// 讲一个故事 · Composer 入口 · P0 显示 login gate + "Coming Soon" 说明
import type { Metadata } from "next";
import CommunityFeedTabs from "@/components/community/CommunityFeedTabs";
import CommunityLoginGate from "@/components/community/CommunityLoginGate";
import { listUnanswered } from "@/lib/community/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "讲一个故事 · 私语广场 · Sugardating",
  description: "登录后分享真实经历、心事、反转或关系观察。支持匿名。18+ 社区。",
};

export default function ComposeStoryPage() {
  const unanswered = listUnanswered();
  return (
    <>
      <CommunityFeedTabs unansweredCount={unanswered.length} />
      <div className="cp-shell">
        <CommunityLoginGate kind="story" returnTo="/community/compose/story" />
        <style>{`
          .cp-shell{background:#F7F4EF;padding:56px 24px}
          @media (max-width:640px){.cp-shell{padding:32px 16px}}
        `}</style>
      </div>
    </>
  );
}
