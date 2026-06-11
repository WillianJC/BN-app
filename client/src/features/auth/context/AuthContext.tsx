import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "../../../utils/api";
import { getDisplayNameFromEmail } from "../../../utils/formatters";
import { authApi } from "../api";
import type { AuthState, AuthUser, LoginDto, RegisterDto } from "../types";

interface AuthContextValue extends AuthState {
  login: (dto: LoginDto) => Promise<AuthUser>;
  register: (dto: RegisterDto) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: null,
  });

  const refresh = useCallback(async () => {
    try {
      const me = await authApi.me();
      const name = me.email ? getDisplayNameFromEmail(me.email) : "Usuario";
      setState({
        status: "authenticated",
        user: { id: me.sub, email: me.email ?? "", name },
      });
    } catch (err: unknown) {
      if (
        err instanceof ApiError &&
        (err.statusCode === 401 || err.statusCode === 403)
      ) {
        setState({ status: "unauthenticated", user: null });
        return;
      }
      setState({ status: "unauthenticated", user: null });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (dto: LoginDto): Promise<AuthUser> => {
    await authApi.login(dto);
    const me = await authApi.me();
    const name = me.email ? getDisplayNameFromEmail(me.email) : "Usuario";
    const user: AuthUser = {
      id: me.sub,
      email: me.email ?? dto.email,
      name,
    };
    setState({ status: "authenticated", user });
    return user;
  }, []);

  const register = useCallback(async (dto: RegisterDto): Promise<AuthUser> => {
    await authApi.register(dto);
    return login({ email: dto.email, password: dto.password });
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // proceed even if request fails
    }
    setState({ status: "unauthenticated", user: null });
  }, []);

  const setUser = useCallback((user: AuthUser) => {
    setState({ status: "authenticated", user });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, register, logout, refresh, setUser }),
    [state, login, register, logout, refresh, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
