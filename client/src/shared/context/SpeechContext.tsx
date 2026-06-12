import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createSpeechController, type SpeechController } from "../../utils/speech";

interface SpeechContextValue {
  speak: (text: string) => void;
  cancel: () => void;
  replay: () => void;
  isMuted: boolean;
  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
}

const SpeechContext = createContext<SpeechContextValue | null>(null);

interface SpeechProviderProps {
  children: ReactNode;
  isMuted: boolean;
}

export function SpeechProvider({ children, isMuted }: SpeechProviderProps) {
  const controllerRef = useRef<SpeechController | null>(null);
  const [, setTick] = useState(0);

  if (!controllerRef.current) {
    controllerRef.current = createSpeechController({
      isMutedInitially: isMuted,
    });
  }

  useEffect(() => {
    controllerRef.current?.setMuted(isMuted);
    if (isMuted) {
      controllerRef.current?.cancel();
    }
  }, [isMuted]);

  const speak = useCallback((text: string) => {
    controllerRef.current?.speak(text);
    setTick((n) => n + 1);
  }, []);

  const cancel = useCallback(() => {
    controllerRef.current?.cancel();
  }, []);

  const replay = useCallback(() => {
    controllerRef.current?.replay();
  }, []);

  const toggleMute = useCallback(() => {
    const next = controllerRef.current?.toggleMute() ?? false;
    setTick((n) => n + 1);
    return next;
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    const current = controllerRef.current;
    if (!current) return;
    if (current.isMuted() !== muted) {
      current.toggleMute();
      setTick((n) => n + 1);
    }
  }, []);

  const value = useMemo<SpeechContextValue>(
    () => ({
      speak,
      cancel,
      replay,
      isMuted: controllerRef.current?.isMuted() ?? isMuted,
      setMuted,
      toggleMute,
    }),
    [speak, cancel, replay, setMuted, toggleMute, isMuted],
  );

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
}

export function useSpeech(): SpeechContextValue {
  const ctx = useContext(SpeechContext);
  if (!ctx) {
    throw new Error("useSpeech must be used within a SpeechProvider");
  }
  return ctx;
}
