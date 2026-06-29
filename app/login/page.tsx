import Link from "next/link";
export default function Page() {
  return (
    <div className="container">
      <div className="authwrap">
        <h1>登录</h1>
        <p className="s">欢迎回到 Sugardating。（表单为静态占位，未接入认证。）</p>
        <div className="field"><label>邮箱</label><input type="email" placeholder="you@example.com" /></div>
        <div className="field"><label>密码</label><input type="password" placeholder="••••••••" /></div>
        <button className="btn btn-ink">登录</button>
        <div className="alt">还没有账号？<Link href="/register" style={{ color: "var(--ink)", fontWeight: 600 }}>注册</Link></div>
      </div>
    </div>
  );
}
