import FeedShell from "@/components/Feed/FeedShell";
import PhotographyPanels from "@/components/Feed/PhotographyPanels";
import {
  featuredCreator, feedPosts,
  sidebarSuggestions, sidebarHotCreators,
  trendingCreators, onlineCreators, vipCreators,
  popularTags, upcomingTrips,
} from "@/lib/feedMock";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "动态推荐 · Sugardating",
  description: "发现创作者动态 · 关注 · 私信 · 通知 · VIP 一站式入口。",
};

export default function Page() {
  return (
    <PhotographyPanels
      posts={feedPosts}
      defaultView={
        <FeedShell
          creator={featuredCreator}
          posts={feedPosts}
          suggestions={sidebarSuggestions}
          hot={sidebarHotCreators}
          trending={trendingCreators}
          online={onlineCreators}
          vip={vipCreators}
          tags={popularTags}
          trips={upcomingTrips}
        />
      }
    />
  );
}
