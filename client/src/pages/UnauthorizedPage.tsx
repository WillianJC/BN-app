import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { APP_ROUTES } from "../utils/constants";
import { AppShell } from "../shared/components";
import { useProfile } from "../shared/context/ProfileContext";
import { translate } from "../utils/i18n";

export function UnauthorizedPage() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.from) {
      // keep state so the auth page can return after login if needed
    }
  }, [location.state]);

  return (
    <AppShell>
      <section className="phone-screen app-bg error-screen">
        <div className="center-stack">
          <div className="error-icon app-icon">
            <i className="fa-solid fa-lock" aria-hidden="true" />
          </div>
          <h1 className="app-title">401</h1>
          <h2 className="app-title">{translate(profile, "401-title")}</h2>
          <p className="app-copy">{translate(profile, "401-desc")}</p>
        </div>
        <Link
          to={APP_ROUTES.auth}
          className="primary-action app-btn-accent"
          onClick={() => navigate(APP_ROUTES.auth)}
        >
          <i className="fa-solid fa-right-to-bracket" aria-hidden="true" />
          <span>{translate(profile, "401-action")}</span>
        </Link>
      </section>
    </AppShell>
  );
}
