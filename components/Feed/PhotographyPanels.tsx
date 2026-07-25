"use client";
// 动态推荐页 · 根据 ?panel= 切换主内容 · 保留 FeedShell 3 栏作为默认视图
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { FeedPost } from "./types";
import FollowingPanel from "./FollowingPanel";
import MessagesPanel from "./MessagesPanel";
import NotificationsPanel from "./NotificationsPanel";

interface Props {
  posts: FeedPost[];
  defaultView: React.ReactNode;    // 默认 FeedShell (由 server 组件传入)
}

export default function PhotographyPanels({ posts, defaultView }: Props) {
  const params = useSearchParams();
  const panel = params?.get("panel") ?? null;
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setLoggedIn(!!(d?.user || d?.session)))
      .catch(() => setLoggedIn(false));
  }, []);

  if (panel === "following")     return <PanelWrap><FollowingPanel posts={posts} /></PanelWrap>;
  if (panel === "messages")      return <PanelWrap><MessagesPanel loggedIn={loggedIn} /></PanelWrap>;
  if (panel === "notifications") return <PanelWrap><NotificationsPanel loggedIn={loggedIn} /></PanelWrap>;

  // 默认 · 返回原 FeedShell (含 3 栏)
  return <>{defaultView}</>;
}

// Panel 视图沿用页面级 grid · 保留左侧 LeftNav + 主内容 · 隐藏右侧推荐卡
function PanelWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-feed-bg text-feed-ink font-ui">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-5 px-4 pb-24 pt-6 lg:gap-6 lg:px-6 lg:pt-8 xl:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden xl:block">
          <div className="sticky top-[80px]">
            <PanelLeftNav />
          </div>
        </aside>
        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

// 复用 LeftNav (client) · 单独导入避免服务端组件问题
import LeftNav from "./LeftNav";
function PanelLeftNav() { return <LeftNav />; }
