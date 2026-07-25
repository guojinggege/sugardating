// 故事详情页 · 只读 P0 (评论区显示为 Coming Soon)
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import CommunityFeedTabs from "@/components/community/CommunityFeedTabs";
import CommunityShell from "@/components/community/CommunityShell";
import CommunityFab from "@/components/community/CommunityFab";
import {
  CommunityTrendingPanel, CommunityUnansweredPanel, CommunityJournalPanel, CommunitySafetyCard,
} from "@/components/community/CommunitySidebarPanels";
import { getPostBySlug, scrubAuthor, listTrending, listUnanswered, listStories } from "@/lib/community/store";
import ShareButton from "@/components/share/ShareButton";
import { postMetadata, buildStorySchema, stringifyJson } from "@/lib/community/seo";
import { featuredPosts } from "@/lib/journal-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post || post.contentType !== "story") return { title: "故事 · 私语广场" };
  return postMetadata(post, scrubAuthor(post));
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function StoryDetailPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post || post.contentType !== "story") notFound();
  const author = scrubAuthor(post);
  const trending = listTrending(5);
  const unanswered = listUnanswered();
  const journalPicks = featuredPosts().slice(0, 3);
  const relatedStories = listStories()
    .filter((s) => s.slug !== post.slug && s.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  const jsonLd = stringifyJson(buildStorySchema(post, author));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <CommunityFeedTabs unansweredCount={unanswered.length} />
      <CommunityShell
        right={
          <>
            <CommunityTrendingPanel items={trending} />
            <CommunityUnansweredPanel items={unanswered} />
            <CommunityJournalPanel posts={journalPicks} />
            <CommunitySafetyCard />
          </>
        }
      >
        <nav className="d-crumb" aria-label="Breadcrumb">
          <Link href="/community">私语广场</Link>
          <span>/</span>
          <Link href="/community/stories">情感私话</Link>
        </nav>

        <article className="d-art">
          <div className="d-h">
            <span className="d-badge d-badge--story">情感私话</span>
            {post.isAnonymous && <span className="d-badge d-badge--anon">匿名投稿</span>}
          </div>

          <h1 className="d-h1">{post.title}</h1>

          <div className="d-meta">
            <span className={"d-avatar" + (post.isAnonymous ? " is-anon" : "")}>
              {post.isAnonymous ? "?" : (author?.name.slice(0, 1) || "?")}
            </span>
            <div>
              <b>{post.isAnonymous ? "匿名读者" : author?.name}</b>
              <span>{fmtDate(post.createdAt)} · {post.viewCount.toLocaleString()} 次浏览</span>
            </div>
          </div>

          <div className="d-body">
            {post.body.split(/\n\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {post.tags.length > 0 && (
            <div className="d-tags">
              {post.tags.map((t) => (
                <Link key={t} href={`/community/tag/${t}`} className="d-chip">#{t}</Link>
              ))}
            </div>
          )}

          <div className="d-react">
            <ReactionRow label="同感"      icon="♥" count={post.reactionCounts.empathy} />
            <ReactionRow label="抱抱"      icon="⌒" count={post.reactionCounts.hug} />
            <ReactionRow label="有启发"    icon="✧" count={post.reactionCounts.insight} />
            <ReactionRow label="想听后续"  icon="+" count={post.reactionCounts["want-more"]} />
          </div>

          <div className="d-actions">
            <span className="d-fine">评论、收藏、举报 · 登录后可用</span>
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
              <ShareButton
                variant="chip"
                payload={{
                  title: post.title,
                  text: post.excerpt || post.body.slice(0, 120),
                  canonicalUrl: `/community/story/${post.slug}`,
                  contentType: "story",
                  contentId: post.slug,
                }}
              />
              <Link href={`/login?return_to=/community/story/${post.slug}`} className="d-cta">登录以互动</Link>
            </div>
          </div>
        </article>

        {relatedStories.length > 0 && (
          <div className="d-related">
            <h3>相关故事</h3>
            <ul>
              {relatedStories.map((s) => (
                <li key={s.id}>
                  <Link href={`/community/story/${s.slug}`}>{s.title}</Link>
                  <span>{s.commentCount} 评论</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <style>{`
          .d-crumb{display:flex;gap:8px;font-size:12.5px;color:#a19a91;align-items:center}
          .d-crumb a{color:#77716A;text-decoration:none}
          .d-crumb a:hover{color:#171512}

          .d-art{background:#fff;border:1px solid #E9E3DA;border-radius:20px;padding:40px 44px;display:flex;flex-direction:column;gap:20px}
          .d-h{display:flex;gap:8px;flex-wrap:wrap}
          .d-badge{font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;padding:3px 10px;border-radius:999px}
          .d-badge--story{background:rgba(169,111,120,.12);color:#8C4B54}
          .d-badge--anon{background:rgba(119,113,106,.12);color:#544f47}
          .d-h1{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-weight:500;font-size:38px;line-height:1.2;color:#171512;letter-spacing:-0.015em;margin:0}

          .d-meta{display:flex;align-items:center;gap:12px;padding:14px 0 10px;border-bottom:1px solid #F0EAE1}
          .d-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#DACFBE,#B8AA95);color:#171512;display:inline-flex;align-items:center;justify-content:center;font-size:16px;font-weight:700}
          .d-avatar.is-anon{background:#F5EEDD;color:#a19a91}
          .d-meta > div{display:flex;flex-direction:column;line-height:1.3}
          .d-meta b{font-size:13.5px;color:#171512;font-weight:700}
          .d-meta span{font-size:11.5px;color:#a19a91}

          .d-body{font-size:16px;line-height:1.85;color:#3d3a35}
          .d-body p{margin:0 0 18px}
          .d-body p:last-child{margin-bottom:0}

          .d-tags{display:flex;flex-wrap:wrap;gap:4px}
          .d-chip{padding:4px 12px;background:#F7F4EF;border:1px solid #E9E3DA;border-radius:999px;font-size:11.5px;color:#77716A;text-decoration:none;font-weight:600}
          .d-chip:hover{background:#EFE7D8;color:#171512}

          .d-react{display:flex;gap:6px;flex-wrap:wrap;padding:14px 0 6px;border-top:1px dashed #F0EAE1}

          .d-actions{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:#F7F4EF;border-radius:12px;gap:12px}
          .d-fine{font-size:12.5px;color:#77716A}
          .d-cta{padding:8px 16px;background:#171512;color:#F5EEDD;border-radius:999px;font-size:12.5px;font-weight:700;text-decoration:none}
          .d-cta:hover{background:#2b2822}

          .d-related{background:#fff;border:1px solid #E9E3DA;border-radius:20px;padding:22px 24px}
          .d-related h3{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#77716A;font-weight:700;margin:0 0 14px}
          .d-related ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
          .d-related li{display:flex;justify-content:space-between;gap:12px;font-size:13.5px}
          .d-related a{color:#171512;text-decoration:none;font-weight:600;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          .d-related a:hover{color:#8C4B54}
          .d-related span{color:#a19a91;font-size:11.5px;flex-shrink:0}

          @media (max-width:640px){
            .d-art{padding:24px 20px;border-radius:16px}
            .d-h1{font-size:28px}
            .d-body{font-size:15.5px}
          }
        `}</style>
      </CommunityShell>
      <CommunityFab />
    </>
  );
}

function ReactionRow({ label, icon, count }: { label: string; icon: string; count?: number }) {
  const n = count ?? 0;
  return (
    <span className="dr">
      <span className="dr-ic">{icon}</span>
      <span className="dr-l">{label}</span>
      <span className="dr-n">{n}</span>
      <style>{`
        .dr{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;background:#FBF7EF;border:1px solid #EFE7D8;border-radius:999px;font-size:12.5px;color:#3d3a35;font-weight:600}
        .dr-ic{color:#A96F78;font-weight:800}
        .dr-l{color:#171512}
        .dr-n{font-variant-numeric:tabular-nums;color:#77716A;font-weight:700}
      `}</style>
    </span>
  );
}
