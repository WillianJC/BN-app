import { useNavigate } from "react-router-dom";
import { APP_ROUTES, PENSION_AMOUNT } from "../../utils/constants";
import { useProfile } from "../../shared/context/ProfileContext";
import { useSpeech } from "../../shared/context/SpeechContext";
import { useToast } from "../../shared/context/ToastContext";
import { useWallet } from "../finances/context/WalletContext";
import {
  ScreenToolbar,
  ScreenScaffold,
} from "../../shared/components";
import { formatBalanceSpeech, formatCurrency } from "../../utils/formatters";
import { translate } from "../../utils/i18n";
import { financesApi } from "../finances/api";

export function WalletPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { speak } = useSpeech();
  const { showToast } = useToast();
  const { wallet, refresh } = useWallet();

  const balance = wallet?.balance ?? 0;
  const balanceSpeech = formatBalanceSpeech(balance);

  const handleSpeak = () => {
    speak(`Sección: Mi dinero. Su saldo actual es de ${balanceSpeech}.`);
  };

  const handleCollectPension = async () => {
    try {
      const result = await financesApi.collectPension();
      showToast(
        "Pensión cobrada",
        `Se depositaron ${formatCurrency(result.amount)} en su cuenta.`,
        "success",
      );
      speak(`Su pensión de mil doscientos dólares ha sido cobrada con éxito.`);
      await refresh();
    } catch (err) {
      const error = err as { message?: string };
      showToast(
        "Error",
        error.message ?? "No se pudo cobrar la pensión.",
        "warning",
      );
    }
  };

  return (
    <ScreenScaffold
      pageSpeech={`Sección: Mi dinero. Su saldo actual es de ${balanceSpeech}.`}
    >
      <ScreenToolbar
        title={translate(profile, "saldo-header")}
        onSpeak={handleSpeak}
        onBack={() => navigate(APP_ROUTES.home)}
      />

      <div className="center-stack">
        <div className="money-icon app-icon">
          <i className="fa-solid fa-piggy-bank" />
        </div>
        <p className="app-copy strong">{translate(profile, "saldo-label")}</p>
        <div className="balance-big app-text">{formatCurrency(balance)}</div>
        <p className="app-copy">Pesos / Dólares Equivalentes</p>
        <div className="notice-card app-card">
          <i className="fa-solid fa-circle-check" />
          <p className="app-copy strong">{translate(profile, "saldo-alert")}</p>
        </div>
        <button
          type="button"
          className="primary-action app-btn-accent"
          onClick={handleCollectPension}
        >
          <i className="fa-solid fa-hand-holding-dollar" />
          <span>COBRAR PENSIÓN (${PENSION_AMOUNT.toLocaleString()})</span>
        </button>
      </div>

      <button
        type="button"
        className="secondary-action app-btn-secondary"
        onClick={() => navigate(APP_ROUTES.withdraw)}
      >
        <i className="fa-solid fa-qrcode" />
        <span>{translate(profile, "saldo-btn")}</span>
      </button>
    </ScreenScaffold>
  );
}
