import { IsObject } from 'class-validator';
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/server';

export class WebAuthnAuthenticationVerifyDto {
  @IsObject()
  response!: AuthenticationResponseJSON;
}

export type WebAuthnAuthenticationOptionsResponse = PublicKeyCredentialRequestOptionsJSON;
