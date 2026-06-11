import { useNavigate } from "react-router-dom";
import { APP_ROUTES, BONUS_AMOUNT, WITHDRAW_CODE } from "../../utils/constants";
import { useProfile } from "../../shared/context/ProfileContext";
import { useSpeech } from "../../shared/context/SpeechContext";
import { useToast } from "../../shared/context/ToastContext";
import { useWallet } from "../finances/context/WalletContext";
import {
  AppShell,
  ScreenToolbar,
  ScreenScaffold,
} from "../../shared/components";
import { translate } from "../../utils/i18n";
import { financesApi } from "../finances/api";
import { formatCurrency } from "../../utils/formatters";

export function WithdrawPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { speak } = useSpeech();
  const { showToast } = useToast();
  const { refresh } = useWallet();

  const handleSpeak = () => {
    speak(
      "Sección de cobro de dinero. Muestre el dibujo en la pantalla de su celular al cajero para retirar sus billetes.",
    );
  };

  const handleCollectBonus = async () => {
    try {
      const result = await financesApi.collectBonus();
      showToast(
        "Bono cobrado",
        `Se depositaron ${formatCurrency(result.amount)} en su cuenta.`,
        "success",
      );
      speak("Su bono de quinientos dólares ha sido cobrado con éxito.");
      await refresh();
    } catch (err) {
      const error = err as { message?: string };
      showToast(
        "Error",
        error.message ?? "No se pudo cobrar el bono.",
        "warning",
      );
    }
  };

  return (
    <AppShell>
      <ScreenScaffold pageSpeech="Sección de cobro de dinero. Muestre el dibujo en la pantalla de su celular al cajero para retirar sus billetes.">
        <ScreenToolbar
          title={translate(profile, "cobro-header")}
          onSpeak={handleSpeak}
          onBack={() => navigate(APP_ROUTES.home)}
        />

        <div className="center-stack center-stack--tight">
          <p className="step-badge app-text">{translate(profile, "cobro-step-1")}</p>
          <div className="qr-card app-card">
            <div className="qr-grid" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span className="dark" />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span className="dark" />
              <span />
              <span className="dark" />
              <span />
              <span />
            </div>
          </div>
          <p className="app-copy strong">{translate(profile, "cobro-step-2")}</p>
          <div className="code-pill app-card">{WITHDRAW_CODE}</div>
          <div className="notice-card notice-card--success app-card">
            <i className="fa-solid fa-circle-info" />
            <p className="app-copy strong">
              Lleve el código al cajero o tienda autorizada.
            </p>
          </div>
          <button
            type="button"
            className="primary-action app-btn-accent"
            onClick={handleCollectBonus}
          >
            <i className="fa-solid fa-gift" />
            <span>COBRAR BONO (${BONUS_AMOUNT.toLocaleString()})</span>
          </button>
        </div>
      </ScreenScaffold>
    </AppShell>
  );
}
