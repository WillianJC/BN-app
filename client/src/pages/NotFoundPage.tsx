import { Link } from "react-router-dom";
import { APP_ROUTES } from "../utils/constants";
import { AppShell } from "../shared/components";
import { useProfile } from "../shared/context/ProfileContext";
import { translate } from "../utils/i18n";

export function NotFoundPage() {
  const { profile } = useProfile();
  return (
    <AppShell>
      <section className="phone-screen app-bg error-screen">
        <div className="center-stack">
          <div className="error-icon app-icon">
            <i className="fa-solid fa-compass" aria-hidden="true" />
          </div>
          <h1 className="app-title">404</h1>
          <h2 className="app-title">{translate(profile, "404-title")}</h2>
          <p className="app-copy">{translate(profile, "404-desc")}</p>
        </div>
        <Link to={APP_ROUTES.home} className="primary-action app-btn-accent">
          <i className="fa-solid fa-house" aria-hidden="true" />
          <span>{translate(profile, "404-action")}</span>
        </Link>
      </section>
    </AppShell>
  );
}
