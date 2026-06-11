import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-stage">
      <main className="app-shell" aria-label="InclusiApp">
        <div className="app-surface">{children}</div>
      </main>
    </div>
  );
}
