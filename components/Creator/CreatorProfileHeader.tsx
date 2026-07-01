// Profile Header — Instagram/Twitter 风格
// Avatar 覆盖 Hero 底部 (mt -70) + Info + Actions row
// Layout:
//   [Avatar 140 (overlap)]  [Name+badges+intro+meta]  [QuickActions horizontal]
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import type { Creator } from "@/lib/types";
import CreatorQuickActions from "./CreatorQuickActions";

interface Props {
  creator: Creator;
  avatar: string;
  age: number;
  languages: string[];
  profession?: string;
  joinedAt: string;
  intro?: string;
  online?: boolean;
  vip?: boolean;
}

export default async function CreatorProfileHeader({
  creator, avatar, age, languages, profession, joinedAt, intro,
  online = true, vip = true,
}: Props) {
  const t = await getTranslations("creatorProfile.hero");
  const tS = await getTranslations("creatorProfile.stats");

  return (
    <section className="cr-shell relative -mt-14 md:-mt-16 lg:-mt-[70px] z-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        {/* Left — Avatar + Info */}
        <div className="flex flex-col md:flex-row md:items-end gap-5 min-w-0 flex-1">
          {/* Avatar (overlapping hero) */}
          <div className="relative w-[128px] h-[128px] lg:w-[140px] lg:h-[140px] flex-shrink-0 self-start md:self-end">
            <div className="w-full h-full rounded-full overflow-hidden border-[5px] border-white bg-[#e6e6ea] shadow-[0_24px_60px_-14px_rgba(0,0,0,0.35),0_10px_24px_-6px_rgba(0,0,0,0.15)]">
              <Img src={avatar} alt={creator.name} sizes="140px" />
            </div>
            {online && (
              <span
                className="absolute right-2 bottom-2 w-4 h-4 rounded-full bg-[#22c55e] border-[3px] border-white"
                aria-label={t("online")}
              />
            )}
          </div>

          {/* Info stack */}
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[26px] lg:text-[30px] font-extrabold tracking-tight text-[var(--ink)] leading-tight m-0">
                {creator.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10.5px] font-bold leading-none bg-[rgba(56,189,248,0.15)] text-[#0284c7] border border-[rgba(56,189,248,0.3)]" title={t("verified")}>
                <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="currentColor"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" /><path d="M9 12l2.2 2.2L15 10.5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t("verified")}
              </span>
              {vip && (
                <span
                  className="text-[10px] font-extrabold leading-none px-2 py-[3px] rounded-full text-[#1a1409] shadow-[0_4px_10px_-3px_rgba(184,167,137,0.4)]"
                  style={{ background: "linear-gradient(135deg,#d4bf95,#b8a789)", letterSpacing: ".06em" }}
                >
                  VIP
                </span>
              )}
              {online && (
                <span className="text-[10px] font-bold leading-none px-2 py-[3px] rounded-full bg-[rgba(34,197,94,0.15)] text-[#16a34a] border border-[rgba(34,197,94,0.35)] inline-flex items-center gap-1">
                  <i className="w-[6px] h-[6px] rounded-full bg-[#22c55e]" style={{ boxShadow: "0 0 8px #22c55e" }} />Online
                </span>
              )}
            </div>
            <div className="text-[14px] text-[var(--muted)] mt-1 font-medium">@{creator.slug}</div>
            {intro && (
              <p className="text-[14px] text-[var(--ink)] mt-2.5 font-medium leading-snug max-w-[520px]">{intro}</p>
            )}
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 m-0 mt-3 p-0 list-none text-[13px] text-[var(--ink2)]">
              <li className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.7] opacity-70"><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
                {creator.region}
              </li>
              <li className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.7] opacity-70"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                {age} {t("yearsOld")}
              </li>
              <li className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.7] opacity-70"><path d="M4 6h16M4 12h16M4 18h12" /></svg>
                {languages.join(" / ")}
              </li>
              {profession && (
                <li className="inline-flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.7] opacity-70"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>
                  {profession}
                </li>
              )}
              <li className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.7] opacity-70"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
                {tS("joinedAt")} {joinedAt}
              </li>
            </ul>
          </div>
        </div>

        {/* Right — Quick Actions horizontal row */}
        <div className="lg:pb-1 flex-shrink-0">
          <CreatorQuickActions creatorName={creator.name} />
        </div>
      </div>
    </section>
  );
}
