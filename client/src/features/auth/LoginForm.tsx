import { useState } from "react";
import { useProfile } from "../../shared/context/ProfileContext";
import { useSpeech } from "../../shared/context/SpeechContext";
import { translate } from "../../utils/i18n";
import { validateLoginForm, type LoginFormErrors } from "../../utils/validation";
import { speechMessages } from "../../utils/speech-messages";
import type { LoginDto } from "./types";
import type { PasskeyPlatform } from "../passkey/types";

interface LoginFormProps {
  onSubmit: (dto: LoginDto) => Promise<void> | void;
  onSwitchToRegister: () => void;
  onSwitchToBiometric: () => void;
  submitting: boolean;
  platform: PasskeyPlatform;
}

export function LoginForm({
  onSubmit,
  onSwitchToRegister,
  onSwitchToBiometric,
  submitting,
  platform,
}: LoginFormProps) {
  const { profile } = useProfile();
  const { speak } = useSpeech();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateLoginForm(email, password);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      showFieldErrors(validation);
      speak(speechMessages["auth-fields"]);
      return;
    }
    await onSubmit({ email, password });
  };

  const showFieldErrors = (errors: LoginFormErrors) => {
    if (errors.email || errors.password) {
      // Toast is handled by parent; this is local feedback hook.
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <input
        type="email"
        className="login-input"
        placeholder="Correo electrónico"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={Boolean(errors.email)}
        required
      />
      <input
        type="password"
        className="login-input"
        placeholder="Contraseña"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={Boolean(errors.password)}
        required
      />
      <div className="screen-actions">
        <button
          type="submit"
          className="primary-action app-btn-accent"
          disabled={submitting}
        >
          <i className="fa-solid fa-right-to-bracket" />
          <span>{translate(profile, "login-submit")}</span>
        </button>
        <button
          type="button"
          className="secondary-action app-btn-secondary"
          onClick={onSwitchToBiometric}
        >
          <i className={`fa-solid ${platform === "ios" ? "fa-face-smile" : "fa-fingerprint"}`} />
          <span>{translate(profile, "auth-btn")}</span>
        </button>
        <button
          type="button"
          className="secondary-action app-btn-secondary"
          onClick={onSwitchToRegister}
        >
          <i className="fa-solid fa-user-plus" />
          <span>{translate(profile, "create-account")}</span>
        </button>
      </div>
    </form>
  );
}
