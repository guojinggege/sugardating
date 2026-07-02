// 3-col shell — Desktop 240 / 1fr / 320,tablet 隐藏 left,mobile 单列
// 暗色主题通过 .cm-scope 类作用域,不影响其它页面 (globals.css §cm-scope)
import type { ReactNode } from "react";

interface Props {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

export default function CommunityLayout({ left, center, right }: Props) {
  return (
    <div className="cm-scope min-h-screen">
      <div className="mx-auto max-w-[1360px] px-4 md:px-6 pt-6 md:pt-8 pb-24">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[240px_minmax(0,1fr)_320px]">
          {/* Left rail — xl+ */}
          <aside className="hidden xl:block">
            <div className="sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto pr-1 [scrollbar-width:thin]">
              {left}
            </div>
          </aside>
          {/* Main Feed */}
          <main className="min-w-0 flex flex-col gap-4">
            {center}
          </main>
          {/* Right rail — lg+ */}
          <aside className="hidden lg:block">
            <div className="sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto pr-1 [scrollbar-width:thin]">
              {right}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
