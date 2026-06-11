import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  Uint8Array_,
} from '@simplewebauthn/server';
import { Repository } from 'typeorm';
import { Credential } from './entities/credential.entity';
import { User } from './entities/user.entity';

function uint8ArrayToBase64url(arr: Uint8Array_): string {
  return Buffer.from(arr).toString('base64url');
}

function base64urlToUint8Array(str: string): Uint8Array_ {
  const buf = Buffer.from(str, 'base64url');
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength) as Uint8Array_;
}

@Injectable()
export class WebAuthnService {
  private challengeStore = new Map<string, string>();

  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  private get rpName(): string {
    return this.configService.get<string>('WEBAUTHN_RP_NAME', 'InclusiApp');
  }

  private get rpID(): string {
    return this.configService.get<string>('WEBAUTHN_RP_ID', 'localhost');
  }

  private get rpOrigin(): string {
    return this.configService.get<string>('WEBAUTHN_RP_ORIGIN', 'http://localhost:5173');
  }

  async generateRegistrationOptions(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const existingCredentials = await this.credentialRepo.find({
      where: { user: { id: userId } },
    });

    const options = await generateRegistrationOptions({
      rpName: this.rpName,
      rpID: this.rpID,
      userName: user.email,
      userDisplayName: user.name,
      attestationType: 'none',
      excludeCredentials: existingCredentials.map((cred) => ({
        id: cred.credentialId,
        type: 'public-key' as const,
        transports: cred.transports as AuthenticatorTransport[],
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
    });

    this.challengeStore.set(`register:${userId}`, options.challenge);

    return options;
  }

  async verifyRegistration(userId: string, response: RegistrationResponseJSON) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const expectedChallenge = this.challengeStore.get(`register:${userId}`);
    if (!expectedChallenge) {
      throw new UnauthorizedException('Registration challenge expired');
    }
    this.challengeStore.delete(`register:${userId}`);

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: this.rpOrigin,
      expectedRPID: this.rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      throw new UnauthorizedException('Passkey registration verification failed');
    }

    const { credential } = verification.registrationInfo;

    const newCredential = this.credentialRepo.create({
      user: { id: userId },
      credentialId: credential.id,
      publicKey: uint8ArrayToBase64url(credential.publicKey),
      counter: credential.counter,
      transports: credential.transports ?? [],
    });

    await this.credentialRepo.save(newCredential);

    return { verified: true };
  }

  async generateAuthenticationOptions() {
    const credentials = await this.credentialRepo.find();

    const options = await generateAuthenticationOptions({
      rpID: this.rpID,
      userVerification: 'preferred',
      allowCredentials: credentials.map((cred) => ({
        id: cred.credentialId,
        type: 'public-key' as const,
        transports: cred.transports as AuthenticatorTransport[],
      })),
    });

    const key = `auth:${Date.now()}`;
    this.challengeStore.set(key, options.challenge);

    return { ...options, _challengeKey: key };
  }

  async verifyAuthentication(response: AuthenticationResponseJSON) {
    const credentialId = response.id;
    const credential = await this.credentialRepo.findOne({
      where: { credentialId },
      relations: { user: true },
    });

    if (!credential || !credential.user) {
      throw new UnauthorizedException('Passkey not recognized');
    }

    const expectedChallenge = (response as any)._challengeKey
      ? this.challengeStore.get((response as any)._challengeKey)
      : undefined;

    if (!expectedChallenge) {
      throw new UnauthorizedException('Authentication challenge expired');
    }

    const challengeKey = (response as any)._challengeKey as string;
    this.challengeStore.delete(challengeKey);

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: this.rpOrigin,
      expectedRPID: this.rpID,
      credential: {
        id: credential.credentialId,
        publicKey: base64urlToUint8Array(credential.publicKey),
        counter: credential.counter,
        transports: credential.transports as AuthenticatorTransport[],
      },
    });

    if (!verification.verified) {
      throw new UnauthorizedException('Passkey authentication failed');
    }

    credential.counter = verification.authenticationInfo.newCounter;
    await this.credentialRepo.save(credential);

    return {
      id: credential.user.id,
      name: credential.user.name,
      email: credential.user.email,
      role: credential.user.role,
    };
  }
}
