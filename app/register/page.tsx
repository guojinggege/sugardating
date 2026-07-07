"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";

export default function Page() {
  const { registerWithApi } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (pw !== pw2) return setErr("两次密码不一致");
    if (pw.length < 8) return setErr("密码至少 8 位");
    if (!agree) return setErr("请先同意平台条款");
    setLoading(true);
    const res = await registerWithApi(name, email, pw);
    setLoading(false);
    if (!res.ok) { setErr(res.message); return; }
    router.push(next);
    router.refresh();
  };

  return (
    <div className="container">
      <div className="authwrap">
        <h1>创建账号</h1>
        <p className="s">加入 Sugardating,浏览 Sugargirls / 开启互动 / 或申请成为创作者。</p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>昵称</label>
            <input placeholder="你的显示名" required minLength={1} maxLength={60}
              value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
          </div>
          <div className="field">
            <label>邮箱</label>
            <input type="email" placeholder="you@example.com" required autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          </div>
          <div className="field">
            <label>密码</label>
            <input type="password" placeholder="至少 8 位" required autoComplete="new-password" minLength={8}
              value={pw} onChange={(e) => setPw(e.target.value)} disabled={loading} />
          </div>
          <div className="field">
            <label>确认密码</label>
            <input type="password" placeholder="再次输入密码" required autoComplete="new-password" minLength={8}
              value={pw2} onChange={(e) => setPw2(e.target.value)} disabled={loading} />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink2)", margin: "8px 0" }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} disabled={loading} />
            我已阅读并同意 <Link href="/community/guidelines" style={{ color: "var(--ink)", fontWeight: 600 }}>平台条款</Link> · 18+ 成年人平台
          </label>
          {err && <div style={{ color: "var(--live)", fontSize: 13, marginBottom: 4 }}>{err}</div>}
          <button className="btn btn-ink" type="submit" disabled={loading}>
            {loading ? "注册中…" : "创建账号"}
          </button>
          <div className="alt">
            已有账号？<Link href="/login" style={{ color: "var(--ink)", fontWeight: 600 }}>登录</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
