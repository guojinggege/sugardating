// 问答专区 feed
import type { Metadata } from "next";
import WhisperSquareHero from "@/components/community/WhisperSquareHero";
import CommunityFeedTabs from "@/components/community/CommunityFeedTabs";
import CommunityShell from "@/components/community/CommunityShell";
import CommunityFab from "@/components/community/CommunityFab";
import QuestionPostCard from "@/components/community/QuestionPostCard";
import {
  CommunityTrendingPanel, CommunityUnansweredPanel, CommunityJournalPanel, CommunitySafetyCard,
} from "@/components/community/CommunitySidebarPanels";
import { listQuestions, listTrending, listUnanswered, scrubAuthor } from "@/lib/community/store";
import { featuredPosts } from "@/lib/journal-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "问答专区 · 私语广场 · Sugardating",
  description: "私语广场问答专区 · sugardating 关系问题与真实回答 · 支持匿名提问。",
};

export default function QuestionsPage() {
  const questions = listQuestions();
  const trending = listTrending(5);
  const unanswered = listUnanswered();
  const journalPicks = featuredPosts().slice(0, 3);

  return (
    <>
      <WhisperSquareHero />
      <CommunityFeedTabs unansweredCount={unanswered.length} />
      <CommunityShell
        activePath="/community/questions"
        right={
          <>
            <CommunityTrendingPanel items={trending} />
            <CommunityUnansweredPanel items={unanswered} />
            <CommunityJournalPanel posts={journalPicks} />
            <CommunitySafetyCard />
          </>
        }
      >
        {questions.map((p) => <QuestionPostCard key={p.id} post={p} author={scrubAuthor(p)} />)}
      </CommunityShell>
      <CommunityFab />
    </>
  );
}
