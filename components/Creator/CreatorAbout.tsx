// About Card V2 — Sugargirl 频道模板
// 布局:
//   Header:  [Avatar 72] {name} 简介   +   [❤️关注 🎁打赏 🔗分享]
//   Body 70/30 grid:
//     Left 70%:  个人简介 → 基础资料 (15 fields) → 兴趣标签 → 服务入口 (4 action cards)
//     Right 30%: 在线状态 → 认证 Badge
// Travel Plan 从 About Card 移除 (spec §三,由 4 服务入口取代)
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import type { CreatorAbout as CreatorAboutData, TrustFlags, AvailabilityData } from "@/lib/creatorProfileMock";
import type { Creator } from "@/lib/types";
import CreatorVerification from "./CreatorVerification";
import CreatorHeaderActions from "./CreatorHeaderActions";
import CreatorServiceActions from "./CreatorServiceActions";

interface Props {
  creator: Creator;
  avatar: string;
  about: CreatorAboutData;
  availability: AvailabilityData;
  age: number;
  height: number;
  profession?: string;
  slogan?: string;
  trust: TrustFlags;
  timezone?: string;
  nextAvailable?: string;
  online?: boolean;
}

export default async function CreatorAbout({
  creator, avatar, about, availability, age, height, profession, slogan, trust,
  timezone = "GMT+8", nextAvailable = "今天", online = true,
}: Props) {
  const t  = await getTranslations("creatorProfile.about");
  const tB = await getTranslations("creatorProfile.basicInfo");
  const tS = await getTranslations("creatorProfile.status");
  const tT = await getTranslations("creatorProfile.trust");

  const basicRows: { label: string; value: React.ReactNode }[] = [
    { label: tB("age"),          value: `${age} 岁` },
    { label: tB("height"),       value: `${height} cm` },
    { label: tB("weight"),       value: `${about.weight} kg` },
    { label: tB("bodyType"),     value: about.bodyType },
    { label: tB("skinTone"),     value: about.skinTone },
    { label: tB("hairColor"),    value: about.hairColor },
    { label: tB("eyeColor"),     value: about.eyeColor },
    { label: tB("profession"),   value: profession || "—" },
    { label: tB("city"),         value: about.city },
    { label: tB("birthCountry"), value: about.birthCountry },
    { label: tB("languages"),    value: about.languages.join(" / ") },
    { label: tB("education"),    value: about.education },
    { label: tB("zodiac"),       value: about.zodiac },
    { label: tB("bloodType"),    value: `${about.bloodType} 型` },
    { label: tB("joinedAt"),     value: about.joinedAt },
  ];

  const sectionH = "text-[11.5px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-3";

  return (
    <section className="bg-white border border-[var(--line)] rounded-[20px] p-6 md:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header — Avatar + Title + Quick Actions,Instagram Profile Header 风格 */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-[var(--line)]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden border-[3px] border-white bg-[var(--page)] shadow-[0_6px_20px_-8px_rgba(0,0,0,0.2)] flex-shrink-0">
            <Img src={avatar} alt={creator.name} sizes="72px" />
            {online && (
              <span
                className="absolute right-1 bottom-1 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-white"
                aria-label={tS("onlineNow")}
              />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-[20px] md:text-[22px] font-extrabold tracking-tight text-[var(--ink)] m-0 leading-tight">
              {t("aboutTitle", { name: creator.name })}
            </h3>
            <div className="text-[13px] text-[var(--muted)] mt-1 font-medium">@{creator.slug}</div>
          </div>
        </div>
        <CreatorHeaderActions creatorName={creator.name} />
      </header>

      {/* Body — 70/30 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] gap-6 lg:gap-8">
        {/* Left column 70% — Bio / Basic Info / Interests / Service Actions */}
        <div className="flex flex-col gap-7">
          {/* 个人简介 */}
          <div>
            <h4 className={sectionH}>{t("aboutMe")}</h4>
            {slogan && (
              <p className="text-[15px] font-medium italic text-[var(--ink)] m-0 mb-2 pl-3 border-l-2 border-[var(--accent)]">
                "{slogan}"
              </p>
            )}
            <p className="text-[14.5px] leading-[1.7] text-[var(--ink2)] m-0">{about.bio}</p>
          </div>

          {/* 基础资料 */}
          <div>
            <h4 className={sectionH}>{t("basicInformation")}</h4>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 m-0">
              {basicRows.map((r) => (
                <div key={r.label} className="flex flex-col gap-0.5">
                  <dt className="text-[11px] text-[var(--muted)] font-medium">{r.label}</dt>
                  <dd className="text-[13.5px] text-[var(--ink)] font-semibold m-0">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 兴趣标签 */}
          <div>
            <h4 className={sectionH}>{t("interests")}</h4>
            <div className="flex flex-wrap gap-1.5">
              {about.interests.map((i) => (
                <span key={i} className="text-[12.5px] font-semibold text-[var(--ink)] bg-[var(--page)] border border-[var(--line)] px-3 py-1.5 rounded-full">
                  {i}
                </span>
              ))}
            </div>
          </div>

          {/* 服务入口 (4 Action Cards) — 取代原 Travel Plan */}
          <div>
            <h4 className={sectionH}>{t("serviceEntries")}</h4>
            <CreatorServiceActions />
          </div>
        </div>

        {/* Right column 30% — Availability + Verification */}
        <aside className="flex flex-col gap-4">
          {/* 在线状态 */}
          <div className="bg-[var(--page)] rounded-2xl p-5 border border-[var(--line)]">
            <h4 className={sectionH}>{t("availability")}</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] text-[var(--muted)]">{tS("onlineNow")}</span>
                {availability.isOnline ? (
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#16a34a]">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e]" style={{ boxShadow: "0 0 6px #22c55e" }} />
                    {tS("onlineNow")}
                  </span>
                ) : (
                  <span className="text-[12.5px] font-semibold text-[var(--ink)]">{availability.lastActiveText}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] text-[var(--muted)]">{tS("avgReply")}</span>
                <b className="text-[13px] font-bold text-[var(--ink)] tabular-nums">
                  {availability.replyMinutes < 60 ? `${availability.replyMinutes} 分钟` : `< ${Math.round(availability.replyMinutes / 60)} 小时`}
                </b>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] text-[var(--muted)]">{tS("nextAvailable")}</span>
                <b className="text-[13px] font-bold text-[var(--ink)]">{nextAvailable}</b>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] text-[var(--muted)]">{tS("timezone")}</span>
                <b className="text-[13px] font-bold text-[var(--ink)]">{timezone}</b>
              </div>
            </div>
          </div>

          {/* 认证 Badges — 移到 Availability 下方 */}
          <div className="bg-white rounded-2xl p-5 border border-[var(--line)]">
            <h4 className={sectionH}>{tT("title")}</h4>
            <CreatorVerification flags={trust} />
          </div>
        </aside>
      </div>
    </section>
  );
}
