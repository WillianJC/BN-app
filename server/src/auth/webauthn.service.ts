import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'node:crypto';
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
import { LoggerService } from '../logger/logger.service';

export interface ChallengePayload {
  op: 'register' | 'auth';
  userId?: string;
  challenge: string;
  ts: number;
}

export interface WebAuthnCookieOptions {
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  secure: boolean;
  maxAge: number;
  path: string;
}

function uint8ArrayToBase64url(arr: Uint8Array_): string {
  return Buffer.from(arr).toString('base64url');
}

function base64urlToUint8Array(str: string): Uint8Array_ {
  const buf = Buffer.from(str, 'base64url');
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

@Injectable()
export class WebAuthnService {
  private readonly logger = new LoggerService('WebAuthnService');

  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.warnIfInsecureOrigin();
  }

  private get rpName(): string {
    return this.configService.get<string>('WEBAUTHN_RP_NAME', 'InclusiApp');
  }

  private get rpID(): string {
    return this.configService.get<string>('WEBAUTHN_RP_ID', 'localhost');
  }

  private get rpOrigin(): string {
    return this.configService.get<string>(
      'WEBAUTHN_RP_ORIGIN',
      'http://localhost:5173',
    );
  }

  private get cookieName(): string {
    return this.configService.get<string>(
      'WEBAUTHN_CHALLENGE_COOKIE_NAME',
      'wa_challenge',
    );
  }

  private get cookieTtlMs(): number {
    return parseInt(
      this.configService.get<string>('WEBAUTHN_CHALLENGE_TTL_MS', '300000'),
      10,
    );
  }

  private get hmacSecret(): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is required for WebAuthn challenge signing');
    }
    return secret;
  }

  getCookieName(): string {
    return this.cookieName;
  }

  getCookieOptions(): WebAuthnCookieOptions {
    const sameSite = this.configService.get<'lax' | 'strict' | 'none'>(
      'COOKIE_SAME_SITE',
      'lax',
    );
    return {
      httpOnly: true,
      sameSite: 'strict',
      secure:
        sameSite === 'none' ||
        this.configService.get<string>('COOKIE_SECURE', 'false') === 'true',
      maxAge: this.cookieTtlMs,
      path: '/auth/webauthn',
    };
  }

  signChallenge(payload: ChallengePayload): string {
    const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = crypto
      .createHmac('sha256', this.hmacSecret)
      .update(data)
      .digest('base64url');
    return `${data}.${sig}`;
  }

  verifyChallenge(raw: string | undefined): ChallengePayload | null {
    if (!raw) return null;
    const dotIndex = raw.indexOf('.');
    if (dotIndex < 0) return null;
    const data = raw.slice(0, dotIndex);
    const sig = raw.slice(dotIndex + 1);
    if (!data || !sig) return null;

    const expectedSig = crypto
      .createHmac('sha256', this.hmacSecret)
      .update(data)
      .digest('base64url');

    if (!safeEqual(sig, expectedSig)) return null;

    let payload: ChallengePayload;
    try {
      const decoded = Buffer.from(data, 'base64url').toString('utf8');
      payload = JSON.parse(decoded) as ChallengePayload;
    } catch {
      return null;
    }

    if (payload.op !== 'register' && payload.op !== 'auth') {
      return null;
    }
    if (
      typeof payload.challenge !== 'string' ||
      payload.challenge.length === 0
    ) {
      return null;
    }
    if (typeof payload.ts !== 'number') return null;
    if (Date.now() - payload.ts > this.cookieTtlMs) return null;

    return payload;
  }

  private warnIfInsecureOrigin(): void {
    const isProduction =
      this.configService.get<string>('PRODUCTION', 'false') === 'true';
    if (!isProduction) return;
    if (this.rpOrigin.startsWith('https://')) return;
    this.logger.warn(
      `WebAuthn rpOrigin is not HTTPS in production: ${this.rpOrigin}. ` +
        'Mobile browsers (Safari iOS, Chrome Android) require HTTPS to surface the biometric prompt.',
    );
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

    return options;
  }

  async verifyRegistration(
    userId: string,
    rawCookie: string | undefined,
    response: RegistrationResponseJSON,
  ) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = this.verifyChallenge(rawCookie);
    if (!payload || payload.op !== 'register') {
      throw new UnauthorizedException('Registration challenge expired');
    }
    if (payload.userId !== userId) {
      throw new UnauthorizedException('Registration challenge user mismatch');
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: payload.challenge,
      expectedOrigin: this.rpOrigin,
      expectedRPID: this.rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      throw new UnauthorizedException(
        'Passkey registration verification failed',
      );
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

    return options;
  }

  async verifyAuthentication(
    rawCookie: string | undefined,
    response: AuthenticationResponseJSON,
  ) {
    const payload = this.verifyChallenge(rawCookie);
    if (!payload || payload.op !== 'auth') {
      throw new UnauthorizedException('Authentication challenge expired');
    }

    const credentialId = response.id;
    const credential = await this.credentialRepo.findOne({
      where: { credentialId },
      relations: { user: true },
    });

    if (!credential || !credential.user) {
      throw new UnauthorizedException('Passkey not recognized');
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: payload.challenge,
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
