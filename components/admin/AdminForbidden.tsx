// Admin 403 · 已登录但无 admin 权限时显示
import Link from "next/link";

interface Props {
  email?: string;
  name?: string;
}

export default function AdminForbidden({ email, name }: Props) {
  return (
    <div className="fb">
      <div className="fb-in">
        <div className="fb-code">403</div>
        <div className="fb-eyebrow">FORBIDDEN · Admin Access Required</div>
        <h1>你的账号没有 Sugardating 后台访问权限</h1>
        {email && (
          <div className="fb-you">
            <div>当前登录:</div>
            <b>{name || "未命名"}</b>
            <span>{email}</span>
          </div>
        )}
        <p className="fb-note">
          Sugardating 后台仅对被列入 <code>ADMIN_EMAILS</code> 环境变量的邮箱开放。
          如需权限,请联系管理员将你的邮箱加入该白名单;或使用一个已获权限的账号登录。
        </p>

        <div className="fb-hint">
          <div className="fb-hint-h">如何配置管理员</div>
          <ol>
            <li>Vercel Project Settings → Environment Variables</li>
            <li>新增 <code>ADMIN_EMAILS</code> = <code>you@your-domain.com,other@team.com</code> (逗号分隔多个)</li>
            <li>Redeploy 后使用该邮箱登录即可访问后台</li>
          </ol>
        </div>

        <div className="fb-cta">
          <Link href="/" className="fb-btn fb-btn--primary">返回首页</Link>
          <Link href="/login" className="fb-btn fb-btn--ghost">切换账号</Link>
          <Link href="/me" className="fb-btn fb-btn--ghost">我的主页</Link>
        </div>
      </div>

      <style>{`
        .fb{min-height:100vh;background:#FAFAF8;display:flex;align-items:center;justify-content:center;padding:40px 20px}
        .fb-in{max-width:560px;background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:48px 44px;box-shadow:0 30px 80px -30px rgba(0,0,0,.15);text-align:left}
        .fb-code{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:64px;color:#D6B980;font-weight:600;line-height:1;margin-bottom:8px;letter-spacing:-0.02em}
        .fb-eyebrow{font-size:10.5px;letter-spacing:.28em;text-transform:uppercase;color:#B91C1C;font-weight:700;margin-bottom:14px}
        .fb-in h1{font-family:'Cormorant Garamond',ui-serif;font-size:26px;font-style:italic;font-weight:500;color:#111;margin:0 0 20px;line-height:1.25;letter-spacing:-0.005em}
        .fb-you{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;gap:2px 12px;align-items:baseline;padding:14px 18px;background:#FBFAF7;border:1px solid #EEE9DC;border-radius:12px;margin-bottom:20px;font-size:13px}
        .fb-you > div{color:#6B7280;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:600;grid-row:1;grid-column:1/-1}
        .fb-you b{color:#111;font-weight:700;font-size:14px}
        .fb-you span{color:#6B7280;font-family:ui-monospace,monospace;font-size:12px}
        .fb-note{font-size:13.5px;line-height:1.7;color:#374151;margin:0 0 20px}
        .fb-note code,.fb-hint code{background:#F3F4F6;padding:2px 6px;border-radius:4px;font-family:ui-monospace,monospace;font-size:11.5px;color:#111}
        .fb-hint{padding:16px 18px;background:#F7F5F0;border:1px dashed #D6B980;border-radius:12px;margin-bottom:24px}
        .fb-hint-h{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6B7280;font-weight:700;margin-bottom:10px}
        .fb-hint ol{list-style:decimal;margin:0;padding-left:20px;display:flex;flex-direction:column;gap:6px;font-size:12.5px;line-height:1.65;color:#374151}
        .fb-cta{display:flex;gap:8px;flex-wrap:wrap}
        .fb-btn{padding:11px 20px;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none;transition:opacity .12s,transform .12s}
        .fb-btn--primary{background:#111;color:#fff}
        .fb-btn--primary:hover{transform:translateY(-1px)}
        .fb-btn--ghost{background:#F3F4F6;color:#111}
        .fb-btn--ghost:hover{background:#E5E7EB}
        @media (max-width:640px){
          .fb-in{padding:32px 24px}
          .fb-in h1{font-size:22px}
          .fb-cta .fb-btn{flex:1;text-align:center}
        }
      `}</style>
    </div>
  );
}
