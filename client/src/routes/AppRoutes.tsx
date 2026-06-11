import { Navigate, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "../utils/constants";
import { AuthLayout } from "../features/auth/AuthLayout";
import { AuthPage } from "../features/auth/AuthPage";
import { HomePage } from "../features/home/HomePage";
import { WalletPage } from "../features/wallet/WalletPage";
import { WithdrawPage } from "../features/withdraw/WithdrawPage";
import { PaymentsPage } from "../features/payments/PaymentsPage";
import { HelpPage } from "../features/help/HelpPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={APP_ROUTES.root} element={<Navigate to={APP_ROUTES.home} replace />} />

      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path={APP_ROUTES.auth} element={<AuthPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route path={APP_ROUTES.home} element={<HomePage />} />
        <Route path={APP_ROUTES.wallet} element={<WalletPage />} />
        <Route path={APP_ROUTES.withdraw} element={<WithdrawPage />} />
        <Route path={APP_ROUTES.payments} element={<PaymentsPage />} />
        <Route path={APP_ROUTES.help} element={<HelpPage />} />
        <Route path={APP_ROUTES.unauthorized} element={<UnauthorizedPage />} />
      </Route>

      <Route path={APP_ROUTES.notFound} element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to={APP_ROUTES.notFound} replace />} />
    </Routes>
  );
}
