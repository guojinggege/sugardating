// Mobile Layout (/m/*) — 独立于 desktop
// 由 middleware 检测 Mobile UA 自动 redirect 到这里
// Desktop 用户手动访问 /m/ 也 serve mobile shell (可用于测试)
import type { Metadata } from "next";
import MobileHeader from "@/components/Mobile/MobileHeader";
import MobileBottomNav from "@/components/Mobile/MobileBottomNav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sugardating · Mobile",
};

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <MobileHeader />
      {/* pt-14 = MobileHeader h-14 · pb 保留给 MobileBottomNav (h-16 + safe-area) */}
      <main className="pt-14" style={{ paddingBottom: "calc(64px + env(safe-area-inset-bottom, 0px))" }}>
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
