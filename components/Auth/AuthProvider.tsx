"use client";
// Auth Provider — 与服务端 session cookie 同步
// 首次挂载时 fetch /api/auth/me 拿真实登录状态 · login/logout 通过 API 完成
// 保留旧 API surface (user / login / logout / requireLogin / modal) 兼容现有调用点
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface AuthUser {
  id: string;
  name: string;
  avatarChar: string;
  role?: "user" | "creator" | "admin";
  email?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (u?: Partial<AuthUser>) => void;   // Legacy: 直接 set(用于测试);推荐用 loginWithApi
  loginWithApi: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  registerWithApi: (name: string, email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  modalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const Ctx = createContext<AuthContextValue | null>(null);

function toClientUser(u: { id: string; name: string; email?: string; role?: string }): AuthUser {
  return {
    id: u.id,
    name: u.name,
    avatarChar: (u.name?.[0] || "?").toUpperCase(),
    role: (u.role as AuthUser["role"]) || "user",
    email: u.email,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data?.user ? toClientUser(data.user) : null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const loginWithApi = useCallback<AuthContextValue["loginWithApi"]>(async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok) {
        setUser(toClientUser(data.user));
        setModalOpen(false);
        return { ok: true };
      }
      return { ok: false, message: data?.message || "登录失败" };
    } catch {
      return { ok: false, message: "网络错误,请稍后重试" };
    }
  }, []);

  const registerWithApi = useCallback<AuthContextValue["registerWithApi"]>(async (name, email, password) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok) {
        setUser(toClientUser(data.user));
        return { ok: true };
      }
      return { ok: false, message: data?.message || "注册失败" };
    } catch {
      return { ok: false, message: "网络错误,请稍后重试" };
    }
  }, []);

  const login = useCallback((u?: Partial<AuthUser>) => {
    // Legacy sync setter (仅供 fallback/测试;真登录请用 loginWithApi)
    setUser({
      id: u?.id ?? "demo-user",
      name: u?.name ?? "Demo",
      avatarChar: u?.avatarChar ?? (u?.name?.[0]?.toUpperCase() ?? "D"),
      role: u?.role ?? "user",
    });
    setModalOpen(false);
  }, []);

  const logout = useCallback(async () => {
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } catch {}
    setUser(null);
  }, []);

  const openLoginModal = useCallback(() => setModalOpen(true), []);
  const closeLoginModal = useCallback(() => setModalOpen(false), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user, isAuthenticated: !!user, hydrated,
      login, loginWithApi, registerWithApi, logout, refresh,
      modalOpen, openLoginModal, closeLoginModal,
    }),
    [user, hydrated, modalOpen, login, loginWithApi, registerWithApi, logout, refresh, openLoginModal, closeLoginModal],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth() 必须在 <AuthProvider> 内调用");
  return v;
}

export function useRequireLogin(): () => boolean {
  const { isAuthenticated, openLoginModal } = useAuth();
  return useCallback(() => {
    if (isAuthenticated) return true;
    openLoginModal();
    return false;
  }, [isAuthenticated, openLoginModal]);
}
