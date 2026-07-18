// 提一个问题 · Composer 入口 · P0 显示 login gate + "Coming Soon" 说明
import type { Metadata } from "next";
import CommunityFeedTabs from "@/components/community/CommunityFeedTabs";
import CommunityLoginGate from "@/components/community/CommunityLoginGate";
import { listUnanswered } from "@/lib/community/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "提一个问题 · 私语广场 · Sugardating",
  description: "登录后向社区寻求回答与建议。写成清晰、可被搜索的问题。支持匿名提问。",
};

export default function ComposeQuestionPage() {
  const unanswered = listUnanswered();
  return (
    <>
      <CommunityFeedTabs unansweredCount={unanswered.length} />
      <div className="cp-shell">
        <CommunityLoginGate kind="question" returnTo="/community/compose/question" />
        <style>{`
          .cp-shell{background:#F7F4EF;padding:56px 24px}
          @media (max-width:640px){.cp-shell{padding:32px 16px}}
        `}</style>
      </div>
    </>
  );
}
