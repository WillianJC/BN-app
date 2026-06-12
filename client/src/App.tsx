import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./features/auth/context/AuthContext";
import {
  ProfileProvider,
  SpeechProvider,
  ToastProvider,
  useProfile,
} from "./shared/context";
import { WalletProvider } from "./features/finances/context/WalletContext";
import { ErrorBoundary } from "./pages";
import { InstallPrompt } from "./features/pwa/InstallPrompt";
import type { ReactNode } from "react";

function MuteAwareSpeechProvider({ children }: { children: ReactNode }) {
  const { muted } = useProfile();
  return <SpeechProvider isMuted={muted}>{children}</SpeechProvider>;
}

function Providers({ children }: { children: ReactNode }) {
  return (
    <ProfileProvider>
      <AuthProvider>
        <WalletProvider>
          <ToastProvider>
            <MuteAwareSpeechProvider>
              {children}
              <InstallPrompt />
            </MuteAwareSpeechProvider>
          </ToastProvider>
        </WalletProvider>
      </AuthProvider>
    </ProfileProvider>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Providers>
          <AppRoutes />
        </Providers>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
