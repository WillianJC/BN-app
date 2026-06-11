import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { financesApi, type WalletResponse } from "../api";

interface WalletContextValue {
  wallet: WalletResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setBalance: (balance: number) => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

interface WalletProviderProps {
  children: ReactNode;
  autoLoad?: boolean;
}

export function WalletProvider({ children, autoLoad = true }: WalletProviderProps) {
  const { status } = useAuth();
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(autoLoad && status === "authenticated");
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await financesApi.getWallet();
      setWallet(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al obtener saldo";
      setError(message);
      setWallet(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const setBalance = useCallback((balance: number) => {
    setWallet((prev: WalletResponse | null) =>
      prev ? { ...prev, balance } : prev,
    );
  }, []);

  useEffect(() => {
    if (!autoLoad) return;
    if (status !== "authenticated") {
      setWallet(null);
      setError(null);
      setLoading(false);
      return;
    }
    void refresh();
  }, [autoLoad, status, refresh]);

  const value = useMemo<WalletContextValue>(
    () => ({ wallet, loading, error, refresh, setBalance }),
    [wallet, loading, error, refresh, setBalance],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return ctx;
}
