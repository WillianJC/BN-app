import { useEffect } from "react";
import { APP_ROUTES } from "../../utils/constants";
import { useProfile } from "../../shared/context/ProfileContext";
import { useSpeech } from "../../shared/context/SpeechContext";
import { useWallet } from "../finances/context/WalletContext";
import {
  ScreenHeader,
  ScreenScaffold,
  ActionCard,
} from "../../shared/components";
import { formatBalanceSpeech, formatCurrency } from "../../utils/formatters";
import { translate } from "../../utils/i18n";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../shared/context/ToastContext";

const ACTION_CARDS = [
  {
    to: APP_ROUTES.wallet,
    icon: "fa-wallet",
    iconClass: "bg-blue-100 text-blue-600",
    labelKey: "menu-saldo" as const,
  },
  {
    to: APP_ROUTES.withdraw,
    icon: "fa-money-bill-wave",
    iconClass: "bg-emerald-100 text-emerald-600",
    labelKey: "menu-cobrar" as const,
  },
  {
    to: APP_ROUTES.payments,
    icon: "fa-receipt",
    iconClass: "bg-purple-100 text-purple-600",
    labelKey: "menu-pagar" as const,
  },
  {
    to: APP_ROUTES.help,
    icon: "fa-question",
    iconClass: "bg-rose-100 text-rose-600",
    labelKey: "menu-ayuda" as const,
  },
];

export function HomePage() {
  const { profile } = useProfile();
  const { speak } = useSpeech();
  const { wallet, refresh } = useWallet();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpeak = () => {
    const balance = wallet?.balance ?? 0;
    speak(
      `Su saldo disponible es de ${formatBalanceSpeech(balance)}. Puede cobrar bonos, pagar servicios o pedir ayuda.`,
    );
  };

  const handleSos = () => {
    showToast(
      "Llamando ayuda",
      "Se está conectando con un asesor humano.",
      "warning",
    );
    navigate(APP_ROUTES.help);
  };

  const balance = wallet?.balance ?? 0;
  const balanceSpeech = formatBalanceSpeech(balance);

  return (
    <ScreenScaffold
      pageSpeech={`Sección principal. Su saldo es de ${balanceSpeech}. Puede cobrar bonos, pagar cuentas o pedir ayuda.`}
    >
      <ScreenHeader showVoice onSpeak={handleSpeak} />

      <div className="balance-card app-card">
        <div>
          <p className="balance-label">{translate(profile, "home-balance-label")}</p>
          <div className="balance-amount">
            {formatCurrency(balance)} <span>USD</span>
          </div>
          <p className="balance-subtitle">Pensión de Jubilación al día</p>
        </div>
        <div className="balance-orb" aria-hidden="true" />
      </div>

      <div className="action-grid">
        {ACTION_CARDS.map((card) => (
          <ActionCard
            key={card.to}
            to={card.to}
            icon={card.icon}
            iconClassName={card.iconClass}
            label={translate(profile, card.labelKey)}
          />
        ))}
      </div>

      <button
        type="button"
        className="sos-button app-btn-accent"
        onClick={handleSos}
      >
        <i className="fa-solid fa-phone-volume" />
        <span>{translate(profile, "home-sos-btn")}</span>
      </button>
    </ScreenScaffold>
  );
}
