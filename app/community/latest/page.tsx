// 最新 · 按创建时间倒序 · 混合 story + question
import type { Metadata } from "next";
import WhisperSquareHero from "@/components/community/WhisperSquareHero";
import CommunityFeedTabs from "@/components/community/CommunityFeedTabs";
import CommunityShell from "@/components/community/CommunityShell";
import CommunityFab from "@/components/community/CommunityFab";
import StoryPostCard from "@/components/community/StoryPostCard";
import QuestionPostCard from "@/components/community/QuestionPostCard";
import {
  CommunityTrendingPanel, CommunityUnansweredPanel, CommunityJournalPanel, CommunitySafetyCard,
} from "@/components/community/CommunitySidebarPanels";
import { listLatest, listTrending, listUnanswered, scrubAuthor } from "@/lib/community/store";
import { featuredPosts } from "@/lib/journal-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "最新 · 私语广场 · Sugardating",
  description: "私语广场最新内容 · 情感私话与问答按发布时间排序。",
};

export default function LatestPage() {
  const feed = listLatest();
  const trending = listTrending(5);
  const unanswered = listUnanswered();
  const journalPicks = featuredPosts().slice(0, 3);

  return (
    <>
      <WhisperSquareHero />
      <CommunityFeedTabs unansweredCount={unanswered.length} />
      <CommunityShell
        activePath="/community/latest"
        right={
          <>
            <CommunityTrendingPanel items={trending} />
            <CommunityUnansweredPanel items={unanswered} />
            <CommunityJournalPanel posts={journalPicks} />
            <CommunitySafetyCard />
          </>
        }
      >
        {feed.map((p) => (
          p.contentType === "story"
            ? <StoryPostCard    key={p.id} post={p} author={scrubAuthor(p)} />
            : <QuestionPostCard key={p.id} post={p} author={scrubAuthor(p)} />
        ))}
      </CommunityShell>
      <CommunityFab />
    </>
  );
}
