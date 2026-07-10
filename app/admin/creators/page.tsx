// Admin · Creators 统一列表 · type=sugargirl/sugarboy/massage 筛选
import Link from "next/link";
import { AdminPageHeader, AdminTable, AdminBadge } from "@/components/admin/AdminPrimitives";
import { cmsRepo } from "@/lib/cms/repository";

export const dynamic = "force-dynamic";
export const metadata = { title: "Creators · Sugardating Admin" };

interface Props { searchParams: { type?: string; q?: string } }

export default function AdminCreatorsPage({ searchParams }: Props) {
  const type = searchParams.type as ("sugargirl" | "sugarboy" | "massage" | undefined);
  const search = searchParams.q?.trim();
  const rows = cmsRepo.listCreators({ type, search });

  const tabs: { key: string; label: string; href: string; count: number }[] = [
    { key: "all",       label: "全部",       href: "/admin/creators", count: cmsRepo.listCreators().length },
    { key: "sugargirl", label: "Sugargirl",  href: "/admin/creators?type=sugargirl", count: cmsRepo.listCreators({ type: "sugargirl" }).length },
    { key: "sugarboy",  label: "Sugarboy",   href: "/admin/creators?type=sugarboy",  count: cmsRepo.listCreators({ type: "sugarboy" }).length },
    { key: "massage",   label: "情趣按摩",   href: "/admin/creators?type=massage",   count: cmsRepo.listCreators({ type: "massage" }).length },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Creators"
        title="全部 Creator"
        description="Sugargirl / Sugarboy / Massage Provider 统一管理 · 支持类型筛选、关键字搜索"
      />

      {/* Type tabs + search */}
      <form className="cr-tools" action="/admin/creators">
        <div className="cr-tabs">
          {tabs.map((t) => {
            const active = (type ?? "all") === t.key;
            return (
              <Link key={t.key} href={t.href} className={"cr-tab" + (active ? " is-active" : "")}>
                {t.label} <span>{t.count}</span>
              </Link>
            );
          })}
        </div>
        <div className="cr-search">
          {type && <input type="hidden" name="type" value={type} />}
          <input type="text" name="q" defaultValue={search || ""} placeholder="搜索 name / slug / city…" />
          <button type="submit">搜索</button>
        </div>
      </form>

      <div style={{ marginTop: 16 }}>
        <AdminTable
          rows={rows}
          emptyLabel={search ? `没有匹配 "${search}" 的 Creator` : "暂无 Creator"}
          columns={[
            {
              key: "profile", label: "Profile", render: (r) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  {r.avatar ? <img src={r.avatar} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} /> : <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#F3F4F6", flexShrink: 0 }} />}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: "#111", fontSize: 13.5 }}>{r.displayName}</div>
                    <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>@{r.slug}</div>
                  </div>
                </div>
              ),
            },
            {
              key: "type", label: "Type", render: (r) => (
                <AdminBadge tone={r.type === "sugargirl" ? "info" : r.type === "sugarboy" ? "gold" : "default"}>
                  {r.type === "sugargirl" ? "Sugargirl" : r.type === "sugarboy" ? "Sugarboy" : "Massage"}
                </AdminBadge>
              ),
            },
            { key: "city", label: "City", render: (r) => <span style={{ color: "#374151" }}>{r.city || "—"}</span> },
            {
              key: "lang", label: "Languages", render: (r) => (
                <span style={{ fontSize: 12, color: "#6B7280" }}>{r.languages.slice(0, 2).join(" · ")}</span>
              ),
            },
            {
              key: "status", label: "Status", render: (r) => (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {r.online && <AdminBadge tone="success">Online</AdminBadge>}
                  {r.verified && <AdminBadge tone="info">Verified</AdminBadge>}
                  {r.vip && <AdminBadge tone="gold">VIP</AdminBadge>}
                  {r.featured && <AdminBadge tone="warning">Featured</AdminBadge>}
                </div>
              ),
            },
            { key: "media", label: "Media", align: "right", render: (r) => <b style={{ fontVariantNumeric: "tabular-nums", fontSize: 13.5 }}>{r.mediaCount}</b> },
            {
              key: "ops", label: "Ops", align: "right", render: (r) => (
                <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                  <Link href={
                    r.type === "sugargirl" ? `/creators/${r.slug}` :
                    r.type === "sugarboy"  ? `/sugarboy/${r.slug}` :
                    `/massage/profile/${r.slug}`
                  } target="_blank" className="cr-op">前台</Link>
                </div>
              ),
            },
          ]}
        />
      </div>

      <style>{`
        .cr-tools{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:4px}
        .cr-tabs{display:flex;gap:4px;background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:3px}
        .cr-tab{padding:8px 14px;font-size:12.5px;color:#374151;text-decoration:none;border-radius:8px;font-weight:600;transition:background .12s,color .12s;display:inline-flex;align-items:center;gap:6px}
        .cr-tab:hover{background:#F7F5F0}
        .cr-tab.is-active{background:#111;color:#EEDDB8}
        .cr-tab span{font-size:10.5px;padding:2px 6px;background:rgba(255,255,255,.15);border-radius:99px;font-variant-numeric:tabular-nums}
        .cr-tab:not(.is-active) span{background:#F3F4F6;color:#6B7280}
        .cr-search{display:flex;gap:6px}
        .cr-search input{padding:8px 12px;border:1px solid #E5E7EB;border-radius:10px;font:inherit;font-size:13px;color:#111;outline:none;width:220px;background:#fff}
        .cr-search input:focus{border-color:#D6B980}
        .cr-search button{padding:8px 14px;background:#111;color:#fff;border:0;border-radius:10px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}
        .cr-op{padding:5px 10px;background:#F7F5F0;color:#111;border-radius:99px;font-size:11.5px;font-weight:600;text-decoration:none;border:1px solid #E5E7EB}
        .cr-op:hover{border-color:#D6B980}
      `}</style>
    </>
  );
}
