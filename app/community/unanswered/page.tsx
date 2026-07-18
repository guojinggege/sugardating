// 等待回答 · 0 answer 的问题
import type { Metadata } from "next";
import WhisperSquareHero from "@/components/community/WhisperSquareHero";
import CommunityFeedTabs from "@/components/community/CommunityFeedTabs";
import CommunityShell from "@/components/community/CommunityShell";
import CommunityFab from "@/components/community/CommunityFab";
import QuestionPostCard from "@/components/community/QuestionPostCard";
import {
  CommunityTrendingPanel, CommunityJournalPanel, CommunitySafetyCard,
} from "@/components/community/CommunitySidebarPanels";
import { listUnanswered, listTrending, scrubAuthor } from "@/lib/community/store";
import { featuredPosts } from "@/lib/journal-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "等待回答 · 私语广场 · Sugardating",
  description: "等待社区第一批回答的问题 · 帮助他人 · 沉淀经验。",
};

export default function UnansweredPage() {
  const questions = listUnanswered();
  const trending = listTrending(5);
  const journalPicks = featuredPosts().slice(0, 3);

  return (
    <>
      <WhisperSquareHero />
      <CommunityFeedTabs unansweredCount={questions.length} />
      <CommunityShell
        activePath="/community/unanswered"
        right={
          <>
            <CommunityTrendingPanel items={trending} />
            <CommunityJournalPanel posts={journalPicks} />
            <CommunitySafetyCard />
          </>
        }
      >
        {questions.length === 0 ? (
          <div className="cs-empty">
            <h2>暂时没有等待回答的问题</h2>
            <p>所有问题都已有回答 · 你可以浏览 <a href="/community/questions">问答专区</a> 继续讨论。</p>
            <style>{`
              .cs-empty{background:#fff;border:1px dashed #E9E3DA;border-radius:20px;padding:56px 32px;text-align:center}
              .cs-empty h2{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:26px;color:#171512;margin:0 0 8px;font-weight:500;letter-spacing:-0.01em}
              .cs-empty p{color:#77716A;font-size:14px;margin:0}
              .cs-empty a{color:#171512;font-weight:700;text-decoration:underline}
            `}</style>
          </div>
        ) : questions.map((p) => (
          <QuestionPostCard key={p.id} post={p} author={scrubAuthor(p)} />
        ))}
      </CommunityShell>
      <CommunityFab />
    </>
  );
}
