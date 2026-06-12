import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../utils/constants";
import { useProfile } from "../../shared/context/ProfileContext";
import { useSpeech } from "../../shared/context/SpeechContext";
import { useToast } from "../../shared/context/ToastContext";
import { useWallet } from "../finances/context/WalletContext";
import {
  ScreenToolbar,
  ScreenScaffold,
} from "../../shared/components";
import { translate } from "../../utils/i18n";
import { financesApi, type UtilityPaymentDto } from "../finances/api";
import { formatCurrency, generateInvoiceNumber } from "../../utils/formatters";
import { speechMessages } from "../../utils/speech-messages";

const SERVICES = [
  {
    id: "LUZ",
    labelKey: "pago-luz" as const,
    icon: "fa-bolt",
    iconClass: "service-icon--light",
    amount: 34.2,
    utilityType: "ELECTRICITY" as UtilityPaymentDto["utilityType"],
  },
  {
    id: "AGUA",
    labelKey: "pago-agua" as const,
    icon: "fa-droplet",
    iconClass: "service-icon--water",
    amount: 15.0,
    utilityType: "WATER" as UtilityPaymentDto["utilityType"],
  },
];

export function PaymentsPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { speak } = useSpeech();
  const { showToast } = useToast();
  const { refresh } = useWallet();

  const handleSpeak = () => {
    speak(speechMessages.pagos);
  };

  const handlePay = async (
    serviceLabel: string,
    amount: number,
    utilityType: UtilityPaymentDto["utilityType"],
  ) => {
    try {
      const result = await financesApi.payUtility({
        utilityType,
        amount,
        invoiceNumber: generateInvoiceNumber(),
      });
      showToast(
        "Pago exitoso",
        `${serviceLabel} pagado por ${formatCurrency(result.amount)}.`,
        "success",
      );
      speak(
        `Se realizó el pago de ${serviceLabel} por ${amount} dólares.`,
      );
      await refresh();
    } catch (err) {
      const error = err as { message?: string };
      showToast(
        "Error de pago",
        error.message ?? "No se pudo procesar el pago.",
        "warning",
      );
    }
  };

  const handleScan = () => {
    showToast("Escaneo activo", "La cámara está leyendo el recibo.", "info");
  };

  return (
    <ScreenScaffold pageSpeech="Sección para pagar recibos de luz o agua de manera segura.">
      <ScreenToolbar
        title={translate(profile, "pagos-header")}
        onSpeak={handleSpeak}
        onBack={() => navigate(APP_ROUTES.home)}
      />

      <div className="center-stack center-stack--tight">
        <p className="app-copy strong">{translate(profile, "pagos-sub")}</p>

        {SERVICES.map((service) => (
          <button
            key={service.id}
            type="button"
            className="service-item app-card"
            onClick={() =>
              handlePay(
                service.id === "LUZ" ? "Luz" : "Agua",
                service.amount,
                service.utilityType,
              )
            }
          >
            <div className="service-info">
              <div className={`service-icon ${service.iconClass}`}>
                <i className={`fa-solid ${service.icon}`} />
              </div>
              <div>
                <h4>{translate(profile, service.labelKey)}</h4>
                <p>Vence en {service.id === "LUZ" ? 3 : 5} días</p>
              </div>
            </div>
            <strong>{formatCurrency(service.amount)}</strong>
          </button>
        ))}

        <button
          type="button"
          className="secondary-action app-btn-secondary"
          onClick={handleScan}
        >
          <i className="fa-solid fa-camera" />
          <span>{translate(profile, "pagos-camera")}</span>
        </button>
      </div>
    </ScreenScaffold>
  );
}
