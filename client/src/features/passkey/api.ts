import { post } from "../../utils/api";
import type { PasskeyLoginResponse, PasskeyOptionsResponse } from "./types";

export const passkeyApi = {
  registrationOptions: () =>
    post<PasskeyOptionsResponse>("/auth/webauthn/register/options"),
  verifyRegistration: (response: unknown) =>
    post<{ verified: boolean }>("/auth/webauthn/register/verify", { response }),
  loginOptions: () =>
    post<PasskeyOptionsResponse>("/auth/webauthn/login/options"),
  verifyLogin: (response: unknown) =>
    post<PasskeyLoginResponse>("/auth/webauthn/login/verify", { response }),
};

export async function isPasskeySupported(): Promise<boolean> {
  if (!window.PublicKeyCredential) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}
