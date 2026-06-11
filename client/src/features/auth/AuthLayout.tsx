import { Outlet } from "react-router-dom";
import { AppShell } from "../../shared/components/AppShell";

export function AuthLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
