// 情感私话 feed · 仅 story 类型
import type { Metadata } from "next";
import WhisperSquareHero from "@/components/community/WhisperSquareHero";
import CommunityFeedTabs from "@/components/community/CommunityFeedTabs";
import CommunityShell from "@/components/community/CommunityShell";
import CommunityFab from "@/components/community/CommunityFab";
import StoryPostCard from "@/components/community/StoryPostCard";
import {
  CommunityTrendingPanel, CommunityUnansweredPanel, CommunityJournalPanel, CommunitySafetyCard,
} from "@/components/community/CommunitySidebarPanels";
import { listStories, listTrending, listUnanswered, scrubAuthor } from "@/lib/community/store";
import { featuredPosts } from "@/lib/journal-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "情感私话 · 私语广场 · Sugardating",
  description: "私语广场情感私话 · 真实经历、匿名心事与关系故事 · 高端 sugardating 社区。",
};

export default function StoriesPage() {
  const stories = listStories();
  const trending = listTrending(5);
  const unanswered = listUnanswered();
  const journalPicks = featuredPosts().slice(0, 3);

  return (
    <>
      <WhisperSquareHero />
      <CommunityFeedTabs unansweredCount={unanswered.length} />
      <CommunityShell
        activePath="/community/stories"
        right={
          <>
            <CommunityTrendingPanel items={trending} />
            <CommunityUnansweredPanel items={unanswered} />
            <CommunityJournalPanel posts={journalPicks} />
            <CommunitySafetyCard />
          </>
        }
      >
        {stories.map((p) => <StoryPostCard key={p.id} post={p} author={scrubAuthor(p)} />)}
      </CommunityShell>
      <CommunityFab />
    </>
  );
}
