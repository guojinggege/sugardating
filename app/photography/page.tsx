import FeedShell from "@/components/Feed/FeedShell";
import {
  featuredCreator, feedPosts,
  sidebarSuggestions, sidebarHotCreators,
  trendingCreators, onlineCreators, vipCreators,
  popularTags, upcomingTrips,
} from "@/lib/feedMock";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "动态推荐 · Sugardating",
  description: "发现创作者动态:照片、视频、VIP 内容、热门更新。平台级 Discover Feed。",
};

export default function Page() {
  return (
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
  );
}
