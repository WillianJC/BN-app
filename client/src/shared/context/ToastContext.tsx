import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ToastKind = "success" | "warning" | "info" | "error";

interface ToastContextValue {
  showToast: (
    title: string,
    message: string,
    kind?: ToastKind,
    duration?: number,
  ) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICON_BY_KIND: Record<ToastKind, string> = {
  success: "fa-circle-check",
  warning: "fa-triangle-exclamation",
  info: "fa-circle-info",
  error: "fa-circle-xmark",
};

const TONE_BY_KIND: Record<ToastKind, string> = {
  success: "toast--success",
  warning: "toast--warning",
  info: "toast--info",
  error: "toast--error",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    kind: ToastKind;
  } | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const showToast = useCallback(
    (
      title: string,
      message: string,
      kind: ToastKind = "info",
      duration = 2600,
    ) => {
      setToast({ title, message, kind });

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setToast(null);
      }, duration);
    },
    [],
  );

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div
          className={`toast ${TONE_BY_KIND[toast.kind]} is-visible`}
          role="status"
          aria-live="polite"
        >
          <div className="toast-icon">
            <i className={`fa-solid ${ICON_BY_KIND[toast.kind]}`} />
          </div>
          <div>
            <h4>{toast.title}</h4>
            <p>{toast.message}</p>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
