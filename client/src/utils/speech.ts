export interface SpeechController {
  speak(text: string): void;
  cancel(): void;
  toggleMute(): boolean;
  setMuted(muted: boolean): boolean;
  isMuted(): boolean;
  replay(): void;
  setMessage(text: string): void;
}

export interface SpeechControllerOptions {
  onMuteChange?: (muted: boolean) => void;
  isMutedInitially?: boolean;
}

export function createSpeechController(
  options: SpeechControllerOptions = {},
): SpeechController {
  let muted = options.isMutedInitially ?? false;
  let currentText = "";
  const onChange = options.onMuteChange;

  const speak = (text: string): void => {
    currentText = text;
    if (muted) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find((voice) => voice.lang.includes("es"));
    if (esVoice) {
      utterance.voice = esVoice;
    }
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const cancel = (): void => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
  };

  const toggleMute = (): boolean => {
    muted = !muted;
    if (muted) cancel();
    onChange?.(muted);
    return muted;
  };

  const setMuted = (next: boolean): boolean => {
    if (muted === next) return muted;
    muted = next;
    if (muted) cancel();
    onChange?.(muted);
    return muted;
  };

  const replay = (): void => {
    if (currentText) speak(currentText);
  };

  return {
    speak,
    cancel,
    toggleMute,
    setMuted,
    isMuted: () => muted,
    replay,
    setMessage: (text) => {
      currentText = text;
    },
  };
}
