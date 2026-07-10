import Link from "next/link";
export default function Forbidden() {
  return (
    <div className="ab-forbidden">
      <div className="ab-in">
        <div className="ab-code">403</div>
        <h1>Forbidden</h1>
        <p>你的账号没有 Sugardating 后台访问权限。如需权限,请联系管理员配置 <code>ADMIN_EMAILS</code>。</p>
        <div className="ab-cta">
          <Link href="/">返回首页</Link>
          <Link href="/login">切换账号</Link>
        </div>
      </div>
      <style>{`
        .ab-forbidden{min-height:100vh;background:#FAFAF8;display:flex;align-items:center;justify-content:center;padding:40px}
        .ab-in{max-width:520px;text-align:center;background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:56px 40px}
        .ab-code{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:64px;color:#D6B980;font-weight:600;line-height:1;margin-bottom:16px}
        .ab-in h1{font-size:26px;color:#111;font-weight:700;margin:0 0 12px}
        .ab-in p{font-size:14px;color:#6B7280;margin:0 0 24px;line-height:1.7}
        .ab-in code{background:#F3F4F6;padding:2px 6px;border-radius:4px;font-family:ui-monospace,monospace;font-size:12.5px}
        .ab-cta{display:flex;justify-content:center;gap:10px}
        .ab-cta a{padding:10px 20px;background:#111;color:#fff;border-radius:10px;font-size:13px;font-weight:600;text-decoration:none}
        .ab-cta a:last-child{background:#F3F4F6;color:#111}
      `}</style>
    </div>
  );
}
