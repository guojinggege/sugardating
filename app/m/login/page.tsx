// Mobile Login — 简洁表单
"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/AuthProvider";

export default function Page() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const name = email.split("@")[0] || "user";
    login({ name, avatarChar: name[0]?.toUpperCase() || "U" });
    router.push("/m");
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-[360px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="mx-auto w-14 h-14 rounded-2xl grid place-items-center text-white text-[24px] font-black"
            style={{ background: "var(--ink)" }}
          >
            S
          </div>
          <h1 className="text-[24px] font-extrabold text-[var(--ink)] mt-4 tracking-tight m-0">欢迎回来</h1>
          <p className="text-[13px] text-[var(--muted)] mt-1.5">登录以继续</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[12px] font-semibold text-[var(--ink)] block mb-1.5">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-12 px-4 rounded-xl bg-white border border-[var(--line)] text-[15px] text-[var(--ink)] focus:outline-none focus:border-[var(--ink)] transition"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[var(--ink)] block mb-1.5">密码</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-xl bg-white border border-[var(--line)] text-[15px] text-[var(--ink)] focus:outline-none focus:border-[var(--ink)] transition"
              autoComplete="current-password"
            />
          </div>
          <div className="text-right">
            <Link href="#" className="text-[12px] text-[var(--muted)] hover:text-[var(--ink)]">
              忘记密码?
            </Link>
          </div>
          <button
            type="submit"
            className="h-12 rounded-xl bg-[var(--ink)] text-white text-[15px] font-bold hover:bg-black transition mt-2"
          >
            登录
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-[var(--line)]" />
          <span className="text-[11px] text-[var(--muted)] uppercase tracking-widest">或</span>
          <span className="flex-1 h-px bg-[var(--line)]" />
        </div>

        {/* Social */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="h-12 rounded-xl bg-white border border-[var(--line)] text-[14px] font-semibold text-[var(--ink)] hover:bg-[var(--page)] transition inline-flex items-center justify-center gap-2"
          >
            <span aria-hidden>🍎</span> 使用 Apple 登录
          </button>
          <button
            type="button"
            className="h-12 rounded-xl bg-white border border-[var(--line)] text-[14px] font-semibold text-[var(--ink)] hover:bg-[var(--page)] transition inline-flex items-center justify-center gap-2"
          >
            <span aria-hidden>💬</span> 使用微信登录
          </button>
        </div>

        {/* Register */}
        <div className="text-center mt-8">
          <span className="text-[13px] text-[var(--muted)]">还没有账号？</span>
          <Link href="/m/register" className="text-[13px] font-bold text-[var(--ink)] ml-1 hover:opacity-80">
            注册
          </Link>
        </div>
      </div>
    </div>
  );
}
