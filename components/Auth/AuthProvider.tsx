"use client";
// Guest Mode auth 框架 — 当前为 demo (localStorage 假登录),
// 接入真实 NextAuth/Clerk 时只需把 user 来源换成 session,API surface 不变
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface AuthUser {
  id: string;
  name: string;
  avatarChar: string;   // 用于头像首字母占位
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hydrated: boolean;    // SSR 首屏后是否已同步 localStorage,避免视觉 flash
  login: (u?: Partial<AuthUser>) => void;
  logout: () => void;
  modalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const Ctx = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "sg.auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  const login = useCallback((u?: Partial<AuthUser>) => {
    const nu: AuthUser = {
      id: u?.id ?? "demo-user",
      name: u?.name ?? "Demo",
      avatarChar: u?.avatarChar ?? (u?.name?.[0]?.toUpperCase() ?? "D"),
    };
    setUser(nu);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nu)); } catch {}
    setModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const openLoginModal = useCallback(() => setModalOpen(true), []);
  const closeLoginModal = useCallback(() => setModalOpen(false), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      hydrated,
      login,
      logout,
      modalOpen,
      openLoginModal,
      closeLoginModal,
    }),
    [user, hydrated, modalOpen, login, logout, openLoginModal, closeLoginModal]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth() 必须在 <AuthProvider> 内调用");
  return v;
}

/**
 * 受保护操作的统一 gate。用法:
 *   const requireLogin = useRequireLogin();
 *   const onClick = () => { if (!requireLogin()) return; doWrite(); };
 *
 * 未登录: 自动弹出全局 Login Modal,返回 false (调用方早退)
 * 已登录: 返回 true (调用方继续执行写操作)
 */
export function useRequireLogin(): () => boolean {
  const { isAuthenticated, openLoginModal } = useAuth();
  return useCallback(() => {
    if (isAuthenticated) return true;
    openLoginModal();
    return false;
  }, [isAuthenticated, openLoginModal]);
}
