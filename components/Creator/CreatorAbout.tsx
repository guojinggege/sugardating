// Creator Introduction — Refactor
// spec §结构:
//   Header: avatar + {Name} 简介 + @slug
//   Body Grid: Left 65% (Bio → Basic Info → Lifestyle → Interests) / Right 35% (Services 2x2)
//   Mobile: 单列,Services 移到 Bio 之后 (spec §八转化路径)
// Basic Info + Lifestyle 使用圆角信息条 (InfoPill),不带编辑按钮
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import type { CreatorAbout as CreatorAboutData } from "@/lib/creatorProfileMock";
import type { Creator } from "@/lib/types";
import CreatorServiceActions from "./CreatorServiceActions";
import CreatorBio from "./CreatorBio";

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

type Row = { icon: React.ReactNode; label: string; value: React.ReactNode };

// ─── Icons — minimal lucide-style 14px stroked ──────────────────
const Ic = {
  cake:      <path d="M4 21V10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11M4 15h16M12 8V3M8 3v5M16 3v5" />,
  ruler:     <path d="M3 8h18v8H3zM7 8v3M11 8v4M15 8v3M19 8v4" />,
  scale:     <path d="M12 3v18M4 8h16M8 20h8M6 8l-2 6a4 4 0 0 0 8 0l-2-6M18 8l-2 6a4 4 0 0 0 8 0l-2-6" />,
  body:      <><circle cx="12" cy="4" r="2" /><path d="M12 6v6M9 12h6M8 22l4-10 4 10M8 22l1-5M16 22l-1-5" /></>,
  palette:   <><circle cx="12" cy="12" r="9" /><circle cx="8" cy="10" r="1" /><circle cx="12" cy="7" r="1" /><circle cx="16" cy="10" r="1" /><path d="M13 21c-1 0-1-1 0-2s1-2 0-2c-2 0-3 1-3 3" /></>,
  scissors:  <><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><path d="M8 8l12 12M8 16l12-12" /></>,
  eye:       <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></>,
  pin:       <><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  globe:     <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></>,
  chat:      <path d="M4 5h16v11H8l-4 4z" />,
  cap:       <><path d="M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></>,
  star:      <path d="M12 3l2.5 6 6.5.6-5 4.5 1.5 6.5L12 17l-5.5 3.6L8 14.1l-5-4.5 6.5-.6z" />,
  drop:      <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />,
  cal:       <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
  smoke:     <><path d="M17 15h2a3 3 0 0 0 0-6 4 4 0 0 0-8 0" /><path d="M2 18h16v2H2z" /></>,
  wine:      <><path d="M8 3h8l-1 8a3 3 0 0 1-6 0z" /><path d="M12 11v8M9 21h6" /></>,
  leaf:      <path d="M4 20c8 0 15-7 15-15 0 8-7 15-15 15zM4 20c8-8 15-8 15-15" />,
  moon:      <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11z" />,
  dumbbell:  <path d="M4 9v6M8 6v12M16 6v12M20 9v6M8 12h8" />,
  plane:     <path d="M14 3l-3 9-9 3 6 3 3 6 3-9 9-3z" />,
  coffee:    <><path d="M4 8h13v6a5 5 0 0 1-10 0V8z" /><path d="M17 10h2a2 2 0 0 1 0 4h-2M4 20h13" /></>,
};

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function InfoPill({ icon, label, value }: Row) {
  return (
    <div className="flex items-center gap-2.5 h-[54px] px-4 rounded-[16px] bg-white border border-[var(--line)] shadow-[0_1px_2px_rgba(0,0,0,0.02)] min-w-0 hover:border-[var(--line2)] transition-colors">
      <span className="text-[var(--muted)] flex-shrink-0" aria-hidden>
        <Svg>{icon}</Svg>
      </span>
      <span className="text-[12px] text-[var(--muted)] whitespace-nowrap flex-shrink-0">{label}</span>
      <span className="ml-auto text-[13px] text-[var(--ink)] font-semibold truncate">{value}</span>
    </div>
  );
}

