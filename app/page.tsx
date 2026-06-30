import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import SectionHeader from "@/components/SectionHeader";
import Img from "@/components/Img";
import Reveal from "@/components/Reveal";
import Stat from "@/components/Stat";
import CreatorRail from "@/components/CreatorRail";
import Testimonials from "@/components/Home/Testimonials";
import FAQ from "@/components/Home/FAQ";
import { Arrow } from "@/components/icons";
import { listCreators } from "@/lib/queries";
import { photos, pick } from "@/lib/images";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

// ─── Why Choose Sugardating(6 项 — 3×2 网格,确保末行不孤立)
// 内容只在 messages/*.json,这里只留 key + 图标
const whyChooseKeys: { key: string; icon: React.ReactNode }[] = [
  {
    key: "international",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
  },
  {
    key: "verified",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" />
        <path d="M9 12l2.2 2.2L15 10.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "multiple",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 11.5a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 11.5z" />
      </svg>
    ),
  },
  {
    key: "privacy",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    ),
  },
  {
    key: "quality",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
  },
  {
    key: "crossborder",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 12h16" />
        <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8" />
        <path d="M12 4c-2.5 2.2-4 5-4 8s1.5 5.8 4 8M12 4c2.5 2.2 4 5 4 8s-1.5 5.8-4 8" />
      </svg>
    ),
  },
];

const howKeys = ["create", "browse", "start", "build"] as const;

const expKeys = [
  { key: "dating",     href: "/art-services#dating" },
  { key: "travel",     href: "/art-services#travel" },
  { key: "shoot",      href: "/art-services#shoot" },
  { key: "video-chat", href: "/art-services#video-chat" },
] as const;

const highlightKeys = [
  { key: "members",    num: "48,200+" },
  { key: "sugargirls", num: "1,860+" },
  { key: "countries",  num: "24" },
  { key: "daily",      num: "12,400+" },
] as const;

export default async function Home() {
  const [creators, t] = await Promise.all([listCreators(), getTranslations("home")]);

  return (
    <>
      <HomeHero photos={photos} />
      <div className="container">

        {/* 1. Why Choose Sugardating */}
        <section className="sec">
          <Reveal>
            <SectionHeader title={t("whyChoose.title")} count={t("whyChoose.subtitle")} />
          </Reveal>
          <div className="why">
            {whyChooseKeys.map((w, i) => (
              <Reveal key={w.key} delay={i * 80}>
                <div className="wy">
                  <div className="wy-ic">{w.icon}</div>
                  <h3>{t(`whyChoose.items.${w.key}.title`)}</h3>
                  <p>{t(`whyChoose.items.${w.key}.desc`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 2. How It Works */}
        <section className="sec">
          <Reveal>
            <SectionHeader title={t("howItWorks.title")} count={t("howItWorks.subtitle")} />
          </Reveal>
          <div className="steps">
            {howKeys.map((k, i) => (
              <Reveal key={k} delay={i * 80}>
                <div className="step">
                  <div className="step-n">{String(i + 1).padStart(2, "0")}</div>
                  <h3>{t(`howItWorks.steps.${k}.title`)}</h3>
                  <p>{t(`howItWorks.steps.${k}.desc`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 3. Popular Experiences */}
        <section className="sec">
          <Reveal>
            <SectionHeader title={t("experiences.title")} count={t("experiences.subtitle")} />
          </Reveal>
          <div className="ctype">
            {expKeys.map((e, i) => (
              <Reveal key={e.key} delay={i * 80}>
                <Link href={e.href} className="ct">
                  <Img src={pick(i, 5)!} alt={t(`experiences.items.${e.key}.title`)} sizes="(max-width: 860px) 50vw, 25vw" />
                  <div className="gr" />
                  <div className="info">
                    <h3>{t(`experiences.items.${e.key}.title`)}</h3>
                    <p>{t(`experiences.items.${e.key}.desc`)}</p>
                    <span className="go">{t("experiences.learnMore")} <Arrow /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 4. Featured Sugargirls */}
        <section className="sec">
          <Reveal>
            <SectionHeader
              title={t("featured.title")}
              count={t("featured.subtitle")}
              moreHref="/male-artists"
              moreText={t("featured.viewAll")}
            />
          </Reveal>
          <Reveal>
            <CreatorRail items={creators} photos={photos} />
          </Reveal>
        </section>

        {/* 5. Platform Highlights */}
        <section className="sec">
          <Reveal>
            <SectionHeader title={t("highlights.title")} count={t("highlights.subtitle")} />
          </Reveal>
          <Reveal>
            <div className="stats">
              {highlightKeys.map((s) => (
                <div key={s.key} className="sv">
                  <span className="accent">{t(`highlights.items.${s.key}.eye`)}</span>
                  <b><Stat value={s.num} /></b>
                  <span>{t(`highlights.items.${s.key}.label`)}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* 6. Testimonials */}
        <section className="sec">
          <Reveal>
            <SectionHeader title={t("testimonials.title")} count={t("testimonials.subtitle")} />
          </Reveal>
          <Reveal>
            <Testimonials />
          </Reveal>
        </section>

        {/* 7. FAQ */}
        <section className="sec">
          <Reveal>
            <SectionHeader title={t("faq.title")} count={t("faq.subtitle")} />
          </Reveal>
          <Reveal>
            <FAQ />
          </Reveal>
        </section>

        {/* 8. Footer CTA */}
        <section className="sec">
          <Reveal>
            <div className="banner">
              <div className="bn-l">
                <span className="bn-eye"><i />{t("bottomCta.eyebrow")}</span>
                <h2>{t("bottomCta.title")}</h2>
                <p>{t("bottomCta.desc")}</p>
                <div className="bn-acts">
                  <Link href="/register" className="btn btn-w">{t("bottomCta.primary")}</Link>
                  <Link href="/male-artists" className="btn btn-g">{t("bottomCta.secondary")}</Link>
                </div>
              </div>
              <div className="bn-r">
                <Img src={pick(0, 7)!} alt={t("bottomCta.imageAlt")} sizes="(max-width: 860px) 100vw, 320px" />
              </div>
            </div>
          </Reveal>
        </section>

        <div style={{ height: 80 }} />
      </div>
    </>
  );
}
