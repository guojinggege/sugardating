// About Card — 2-col label/value grid,展示核心 profile 信息
// 位置:Quick Stats 下方,Tabs 上方
import { getTranslations } from "next-intl/server";
import type { CreatorAbout as CreatorAboutData } from "@/lib/creatorProfileMock";

interface Props {
  about: CreatorAboutData;
  profession?: string;
  slogan?: string;
}

export default async function CreatorAbout({ about, profession, slogan }: Props) {
  const t = await getTranslations("creatorProfile.about");

  const rows: { label: string; value: React.ReactNode }[] = [];
  if (slogan) rows.push({ label: t("slogan"), value: <em className="not-italic font-medium text-[var(--ink)]">"{slogan}"</em> });
  rows.push({ label: t("interests"), value: <div className="flex flex-wrap gap-1.5">{about.interests.map((i) => <span key={i} className="text-[12px] font-semibold text-[var(--ink)] bg-[var(--page)] border border-[var(--line)] px-2.5 py-1 rounded-full">{i}</span>)}</div> });
  rows.push({ label: t("languages"), value: about.languages.join(" / ") });
  rows.push({ label: t("city"), value: about.city });
  if (profession) rows.push({ label: t("profession"), value: profession });
  rows.push({ label: t("frequent"), value: <div className="flex flex-wrap gap-1.5">{about.frequentCountries.map((c) => <span key={c} className="text-[12px] font-semibold text-[var(--ink)] bg-[var(--page)] border border-[var(--line)] px-2.5 py-1 rounded-full">{c}</span>)}</div> });
  rows.push({ label: t("travelPlans"), value: <ul className="m-0 p-0 list-none flex flex-col gap-1">{about.travelPlans.map((p) => <li key={p} className="text-[13.5px] text-[var(--ink)] pl-3 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-[var(--accent)]">{p}</li>)}</ul> });
  rows.push({ label: t("joinedAt"), value: about.joinedAt });

  return (
    <section className="bg-white border border-[var(--line)] rounded-[20px] p-6 md:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <details className="cr-about-details">
        <summary className="cursor-pointer list-none flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-extrabold tracking-tight text-[var(--ink)] m-0">{t("aboutCreator")}</h3>
          <span className="text-[12.5px] font-semibold text-[var(--muted)] hover:text-[var(--ink)] cr-about-toggle" />
        </summary>
        <p className="text-[15px] leading-relaxed text-[var(--ink2)] m-0 pb-5 mb-5 border-b border-[var(--line)]">{about.bio}</p>
        <dl className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-x-6 gap-y-4 m-0">
          {rows.map((r, i) => (
            <div key={i} className="contents">
              <dt className="text-[11.5px] font-bold uppercase tracking-[.14em] text-[var(--muted)] pt-1">{r.label}</dt>
              <dd className="m-0 text-[14px] text-[var(--ink)] leading-relaxed">{r.value}</dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
}
