/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "./api";

interface AuthContextValue {
  token: string | null;
  username: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const r = await api.get<{ username: string }>("/api/auth/me");
        if (!cancelled) setUsername(r.data.username);
      } catch {
        localStorage.removeItem("token");
        if (!cancelled) {
          setToken(null);
          setUsername(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function login(u: string, p: string) {
    const r = await api.post<{ access_token: string }>("/api/auth/login-json", {
      username: u,
      password: p,
    });
    localStorage.setItem("token", r.data.access_token);
    setToken(r.data.access_token);
    setUsername(u);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ token, username, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
