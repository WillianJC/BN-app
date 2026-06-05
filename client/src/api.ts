const API_BASE = "/api";

interface ApiResponse<T = unknown> {
  success: boolean;
  error?: string;
  [key: string]: unknown;
}

let authToken: number | null = null;

export function setAuthToken(userId: number): void {
  authToken = userId;
}

export function getAuthToken(): number | null {
  return authToken;
}

export function clearAuthToken(): void {
  authToken = null;
}

async function apiRequest<T extends ApiResponse>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers["x-user-id"] = String(authToken);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  return res.json() as Promise<T>;
}

export async function login(dni: string, pin: string): Promise<ApiResponse<{ user: { id: number; name: string; balance: number } }>> {
  const res = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ dni, pin }),
  });

  if (res.success && res.user) {
    setAuthToken((res.user as { id: number; name: string; balance: number }).id);
  }

  return res;
}

export async function getBalance(): Promise<ApiResponse<{ balance: number; pensionAmount: number; pensionDeposited: boolean }>> {
  return apiRequest("/balance");
}

export async function createWithdrawalCode(amount: number): Promise<ApiResponse<{ code: string; amount: number; expiresAt: string }>> {
  return apiRequest("/withdraw", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export async function processPayment(service: string, amount: number): Promise<ApiResponse<{ transactionId: number; service: string; amount: number }>> {
  return apiRequest("/payments", {
    method: "POST",
    body: JSON.stringify({ service, amount }),
  });
}

export async function triggerSOS(): Promise<ApiResponse<{ alertId: number; message: string }>> {
  return apiRequest("/sos", { method: "POST" });
}

export async function getSchedule(): Promise<ApiResponse<{ month: string; schedule: Array<{ dniEnds: string; date: string }> }>> {
  return apiRequest("/schedule");
}
