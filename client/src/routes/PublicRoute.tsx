import { Navigate } from "react-router-dom";
import { APP_ROUTES } from "../utils/constants";
import { useAuth } from "../features/auth/context/AuthContext";
import type { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function PublicRoute({
  children,
  redirectTo = APP_ROUTES.home,
}: PublicRouteProps) {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <div className="route-loading" role="status" aria-live="polite">
        <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
        <span>Cargando…</span>
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
