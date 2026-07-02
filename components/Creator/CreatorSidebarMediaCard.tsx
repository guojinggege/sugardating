"use client";
// Sidebar Media Showcase Card — 参考图一:大图 · 底部渐变 · 中间信息 chip · 底部 4-button pill Action Bar
// spec §五-十:
//   - 4:5 aspect · full-width · radius 24 · #F3F4F6 bg · shadow 0 16px 40px rgba(15,23,42,.10)
//   - image priority (caller): creator.sidebarImage → cover → photos[0] → avatar
//   - 底部 40% linear-gradient rgba(0,0,0,.68/.28/0)
//   - 左上 bookmark icon (glass) · 右下 expand icon (dark glass)
//   - 信息 chip:{Name} · {Age} · from {Price} 或 · {City}
//   - Pill Action Bar (h 56):[提醒 · 收藏] 蓝 + [电话 · 消息] 粉红,4 段无缝
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
  const guard = () => { if (!requireLogin()) return; /* TODO: route */ };

  // Chip 内容 — 只显示可用字段,{Name} · {Age} · from {Price} 或 · {City}
  const parts: string[] = [creator.name];
  if (age) parts.push(String(age));
  if (price) parts.push(`from ${price}`);
  else if (city) parts.push(city);
  const chipText = parts.join(" · ");

  return (
    <div
      className="relative w-full rounded-[24px] overflow-hidden bg-[#F3F4F6] shadow-[0_16px_40px_rgba(15,23,42,0.10)]"
      style={{ aspectRatio: "4 / 5" }}
    >
      {/* Image 铺满 */}
      <Img src={imageSrc} alt={creator.name} sizes="(min-width:1024px) 360px, 100vw" />

      {/* Bottom 40% 渐变遮罩 — 保 chip + action bar 可读 */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40%] pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,.68) 0%, rgba(0,0,0,.28) 55%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* 左上 bookmark icon (glass 半透) */}
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

      {/* 右下 expand icon (dark glass) — 位于 chip 之上,不干扰 action bar */}
      <button
        type="button"
        aria-label="Expand"
        className="absolute right-4 w-[34px] h-[34px] grid place-items-center rounded-full text-white transition hover:bg-black/55"
        style={{
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          bottom: "96px",
        }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        </svg>
      </button>

      {/* Info chip — 底部中央,位于 Action Bar 上方 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1.5 text-[12px] font-medium text-[#111827] whitespace-nowrap shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          bottom: "92px",
        }}
      >
        {chipText}
      </div>

      {/* Pill Action Bar — 底部悬浮 · 4 按钮无缝拼接 · 蓝/蓝/粉/粉 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-stretch h-14 rounded-full overflow-hidden shadow-[0_14px_32px_rgba(0,0,0,0.22)]"
        style={{
          bottom: "20px",
          width: "calc(100% - 32px)",
          maxWidth: "calc(100% - 32px)",
        }}
      >
        <ActionBtn
          onClick={guard} label="提醒" bg="#2F91C8"
          icon={<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>}
        />
        <ActionBtn
          onClick={guard} label="收藏" bg="#2F91C8"
          icon={<path d="M6 3h12v18l-6-4-6 4z" />}
        />
        <ActionBtn
          onClick={guard} label="电话" bg="#D83B5E"
          icon={<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />}
        />
        <ActionBtn
          onClick={guard} label="消息" bg="#D83B5E"
          icon={<path d="M21 12a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 12z" />}
        />
      </div>
    </div>
  );
}

function ActionBtn({
  onClick, label, bg, icon,
}: { onClick: () => void; label: string; bg: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex-1 flex items-center justify-center gap-1.5 text-white text-[12.5px] font-semibold whitespace-nowrap hover:brightness-110 transition-all"
      style={{ background: bg }}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
      <span>{label}</span>
    </button>
  );
}
