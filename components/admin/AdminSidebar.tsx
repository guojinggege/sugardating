"use client";
// Admin 左侧导航 · 分组 · sticky · Linear / Vercel Dashboard 感
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem { label: string; href: string; badge?: string; soon?: boolean }
interface NavGroup { label: string; items: NavItem[] }

const NAV: NavGroup[] = [
  { label: "Overview", items: [
    { label: "Dashboard",       href: "/admin/dashboard" },
  ]},
  { label: "Content", items: [
    { label: "首页内容",         href: "/admin/content/home", soon: true },
    { label: "导航与 Footer",    href: "/admin/content/navigation", soon: true },
    { label: "Journal 文章",     href: "/admin/journal/posts" },
    { label: "笔记转博客",       href: "/admin/tools/xhs-to-blog", badge: "NEW" },
    { label: "SEO 页面",         href: "/admin/seo", soon: true },
  ]},
  { label: "Creators", items: [
    { label: "全部 Creator",     href: "/admin/creators" },
    { label: "入驻申请",         href: "/admin/creators/applications" },
    { label: "Sugargirls",       href: "/admin/creators?type=sugargirl" },
    { label: "Sugarboys",        href: "/admin/creators?type=sugarboy" },
    { label: "情趣按摩",         href: "/admin/creators?type=massage" },
  ]},
  { label: "Channels", items: [
    { label: "定制服务需求",     href: "/admin/custom-services/requests" },
    { label: "推荐位",           href: "/admin/channels/placements", soon: true },
  ]},
  { label: "Media", items: [
    { label: "图片视频库",       href: "/admin/media" },
    { label: "付费内容",         href: "/admin/media?locked=1" },
  ]},
  { label: "Community", items: [
    { label: "注册用户",         href: "/admin/users" },
  ]},
  { label: "Commerce", items: [
    { label: "Credits",          href: "/admin/wallet", soon: true },
    { label: "会员",             href: "/admin/membership", soon: true },
  ]},
  { label: "Safety", items: [
    { label: "举报",             href: "/admin/chat/reports", soon: true },
    { label: "审核队列",         href: "/admin/moderation", soon: true },
  ]},
  { label: "System", items: [
    { label: "多语言",           href: "/admin/i18n", soon: true },
    { label: "站点设置",         href: "/admin/settings" },
    { label: "操作日志",         href: "/admin/audit-log" },
  ]},
];

export default function AdminSidebar() {
  const pathname = usePathname() || "";
  return (
    <aside className="as">
      <div className="as-brand">
        <div className="as-mark">S</div>
        <div className="as-brand-text">
          <b>Sugardating</b>
          <span>Admin Console</span>
        </div>
      </div>

      <nav className="as-nav" aria-label="Admin navigation">
        {NAV.map((group) => (
          <div key={group.label} className="as-group">
            <div className="as-group-h">{group.label}</div>
            <ul>
              {group.items.map((it) => {
                const base = it.href.split("?")[0];
                const active = pathname === base || (base !== "/admin/creators" && pathname.startsWith(base));
                return (
                  <li key={it.href}>
                    <Link href={it.href} className={"as-item" + (active ? " is-active" : "")}>
                      <span className="as-item-label">{it.label}</span>
                      {it.badge && <span className="as-badge">{it.badge}</span>}
                      {it.soon && <span className="as-soon">Soon</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="as-foot">
        <Link href="/" className="as-back">← 返回前台</Link>
      </div>

      <style>{`
        .as{position:sticky;top:0;height:100vh;width:260px;background:#0F0F11;color:#e8e8ec;display:flex;flex-direction:column;flex-shrink:0;border-right:1px solid rgba(238,221,184,.08)}
        .as-brand{display:flex;align-items:center;gap:12px;padding:20px 22px 22px;border-bottom:1px solid rgba(238,221,184,.08)}
        .as-mark{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;display:inline-flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:22px;font-weight:700}
        .as-brand-text{display:flex;flex-direction:column;line-height:1.2}
        .as-brand-text b{font-size:14px;color:#fff;font-weight:700;letter-spacing:-0.005em}
        .as-brand-text span{font-size:10.5px;color:#B8A789;letter-spacing:.14em;text-transform:uppercase;font-weight:600}
        .as-nav{flex:1;overflow-y:auto;padding:14px 12px;scrollbar-width:thin;scrollbar-color:rgba(238,221,184,.15) transparent}
        .as-nav::-webkit-scrollbar{width:6px}
        .as-nav::-webkit-scrollbar-thumb{background:rgba(238,221,184,.15);border-radius:6px}
        .as-group{margin-bottom:18px}
        .as-group-h{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:rgba(238,221,184,.4);font-weight:700;padding:0 12px 8px}
        .as-group ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:1px}
        .as-item{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;font-size:13.5px;color:rgba(232,232,236,.72);text-decoration:none;border-radius:8px;transition:background .12s,color .12s;position:relative}
        .as-item:hover{background:rgba(238,221,184,.06);color:#fff}
        .as-item.is-active{background:linear-gradient(135deg,rgba(238,221,184,.18),rgba(184,167,137,.08));color:#EEDDB8;font-weight:600}
        .as-item.is-active:before{content:"";position:absolute;left:-12px;top:50%;transform:translateY(-50%);width:3px;height:16px;background:#EEDDB8;border-radius:0 3px 3px 0}
        .as-item-label{flex:1}
        .as-soon{font-size:9.5px;letter-spacing:.06em;color:rgba(238,221,184,.55);text-transform:uppercase;font-weight:700;background:rgba(238,221,184,.08);padding:2px 6px;border-radius:4px}
        .as-badge{font-size:9.5px;letter-spacing:.08em;color:#1a1409;text-transform:uppercase;font-weight:800;background:linear-gradient(135deg,#EEDDB8,#B8A789);padding:2px 6px;border-radius:4px}
        .as-foot{padding:14px 22px 20px;border-top:1px solid rgba(238,221,184,.08)}
        .as-back{font-size:12px;color:rgba(232,232,236,.6);text-decoration:none;transition:color .12s}
        .as-back:hover{color:#EEDDB8}
      `}</style>
    </aside>
  );
}
