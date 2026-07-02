"use client";
// Sidebar Media Showcase Card — 竖版大图 + 底部渐变 + 悬浮信息 chip + 圆角操作栏
// spec §五-九:
//   - 4:5 aspect · full-width · radius 24 · #F3F4F6 bg placeholder · soft shadow
//   - image priority: creator.sidebarImage → coverImage → photos[0] → avatar (由 caller 解析)
//   - 底部 35% 渐变 rgba(0,0,0,.62/.22/0)
//   - 信息 chip:name · age · city,glass rounded-full,bottom 88 (在操作栏上方)
//   - Pill action bar:聊天(黑) | 打赏(金) | 预约(白),flex:1 各占 1/3,52px 高,rounded-full
//   - 顶右 "..." glass 圆按钮
import Img from "@/components/Img";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import type { Creator } from "@/lib/types";

interface Props {
  creator: Creator;
  imageSrc: string;
  age?: number;
  city?: string;
}

export default function CreatorSidebarMediaCard({ creator, imageSrc, age, city }: Props) {
  const tA = useTranslations("creatorProfile.actions");
  const requireLogin = useRequireLogin();
  const guard = (fn: () => void) => () => { if (requireLogin()) fn(); };

  // Info chip 内容 — 只显示可用字段
  const chipParts: string[] = [creator.name];
  if (age) chipParts.push(String(age));
  if (city) chipParts.push(city);
  const chipText = chipParts.join(" · ");

  return (
    <div
      className="relative w-full rounded-[24px] overflow-hidden bg-[#F3F4F6] shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
      style={{ aspectRatio: "4 / 5" }}
    >
      {/* Image 铺满 (Img = next/image fill + object-cover) */}
      <Img src={imageSrc} alt={creator.name} sizes="(min-width:1024px) 360px, 100vw" />

      {/* Bottom gradient — 35% coverage,保 chip + 操作栏可读 */}
      <div
        className="absolute inset-x-0 bottom-0 h-[35%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,.62) 0%, rgba(0,0,0,.22) 60%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* 顶右 More 按钮 (glass) */}
      <button
        type="button"
        onClick={() => { /* TODO: more menu */ }}
        className="absolute top-4 right-4 w-9 h-9 grid place-items-center rounded-full text-[#111] hover:bg-white transition"
        style={{ background: "rgba(255,255,255,.82)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
        aria-label="More"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>

      {/* Info chip — 底部中央,位于操作栏之上 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5 text-[12px] font-medium text-[#111827] shadow-[0_2px_8px_rgba(0,0,0,0.08)] whitespace-nowrap"
        style={{
          background: "rgba(255,255,255,.86)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          bottom: "88px",
        }}
      >
        {chipText}
      </div>

      {/* Pill Action Bar — 悬浮在图片底部 */}
      <div
        className="absolute left-[18px] right-[18px] bottom-[18px] flex h-[52px] rounded-full overflow-hidden"
        style={{ boxShadow: "0 12px 28px rgba(0,0,0,0.18)" }}
      >
        <button
          type="button"
          onClick={guard(() => {})}
          className="flex-1 flex items-center justify-center gap-1.5 text-white text-[14px] font-semibold hover:opacity-95 transition"
          style={{ background: "var(--ink)" }}
        >
          {tA("chatShort")}
        </button>
        <button
          type="button"
          onClick={guard(() => {})}
          className="flex-1 flex items-center justify-center gap-1.5 text-[#1a1409] text-[14px] font-semibold hover:opacity-95 transition"
          style={{ background: "linear-gradient(135deg,#d4bf95 0%,#b8a789 50%,#f0c9a3 100%)" }}
        >
          {tA("tipShort")}
        </button>
        <button
          type="button"
          onClick={guard(() => {})}
          className="flex-1 flex items-center justify-center gap-1.5 text-[#111827] text-[14px] font-semibold bg-white hover:bg-[#F8F8F8] transition"
        >
          {tA("bookShort")}
        </button>
      </div>
    </div>
  );
}
