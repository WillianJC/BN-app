export const APP_ROUTES = {
  root: "/",
  auth: "/auth",
  home: "/home",
  wallet: "/wallet",
  withdraw: "/withdraw",
  payments: "/payments",
  help: "/help",
  notFound: "/404",
  unauthorized: "/401",
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export const PROFILE_STORAGE_KEY = "bnapp.profile";
export const MUTED_STORAGE_KEY = "bnapp.muted";

export const DEFAULT_PAGE_LIMIT = parseInt(
  import.meta.env.VITE_DEFAULT_PAGE_LIMIT ?? "20",
  10,
);

export const PENSION_AMOUNT = 1200;
export const BONUS_AMOUNT = 500;
export const WITHDRAW_CODE = "4590 - 23";
