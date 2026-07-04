// Mobile Home /m — 与 PC 首页同结构,mobile 优化叙事:
// 1. Hero  2. Why Choose  3. How It Works  4. Experiences  5. Featured  6. Highlights
// 7. Testimonials  8. FAQ  9. Footer CTA
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { sugarGirls } from "@/lib/sugarGirlMock";
import { pick } from "@/lib/images";

export const dynamic = "force-dynamic";

// ─── Icons ─────────────────────────────────
const IcInt = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>);
const IcVer = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z"/><path d="M9 12l2.2 2.2L15 10.5"/></svg>);
const IcMul = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 11.5z"/></svg>);
const IcPri = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>);
const IcQ = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>);
const IcCB = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16"/><path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8"/><path d="M12 4c-2.5 2.2-4 5-4 8s1.5 5.8 4 8M12 4c2.5 2.2 4 5 4 8s-1.5 5.8-4 8"/></svg>);
const IcArrow = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>);

const WHY = [
  { key: "international", Icon: IcInt },
  { key: "verified",      Icon: IcVer },
  { key: "multiple",      Icon: IcMul },
  { key: "privacy",       Icon: IcPri },
  { key: "quality",       Icon: IcQ },
  { key: "crossborder",   Icon: IcCB },
] as const;

const HOW = ["create", "browse", "start", "build"] as const;
const EXP = [
  { key: "dating",     href: "/m/creators", off: 3 },
  { key: "travel",     href: "/m/creators", off: 5 },
  { key: "shoot",      href: "/m/creators", off: 7 },
  { key: "video-chat", href: "/m/creators", off: 9 },
] as const;
const HL = [
  { key: "members",    num: "48,200+" },
  { key: "sugargirls", num: "1,860+"  },
  { key: "countries",  num: "24"      },
  { key: "daily",      num: "12,400+" },
] as const;
const TESTI = ["james", "sofia", "daniel", "yuna", "marcus", "eva"] as const;
const FAQ = ["what", "verified", "free", "privacy", "cancel", "start"] as const;

