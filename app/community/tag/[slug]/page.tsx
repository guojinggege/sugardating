// Tag 聚合 · story + question 混合
import type { Metadata } from "next";
import CommunityFeedTabs from "@/components/community/CommunityFeedTabs";
import CommunityShell from "@/components/community/CommunityShell";
import CommunityFab from "@/components/community/CommunityFab";
import StoryPostCard from "@/components/community/StoryPostCard";
import QuestionPostCard from "@/components/community/QuestionPostCard";
import {
  CommunityTrendingPanel, CommunityUnansweredPanel, CommunityJournalPanel, CommunitySafetyCard,
} from "@/components/community/CommunitySidebarPanels";
import { listByTag, listTrending, listUnanswered, listTags, scrubAuthor } from "@/lib/community/store";
import { featuredPosts } from "@/lib/journal-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tag = params.slug;
  return {
    title: `#${tag} · 私语广场 · Sugardating`,
    description: `与 ${tag} 相关的故事与问答 · 私语广场标签聚合。`,
  };
}

export default function TagPage({ params }: { params: { slug: string } }) {
  const posts = listByTag(params.slug);
  const trending = listTrending(5);
  const unanswered = listUnanswered();
  const journalPicks = featuredPosts().slice(0, 3);
  const tagMeta = listTags(50).find((t) => t.slug === params.slug);

  return (
    <>
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
        <header className="tg-h">
          <div className="tg-eye">TAG</div>
          <h1>#{tagMeta?.label ?? params.slug}</h1>
          {tagMeta && (
            <p>共 {tagMeta.storyCount} 篇情感私话 · {tagMeta.questionCount} 个问题</p>
          )}
          <style>{`
            .tg-h{background:#fff;border:1px solid #E9E3DA;border-radius:20px;padding:26px 30px}
            .tg-eye{font-size:11px;letter-spacing:.24em;color:#C5A56A;font-weight:700}
            .tg-h h1{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:32px;color:#171512;margin:4px 0 6px;font-weight:500;letter-spacing:-0.015em}
            .tg-h p{font-size:13px;color:#77716A;margin:0}
          `}</style>
        </header>

        {posts.length === 0 ? (
          <div className="tg-empty">
            <p>暂无与该标签相关的内容。</p>
            <style>{`.tg-empty{background:#fff;border:1px dashed #E9E3DA;border-radius:16px;padding:40px;text-align:center;color:#77716A}`}</style>
          </div>
        ) : posts.map((p) => (
          p.contentType === "story"
            ? <StoryPostCard    key={p.id} post={p} author={scrubAuthor(p)} />
            : <QuestionPostCard key={p.id} post={p} author={scrubAuthor(p)} />
        ))}
      </CommunityShell>
      <CommunityFab />
    </>
  );
}
