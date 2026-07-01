// V3 — About Card
// spec §Creator Introduction:
//   - 标题: {CreatorName} 简介 (动态)
//   - 内容: About Me + Basic Information + Interests + Languages/Height/Weight/etc
//   - 采用: 左右 Grid (left About Me + Interests / right Basic Info)
//   - Services 全宽底部
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import type { CreatorAbout as CreatorAboutData } from "@/lib/creatorProfileMock";
import type { Creator } from "@/lib/types";
import CreatorServiceActions from "./CreatorServiceActions";

interface Props {
  creator: Creator;
  avatar: string;
  about: CreatorAboutData;
  age: number;
  height: number;
  profession?: string;
  slogan?: string;
  online?: boolean;
}

export default async function CreatorAbout({
  creator, avatar, about, age, height, profession, slogan, online = true,
}: Props) {
  const t  = await getTranslations("creatorProfile.about");
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

  const sectionH = "text-[11.5px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-3";

  return (
    <section className="bg-white border border-[var(--line)] rounded-[20px] p-6 md:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header — Avatar + Dynamic Title "{Name} 简介" */}
      <header className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--line)]">
        <div className="relative w-[64px] h-[64px] rounded-full overflow-hidden border-[3px] border-white bg-[var(--page)] shadow-[0_6px_20px_-8px_rgba(0,0,0,0.2)] flex-shrink-0">
          <Img src={avatar} alt={creator.name} sizes="64px" />
          {online && (
            <span
              className="absolute right-0.5 bottom-0.5 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-white"
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
      </header>

      {/* Body — 左右 Grid (spec) */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 lg:gap-10">
        {/* Left — About Me + Interests */}
        <div className="flex flex-col gap-7">
          <div>
            <h4 className={sectionH}>{t("aboutMe")}</h4>
            {slogan && (
              <p className="text-[15px] font-medium italic text-[var(--ink)] m-0 mb-3 pl-3 border-l-2 border-[var(--accent)]">
                &quot;{slogan}&quot;
              </p>
            )}
            <p className="text-[15px] leading-[1.75] text-[var(--ink2)] m-0">{about.bio}</p>
          </div>

          <div>
            <h4 className={sectionH}>{t("interests")}</h4>
            <div className="flex flex-wrap gap-2">
              {about.interests.map((i) => (
                <span key={i} className="text-[13px] font-semibold text-[var(--ink)] bg-[var(--page)] border border-[var(--line)] px-3 py-1.5 rounded-full">
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Basic Information (compact 2-col dl) */}
        <div>
          <h4 className={sectionH}>{t("basicInformation")}</h4>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 m-0">
            {basicRows.map((r) => (
              <div key={r.label} className="flex flex-col gap-0.5 min-w-0">
                <dt className="text-[11px] text-[var(--muted)] font-medium">{r.label}</dt>
                <dd className="text-[13.5px] text-[var(--ink)] font-semibold m-0 truncate">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Services 全宽 (spec: 底部 4 service card) */}
      <div className="mt-8 pt-7 border-t border-[var(--line)]">
        <h4 className={sectionH}>{t("serviceEntries")}</h4>
        <CreatorServiceActions />
      </div>
    </section>
  );
}
