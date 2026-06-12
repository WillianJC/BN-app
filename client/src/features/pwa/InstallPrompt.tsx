import { useState } from "react";
import { useInstallPrompt } from "./useInstallPrompt";

export function InstallPrompt() {
  const { available, installed, install, dismiss } = useInstallPrompt();
  const [busy, setBusy] = useState(false);

  if (!available || installed) return null;

  const handleInstall = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await install();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="install-prompt" role="dialog" aria-live="polite" aria-label="Instalar aplicación">
      <div className="install-prompt__icon" aria-hidden="true">
        <i className="fa-solid fa-mobile-screen-button" />
      </div>
      <div className="install-prompt__body">
        <h4 className="install-prompt__title">Instala InclusiApp</h4>
        <p className="install-prompt__copy">
          Te recomendamos instalar la aplicación.
        </p>
      </div>
      <div className="install-prompt__actions">
        <button
          type="button"
          className="install-prompt__btn install-prompt__btn--ghost"
          onClick={dismiss}
          disabled={busy}
          aria-label="Ahora no"
        >
          Ahora no
        </button>
        <button
          type="button"
          className="install-prompt__btn install-prompt__btn--primary"
          onClick={handleInstall}
          disabled={busy}
          aria-label="Instalar aplicación"
        >
          {busy ? "Instalando..." : "Instalar"}
        </button>
      </div>
    </div>
  );
}
