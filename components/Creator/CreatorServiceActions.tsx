"use client";
// Service Cards — Right column of Creator Introduction (2×2 grid always)
// Spec §三: 立即聊天 / 视频聊天 / 私拍 / 预约伴游,每 card = icon + title + subtitle
// 视觉:soft pastel bg + white icon puck + 轻边框,统一 radius 18
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";

type ServiceKey = "chat" | "videoCall" | "privateShoot" | "bookTravel";

interface Svc {
  k: ServiceKey;
  emoji: string;
  subKey: string;
  bg: string;
  border: string;
  hoverBorder: string;
}

const SERVICES: Svc[] = [
  { k: "chat",         emoji: "💬", subKey: "chatSub",         bg: "#F8FAFC", border: "#E6EEF6", hoverBorder: "#B8C9DA" },
  { k: "videoCall",    emoji: "📹", subKey: "videoCallSub",    bg: "#F7F3EA", border: "#EFE7D4", hoverBorder: "#D4C79E" },
  { k: "privateShoot", emoji: "📸", subKey: "privateShootSub", bg: "#F3F8F6", border: "#DFEDE5", hoverBorder: "#A8CFBD" },
  { k: "bookTravel",   emoji: "✈️", subKey: "bookTravelSub",   bg: "#F8F5FF", border: "#EBE3F7", hoverBorder: "#C6B4E4" },
];

export default function CreatorServiceActions() {
  const t   = useTranslations("creatorProfile.actions");
  const requireLogin = useRequireLogin();
  const onClick = () => { if (!requireLogin()) return; /* TODO: route to action */ };

  return (
    <div className="grid grid-cols-2 gap-3">
      {SERVICES.map((s) => (
        <button
          key={s.k}
          type="button"
          onClick={onClick}
          className="group relative flex flex-col items-start justify-between gap-4 min-h-[120px] p-4 rounded-[18px] border transition-all duration-200 ease-out cursor-pointer font-ui text-left hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-14px_rgba(0,0,0,0.14)]"
          style={{ background: s.bg, borderColor: s.border }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = s.hoverBorder)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = s.border)}
        >
          <span
            className="grid place-items-center w-10 h-10 rounded-[12px] bg-white shadow-[0_2px_6px_-2px_rgba(0,0,0,0.08)] text-[22px] leading-none"
            aria-hidden
          >
            {s.emoji}
          </span>
          <div className="min-w-0 w-full">
            <div className="text-[14px] font-bold text-[var(--ink)] leading-tight">{t(s.k)}</div>
            <div className="text-[11.5px] text-[var(--muted)] mt-1 leading-snug">{t(s.subKey)}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