export default async function Page() {
  const t = await getTranslations("home");
  const featured = sugarGirls.filter((s) => s.featured).slice(0, 8);
  const hero = pick(0, 0) ?? "/images/placeholder.png";
  const ctaImg = pick(0, 7) ?? "/images/placeholder.png";

  return (
    <div className="flex flex-col">
      {/* ═══ 1. Hero ═══ */}
      <section className="relative h-[520px] overflow-hidden">
        <Image src={hero} alt="" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative h-full flex flex-col justify-end px-5 pb-10 text-white">
          <span className="text-[11px] font-bold uppercase tracking-[.16em] text-white/75 mb-3">
            {t("hero.slide1.eyebrow")}
          </span>
          <h1 className="text-[34px] font-extrabold leading-[1.08] tracking-[-0.02em] mb-3">
            {t("hero.slide1.title")}
          </h1>
          <p className="text-[14.5px] text-white/85 leading-[1.55] mb-6 max-w-[320px]">
            {t("hero.slide1.subtitle")}
          </p>
          <div className="flex gap-2">
            <Link href="/m/creators" className="flex-1 h-12 rounded-full bg-white text-[var(--ink)] text-[14px] font-bold grid place-items-center hover:opacity-95 transition">
              {t("hero.slide1.cta")}
            </Link>
            <Link href="/m/login" className="flex-1 h-12 rounded-full bg-white/15 backdrop-blur-md text-white text-[14px] font-semibold grid place-items-center border border-white/25 hover:bg-white/25 transition">
              登录
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 2. Why Choose ═══ */}
      <section className="mt-12 px-5">
        <SectionHeader title={t("whyChoose.title")} subtitle={t("whyChoose.subtitle")} />
        <div className="grid grid-cols-2 gap-3 mt-5">
          {WHY.map((w) => (
            <div key={w.key} className="bg-white border border-[var(--line)] rounded-2xl p-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-[var(--page)] text-[var(--accent)] mb-3">
                <w.Icon />
              </span>
              <h3 className="text-[14px] font-bold text-[var(--ink)] m-0 leading-tight">{t(`whyChoose.items.${w.key}.title`)}</h3>
              <p className="text-[12px] text-[var(--muted)] leading-[1.5] mt-1.5 m-0 line-clamp-3">{t(`whyChoose.items.${w.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 3. How It Works ═══ */}
      <section className="mt-12 px-5">
        <SectionHeader title={t("howItWorks.title")} subtitle={t("howItWorks.subtitle")} />
        <ol className="list-none m-0 p-0 flex flex-col gap-4 mt-5">
          {HOW.map((k, i) => (
            <li key={k} className="relative flex gap-4 items-start">
              <div className="flex flex-col items-center flex-shrink-0">
                <span className="grid place-items-center w-10 h-10 rounded-full bg-[var(--ink)] text-white text-[13px] font-black">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < HOW.length - 1 && (
                  <span className="w-px h-8 bg-[var(--line)] my-1" />
                )}
              </div>
              <div className="pb-4 flex-1 min-w-0">
                <h3 className="text-[15px] font-bold text-[var(--ink)] m-0 leading-tight">{t(`howItWorks.steps.${k}.title`)}</h3>
                <p className="text-[13px] text-[var(--muted)] leading-[1.6] mt-1.5 m-0">{t(`howItWorks.steps.${k}.desc`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ═══ 4. Popular Experiences — horizontal scroll ═══ */}
      <section className="mt-12">
        <div className="px-5">
          <SectionHeader title={t("experiences.title")} subtitle={t("experiences.subtitle")} />
        </div>
        <div className="flex gap-3 mt-5 px-5 overflow-x-auto scrollbar-hide pb-1 snap-x">
          {EXP.map((e) => (
            <Link
              key={e.key}
              href={e.href}
              className="flex-shrink-0 w-[260px] relative aspect-[4/5] rounded-2xl overflow-hidden bg-black snap-start"
            >
              <Image src={pick(0, e.off) ?? "/images/placeholder.png"} alt="" fill sizes="260px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-[17px] font-bold m-0 leading-tight">{t(`experiences.items.${e.key}.title`)}</h3>
                <p className="text-[12.5px] text-white/80 mt-1.5 line-clamp-2 m-0">{t(`experiences.items.${e.key}.desc`)}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-[12px] font-bold text-white">
                  {t("experiences.learnMore")} <IcArrow />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 5. Featured Sugargirls — horizontal ═══ */}
      <section className="mt-12">
        <div className="px-5 flex items-end justify-between">
          <SectionHeader title={t("featured.title")} subtitle={t("featured.subtitle")} />
          <Link href="/m/creators" className="text-[12px] font-bold text-[var(--muted)] pb-1">
            {t("featured.viewAll")} →
          </Link>
        </div>
        <div className="flex gap-3 mt-5 px-5 overflow-x-auto scrollbar-hide pb-1 snap-x">
          {featured.map((sg) => (
            <Link key={sg.id} href={`/m/creators/${sg.id}`} className="flex-shrink-0 w-[150px] snap-start">
              <div className="relative w-[150px] h-[190px] rounded-2xl overflow-hidden bg-[#F3F4F6] shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                <Image src={sg.cover} alt={sg.name} fill sizes="150px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                {sg.online && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500/90 text-white text-[9.5px] font-bold rounded-full px-1.5 py-0.5">
                    <span className="w-1 h-1 bg-white rounded-full" />Online
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <div className="text-[14px] font-bold truncate">{sg.name}</div>
                  <div className="text-[10.5px] text-white/85 truncate">{sg.city} · {sg.age}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 6. Platform Highlights — 2×2 stats ═══ */}
      <section className="mt-12 px-5">
        <SectionHeader title={t("highlights.title")} subtitle={t("highlights.subtitle")} />
        <div className="grid grid-cols-2 gap-3 mt-5">
          {HL.map((s) => (
            <div key={s.key} className="bg-white border border-[var(--line)] rounded-2xl p-4">
              <span className="text-[10.5px] font-bold uppercase tracking-[.14em] text-[var(--accent)]">
                {t(`highlights.items.${s.key}.eye`)}
              </span>
              <div className="text-[26px] font-extrabold text-[var(--ink)] mt-1 tabular-nums leading-none">
                {s.num}
              </div>
              <div className="text-[11.5px] text-[var(--muted)] mt-1.5">
                {t(`highlights.items.${s.key}.label`)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 7. Testimonials — horizontal ═══ */}
      <section className="mt-12">
        <div className="px-5">
          <SectionHeader title={t("testimonials.title")} subtitle={t("testimonials.subtitle")} />
        </div>
        <div className="flex gap-3 mt-5 px-5 overflow-x-auto scrollbar-hide pb-1 snap-x">
          {TESTI.map((k) => {
            const name = t(`testimonials.items.${k}.name`);
            return (
              <article key={k} className="flex-shrink-0 w-[280px] snap-start bg-white border border-[var(--line)] rounded-2xl p-5">
                <div className="text-[13px] text-[var(--accent)] mb-2 tracking-widest">★★★★★</div>
                <p className="text-[13.5px] text-[var(--ink2)] leading-[1.6] m-0 line-clamp-4">
                  &ldquo;{t(`testimonials.items.${k}.quote`)}&rdquo;
                </p>
                <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-[var(--line)]">
                  <div className="grid place-items-center w-9 h-9 rounded-full text-white font-bold bg-gradient-to-br from-[#7C5CFF] to-[#EC4C86]">
                    {name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[var(--ink)] truncate">{name}</div>
                    <div className="text-[11px] text-[var(--muted)] truncate">{t(`testimonials.items.${k}.location`)}</div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ═══ 8. FAQ — accordion ═══ */}
      <section className="mt-12 px-5">
        <SectionHeader title={t("faq.title")} subtitle={t("faq.subtitle")} />
        <div className="mt-5 rounded-2xl overflow-hidden border border-[var(--line)] bg-white">
          {FAQ.map((k, i) => (
            <details
              key={k}
              className={`group ${i < FAQ.length - 1 ? "border-b border-[var(--line)]" : ""}`}
              open={i === 0}
            >
              <summary className="flex items-center justify-between gap-3 px-4 py-4 cursor-pointer list-none font-semibold text-[14px] text-[var(--ink)]">
                {t(`faq.items.${k}.q`)}
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.8] shrink-0 transition-transform group-open:rotate-180"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </summary>
              <p className="px-4 pb-4 pt-0 text-[13px] text-[var(--muted)] leading-[1.65] m-0">
                {t(`faq.items.${k}.a`)}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ═══ 9. Footer CTA ═══ */}
      <section className="mt-12 mx-5">
        <div className="relative rounded-3xl overflow-hidden bg-[var(--ink)] p-6 text-white">
          <div className="absolute inset-y-0 right-0 w-2/5 opacity-70">
            <Image src={ctaImg} alt="" fill sizes="180px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-transparent to-transparent" />
          </div>
          <div className="relative max-w-[70%]">
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[.14em] text-[var(--accent)] mb-2">
              <i className="w-1 h-1 rounded-full bg-[var(--accent)]" />
              {t("bottomCta.eyebrow")}
            </span>
            <h2 className="text-[20px] font-extrabold leading-[1.15] m-0 tracking-tight">{t("bottomCta.title")}</h2>
            <p className="text-[12.5px] text-white/75 leading-[1.55] mt-2 mb-4 m-0 line-clamp-3">{t("bottomCta.desc")}</p>
            <div className="flex flex-col gap-2">
              <Link href="/m/login" className="h-11 px-4 rounded-full bg-white text-[var(--ink)] text-[13px] font-bold grid place-items-center">
                {t("bottomCta.primary")}
              </Link>
              <Link href="/m/creators" className="h-11 px-4 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[13px] font-semibold grid place-items-center">
                {t("bottomCta.secondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer bottom link */}
      <div className="mt-8 px-5 py-6 text-center border-t border-[var(--line)]">
        <Link href="/" className="text-[12px] text-[var(--muted)] hover:text-[var(--ink)] transition">
          切换到桌面版 →
        </Link>
      </div>
    </div>
  );
}

// ─── Section header helper ────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[.16em] text-[var(--accent)]">{subtitle}</div>
      <h2 className="text-[22px] font-extrabold text-[var(--ink)] tracking-tight leading-tight mt-2 m-0">{title}</h2>
    </div>
  );
}
