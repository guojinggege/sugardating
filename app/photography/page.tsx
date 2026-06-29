import FeedShell from "@/components/Feed/FeedShell";
import { featuredCreator, feedPosts, sidebarSuggestions, sidebarHotCreators } from "@/lib/feedMock";

export const dynamic = "force-dynamic";

// SEO 沿用频道名,描述贴近新页面定位
export const metadata = {
  title: "动态推荐 · Sugardating",
  description: "发现创作者动态:图片、视频、VIP 内容、热门更新。",
};

export default function Page() {
  return (
    <FeedShell
      creator={featuredCreator}
      posts={feedPosts}
      suggestions={sidebarSuggestions}
      hot={sidebarHotCreators}
    />
  );
}
