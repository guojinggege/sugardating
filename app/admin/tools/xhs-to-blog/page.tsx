// Admin · 内容智能工坊 · 笔记转博客
import { AdminPageHeader, AdminCard } from "@/components/admin/AdminPrimitives";
import XhsToBlogWorkspace from "@/components/admin/content-tools/XhsToBlogWorkspace";
import { journalCategories } from "@/lib/journal-data";
import { listConversions } from "@/lib/content-tools/conversion-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = { title: "笔记转博客 · Sugardating Admin" };

export default function XhsToBlogToolPage() {
  const categories = journalCategories.map((c) => ({
    slug: c.slug,
    title: c.title,
    titleZh: c.titleZh,
  }));
  const recent = listConversions(6);

  return (
    <>
      <AdminPageHeader
        eyebrow="Content · Tool"
        title="内容智能工坊 · 笔记转博客"
        description="将小红书笔记原文 · 转换为符合 Sugardating 品牌的 Journal 草稿 · 支持原生启发式重写 + 原始工具 iframe 两种模式 · 所有产出必须人工复核后手动发布"
      />

      <XhsToBlogWorkspace categories={categories} />

      {recent.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <AdminCard title="最近生成 (最近 6 条)">
            <ul className="wf-hist">
              {recent.map((c) => (
                <li key={c.id}>
                  <div>
                    <b>{c.title}</b>
                    <span>{new Date(c.createdAt).toLocaleString("zh-CN", { hour12: false, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
                    <em>{categories.find((x) => x.slug === c.categorySlug)?.title || c.categorySlug} · {c.language.toUpperCase()} · {c.readingTime}</em>
                  </div>
                  <div className="wf-hist-r">
                    {c.usedForDraft ? (
                      <a href={`/admin/journal/posts/${c.usedForDraft}`}>已创建草稿 · 打开 →</a>
                    ) : (
                      <span className="wf-hist-pending">未生成草稿</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <style>{`
              .wf-hist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
              .wf-hist li{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#FAFAF8;border-radius:10px;gap:12px}
              .wf-hist li > div:first-child{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}
              .wf-hist b{font-size:13.5px;color:#111;font-weight:700;line-height:1.35;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
              .wf-hist span{font-size:11px;color:#9CA3AF;font-variant-numeric:tabular-nums}
              .wf-hist em{font-size:11px;color:#6B7280;font-style:normal}
              .wf-hist-r a{font-size:12px;font-weight:700;color:#111;text-decoration:none;padding:6px 12px;border:1px solid #D6B980;border-radius:99px;background:#fff;white-space:nowrap}
              .wf-hist-r a:hover{background:#EEDDB8}
              .wf-hist-pending{font-size:11px;color:#9CA3AF;letter-spacing:.06em;text-transform:uppercase;font-weight:700}
            `}</style>
          </AdminCard>
        </div>
      )}
    </>
  );
}
