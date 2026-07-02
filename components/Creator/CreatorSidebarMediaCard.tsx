"use client";
// Sidebar Media Showcase Card V2:
//   - 顶部 3 CTA 行:打赏 / 聊天 / 约她 (spec 明确)
//   - 大图 4:5 · radius 24 · 底部渐变 + 信息 chip
//   - 左上 bookmark · 右下 expand
//   - 无底部 pill Action Bar (已由顶部 CTA 承担转化,不重复)
import Img from "@/components/Img";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import type { Creator } from "@/lib/types";

interface Props {
  creator: Creator;
  imageSrc: string;
  age?: number;
  city?: string;
  price?: string;
}

export default function CreatorSidebarMediaCard({
  creator, imageSrc, age, city, price,
}: Props) {
  const requireLogin = useRequireLogin();
  const guard = () => { if (!requireLogin()) return; /* TODO route */ };

  const parts: string[] = [creator.name];
  if (age) parts.push(String(age));
  if (price) parts.push(`from ${price}`);
  else if (city) parts.push(city);
  const chipText = parts.join(" · ");

  return (
    <div className="rounded-[24px] overflow-hidden bg-white border border-[#E5E7EB] shadow-[0_16px_40px_rgba(15,23,42,0.10)]">
      {/* 顶部 3 CTA 行 — 打赏 / 聊天 / 约她 */}
      <div className="grid grid-cols-3 gap-2 p-3.5 bg-white">
        <button
          type="button"
          onClick={guard}
          className="h-11 rounded-full text-[#1a1409] text-[13px] font-bold hover:opacity-95 transition inline-flex items-center justify-center gap-1.5"
          style={{ background: "linear-gradient(135deg,#d4bf95 0%,#b8a789 50%,#f0c9a3 100%)" }}
        >
          <span aria-hidden>🎁</span>
          打赏
        </button>
        <button
          type="button"
          onClick={guard}
          className="h-11 rounded-full bg-[var(--ink)] text-white text-[13px] font-semibold hover:bg-black transition inline-flex items-center justify-center gap-1.5"
        >
          <span aria-hidden>💬</span>
          聊天
        </button>
        <button
          type="button"
          onClick={guard}
          className="h-11 rounded-full bg-white text-[var(--ink)] border border-[var(--line2)] text-[13px] font-semibold hover:border-[var(--ink)] hover:bg-[var(--page)] transition inline-flex items-center justify-center gap-1.5"
        >
          <span aria-hidden>📅</span>
          约她
        </button>
      </div>

      {/* Media Image — 4:5 竖版,radius 只作用于底部 (top 已被 CTA 行占据) */}
      <div
        className="relative w-full bg-[#F3F4F6]"
        style={{ aspectRatio: "4 / 5" }}
      >
        <Img src={imageSrc} alt={creator.name} sizes="(min-width:1024px) 360px, 100vw" />

        {/* 底部 30% 渐变 — 保 chip 可读 */}
        <div
          className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,.6) 0%, rgba(0,0,0,.2) 60%, transparent 100%)",
          }}
          aria-hidden
        />

        {/* 左上 bookmark icon */}
        <button
          type="button"
          onClick={guard}
          aria-label="Bookmark"
          className="absolute top-[18px] left-[18px] w-9 h-9 grid place-items-center rounded-full text-[#6B7280] hover:text-[#111827] transition"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12v18l-6-4-6 4z" />
          </svg>
        </button>

        {/* 右下 expand icon */}
        <button
          type="button"
          aria-label="Expand"
          className="absolute bottom-4 right-4 w-[34px] h-[34px] grid place-items-center rounded-full text-white transition hover:bg-black/55"
          style={{
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>

        {/* 信息 chip — 底部中央 */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1.5 text-[12px] font-medium text-[#111827] whitespace-nowrap shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
          style={{
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            bottom: "18px",
          }}
        >
          {chipText}
        </div>
      </div>
    </div>
  );
}
