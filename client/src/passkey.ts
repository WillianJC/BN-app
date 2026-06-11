import {
  startRegistration,
  startAuthentication,
} from '@simplewebauthn/browser';
import { request } from './api';

interface PasskeyOptionsResponse {
  challenge: string;
  _challengeKey?: string;
  [key: string]: unknown;
}

export async function isPasskeySupported(): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    return false;
  }
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export async function startPasskeyRegistration(): Promise<void> {
  const options = await request<PasskeyOptionsResponse>(
    '/auth/webauthn/register/options',
    { method: 'POST' },
  );

  if (!options.challenge) {
    throw new Error('Failed to get registration options');
  }

  const registrationResponse = await startRegistration({ optionsJSON: options as any });

  const result = await request<{ verified: boolean }>(
    '/auth/webauthn/register/verify',
    {
      method: 'POST',
      body: JSON.stringify({ response: registrationResponse }),
    },
  );

  if (!result.verified) {
    throw new Error('Passkey registration failed');
  }
}

export interface PasskeyLoginResult {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function authenticateWithPasskey(): Promise<PasskeyLoginResult> {
  const options = await request<PasskeyOptionsResponse>(
    '/auth/webauthn/login/options',
    { method: 'POST' },
  );

  if (!options.challenge) {
    throw new Error('Failed to get authentication options');
  }

  const authenticationResponse = await startAuthentication({ optionsJSON: options as any });

  const challengeKey = options._challengeKey;
  const payload: any = { ...authenticationResponse };
  if (challengeKey) {
    payload._challengeKey = challengeKey;
  }

  const result = await request<{ message: string; user: PasskeyLoginResult }>(
    '/auth/webauthn/login/verify',
    {
      method: 'POST',
      body: JSON.stringify({ response: payload }),
    },
  );

  return result.user;
}
