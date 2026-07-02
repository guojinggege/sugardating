"use client";
// Sidebar Media Showcase Card V3:
//   - 顶部 Online Status rows (在线/回复率/平均回复/下次可预约/时区/最近活跃)
//   - 大图 4:5 · radius 20 · 底部渐变 + 信息 chip
//   - 左上 bookmark · 右下 expand
//   - 3 CTA (打赏/聊天/约她) 已迁至独立卡片 (RightSidebar)
import Img from "@/components/Img";
import { useTranslations } from "next-intl";
import type { Creator } from "@/lib/types";
import type { AvailabilityData } from "@/lib/creatorProfileMock";

interface Props {
  creator: Creator;
  imageSrc: string;
  age?: number;
  city?: string;
  price?: string;
  availability: AvailabilityData;
  timezone?: string;
  nextAvailable?: string;
}

export default function CreatorSidebarMediaCard({
  creator, imageSrc, age, city, price,
  availability, timezone = "GMT+8", nextAvailable = "今天",
}: Props) {
  const tS = useTranslations("creatorProfile.status");

  const parts: string[] = [creator.name];
  if (age) parts.push(String(age));
  if (price) parts.push(`from ${price}`);
  else if (city) parts.push(city);
  const chipText = parts.join(" · ");

  const replyValue = availability.replyMinutes < 60
    ? `${availability.replyMinutes} 分钟`
    : `< ${Math.round(availability.replyMinutes / 60)} 小时`;

  return (
    <div className="rounded-[20px] overflow-hidden bg-white border border-[var(--line)] shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
      {/* 顶部 Online Status rows */}
      <div className="p-5">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-[var(--muted)]">{tS("onlineNow")}</span>
            {availability.isOnline ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-[#16a34a]">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" style={{ boxShadow: "0 0 6px #22c55e" }} />
                {tS("onlineNow")}
              </span>
            ) : (
              <span className="font-semibold text-[var(--ink)]">{availability.lastActiveText}</span>
            )}
          </div>
          <StatRow label={tS("replyRate")}     value={`${availability.responseRate}%`} />
          <StatRow label={tS("avgReply")}      value={replyValue} />
          <StatRow label={tS("nextAvailable")} value={nextAvailable} />
          <StatRow label={tS("timezone")}      value={timezone} />
          <StatRow label={tS("lastActive")}    value={availability.lastActiveText} />
        </div>
      </div>

      {/* Media Image — 4:5 竖版 */}
      <div className="relative w-full bg-[#F3F4F6]" style={{ aspectRatio: "4 / 5" }}>
        <Img src={imageSrc} alt={creator.name} sizes="(min-width:1024px) 360px, 100vw" />

        {/* 底部 30% 渐变 */}
        <div
          className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,.6) 0%, rgba(0,0,0,.2) 60%, transparent 100%)" }}
          aria-hidden
        />

        {/* 左上 bookmark icon */}
        <button
          type="button"
          aria-label="Bookmark"
          className="absolute top-[18px] left-[18px] w-9 h-9 grid place-items-center rounded-full text-[#6B7280] hover:text-[#111827] transition"
          style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
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
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
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

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-[12.5px]">
      <span className="text-[var(--muted)]">{label}</span>
      <b className="text-[13px] font-bold text-[var(--ink)] tabular-nums">{value}</b>
    </div>
  );
}
