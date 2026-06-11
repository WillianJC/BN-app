import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../utils/constants";
import { useProfile } from "../../shared/context/ProfileContext";
import { useSpeech } from "../../shared/context/SpeechContext";
import { useToast } from "../../shared/context/ToastContext";
import {
  AppShell,
  ScreenToolbar,
  ScreenScaffold,
} from "../../shared/components";
import { translate } from "../../utils/i18n";
import { speechMessages } from "../../utils/speech-messages";

export function HelpPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { speak } = useSpeech();
  const { showToast } = useToast();

  const handleSpeak = () => {
    speak(speechMessages.help);
  };

  const handleCall = () => {
    showToast(
      "Llamada iniciada",
      "Un asesor está atendiendo su solicitud.",
      "success",
    );
    speak(speechMessages["call-success"]);
  };

  return (
    <AppShell>
      <ScreenScaffold pageSpeech="Le estamos conectando con un asesor humano para guiarle paso a paso.">
        <ScreenToolbar
          title={translate(profile, "ayuda-header")}
          onSpeak={handleSpeak}
          onBack={() => navigate(APP_ROUTES.home)}
        />

        <div className="center-stack">
          <div className="support-avatar app-card">
            <i className="fa-solid fa-user-tie" />
          </div>
          <div>
            <h4 className="app-text">{translate(profile, "ayuda-sub")}</h4>
            <p className="app-copy">Conexión de audio y video</p>
          </div>
          <div className="notice-card app-card">
            <i className="fa-solid fa-shield-halved" />
            <p className="app-copy strong">
              Puede dar acceso temporal controlado a su hijo o asesor para ayudarle.
            </p>
          </div>
        </div>

        <div className="help-actions">
          <button
            type="button"
            className="primary-action app-btn-accent"
            onClick={handleCall}
          >
            <i className="fa-solid fa-phone" />
            <span>LLAMAR DE INMEDIATO</span>
          </button>
          <button
            type="button"
            className="secondary-action app-btn-secondary"
            onClick={() => navigate(APP_ROUTES.home)}
          >
            CANCELAR
          </button>
        </div>
      </ScreenScaffold>
    </AppShell>
  );
}
