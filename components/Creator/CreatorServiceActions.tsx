"use client";
// Service Cards (V2) — 参考图二: 独立服务卡片,icon puck + title + desc + divider + price/dur + CTA
// spec: 4 服务通用 fallback (S$ 8 / 48 / 680 / 280),右侧 35% 列内 2×2 grid
// 视觉:白 bg · #E5E7EB border · radius 18 · min-h 180 · 柔 shadow · hover 上浮 + gold border
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";

type ServiceKey = "chat" | "videoCall" | "privateShoot" | "bookTravel";

interface Svc {
  k: ServiceKey;
  emoji: string;
  price: string;      // "S$ 8"
  durKey: string;     // i18n key for duration
  ctaKey: "ctaStart" | "ctaBook";
}

const SERVICES: Svc[] = [
  { k: "chat",         emoji: "💬", price: "S$ 8",   durKey: "chatDur",         ctaKey: "ctaStart" },
  { k: "videoCall",    emoji: "📹", price: "S$ 48",  durKey: "videoCallDur",    ctaKey: "ctaBook"  },
  { k: "privateShoot", emoji: "📸", price: "S$ 680", durKey: "privateShootDur", ctaKey: "ctaBook"  },
  { k: "bookTravel",   emoji: "✈️", price: "S$ 280", durKey: "bookTravelDur",   ctaKey: "ctaBook"  },
];

export default function CreatorServiceActions() {
  const t   = useTranslations("creatorProfile.actions");
  const tS  = useTranslations("creatorProfile.services");
  const requireLogin = useRequireLogin();
  const onClick = () => { if (!requireLogin()) return; /* TODO route to service */ };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SERVICES.map((s) => (
        <button
          key={s.k}
          type="button"
          onClick={onClick}
          className="group flex flex-col justify-between gap-4 min-h-[180px] p-5 rounded-[18px] bg-white border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all duration-200 ease-out cursor-pointer text-left hover:-translate-y-0.5 hover:border-[#D6C29A] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
        >
          {/* Top: icon puck + title + desc */}
          <div className="flex flex-col gap-3">
            <span
              className="grid place-items-center w-11 h-11 rounded-[12px] bg-[#F7F7F7] text-[22px] leading-none"
              aria-hidden
            >
              {s.emoji}
            </span>
            <div>
              <div className="text-[16px] font-bold text-[#111827] leading-tight">{t(s.k)}</div>
              <div className="text-[13px] text-[#6B7280] leading-[1.6] mt-1.5">{tS(`${s.k}.desc`)}</div>
            </div>
          </div>

          {/* Bottom: divider + price/dur + CTA */}
          <div className="border-t border-[#EFEFEF] pt-3 flex items-end justify-between gap-2">
            <div className="min-w-0 flex flex-col gap-0.5">
              <div className="text-[16px] font-bold text-[#111827] leading-none tabular-nums whitespace-nowrap">
                {s.price} {tS("priceFrom")}
              </div>
              <div className="text-[12px] text-[#9CA3AF] leading-none whitespace-nowrap">
                · {tS(s.durKey)}
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[#111827] group-hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1 whitespace-nowrap flex-shrink-0">
              {tS(s.ctaKey)} →
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
