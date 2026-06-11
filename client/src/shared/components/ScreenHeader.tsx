import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../utils/constants";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { useSpeech } from "../context/SpeechContext";
import { useToast } from "../context/ToastContext";
import { getInitials } from "../../utils/formatters";
import { translate, type Profile } from "../../utils/i18n";
import { speechMessages } from "../../utils/speech-messages";

interface ScreenHeaderProps {
  title?: string;
  showVoice?: boolean;
  onSpeak?: () => void;
  showLogout?: boolean;
  right?: ReactNode;
}

export function ScreenHeader({
  showVoice = false,
  onSpeak,
  showLogout = true,
  right,
}: ScreenHeaderProps) {
  const { user, logout } = useAuth();
  const { profile, muted, toggleMute } = useProfile();
  const { speak } = useSpeech();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleToggleVoice = () => {
    toggleMute();
    showToast(
      muted ? "Voz Activada" : "Voz Silenciada",
      muted
        ? "Se ha vuelto a activar la guía de voz en español."
        : "Se ha desactivado la ayuda sonora del simulador.",
      muted ? "success" : "warning",
    );
    onSpeak?.();
  };

  const handleLogout = async () => {
    await logout();
    navigate(APP_ROUTES.auth, { replace: true });
    showToast("Sesión cerrada", "Ha cerrado sesión correctamente.", "info");
    speak(speechMessages.logout);
  };

  return (
    <div className="screen-header">
      <div className="user-chip">
        <div className="avatar">{getInitials(user?.name ?? "")}</div>
        <div>
          <p className="eyebrow">Hola,</p>
          <h3>{user?.name ?? "Invitado"}</h3>
        </div>
      </div>
      <div className="header-actions">
        {showVoice && (
          <button
            type="button"
            className="mini-action app-btn-secondary"
            onClick={handleToggleVoice}
            aria-label="Escuchar estado de la cuenta"
          >
            <i className="fa-solid fa-volume-high" />
          </button>
        )}
        {showLogout && (
          <button
            type="button"
            className="mini-action logout-action app-btn-secondary"
            onClick={handleLogout}
            aria-label={translate(profile as Profile, "logout")}
          >
            <i className="fa-solid fa-right-from-bracket" />
          </button>
        )}
        {right}
      </div>
    </div>
  );
}
