// About Creator Card — Sugargirl V3
// Header 布局:
//   ┌─────────────────────────────────────────────────────────────┐
//   │ {name} 简介                                                   │
//   ├─────────────────────────────────────────────────────────────┤
//   │ [Verification 6 chip]  │  [Actions: chat/video/私拍/伴游/tip/...] │
//   └─────────────────────────────────────────────────────────────┘
// Actions 从 Hero 右侧移到这里 (V3 spec)
import { getTranslations } from "next-intl/server";
import type { CreatorAbout as CreatorAboutData, TrustFlags, AvailabilityData } from "@/lib/creatorProfileMock";
import CreatorVerification from "./CreatorVerification";
import CreatorQuickActions from "./CreatorQuickActions";

interface Props {
  creatorName: string;
  about: CreatorAboutData;
  availability: AvailabilityData;
  age: number;
  height: number;
  profession?: string;
  slogan?: string;
  trust: TrustFlags;
  timezone?: string;
  nextAvailable?: string;
}

export default async function CreatorAbout({
  creatorName, about, availability, age, height, profession, slogan, trust,
  timezone = "GMT+8", nextAvailable = "今天",
}: Props) {
  const t = await getTranslations("creatorProfile.about");
  const tB = await getTranslations("creatorProfile.basicInfo");
  const tS = await getTranslations("creatorProfile.status");

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

  return (
    <section className="bg-white border border-[var(--line)] rounded-[20px] p-6 md:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header — Row 1: 动态标题 "{name} 简介"  |  Row 2: Verification + Actions 同一行 */}
      <header className="mb-6 md:mb-7 pb-5 md:pb-6 border-b border-[var(--line)]">
        <h3 className="text-[22px] md:text-[24px] font-extrabold tracking-tight text-[var(--ink)] m-0 mb-4">
          {t("aboutTitle", { name: creatorName })}
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <CreatorVerification flags={trust} />
          <div className="w-px h-6 bg-[var(--line)] hidden lg:block" aria-hidden />
          <CreatorQuickActions creatorName={creatorName} />
        </div>
      </header>

      {/* Body — About Me + Availability 2-col */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] gap-8 mb-8 pb-8 border-b border-[var(--line)]">
        <div>
          <h4 className="text-[11.5px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-3">
            {t("aboutMe")}
          </h4>
          {slogan && (
            <p className="text-[15px] font-medium italic text-[var(--ink)] m-0 mb-3 pl-3 border-l-2 border-[var(--accent)]">
              "{slogan}"
            </p>
          )}
          <p className="text-[15px] leading-[1.7] text-[var(--ink2)] m-0">{about.bio}</p>
        </div>
        <aside className="bg-[var(--page)] rounded-2xl p-5 self-start">
          <h4 className="text-[11.5px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-3">
            {t("availability")}
          </h4>
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
        </aside>
      </div>

      {/* Basic Info 15 fields */}
      <div className="mb-8 pb-8 border-b border-[var(--line)]">
        <h4 className="text-[11.5px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-4">
          {t("basicInformation")}
        </h4>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 m-0">
          {basicRows.map((r) => (
            <div key={r.label} className="flex flex-col gap-0.5">
              <dt className="text-[11px] text-[var(--muted)] font-medium">{r.label}</dt>
              <dd className="text-[14px] text-[var(--ink)] font-semibold m-0">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Interests */}
      <div className="mb-8 pb-8 border-b border-[var(--line)]">
        <h4 className="text-[11.5px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-3">
          {t("interests")}
        </h4>
        <div className="flex flex-wrap gap-2">
          {about.interests.map((i) => (
            <span key={i} className="text-[13px] font-semibold text-[var(--ink)] bg-[var(--page)] border border-[var(--line)] px-3 py-1.5 rounded-full">
              {i}
            </span>
          ))}
        </div>
      </div>

      {/* Travel Plan */}
      <div>
        <h4 className="text-[11.5px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-3">
          {t("travelPlans")}
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 m-0 p-0 list-none">
          {about.travelPlans.map((p) => {
            const parts = p.split("·");
            const city = parts[0]?.trim() ?? p;
            const date = parts[1]?.trim();
            return (
              <li key={p} className="flex items-center gap-3 bg-[var(--page)] rounded-xl p-3 border border-[var(--line)]">
                <span className="text-lg leading-none" aria-hidden>📍</span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <b className="text-[14px] font-bold text-[var(--ink)] truncate">{city}</b>
                  {date && <span className="text-[11.5px] text-[var(--muted)]">{date}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {about.frequentCountries.length > 0 && (
        <div className="mt-4 flex items-center gap-2 text-[12.5px] text-[var(--muted)]">
          <span className="font-semibold uppercase tracking-[.12em] text-[11px]">{t("frequent")}:</span>
          <span>{about.frequentCountries.join(" · ")}</span>
        </div>
      )}
    </section>
  );
}
