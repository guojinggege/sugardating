// Verification — 小型 inline row (不再是大 Card)
// LinkedIn/Instagram Verified 风格:一排 ✔ + label,绿色,~36px 高
import { getTranslations } from "next-intl/server";
import type { TrustFlags } from "@/lib/creatorProfileMock";

const ORDER: (keyof TrustFlags)[] = ["identity", "phone", "email", "video", "face", "safeMeet"];

export default async function CreatorVerification({ flags }: { flags: TrustFlags }) {
  const t = await getTranslations("creatorProfile.trust");
  const active = ORDER.filter((k) => flags[k]);

  return (
    <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
      {active.map((k) => (
        <span
          key={k}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.25)] text-[#16a34a] font-semibold whitespace-nowrap"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.4]" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l4 4 10-10" />
          </svg>
          {t(`items.${k}`)}
        </span>
      ))}
      <span className="ml-1 text-[11.5px] text-[var(--muted)] font-medium">
        {active.length} / {ORDER.length} {t("verified")}
      </span>
    </div>
  );
}
