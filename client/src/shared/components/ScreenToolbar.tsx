import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../utils/constants";
import { translate, type Profile } from "../../utils/i18n";
import { useProfile } from "../context/ProfileContext";

interface ScreenToolbarProps {
  title: string;
  onSpeak?: () => void;
  speakLabel?: string;
  onBack?: () => void;
  right?: ReactNode;
  backLabelKey?: keyof typeof import("../../utils/i18n").translations.normal;
}

export function ScreenToolbar({
  title,
  onSpeak,
  speakLabel = "Escuchar",
  onBack,
  right,
  backLabelKey = "btn-volver",
}: ScreenToolbarProps) {
  const navigate = useNavigate();
  const { profile } = useProfile();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(APP_ROUTES.home);
  };

  return (
    <div className="screen-toolbar">
      <button
        type="button"
        className="back-button app-btn-secondary"
        onClick={handleBack}
      >
        <i className="fa-solid fa-arrow-left" />
        <span>{translate(profile as Profile, backLabelKey)}</span>
      </button>
      <h3>{title}</h3>
      {onSpeak ? (
        <button
          type="button"
          className="mini-action app-btn-secondary"
          onClick={onSpeak}
          aria-label={speakLabel}
        >
          <i className="fa-solid fa-volume-high" />
        </button>
      ) : (
        <span />
      )}
      {right}
    </div>
  );
}
