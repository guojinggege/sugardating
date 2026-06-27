import Link from "next/link";
export default function Page() {
  return (
    <div className="container">
      <div className="authwrap">
        <h1>成为创作者</h1>
        <p className="s">开通主页，开始发布作品。（表单为静态占位，未接入认证。）</p>
        <div className="field"><label>昵称</label><input placeholder="你的创作者名" /></div>
        <div className="field"><label>邮箱</label><input type="email" placeholder="you@example.com" /></div>
        <div className="field"><label>密码</label><input type="password" placeholder="••••••••" /></div>
        <button className="btn btn-ink">创建账号</button>
        <div className="alt">已有账号？<Link href="/login" style={{ color: "var(--ink)", fontWeight: 600 }}>登录</Link></div>
      </div>
    </div>
  );
}
