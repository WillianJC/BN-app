import type { ReactNode } from "react";
import { ProfileSwitcher } from "./ProfileSwitcher";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-stage">
      <main className="app-shell" aria-label="InclusiApp">
        <div className="app-surface">
          <ProfileSwitcher />
          {children}
        </div>
      </main>
    </div>
  );
}
