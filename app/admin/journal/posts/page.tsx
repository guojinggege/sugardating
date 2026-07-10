// Admin · Journal Posts · list + publish/feature toggles
import Link from "next/link";
import { AdminPageHeader, AdminTable, AdminBadge, AdminCard } from "@/components/admin/AdminPrimitives";
import { cmsRepo } from "@/lib/cms/repository";
import JournalActions from "@/components/admin/JournalActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Journal · Sugardating Admin" };

export default function AdminJournalPage() {
  const rows = cmsRepo.listJournalPosts();
  const counts = {
    total: rows.length,
    published: rows.filter((r) => r.status === "published").length,
    draft: rows.filter((r) => r.status === "draft").length,
    featured: rows.filter((r) => r.featured).length,
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Sugardating Journal"
        description="12 分类 · 30 篇文章 · 管理发布状态、Featured 标记 · 预览走前台 /community 路径"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Journal" }]}
      />

      <div className="jn-stats">
        <AdminCard><div className="jn-stat"><b>{counts.total}</b><span>总数</span></div></AdminCard>
        <AdminCard><div className="jn-stat"><b>{counts.published}</b><span>已发布</span></div></AdminCard>
        <AdminCard><div className="jn-stat"><b>{counts.draft}</b><span>草稿</span></div></AdminCard>
        <AdminCard><div className="jn-stat"><b>{counts.featured}</b><span>Featured</span></div></AdminCard>
      </div>

      <div style={{ marginTop: 16 }}>
        <AdminTable
          rows={rows}
          columns={[
            {
              key: "title", label: "标题", render: (r) => (
                <div>
                  <div style={{ fontWeight: 700, color: "#111", fontSize: 13.5, lineHeight: 1.35 }}>{r.title}</div>
                  <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2 }}>@{r.slug}</div>
                </div>
              ),
            },
            { key: "cat", label: "分类", render: (r) => <AdminBadge tone="gold">{r.categoryTitle}</AdminBadge> },
            { key: "lang", label: "语言", render: (r) => <AdminBadge tone="muted">{r.language.toUpperCase()}</AdminBadge> },
            {
              key: "status", label: "状态", render: (r) => (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  <AdminBadge tone={r.status === "published" ? "success" : "muted"}>
                    {r.status === "published" ? "已发布" : "草稿"}
                  </AdminBadge>
                  {r.featured && <AdminBadge tone="warning">Featured</AdminBadge>}
                  {r.popular && <AdminBadge tone="info">Popular</AdminBadge>}
                </div>
              ),
            },
            { key: "read", label: "字数", align: "right", render: (r) => <span style={{ fontSize: 12, color: "#6B7280", fontVariantNumeric: "tabular-nums" }}>{r.wordCount.toLocaleString("en-US")}</span> },
            {
              key: "when", label: "发布时间", render: (r) => (
                <span style={{ fontSize: 11.5, color: "#6B7280", fontVariantNumeric: "tabular-nums" }}>
                  {r.publishedAt ? new Date(r.publishedAt).toLocaleDateString("zh-CN") : "—"}
                </span>
              ),
            },
            {
              key: "ops", label: "操作", align: "right", render: (r) => (
                <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                  <Link href={`/community/${r.categorySlug}/post/${r.slug}`} target="_blank" className="jn-op">前台</Link>
                  <JournalActions slug={r.slug} isPublished={r.status === "published"} isFeatured={!!r.featured} />
                </div>
              ),
            },
          ]}
        />
      </div>

      <style>{`
        .jn-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
        .jn-stat{display:flex;flex-direction:column;gap:2px;text-align:left}
        .jn-stat b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:32px;color:#111;font-weight:600;letter-spacing:-0.01em;line-height:1;font-variant-numeric:tabular-nums}
        .jn-stat span{font-size:11.5px;color:#6B7280;letter-spacing:.06em;text-transform:uppercase;font-weight:600;margin-top:6px}
        .jn-op{padding:5px 10px;background:#F7F5F0;color:#111;border-radius:99px;font-size:11.5px;font-weight:600;text-decoration:none;border:1px solid #E5E7EB}
        .jn-op:hover{border-color:#D6B980}
        @media (max-width:900px){.jn-stats{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </>
  );
}
