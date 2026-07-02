// Verification Badges — 2×2 grid,放在服务入口上方,为服务卡建立信任背书
// spec: 真人认证 / 安全认证 / 服务认证 / VIP 认证
// 视觉:白 bg,#EFEFEF border,radius 16,gold-accent icon,轻 shadow,hover 微升
import { getTranslations } from "next-intl/server";

type BadgeKey = "realPerson" | "safety" | "service" | "vip";

// lucide-style monochrome 20px stroked icons
const ICONS: Record<BadgeKey, React.ReactNode> = {
  realPerson: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="10" cy="8" r="4" />
      <path d="M2 21c0-4 4-6 8-6 1.6 0 3 .3 4.2.9" />
      <path d="M15 18l2 2 4-4" />
    </svg>
  ),
  safety: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  service: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2l2.4 2.6L18 4l.4 3.6L22 9l-1.4 3.4L22 16l-3.6 1L18 20l-3.6-.6L12 22l-2.4-2.6L6 20l-.4-3L2 16l1.4-3.6L2 9l3.6-1L6 4l3.6.6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  vip: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 8l4 5 5-8 5 8 4-5-2 12H5z" />
      <path d="M5 20h14" />
    </svg>
  ),
};

const ORDER: BadgeKey[] = ["realPerson", "safety", "service", "vip"];

export default async function CreatorTrustBadges() {
  const t = await getTranslations("creatorProfile.verification");

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {ORDER.map((k) => (
        <div
          key={k}
          className="bg-white border border-[#EFEFEF] rounded-[16px] p-3.5 shadow-[0_6px_18px_rgba(15,23,42,0.04)] transition-all duration-200 ease-out hover:-translate-y-px hover:border-[#D6C29A] hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)]"
        >
          <div className="flex items-start gap-2.5">
            <span className="text-[var(--accent)] flex-shrink-0 mt-0.5" aria-hidden>
              {ICONS[k]}
            </span>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-[#111827] leading-tight">
                {t(`${k}.title`)}
              </div>
              <div className="text-[11.5px] text-[#9CA3AF] mt-1 leading-[1.4]">
                {t(`${k}.desc`)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
