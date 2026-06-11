import { IsObject } from 'class-validator';
import type {
  RegistrationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/server';

export class WebAuthnRegistrationVerifyDto {
  @IsObject()
  response!: RegistrationResponseJSON;
}

export type WebAuthnRegistrationOptionsResponse = PublicKeyCredentialCreationOptionsJSON;
