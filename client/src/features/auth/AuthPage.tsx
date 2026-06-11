import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { usePasskey, explainWebAuthnError } from "../passkey/usePasskey";
import type { PasskeyPlatform } from "../passkey/types";
import { useToast } from "../../shared/context/ToastContext";
import { useSpeech } from "../../shared/context/SpeechContext";
import { useProfile } from "../../shared/context/ProfileContext";
import { translate } from "../../utils/i18n";
import { speechMessages } from "../../utils/speech-messages";
import { APP_ROUTES } from "../../utils/constants";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import type { LoginDto, RegisterDto } from "./types";
import type { TranslationKey } from "../../utils/i18n";

type Mode = "biometric" | "form";

function biometricIcon(platform: PasskeyPlatform): string {
  if (platform === "ios") return "fa-face-smile";
  return "fa-fingerprint";
}

function biometricBtnKey(platform: PasskeyPlatform): TranslationKey {
  if (platform === "ios") return "auth-btn-ios";
  if (platform === "android") return "auth-btn-android";
  return "auth-btn";
}

function biometricSpeechPrompt(platform: PasskeyPlatform): string {
  if (platform === "ios") return speechMessages["auth-biometric-prompt-ios"];
  return speechMessages["auth-biometric-prompt-android"];
}

export function AuthPage() {
  const navigate = useNavigate();
  const { login, register, setUser } = useAuth();
  const { authenticate: passkeyAuth, register: registerPasskey, isSupported, platform } = usePasskey();
  const { showToast } = useToast();
  const { speak } = useSpeech();
  const { profile } = useProfile();

  const [mode, setMode] = useState<Mode>("biometric");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const biometricBtnLabel = useMemo(
    () => translate(profile, biometricBtnKey(platform)),
    [profile, platform],
  );

  useEffect(() => {
    speak(speechMessages.auth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBiometricLogin = async () => {
    if (isRegisterMode) {
      setMode("form");
      return;
    }
    const supported = await isSupported();
    if (!supported) {
      setMode("form");
      showToast(
        "Ingreso manual",
        "Ingrese con su correo y contraseña.",
        "info",
      );
      speak(speechMessages["auth-fallback"]);
      return;
    }
    showToast(
      "Verificando",
      platform === "ios"
        ? "Use Face ID para ingresar..."
        : "Use su huella o rostro para ingresar...",
      "info",
    );
    speak(biometricSpeechPrompt(platform));
    try {
      const user = await passkeyAuth();
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
      });
      showToast("Identidad verificada", "Bienvenido a InclusiApp.", "success");
      speak(speechMessages["auth-success"]);
      navigate(APP_ROUTES.home, { replace: true });
    } catch (err) {
      const error = err as { message?: string; name?: string };
      const message = error.name === "SecurityError"
        ? speechMessages["auth-biometric-https-error"]
        : (error.message ?? "No se pudo verificar la identidad.");
      showToast(
        "Verificación fallida",
        message,
        "warning",
      );
      if (error.name === "SecurityError") {
        speak(speechMessages["auth-biometric-https-error"]);
      } else {
        speak(speechMessages["auth-fail"]);
      }
      setMode("form");
    }
  };

  const handleFormLogin = async (dto: LoginDto) => {
    setSubmitting(true);
    try {
      await login(dto);
      showToast("Ingreso correcto", "Bienvenido a InclusiApp.", "success");
      navigate(APP_ROUTES.home, { replace: true });
    } catch (err) {
      const error = err as { message?: string };
      showToast(
        "Error de ingreso",
        error.message ?? "Credenciales inválidas.",
        "warning",
      );
      speak(speechMessages["payments-fail"]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormRegister = async (dto: RegisterDto) => {
    setSubmitting(true);
    try {
      await register(dto);
      showToast("Ingreso correcto", "Bienvenido a InclusiApp.", "success");

      const supported = await isSupported();
      if (supported) {
        try {
          showToast(
            "Registrando passkey",
            platform === "ios"
              ? "Configure Face ID para ingresos futuros."
              : "Configure su huella o rostro para ingresos futuros.",
            "info",
          );
          await registerPasskey();
          showToast(
            "Passkey registrada",
            "Ya puede ingresar con su biometria.",
            "success",
          );
          speak(speechMessages["auth-biometric-register"]);
        } catch (err) {
          const message = explainWebAuthnError(err);
          showToast("Passkey no registrada", message, "info");
          speak(speechMessages["auth-biometric-fail"]);
        }
      }
      navigate(APP_ROUTES.home, { replace: true });
    } catch (err) {
      const error = err as { message?: string };
      showToast(
        "Error de ingreso",
        error.message ?? "No se pudo crear la cuenta.",
        "warning",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSwitchMode = () => {
    setIsRegisterMode((prev) => !prev);
    setMode("form");
  };

  const handleVoiceHelp = () => {
    speak(speechMessages["auth-voice-prompt"]);
  };

  const iconClass = biometricIcon(platform);

  return (
    <section id="screen-auth" className="phone-screen app-bg">
      <div className="screen-hero">
        <span className="hero-icon app-icon">
          <i className="fa-solid fa-hand-holding-heart" />
        </span>
        <h2 className="app-title">{translate(profile, "auth-title")}</h2>
        <p className="app-copy">{translate(profile, "auth-desc")}</p>
      </div>

      <div className="screen-visual">
        <div className="face-ring app-card">
          <i className="fa-solid fa-face-smile app-icon" />
          <div className="scanner-line" aria-hidden="true" />
        </div>
      </div>

      {mode === "form" && !isRegisterMode && (
        <LoginForm
          onSubmit={handleFormLogin}
          onSwitchToRegister={handleSwitchMode}
          onSwitchToBiometric={() => setMode("biometric")}
          submitting={submitting}
          platform={platform}
        />
      )}

      {mode === "form" && isRegisterMode && (
        <RegisterForm
          onSubmit={handleFormRegister}
          onSwitchToLogin={handleSwitchMode}
          submitting={submitting}
        />
      )}

      {mode === "biometric" && (
        <>
          <input
            type="text"
            name="webauthn"
            autoComplete="webauthn"
            tabIndex={-1}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              top: "auto",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          />
          <div className="screen-actions">
            <button
              type="button"
              className="primary-action app-btn-accent"
              onClick={handleBiometricLogin}
              disabled={submitting}
            >
              <i className={`fa-solid ${iconClass}`} />
              <span>{biometricBtnLabel}</span>
            </button>
            <button
              type="button"
              className="secondary-action app-btn-secondary"
              onClick={handleSwitchMode}
            >
              <i className="fa-solid fa-user-plus" />
              <span>{translate(profile, "create-account")}</span>
            </button>
            <button
              type="button"
              className="secondary-action app-btn-secondary"
              onClick={handleVoiceHelp}
            >
              <i className="fa-solid fa-volume-high" />
              <span>{translate(profile, "auth-voice-help")}</span>
            </button>
          </div>
        </>
      )}
    </section>
  );
}
