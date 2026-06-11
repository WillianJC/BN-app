const BASE = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export interface RequestOptions extends RequestInit {
  skipJsonBody?: boolean;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { skipJsonBody, headers, body, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: finalHeaders,
    ...rest,
    body: body && !skipJsonBody ? body : body,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new ApiError(errorBody.message ?? "Request failed", res.status);
  }

  return (await res.json()) as T;
}

export function get<T>(path: string, options?: RequestOptions): Promise<T> {
  return request<T>(path, { method: "GET", ...options });
}

export function post<T>(
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...options,
  });
}
