export interface UserMe {
  sub: string;
  email?: string;
  role?: string;
}

export interface SessionInfo {
  authenticated: boolean;
  user: {
    sub: string;
    email: string | null;
    role: string | null;
  };
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto extends LoginDto {
  name: string;
}

export interface AuthResponse {
  message: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  status: "loading" | "authenticated" | "unauthenticated";
  user: AuthUser | null;
}
