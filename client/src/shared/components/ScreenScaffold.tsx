import { useEffect } from "react";
import { useSpeech } from "../context/SpeechContext";

interface ScreenScaffoldProps {
  children: React.ReactNode;
  pageSpeech?: string;
  className?: string;
}

export function ScreenScaffold({
  children,
  pageSpeech,
  className,
}: ScreenScaffoldProps) {
  const { speak } = useSpeech();

  useEffect(() => {
    if (pageSpeech) {
      speak(pageSpeech);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={`phone-screen app-bg ${className ?? ""}`}>
      {children}
    </section>
  );
}
