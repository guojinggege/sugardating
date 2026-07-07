"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";

export default function Page() {
  const { loginWithApi, user, hydrated } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/me";     // 默认进 /me (spec §五)

  // 已登录访问 /login → 自动跳 next (client-side · 避 middleware cookie loop)
  useEffect(() => {
    if (hydrated && user) router.replace(next);
  }, [hydrated, user, next, router]);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    const res = await loginWithApi(email, pw);
    setLoading(false);
    if (!res.ok) { setErr(res.message); return; }
    router.push(next);
    router.refresh();
  };

  return (
    <div className="container">
      <div className="authwrap">
        <h1>登录</h1>
        <p className="s">欢迎回到 Sugardating。</p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>邮箱</label>
            <input type="email" required autoComplete="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          </div>
          <div className="field">
            <label>密码</label>
            <input type="password" required autoComplete="current-password" placeholder="至少 8 位"
              value={pw} onChange={(e) => setPw(e.target.value)} disabled={loading} />
          </div>
          {err && <div style={{ color: "var(--live)", fontSize: 13, marginTop: 4 }}>{err}</div>}
          <button className="btn btn-ink" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "登录中…" : "登录"}
          </button>
          <div className="alt">
            还没有账号？<Link href="/register" style={{ color: "var(--ink)", fontWeight: 600 }}>注册</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
