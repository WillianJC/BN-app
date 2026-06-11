import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../utils/constants";
import { useAuth } from "../features/auth/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = APP_ROUTES.auth,
}: ProtectedRouteProps) {
  const { status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate(redirectTo, {
        replace: true,
        state: { from: location.pathname + location.search },
      });
    }
  }, [status, navigate, redirectTo, location.pathname, location.search]);

  if (status === "loading") {
    return (
      <div className="route-loading" role="status" aria-live="polite">
        <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
        <span>Cargando…</span>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="route-loading" role="status" aria-live="polite">
        <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
        <span>Redirigiendo…</span>
      </div>
    );
  }

  return <>{children}</>;
}
