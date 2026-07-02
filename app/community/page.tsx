// 互动社区 — Reddit-style 三栏社区讨论区
// 只影响 /community 路由。暗色主题 scoped via .cm-scope (globals.css)
// 不改动 Creator Detail / Sugargirl / Feed / Services / Video / AI Companion
import CommunityLayout from "@/components/Community/CommunityLayout";
import CommunityLeftSidebar from "@/components/Community/CommunityLeftSidebar";
import CommunityRightSidebar from "@/components/Community/CommunityRightSidebar";
import CommunityHeader from "@/components/Community/CommunityHeader";
import CommunityComposer from "@/components/Community/CommunityComposer";
import CommunitySortTabs from "@/components/Community/CommunitySortTabs";
import CommunityPostCard from "@/components/Community/CommunityPostCard";
import {
  myCommunities, discoverCommunities, trendingTopics, posts,
} from "@/lib/communityMock";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "互动社区 · Sugardating",
  description: "夜谈社区 · 情绪 / 关系 / 独居 / 深夜话题的讨论区。热帖、投票、匿名、24h 榜。",
};

export default function Page() {
  const onlineTotal = myCommunities.reduce((s, c) => s + (c.onlineCount || 0), 0) + 8930;

  return (
    <CommunityLayout
      left={<CommunityLeftSidebar joined={myCommunities} discover={discoverCommunities} activeSlug="home" />}
      right={<CommunityRightSidebar topics={trendingTopics} activeCommunities={myCommunities.slice(0, 5)} />}
      center={
        <>
          <CommunityHeader onlineTotal={onlineTotal} joinedCount={myCommunities.length} />
          <CommunityComposer />
          <CommunitySortTabs postsCount={posts.length} />
          {posts
            .slice()
            .sort((a, b) => b.score - a.score)
            .slice(0, 16)
            .map((p) => (
              <CommunityPostCard key={p.slug} post={p} />
            ))}
        </>
      }
    />
  );
}
