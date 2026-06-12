import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const INSTALL_DISMISSED_KEY = "bnapp.install.dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function wasDismissedRecently(): boolean {
  try {
    const raw = window.localStorage.getItem(INSTALL_DISMISSED_KEY);
    if (!raw) return false;
    const ts = Number.parseInt(raw, 10);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const mediaStandalone = window.matchMedia?.("(display-mode: standalone)").matches;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return Boolean(mediaStandalone || iosStandalone);
}

export interface InstallPromptState {
  available: boolean;
  installed: boolean;
  install: () => Promise<void>;
  dismiss: () => void;
}

export function useInstallPrompt(): InstallPromptState {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState<boolean>(() => isStandalone());
  const [dismissed, setDismissed] = useState<boolean>(() => wasDismissedRecently());

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const install = async (): Promise<void> => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    if (choice.outcome === "accepted") {
      setInstalled(true);
    }
  };

  const dismiss = (): void => {
    setDismissed(true);
    try {
      window.localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now()));
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
  };

  return {
    available: Boolean(deferred) && !installed && !dismissed,
    installed,
    install,
    dismiss,
  };
}
