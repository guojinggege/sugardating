// 问题详情页 · 只读 P0 (回答区显示为 Coming Soon)
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import CommunityFeedTabs from "@/components/community/CommunityFeedTabs";
import CommunityShell from "@/components/community/CommunityShell";
import CommunityFab from "@/components/community/CommunityFab";
import {
  CommunityTrendingPanel, CommunityUnansweredPanel, CommunityJournalPanel, CommunitySafetyCard,
} from "@/components/community/CommunitySidebarPanels";
import { getPostBySlug, scrubAuthor, listTrending, listUnanswered, listQuestions } from "@/lib/community/store";
import { postMetadata, buildQaSchema, stringifyJson } from "@/lib/community/seo";
import { featuredPosts } from "@/lib/journal-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post || post.contentType !== "question") return { title: "问题 · 问答专区" };
  return postMetadata(post, scrubAuthor(post));
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function QuestionDetailPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post || post.contentType !== "question") notFound();
  const author = scrubAuthor(post);
  const trending = listTrending(5);
  const unanswered = listUnanswered();
  const journalPicks = featuredPosts().slice(0, 3);
  const relatedQuestions = listQuestions()
    .filter((q) => q.slug !== post.slug && q.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  const jsonLd = stringifyJson(buildQaSchema(post, author));

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
        <nav className="q-crumb" aria-label="Breadcrumb">
          <Link href="/community">私语广场</Link>
          <span>/</span>
          <Link href="/community/questions">问答专区</Link>
        </nav>

        <article className="q-art">
          <div className="q-h">
            <span className="q-badge q-badge--qa">问答专区</span>
            {post.acceptedAnswerId && <span className="q-badge q-badge--ok">已有最佳答案</span>}
            {post.answerCount === 0 && <span className="q-badge q-badge--warn">等待第一个回答</span>}
            {post.isAnonymous && <span className="q-badge q-badge--anon">匿名提问</span>}
          </div>

          <h1 className="q-h1">{post.title}</h1>

          <div className="q-meta">
            <span className={"q-avatar" + (post.isAnonymous ? " is-anon" : "")}>
              {post.isAnonymous ? "?" : (author?.name.slice(0, 1) || "?")}
            </span>
            <div>
              <b>{post.isAnonymous ? "匿名读者" : author?.name}</b>
              <span>{fmtDate(post.createdAt)} · {post.viewCount.toLocaleString()} 次浏览 · {post.followerCount ?? 0} 关注</span>
            </div>
            <div className="q-actions">
              <Link href="/login?return_to=/community/question" className="q-btn q-btn--ghost">关注问题</Link>
              <Link href="/login?return_to=/community/question" className="q-btn q-btn--dark">回答问题</Link>
            </div>
          </div>

          <div className="q-body">
            {post.body.split(/\n\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {post.tags.length > 0 && (
            <div className="q-tags">
              {post.tags.map((t) => (
                <Link key={t} href={`/community/tag/${t}`} className="q-chip">#{t}</Link>
              ))}
            </div>
          )}
        </article>

        <section className="q-answers">
          <div className="q-answers-h">
            <h2>{post.answerCount} 个回答</h2>
            <div className="q-sort">
              <span className="is-active">有帮助</span>
              <span>最新</span>
              <span>最早</span>
            </div>
          </div>

          <div className="q-answers-placeholder">
            <div className="q-placeholder-h">回答内容与 Composer 开发中</div>
            <p>
              P0 阶段展示问题基础信息 · 完整的回答/评论/邀请回答/最佳答案功能将在 P1 交付。
              现在你可以浏览相关问题,或到 <Link href="/community/questions">问答专区</Link> 参与其他讨论。
            </p>
          </div>
        </section>

        {relatedQuestions.length > 0 && (
          <div className="q-related">
            <h3>相关问题</h3>
            <ul>
              {relatedQuestions.map((q) => (
                <li key={q.id}>
                  <Link href={`/community/question/${q.slug}`}>{q.title}</Link>
                  <span>{q.answerCount} 回答</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <style>{`
          .q-crumb{display:flex;gap:8px;font-size:12.5px;color:#a19a91;align-items:center}
          .q-crumb a{color:#77716A;text-decoration:none}
          .q-crumb a:hover{color:#171512}

          .q-art{background:#fff;border:1px solid #E9E3DA;border-radius:20px;padding:40px 44px;display:flex;flex-direction:column;gap:20px;position:relative;overflow:hidden}
          .q-art:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,#667A9B,#8C9EBF)}
          .q-h{display:flex;gap:8px;flex-wrap:wrap}
          .q-badge{font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;padding:3px 10px;border-radius:999px}
          .q-badge--qa{background:rgba(102,122,155,.12);color:#4B5E80}
          .q-badge--ok{background:rgba(66,133,107,.14);color:#2B6249}
          .q-badge--warn{background:rgba(183,121,69,.16);color:#7A4C27}
          .q-badge--anon{background:rgba(119,113,106,.12);color:#544f47}
          .q-h1{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-weight:500;font-size:38px;line-height:1.2;color:#171512;letter-spacing:-0.015em;margin:0}

          .q-meta{display:flex;align-items:center;gap:12px;padding:14px 0 10px;border-bottom:1px solid #F0EAE1;flex-wrap:wrap}
          .q-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#C9D0DE,#8C9EBF);color:#171512;display:inline-flex;align-items:center;justify-content:center;font-size:16px;font-weight:700}
          .q-avatar.is-anon{background:#F5EEDD;color:#a19a91}
          .q-meta > div:not(.q-actions){display:flex;flex-direction:column;line-height:1.3;flex:1;min-width:180px}
          .q-meta b{font-size:13.5px;color:#171512;font-weight:700}
          .q-meta span{font-size:11.5px;color:#a19a91}
          .q-actions{display:inline-flex;gap:6px;margin-left:auto;flex-shrink:0}
          .q-btn{padding:8px 16px;border-radius:999px;font-size:12.5px;font-weight:700;text-decoration:none;letter-spacing:-0.005em}
          .q-btn--dark{background:#171512;color:#F5EEDD}
          .q-btn--dark:hover{background:#2b2822}
          .q-btn--ghost{background:#F7F4EF;color:#171512;border:1px solid #E9E3DA}
          .q-btn--ghost:hover{border-color:#171512}

          .q-body{font-size:16px;line-height:1.85;color:#3d3a35}
          .q-body p{margin:0 0 18px}
          .q-body p:last-child{margin-bottom:0}

          .q-tags{display:flex;flex-wrap:wrap;gap:4px}
          .q-chip{padding:4px 12px;background:#F7F4EF;border:1px solid #E9E3DA;border-radius:999px;font-size:11.5px;color:#77716A;text-decoration:none;font-weight:600}
          .q-chip:hover{background:#EFE7D8;color:#171512}

          .q-answers{background:#fff;border:1px solid #E9E3DA;border-radius:20px;padding:28px 32px;display:flex;flex-direction:column;gap:16px}
          .q-answers-h{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:10px}
          .q-answers h2{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:22px;color:#171512;margin:0;font-weight:500;letter-spacing:-0.008em}
          .q-sort{display:inline-flex;gap:4px}
          .q-sort span{padding:4px 10px;font-size:11.5px;color:#77716A;border-radius:99px;font-weight:600;cursor:pointer}
          .q-sort span.is-active{background:#171512;color:#F5EEDD}
          .q-answers-placeholder{background:#F7F4EF;border:1px dashed #E9E3DA;border-radius:14px;padding:20px 22px}
          .q-placeholder-h{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#C5A56A;font-weight:700;margin-bottom:8px}
          .q-answers-placeholder p{font-size:13.5px;line-height:1.7;color:#3d3a35;margin:0}
          .q-answers-placeholder a{color:#171512;font-weight:700}

          .q-related{background:#fff;border:1px solid #E9E3DA;border-radius:20px;padding:22px 24px}
          .q-related h3{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#77716A;font-weight:700;margin:0 0 14px}
          .q-related ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
          .q-related li{display:flex;justify-content:space-between;gap:12px;font-size:13.5px}
          .q-related a{color:#171512;text-decoration:none;font-weight:600;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          .q-related a:hover{color:#4B5E80}
          .q-related span{color:#a19a91;font-size:11.5px;flex-shrink:0}

          @media (max-width:640px){
            .q-art,.q-answers{padding:24px 20px;border-radius:16px}
            .q-h1{font-size:26px}
            .q-body{font-size:15.5px}
            .q-actions{width:100%;margin-left:0}
          }
        `}</style>
      </CommunityShell>
      <CommunityFab />
    </>
  );
}
