// Mobile Journal 分类页
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  journalCategories, getCategory, listPostsByCategory,
} from "@/lib/journal-data";
import JournalPostCard from "@/components/Journal/JournalPostCard";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return journalCategories.map((c) => ({ communitySlug: c.slug }));
}

export async function generateMetadata({ params }: { params: { communitySlug: string } }): Promise<Metadata> {
  const c = getCategory(params.communitySlug);
  if (!c) return { title: "Sugardating Journal" };
  return { title: `${c.title} · Journal · Sugardating`, description: c.description };
}

export default function MobileJournalCategoryPage({ params }: { params: { communitySlug: string } }) {
  const category = getCategory(params.communitySlug);
  if (!category) notFound();
  const posts = listPostsByCategory(category.slug);

  return (
    <div className="mj-page">
      <header className="mj-cat-head">
        <Link href="/m/community" className="mj-back">← Journal</Link>
        <div className="mj-cat-eyebrow">Sugardating Journal</div>
        <h1 className="mj-cat-h1">{category.title}</h1>
        <p className="mj-cat-zh">{category.titleZh}</p>
        <p className="mj-cat-desc">{category.description}</p>
      </header>

      <div className="mj-cat-body">
        {posts.length === 0 ? (
          <div className="mj-empty">这个分类下暂无文章。</div>
        ) : (
          <div className="mj-list">
            {posts.map((p) => (
              <JournalPostCard key={p.id} post={p} basePath="/m/community" />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .mj-page{background:#F4F4F5;min-height:100vh;padding-bottom:80px}
        .mj-cat-head{background:linear-gradient(180deg,#FBFAF7,#F4F4F5);padding:24px 20px 22px;border-bottom:1px solid var(--line)}
        .mj-back{display:inline-block;font-size:12.5px;color:#8a8a92;text-decoration:none;margin-bottom:12px}
        .mj-back:hover{color:#161618}
        .mj-cat-eyebrow{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:8px}
        .mj-cat-h1{font-size:24px;font-weight:700;color:#161618;letter-spacing:-0.01em;margin:0 0 4px;line-height:1.2}
        .mj-cat-zh{font-size:14px;color:#5a5a62;margin:0 0 10px;font-weight:500}
        .mj-cat-desc{font-size:13.5px;line-height:1.65;color:#3d3d42;margin:0}
        .mj-cat-body{padding:20px 16px 8px}
        .mj-list{display:flex;flex-direction:column;gap:14px}
        .mj-empty{background:#fff;border:1px solid var(--line);border-radius:16px;padding:40px 20px;text-align:center;color:#8a8a92;font-size:13.5px}
      `}</style>
    </div>
  );
}
