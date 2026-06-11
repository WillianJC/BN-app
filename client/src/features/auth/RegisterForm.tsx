import { useState } from "react";
import { useProfile } from "../../shared/context/ProfileContext";
import { useSpeech } from "../../shared/context/SpeechContext";
import { translate } from "../../utils/i18n";
import { validateLoginForm, type LoginFormErrors } from "../../utils/validation";
import { speechMessages } from "../../utils/speech-messages";
import type { RegisterDto } from "./types";

interface RegisterFormProps {
  onSubmit: (dto: RegisterDto) => Promise<void> | void;
  onSwitchToLogin: () => void;
  submitting: boolean;
}

export function RegisterForm({
  onSubmit,
  onSwitchToLogin,
  submitting,
}: RegisterFormProps) {
  const { profile } = useProfile();
  const { speak } = useSpeech();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateLoginForm(email, password, name, true);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      if (validation.name) speak(speechMessages["auth-name-required"]);
      else speak(speechMessages["auth-fields"]);
      return;
    }
    await onSubmit({ name, email, password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        className="login-input"
        placeholder="Nombre completo"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-invalid={Boolean(errors.name)}
        required
      />
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
        autoComplete="new-password"
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
          <i className="fa-solid fa-user-plus" />
          <span>{translate(profile, "create-account-submit")}</span>
        </button>
        <button
          type="button"
          className="secondary-action app-btn-secondary"
          onClick={onSwitchToLogin}
        >
          <i className="fa-solid fa-arrow-right-to-bracket" />
          <span>{translate(profile, "have-account")}</span>
        </button>
      </div>
    </form>
  );
}
