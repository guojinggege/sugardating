// Admin · Journal Posts · list + publish/feature toggles + new + edit + preview
import Link from "next/link";
import { AdminPageHeader, AdminTable, AdminBadge, AdminCard } from "@/components/admin/AdminPrimitives";
import { cmsRepo } from "@/lib/cms/repository";
import JournalActions from "@/components/admin/JournalActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Journal · Sugardating Admin" };

interface Props { searchParams: { q?: string; status?: string; cat?: string; lang?: string } }

export default function AdminJournalPage({ searchParams }: Props) {
  const q = (searchParams.q || "").toLowerCase().trim();
  const statusFilter = searchParams.status;
  const catFilter = searchParams.cat;
  const langFilter = searchParams.lang;

  let rows = cmsRepo.listJournalPosts();
  const allRows = [...rows];
  if (q) rows = rows.filter((r) => r.title.toLowerCase().includes(q) || r.slug.toLowerCase().includes(q));
  if (statusFilter) rows = rows.filter((r) => r.status === statusFilter);
  if (catFilter) rows = rows.filter((r) => r.categorySlug === catFilter);
  if (langFilter) rows = rows.filter((r) => r.language === langFilter);

  const counts = {
    total: allRows.length,
    published: allRows.filter((r) => r.status === "published").length,
    draft: allRows.filter((r) => r.status === "draft").length,
    featured: allRows.filter((r) => r.featured).length,
  };
  const categories = cmsRepo.listCategories();

  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Sugardating Journal"
        description="12 分类 · 管理发布状态、Featured 标记 · 新建/编辑/预览 · 前台走 /community 路径"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Journal" }]}
        actions={
          <Link href="/admin/journal/posts/new" className="jn-new">+ 新建文章</Link>
        }
      />

      <div className="jn-stats">
        <AdminCard><div className="jn-stat"><b>{counts.total}</b><span>总数</span></div></AdminCard>
        <AdminCard><div className="jn-stat"><b>{counts.published}</b><span>已发布</span></div></AdminCard>
        <AdminCard><div className="jn-stat"><b>{counts.draft}</b><span>草稿</span></div></AdminCard>
        <AdminCard><div className="jn-stat"><b>{counts.featured}</b><span>Featured</span></div></AdminCard>
      </div>

      <form className="jn-filters" action="/admin/journal/posts">
        <input type="text" name="q" defaultValue={q} placeholder="搜索标题或 slug…" />
        <select name="status" defaultValue={statusFilter || ""}>
          <option value="">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
          <option value="archived">已归档</option>
        </select>
        <select name="cat" defaultValue={catFilter || ""}>
          <option value="">全部分类</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.title} ({c.postCount})</option>)}
        </select>
        <select name="lang" defaultValue={langFilter || ""}>
          <option value="">全部语言</option>
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
        <button type="submit">筛选</button>
        {(q || statusFilter || catFilter || langFilter) && (
          <Link href="/admin/journal/posts" className="jn-clear">清除</Link>
        )}
      </form>

      <div style={{ marginTop: 12 }}>
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
                  <Link href={`/admin/journal/posts/${r.slug}`} className="jn-op jn-op--edit">编辑</Link>
                  <Link href={`/admin/journal/posts/${r.slug}/preview`} target="_blank" className="jn-op">预览</Link>
                  {r.status === "published" && (
                    <Link href={`/community/${r.categorySlug}/post/${r.slug}`} target="_blank" className="jn-op">前台</Link>
                  )}
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
        .jn-op--edit{background:#111;color:#EEDDB8;border-color:#111}
        .jn-op--edit:hover{background:#000}
        .jn-new{padding:9px 18px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none;box-shadow:0 8px 20px -10px rgba(184,167,137,.55)}
        .jn-new:hover{transform:translateY(-1px)}
        .jn-filters{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;align-items:center;padding:12px;background:#fff;border:1px solid #E5E7EB;border-radius:12px}
        .jn-filters input,.jn-filters select{padding:8px 10px;border:1px solid #E5E7EB;border-radius:8px;font:inherit;font-size:12.5px;color:#111;background:#FAFAF8;outline:none}
        .jn-filters input{flex:1;min-width:200px}
        .jn-filters input:focus,.jn-filters select:focus{border-color:#D6B980;background:#fff}
        .jn-filters button{padding:8px 14px;background:#111;color:#fff;border:0;border-radius:8px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}
        .jn-clear{padding:8px 10px;font-size:12px;color:#6B7280;text-decoration:none}
        .jn-clear:hover{color:#111}
        @media (max-width:900px){.jn-stats{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </>
  );
}
