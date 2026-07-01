// V2 Discover Feed — 3 栏布局:
//   Left rail (nav 9 items,xl+ 显示)
//   Middle (infinite feed,posts 来自不同 creator)
//   Right rail (6 widget sidebar,lg+ 显示)
import LeftNav from "./LeftNav";
import Feed from "./Feed";
import Sidebar from "./Sidebar";
import PageBgDark from "./PageBgDark";
import type { CreatorProfile, FeedPost, SidebarSuggestion } from "./types";

interface Props {
  creator?: CreatorProfile;  // legacy prop 兼容
  posts: FeedPost[];
  suggestions: SidebarSuggestion[];
  hot?: SidebarSuggestion[];  // legacy 兼容
  trending: SidebarSuggestion[];
  online: SidebarSuggestion[];
  vip: SidebarSuggestion[];
  tags: { tag: string; count: number }[];
  trips: { city: string; date: string; sg: string }[];
}

export default function FeedShell({
  creator, posts, suggestions, hot, trending, online, vip, tags, trips,
}: Props) {
  return (
    <>
      <PageBgDark />
      <div className="min-h-screen bg-feed-bg text-feed-ink font-ui">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-5 px-4 pb-24 pt-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6 lg:px-6 lg:pt-8 xl:grid-cols-[240px_minmax(0,1fr)_340px]">
          {/* Left rail — nav (xl+ 显示) */}
          <aside className="hidden xl:block">
            <div className="sticky top-[80px]">
              <LeftNav />
            </div>
          </aside>

          {/* Middle — infinite feed */}
          <main className="min-w-0">
            <Feed
              posts={posts}
              composerAvatar={creator?.avatar ?? "/images/placeholder.png"}
              composerName={creator?.name ?? ""}
            />
          </main>

          {/* Right rail — 6 widget (lg+ 显示) */}
          <aside className="hidden lg:block">
            <div className="sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto pr-1 scrollbar-hide">
              <Sidebar
                creator={creator}
                suggestions={suggestions}
                hot={hot}
                trending={trending}
                online={online}
                vip={vip}
                tags={tags}
                trips={trips}
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
