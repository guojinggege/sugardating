// Admin · 媒体库 · grid + kind/status/locked filters
import Link from "next/link";
import { AdminPageHeader, AdminBadge } from "@/components/admin/AdminPrimitives";
import { cmsRepo } from "@/lib/cms/repository";
import type { MediaStatus } from "@/lib/cms/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Media · Sugardating Admin" };

interface Props { searchParams: { kind?: string; status?: string; locked?: string } }

export default function AdminMediaPage({ searchParams }: Props) {
  const kind = searchParams.kind as ("image" | "video" | undefined);
  const status = searchParams.status as (MediaStatus | undefined);
  const lockedFlag = searchParams.locked === "1" ? true : searchParams.locked === "0" ? false : undefined;
  const items = cmsRepo.listMedia({ kind, status, locked: lockedFlag });

  const all = cmsRepo.listMedia();
  const stats = {
    total: all.length,
    pending: all.filter((m) => m.status === "pending").length,
    locked: all.filter((m) => m.isLocked).length,
    revenue: all.reduce((s, m) => s + (m.revenue || 0), 0),
  };

  const filters: { key: string; label: string; href: string; active: boolean }[] = [
    { key: "all",       label: "全部",       href: "/admin/media",              active: !kind && !status && lockedFlag === undefined },
    { key: "pending",   label: "待审核",     href: "/admin/media?status=pending", active: status === "pending" },
    { key: "approved",  label: "已通过",     href: "/admin/media?status=approved", active: status === "approved" },
    { key: "locked",    label: "付费解锁",   href: "/admin/media?locked=1",     active: lockedFlag === true },
    { key: "images",    label: "图片",       href: "/admin/media?kind=image",   active: kind === "image" },
    { key: "videos",    label: "视频",       href: "/admin/media?kind=video",   active: kind === "video" },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Media"
        title="图片视频库"
        description="全站媒体资源管理 · 支持审核、付费解锁配置、来源筛选"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Media" }]}
      />

      <div className="ml-stats">
        <div className="ml-stat"><b>{stats.total}</b><span>总数</span></div>
        <div className="ml-stat"><b>{stats.pending}</b><span>待审核</span></div>
        <div className="ml-stat"><b>{stats.locked}</b><span>付费内容</span></div>
        <div className="ml-stat"><b>{stats.revenue.toLocaleString("en-US")}</b><span>Credits 收入</span></div>
      </div>

      <div className="ml-filters">
        {filters.map((f) => (
          <Link key={f.key} href={f.href} className={"ml-f" + (f.active ? " is-active" : "")}>{f.label}</Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="ml-empty">当前筛选下没有媒体</div>
      ) : (
        <div className="ml-grid">
          {items.map((m) => (
            <div key={m.id} className={"ml-tile" + (m.isLocked ? " is-locked" : "")}>
              <div className="ml-tile-media">
                {m.kind === "image" ? (
                  <img src={m.src} alt={m.alt || ""} loading="lazy" />
                ) : (
                  <video src={m.src} muted playsInline />
                )}
                <div className="ml-tile-badges">
                  {m.isLocked && <AdminBadge tone="gold">🔒 {m.price} coins</AdminBadge>}
                  <AdminBadge tone={m.status === "approved" ? "success" : m.status === "pending" ? "warning" : "danger"}>
                    {m.status}
                  </AdminBadge>
                </div>
                <div className="ml-tile-kind">{m.kind === "image" ? "IMG" : "VID"}</div>
              </div>
              <div className="ml-tile-meta">
                <div className="ml-tile-id">{m.id}</div>
                {m.ownerId && <div className="ml-tile-owner">owner: {m.ownerId}</div>}
                {m.isLocked && (
                  <div className="ml-tile-stats">
                    <span>{m.unlockCount ?? 0} 解锁</span>
                    <span>· {m.revenue ?? 0} coins</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .ml-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
        .ml-stat{padding:16px 18px;background:#fff;border:1px solid #E5E7EB;border-radius:14px;display:flex;flex-direction:column;gap:2px}
        .ml-stat b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:26px;color:#111;font-weight:600;line-height:1;font-variant-numeric:tabular-nums}
        .ml-stat span{font-size:11px;color:#6B7280;letter-spacing:.1em;text-transform:uppercase;font-weight:600;margin-top:6px}
        .ml-filters{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
        .ml-f{padding:7px 14px;background:#fff;border:1px solid #E5E7EB;border-radius:99px;font-size:12.5px;color:#374151;text-decoration:none;font-weight:600;transition:border-color .12s,background .12s}
        .ml-f:hover{border-color:#D6B980}
        .ml-f.is-active{background:#111;color:#EEDDB8;border-color:#111}
        .ml-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}
        .ml-tile{background:#fff;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;transition:border-color .12s,transform .12s}
        .ml-tile:hover{border-color:#D6B980;transform:translateY(-2px)}
        .ml-tile.is-locked{border-color:#EEDDB8}
        .ml-tile-media{position:relative;aspect-ratio:1;background:#F3F4F6;overflow:hidden}
        .ml-tile-media img,.ml-tile-media video{width:100%;height:100%;object-fit:cover;display:block}
        .ml-tile-badges{position:absolute;top:8px;left:8px;right:8px;display:flex;gap:4px;flex-wrap:wrap}
        .ml-tile-kind{position:absolute;bottom:8px;right:8px;padding:2px 6px;background:rgba(0,0,0,.65);color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.08em;border-radius:4px;backdrop-filter:blur(4px)}
        .ml-tile-meta{padding:10px 12px}
        .ml-tile-id{font-family:ui-monospace,monospace;font-size:11px;color:#6B7280}
        .ml-tile-owner{font-size:11px;color:#9CA3AF;margin-top:2px}
        .ml-tile-stats{display:flex;gap:4px;font-size:11px;color:#6B7280;margin-top:6px;padding-top:6px;border-top:1px dashed #F3F4F6}
        .ml-empty{padding:60px 24px;background:#fff;border:1px dashed #E5E7EB;border-radius:16px;text-align:center;color:#9CA3AF;font-size:14px;font-style:italic}
        @media (max-width:900px){.ml-stats{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </>
  );
}
