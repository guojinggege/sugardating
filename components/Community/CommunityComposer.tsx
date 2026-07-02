// 轻量发帖入口 — 头像 + placeholder + 图片/视频/表情/投票 + 发布
"use client";
import { useAuth, useRequireLogin } from "@/components/Auth/AuthProvider";

export default function CommunityComposer() {
  const { user } = useAuth();
  const requireLogin = useRequireLogin();
  const guard = () => requireLogin();

  return (
    <section
      className="rounded-[16px] border p-3.5"
      style={{ background: "rgba(255,255,255,0.045)", borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#EC4C86] shrink-0 grid place-items-center text-white text-[12px] font-bold">
          {user?.name?.[0] || "?"}
        </div>
        <button
          type="button"
          onClick={guard}
          className="flex-1 h-10 rounded-full px-4 text-left text-[13px] text-[var(--cm-muted)] transition hover:bg-white/[0.06]"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          分享一些你的近况...
        </button>
        <div className="hidden md:flex gap-1">
          <ToolBtn onClick={guard} label="图片" icon={<path d="M3 5h18v14H3z M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM3 17l6-6 5 5 3-3 4 4"/>} />
          <ToolBtn onClick={guard} label="视频" icon={<path d="M3 6h13v12H3zM16 10l5-3v10l-5-3z"/>} />
          <ToolBtn onClick={guard} label="投票" icon={<path d="M4 6h10M4 12h16M4 18h6"/>} />
        </div>
        <button
          type="button"
          onClick={guard}
          className="h-10 px-4 rounded-full text-[12.5px] font-bold text-white transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#EC4C86 0%,#7C5CFF 100%)" }}
        >
          发布
        </button>
      </div>
    </section>
  );
}

function ToolBtn({ onClick, label, icon }: { onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 grid place-items-center rounded-full text-[var(--cm-muted)] hover:text-white hover:bg-white/[0.06] transition"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
    </button>
  );
}
