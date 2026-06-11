import { useCallback } from "react";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { ApiError } from "../../utils/api";
import { isPasskeySupported, passkeyApi } from "./api";
import type { PasskeyUser } from "./types";

export function usePasskey() {
  const isSupported = useCallback(() => isPasskeySupported(), []);

  const register = useCallback(async (): Promise<void> => {
    const options = await passkeyApi.registrationOptions();
    if (!options.challenge) {
      throw new Error("Failed to get registration options");
    }
    const registrationResponse = await startRegistration({
      optionsJSON: options as unknown as Parameters<typeof startRegistration>[0]["optionsJSON"],
    });
    const result = await passkeyApi.verifyRegistration(registrationResponse);
    if (!result.verified) {
      throw new Error("Passkey registration failed");
    }
  }, []);

  const authenticate = useCallback(async (): Promise<PasskeyUser> => {
    const options = await passkeyApi.loginOptions();
    if (!options.challenge) {
      throw new ApiError("Failed to get authentication options", 400);
    }
    const authenticationResponse = await startAuthentication({
      optionsJSON: options as unknown as Parameters<typeof startAuthentication>[0]["optionsJSON"],
    });
    const challengeKey = options._challengeKey;
    const payload: Record<string, unknown> = {
      ...(authenticationResponse as unknown as Record<string, unknown>),
    };
    if (challengeKey) {
      payload._challengeKey = challengeKey;
    }
    const result = await passkeyApi.verifyLogin(payload);
    return result.user;
  }, []);

  return { isSupported, register, authenticate };
}
