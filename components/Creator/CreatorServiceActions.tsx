"use client";
// About Card 里的 4 功能入口 (取代原 Travel Plan 位置):
//   💬 聊天  ·  📹 视频聊天  ·  📷 私拍  ·  ✈️ 预约伴游
// 统一 Card 样式,同高,同 icon 尺寸,hover 抬升
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";

type ServiceKey = "chat" | "videoCall" | "privateShoot" | "bookTravel";

const SERVICES: { k: ServiceKey; emoji: string; tint: string }[] = [
  { k: "chat",          emoji: "💬", tint: "sky" },
  { k: "videoCall",     emoji: "📹", tint: "violet" },
  { k: "privateShoot",  emoji: "📷", tint: "amber" },
  { k: "bookTravel",    emoji: "✈️", tint: "gold" },
];

const TINT_BG: Record<string, string> = {
  sky:    "bg-sky-50 border-sky-100 hover:border-sky-300",
  violet: "bg-violet-50 border-violet-100 hover:border-violet-300",
  amber:  "bg-amber-50 border-amber-100 hover:border-amber-300",
  gold:   "bg-[rgba(184,167,137,0.08)] border-[rgba(184,167,137,0.2)] hover:border-[var(--accent)]",
};

export default function CreatorServiceActions() {
  const t = useTranslations("creatorProfile.actions");
  const requireLogin = useRequireLogin();
  const onClick = () => { if (!requireLogin()) return; /* TODO 接入 */ };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {SERVICES.map((s) => (
        <button
          key={s.k}
          type="button"
          onClick={onClick}
          className={`flex flex-col items-center justify-center gap-1.5 p-4 border rounded-2xl transition-all cursor-pointer font-ui hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-12px_rgba(0,0,0,0.15)] ${TINT_BG[s.tint]}`}
        >
          <span className="text-[26px] leading-none" aria-hidden>{s.emoji}</span>
          <span className="text-[13px] font-bold text-[var(--ink)] mt-0.5">{t(s.k)}</span>
        </button>
      ))}
    </div>
  );
}