export default async function CreatorAbout({
  creator, avatar, about, age, height, profession, slogan, online = true,
}: Props) {
  const t  = await getTranslations("creatorProfile.about");
  const tB = await getTranslations("creatorProfile.basicInfo");
  const tL = await getTranslations("creatorProfile.lifestyle");
  const tS = await getTranslations("creatorProfile.status");

  // 数据动态读取;空值 fallback 到 "—" (spec §十一)
  const dash = "—";
  const basicRows: Row[] = [
    { icon: Ic.cake,      label: tB("age"),          value: age ? `${age} 岁` : dash },
    { icon: Ic.ruler,     label: tB("height"),       value: height ? `${height} cm` : dash },
    { icon: Ic.scale,     label: tB("weight"),       value: about.weight ? `${about.weight} kg` : dash },
    { icon: Ic.body,      label: tB("bodyType"),     value: about.bodyType || dash },
    { icon: Ic.palette,   label: tB("skinTone"),     value: about.skinTone || dash },
    { icon: Ic.scissors,  label: tB("hairColor"),    value: about.hairColor || dash },
    { icon: Ic.eye,       label: tB("eyeColor"),     value: about.eyeColor || dash },
    { icon: Ic.briefcase, label: tB("profession"),   value: profession || dash },
    { icon: Ic.pin,       label: tB("city"),         value: about.city || dash },
    { icon: Ic.globe,     label: tB("birthCountry"), value: about.birthCountry || dash },
    { icon: Ic.chat,      label: tB("languages"),    value: about.languages?.length ? about.languages.join(" / ") : dash },
    { icon: Ic.cap,       label: tB("education"),    value: about.education || dash },
    { icon: Ic.star,      label: tB("zodiac"),       value: about.zodiac || dash },
    { icon: Ic.drop,      label: tB("bloodType"),    value: about.bloodType ? `${about.bloodType} 型` : dash },
    { icon: Ic.cal,       label: tB("joinedAt"),     value: about.joinedAt || dash },
  ];

  const ls = about.lifestyle;
  const lifestyleRows: Row[] = [
    { icon: Ic.smoke,    label: tL("smoking"),    value: ls?.smoking    || dash },
    { icon: Ic.wine,     label: tL("drinking"),   value: ls?.drinking   || dash },
    { icon: Ic.leaf,     label: tL("diet"),       value: ls?.diet       || dash },
    { icon: Ic.moon,     label: tL("schedule"),   value: ls?.schedule   || dash },
    { icon: Ic.dumbbell, label: tL("exercise"),   value: ls?.exercise   || dash },
    { icon: Ic.plane,    label: tL("travel"),     value: ls?.travel     || dash },
    { icon: Ic.coffee,   label: tL("datingPref"), value: ls?.datingPref || dash },
  ].filter((r) => r.value !== dash);

  const sectionH = "text-[11.5px] font-bold uppercase tracking-[.14em] text-[var(--muted)] mb-4";
  const services = <CreatorServiceActions />;

  return (
    <section className="bg-white border border-[var(--line)] rounded-[20px] p-6 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header — Avatar + Dynamic Title "{Name} 简介" */}
      <header className="flex items-center gap-3 mb-8 pb-6 border-b border-[var(--line)]">
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

      {/* Body Grid — Left 65% / Right 35% (Desktop);Mobile 单列 */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] gap-8 lg:gap-10">
        {/* ─── Left ──────────────────────────── */}
        <div className="flex flex-col gap-8 min-w-0 order-2 lg:order-1">
          {/* 个人介绍 */}
          <div>
            <h4 className={sectionH}>{t("aboutMe")}</h4>
            <CreatorBio slogan={slogan} bio={about.bio} />
          </div>

          {/* 基础资料 — 圆角信息条 2 col */}
          <div>
            <h4 className={sectionH}>{t("basicInformation")}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-3">
              {basicRows.map((r) => (
                <InfoPill key={r.label} {...r} />
              ))}
            </div>
          </div>

          {/* 生活方式 — 圆角信息条 2 col */}
          {lifestyleRows.length > 0 && (
            <div>
              <h4 className={sectionH}>{tL("title")}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-3">
                {lifestyleRows.map((r) => (
                  <InfoPill key={r.label} {...r} />
                ))}
              </div>
            </div>
          )}

          {/* 兴趣爱好 — Chip */}
          {about.interests?.length > 0 && (
            <div>
              <h4 className={sectionH}>{t("interests")}</h4>
              <div className="flex flex-wrap gap-2">
                {about.interests.map((i) => (
                  <span
                    key={i}
                    className="text-[13px] font-medium text-[var(--ink)] bg-[#F5F5F5] border border-[#EEEEEE] px-3 py-2 rounded-full leading-none"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── Right — Services (Mobile: order 1 for conversion 优先) ── */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-[156px] lg:self-start">
          <h4 className={sectionH}>{t("serviceEntries")}</h4>
          {services}
        </div>
      </div>
    </section>
  );
}
