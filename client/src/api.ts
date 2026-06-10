const BASE = import.meta.env.VITE_API_URL ?? "";

interface ApiError {
  message: string;
  statusCode: number;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Unknown error" }));
    throw {
      message: body.message ?? "Request failed",
      statusCode: res.status,
    } as ApiError;
  }

  return res.json() as Promise<T>;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
}

export interface WalletResponse {
  id: string;
  balance: number;
}

export interface UserMe {
  sub: string;
  email?: string;
  role?: string;
}

export interface TransactionItem {
  id: string;
  walletId: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string | null;
  referenceId: string | null;
  createdAt: string;
}

export interface TransactionsResponse {
  items: TransactionItem[];
  total: number;
  page: number;
  lastPage: number;
}

export interface UtilityPaymentDto {
  utilityType: "ELECTRICITY" | "WATER";
  amount: number;
  invoiceNumber: string;
}

export interface WithdrawDto {
  amount: number;
}

export interface TransferDto {
  recipientId: string;
  amount: number;
  description: string;
}

export async function login(dto: LoginDto): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function register(
  dto: LoginDto & { name: string },
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function getMe(): Promise<UserMe> {
  return request<UserMe>("/auth/me");
}

export async function getWallet(): Promise<WalletResponse> {
  return request<WalletResponse>("/finances/wallet");
}

export async function getTransactions(
  page = 1,
  limit?: number,
): Promise<TransactionsResponse> {
  limit = limit ?? parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT ?? "20");
  return request<TransactionsResponse>(
    `/finances/transactions?page=${page}&limit=${limit}`,
  );
}

export async function transfer(
  dto: TransferDto,
): Promise<{ message: string; amount: number }> {
  return request("/finances/transfer", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function withdraw(
  dto: WithdrawDto,
): Promise<{ message: string; amount: number }> {
  return request("/finances/withdraw", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function collectPension(): Promise<{
  message: string;
  amount: number;
}> {
  return request("/finances/pension", { method: "POST" });
}

export async function collectBonus(): Promise<{
  message: string;
  amount: number;
}> {
  return request("/finances/bonus", { method: "POST" });
}

export async function payUtility(
  dto: UtilityPaymentDto,
): Promise<{ message: string; amount: number }> {
  return request("/finances/pay-utility", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}
export interface BiometricLoginDto {
  dni: string;
}

export interface BiometricLoginResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function biometricLogin(
  dto: BiometricLoginDto,
): Promise<BiometricLoginResponse> {
  return request<BiometricLoginResponse>("/auth/biometric-login", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}
