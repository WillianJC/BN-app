import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../utils/constants";
import { AppShell } from "../shared/components";
import { useProfile } from "../shared/context/ProfileContext";
import { translate } from "../utils/i18n";

interface State {
  hasError: boolean;
  error?: Error;
}

interface Props {
  children: ReactNode;
}

export class ErrorBoundaryClass extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }
    return this.props.children;
  }
}

function ErrorScreen() {
  const { profile } = useProfile();
  return (
    <AppShell>
      <section className="phone-screen app-bg error-screen">
        <div className="center-stack">
          <div className="error-icon app-icon">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
          </div>
          <h1 className="app-title">500</h1>
          <h2 className="app-title">{translate(profile, "500-title")}</h2>
          <p className="app-copy">{translate(profile, "500-desc")}</p>
        </div>
        <Link to={APP_ROUTES.home} className="primary-action app-btn-accent">
          <i className="fa-solid fa-rotate-right" aria-hidden="true" />
          <span>{translate(profile, "500-action")}</span>
        </Link>
      </section>
    </AppShell>
  );
}
