import { get, post } from "../../utils/api";
import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  SessionInfo,
  UserMe,
} from "./types";

export const authApi = {
  login: (dto: LoginDto) => post<AuthResponse>("/auth/login", dto),
  register: (dto: RegisterDto) => post<AuthResponse>("/auth/register", dto),
  logout: () => post<AuthResponse>("/auth/logout"),
  me: () => get<UserMe>("/auth/me"),
  session: () => get<SessionInfo>("/auth/session"),
};
