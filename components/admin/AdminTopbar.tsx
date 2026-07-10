"use client";
// Admin 顶部条 · Search + Actions + User menu
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  adminEmail: string;
  isDemoMode: boolean;
}

export default function AdminTopbar({ adminEmail, isDemoMode }: Props) {
  const [q, setQ] = useState("");
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen((v) => !v); }
      if (e.key === "Escape" && cmdOpen) setCmdOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cmdOpen]);

  return (
    <>
      <header className="at">
        <div className="at-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="搜索 Creator / 申请 / 文章 / 媒体…  (⌘ K)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setCmdOpen(true)}
          />
          <span className="at-kbd">⌘K</span>
        </div>

        <div className="at-actions">
          {isDemoMode && (
            <span className="at-demo" title="当前 CMS 使用 Demo 数据 · 生产持久化需接入数据库">
              <span /> Demo Mode
            </span>
          )}
          <Link href="/admin/audit-log" className="at-btn at-btn--ghost">操作日志</Link>
          <div className="at-user">
            <div className="at-avatar">{(adminEmail[0] || "A").toUpperCase()}</div>
            <div className="at-user-info">
              <b>{adminEmail}</b>
              <span>Admin</span>
            </div>
          </div>
        </div>
      </header>

      {cmdOpen && (
        <div className="at-cmd-bd" onClick={() => setCmdOpen(false)}>
          <div className="at-cmd" onClick={(e) => e.stopPropagation()}>
            <div className="at-cmd-h">
              <span>快速导航 · Command Menu</span>
              <button onClick={() => setCmdOpen(false)} aria-label="关闭">×</button>
            </div>
            <div className="at-cmd-body">
              <input autoFocus placeholder="输入以搜索…" value={q} onChange={(e) => setQ(e.target.value)} />
              <ul>
                <li><Link href="/admin/dashboard" onClick={() => setCmdOpen(false)}><b>Dashboard</b><span>Overview</span></Link></li>
                <li><Link href="/admin/creators" onClick={() => setCmdOpen(false)}><b>Creators</b><span>全部 Creator / Provider</span></Link></li>
                <li><Link href="/admin/creators/applications" onClick={() => setCmdOpen(false)}><b>Applications</b><span>入驻申请审核</span></Link></li>
                <li><Link href="/admin/journal/posts" onClick={() => setCmdOpen(false)}><b>Journal Posts</b><span>Sugardating Journal 文章</span></Link></li>
                <li><Link href="/admin/media" onClick={() => setCmdOpen(false)}><b>Media Library</b><span>图片视频库</span></Link></li>
                <li><Link href="/admin/custom-services/requests" onClick={() => setCmdOpen(false)}><b>Custom Requests</b><span>定制服务需求</span></Link></li>
                <li><Link href="/admin/settings" onClick={() => setCmdOpen(false)}><b>Settings</b><span>站点设置 / Feature Flags</span></Link></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .at{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:14px 28px;background:rgba(250,250,248,.92);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid #E5E7EB;position:sticky;top:0;z-index:40}
        .at-search{flex:1;max-width:520px;position:relative;display:flex;align-items:center}
        .at-search svg{position:absolute;left:12px;color:#6B7280;pointer-events:none}
        .at-search input{width:100%;padding:9px 60px 9px 34px;background:#fff;border:1px solid #E5E7EB;border-radius:10px;font:inherit;font-size:13.5px;color:#111;outline:none;transition:border-color .12s,box-shadow .12s}
        .at-search input:focus{border-color:#D6B980;box-shadow:0 0 0 3px rgba(214,185,128,.15)}
        .at-kbd{position:absolute;right:10px;font-size:10.5px;color:#6B7280;background:#F4F4F5;padding:3px 6px;border-radius:5px;font-family:ui-monospace,monospace;letter-spacing:.02em;font-weight:600;pointer-events:none}
        .at-actions{display:flex;align-items:center;gap:12px}
        .at-demo{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;background:linear-gradient(135deg,#FEF3C7,#FDE68A);color:#7C5A05;border-radius:99px;font-size:11.5px;font-weight:700;letter-spacing:.02em}
        .at-demo span{width:6px;height:6px;background:#D6B980;border-radius:50%;animation:demo-pulse 2.4s infinite}
        @keyframes demo-pulse{0%,100%{opacity:.4}50%{opacity:1}}
        .at-btn{padding:7px 14px;border-radius:8px;font-size:12.5px;font-weight:600;text-decoration:none;transition:background .12s,border-color .12s}
        .at-btn--ghost{background:#fff;color:#111;border:1px solid #E5E7EB}
        .at-btn--ghost:hover{border-color:#D6B980}
        .at-user{display:flex;align-items:center;gap:10px;padding-left:12px;border-left:1px solid #E5E7EB}
        .at-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#111,#333);color:#EEDDB8;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700}
        .at-user-info{display:flex;flex-direction:column;line-height:1.2;max-width:180px}
        .at-user-info b{font-size:12.5px;color:#111;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .at-user-info span{font-size:10.5px;color:#6B7280;letter-spacing:.06em;text-transform:uppercase;font-weight:600}

        .at-cmd-bd{position:fixed;inset:0;background:rgba(15,15,17,.45);backdrop-filter:blur(6px);z-index:80;display:flex;align-items:flex-start;justify-content:center;padding:100px 20px 20px;animation:at-fade .16s ease}
        .at-cmd{width:100%;max-width:560px;background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 40px 80px -40px rgba(0,0,0,.45);animation:at-rise .2s cubic-bezier(.2,.9,.3,1.2);overflow:hidden}
        .at-cmd-h{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #E5E7EB;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6B7280;font-weight:700}
        .at-cmd-h button{background:none;border:0;font-size:22px;color:#6B7280;cursor:pointer;line-height:1;padding:0 4px}
        .at-cmd-body{padding:12px}
        .at-cmd-body input{width:100%;padding:10px 12px;background:#F7F5F0;border:1px solid #E5E7EB;border-radius:10px;font:inherit;font-size:14px;color:#111;outline:none;margin-bottom:8px}
        .at-cmd-body input:focus{border-color:#D6B980;background:#fff}
        .at-cmd-body ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px;max-height:340px;overflow-y:auto}
        .at-cmd-body li a{display:flex;flex-direction:column;padding:9px 12px;border-radius:8px;text-decoration:none;color:#111;transition:background .1s}
        .at-cmd-body li a:hover{background:#F7F5F0}
        .at-cmd-body li b{font-size:13.5px;font-weight:700}
        .at-cmd-body li span{font-size:11.5px;color:#6B7280}

        @keyframes at-fade{from{opacity:0}to{opacity:1}}
        @keyframes at-rise{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}

        @media (max-width:900px){.at{padding:12px 16px}.at-search{max-width:none}.at-user-info{display:none}.at-btn{display:none}}
      `}</style>
    </>
  );
}
