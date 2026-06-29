import CreatorCard from "./CreatorCard";
import Feed from "./Feed";
import Sidebar from "./Sidebar";
import PageBgDark from "./PageBgDark";
import type { CreatorProfile, FeedPost, SidebarSuggestion } from "./types";

// 三栏 layout (server) — 左 creator 卡 / 中 feed / 右 sidebar
// 响应式:
//   <1024:  单列(中)
//   1024-1280:  中 + 右
//   ≥1280:   左 + 中 + 右
export default function FeedShell({
  creator,
  posts,
  suggestions,
  hot,
}: {
  creator: CreatorProfile;
  posts: FeedPost[];
  suggestions: SidebarSuggestion[];
  hot: SidebarSuggestion[];
}) {
  return (
    <>
      <PageBgDark />
      <div className="min-h-screen bg-feed-bg text-feed-ink font-ui">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-5 px-4 pb-24 pt-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6 lg:px-6 lg:pt-8 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
          {/* 左:仅 xl 以上显示 */}
          <aside className="hidden xl:block">
            <div className="sticky top-[80px]">
              <CreatorCard creator={creator} />
            </div>
          </aside>

          {/* 中:主信息流 */}
          <main className="min-w-0">
            <Feed posts={posts} composerAvatar={creator.avatar} composerName={creator.name} />
          </main>

          {/* 右:lg 以上显示 */}
          <aside className="hidden lg:block">
            <div className="sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto pr-1 scrollbar-hide">
              <Sidebar creator={creator} suggestions={suggestions} hot={hot} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
