// Journal 分类页 /community/[communitySlug]  (URL 兼容:communitySlug 语义为 categorySlug)
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  journalCategories, getCategory, listPostsByCategory,
} from "@/lib/journal-data";
import JournalCategoryHero from "@/components/Journal/JournalCategoryHero";
import JournalCategoryNav from "@/components/Journal/JournalCategoryNav";
import JournalPostCard from "@/components/Journal/JournalPostCard";
import JournalSidebar from "@/components/Journal/JournalSidebar";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return journalCategories.map((c) => ({ communitySlug: c.slug }));
}

export async function generateMetadata({ params }: { params: { communitySlug: string } }): Promise<Metadata> {
  const c = getCategory(params.communitySlug);
  if (!c) return { title: "Sugardating Journal" };
  return {
    title: `${c.title} · Sugardating Journal`,
    description: c.description,
  };
}

export default function JournalCategoryPage({ params }: { params: { communitySlug: string } }) {
  const category = getCategory(params.communitySlug);
  if (!category) notFound();
  const posts = listPostsByCategory(category.slug);

  return (
    <div className="jn-page">
      <JournalCategoryHero category={category} />
      <JournalCategoryNav activeSlug={category.slug} />

      <div className="jn-shell">
        <div className="jn-grid">
          <main className="jn-main">
            {posts.length === 0 ? (
              <div className="jn-empty">
                <p>这个分类下暂无文章。</p>
              </div>
            ) : (
              <div className="jn-post-grid">
                {posts.map((p) => (
                  <JournalPostCard key={p.id} post={p} />
                ))}
              </div>
            )}
          </main>
          <JournalSidebar activeCategorySlug={category.slug} />
        </div>
      </div>

      <style>{`
        .jn-page{background:#F4F4F5;min-height:100vh}
        .jn-shell{max-width:1240px;margin:0 auto;padding:32px 24px 80px}
        .jn-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:40px}
        .jn-main{min-width:0}
        .jn-post-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:22px}
        .jn-empty{background:#fff;border:1px solid var(--line);border-radius:18px;padding:60px 24px;text-align:center;color:#8a8a92}
        @media (max-width:1024px){
          .jn-grid{grid-template-columns:1fr;gap:32px}
          .jn-post-grid{grid-template-columns:repeat(2,1fr)}
        }
        @media (max-width:640px){
          .jn-shell{padding:24px 16px 60px}
          .jn-post-grid{grid-template-columns:1fr}
        }
      `}</style>
    </div>
  );
}
