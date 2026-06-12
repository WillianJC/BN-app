import { useCallback, useMemo } from "react";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { ApiError } from "../../utils/api";
import { isPasskeySupported, passkeyApi } from "./api";
import type { PasskeyPlatform, PasskeyUser } from "./types";

function detectPlatform(): PasskeyPlatform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

export function explainWebAuthnError(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) {
    switch (err.name) {
      case "NotAllowedError":
        return "No se autorizo el acceso biometric";
      case "SecurityError":
        return "Conexion insegura. Se requiere HTTPS para usar biometria en este dispositivo.";
      case "NotSupportedError":
        return "Este dispositivo no soporta passkey";
      case "InvalidStateError":
        return "Esta passkey ya esta registrada en el dispositivo";
      case "AbortError":
        return "Operacion cancelada por el usuario";
      case "TimeoutError":
        return "La verificacion expiro. Intente de nuevo.";
      default:
        return err.message || "Error de autenticacion biometric";
    }
  }
  return "Error de autenticacion biometric";
}

export function usePasskey() {
  const platform = useMemo<PasskeyPlatform>(() => detectPlatform(), []);

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
      useBrowserAutofill: false,
    });
    const result = await passkeyApi.verifyLogin(authenticationResponse);
    return result.user;
  }, []);

  return { isSupported, register, authenticate, platform };
}
