"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Img from "./Img";
import Placeholder from "./Placeholder";

// 两张 slide,文案统一从 i18n 取
const SLIDES = [
  { key: "slide1", href: "/male-artists", bgIndex: 6 },
  { key: "slide2", href: "/register",     bgIndex: 0 },
] as const;

export default function HomeHero({ photos = [] }: { photos?: string[] }) {
  const t = useTranslations("home.hero");
  const [i, setI] = useState(0);
  const n = SLIDES.length;

  useEffect(() => {
    const tm = setInterval(() => setI((p) => (p + 1) % n), 6500);
    return () => clearInterval(tm);
  }, [n]);

  useEffect(() => {
    document.body.classList.add("home-immersive");
    let raf = 0;
    const heroEl = document.querySelector<HTMLElement>(".hh");
    const stackEl = document.querySelector<HTMLElement>(".hh-stack");
    const apply = () => {
      const y = window.scrollY;
      if (y > 40) document.body.classList.add("nav-scrolled");
      else document.body.classList.remove("nav-scrolled");
      if (stackEl && heroEl) {
        const max = heroEl.offsetHeight;
        const offset = Math.min(Math.max(y, 0), max) * 0.35;
        stackEl.style.setProperty("--parallax-y", `${offset}px`);
      }
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.body.classList.remove("home-immersive");
      document.body.classList.remove("nav-scrolled");
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const s = SLIDES[i];
  const title = t(`${s.key}.title`);
  const sub = t(`${s.key}.subtitle`);
  const eyebrow = t(`${s.key}.eyebrow`);
  const cta = t(`${s.key}.cta`);

  return (
    <section className="hh" aria-roledescription="carousel">
      <div className="hh-stack">
        {SLIDES.map((slide, idx) => {
          const photo = photos.length > 0 ? photos[slide.bgIndex % photos.length] : undefined;
          const slideTitle = t(`${slide.key}.title`);
          return (
            <div
              key={idx}
              className={"hh-slide" + (idx === i ? " on" : "")}
              aria-hidden={idx !== i}
            >
              {photo
                ? <Img src={photo} alt={slideTitle} sizes="100vw" priority={idx === 0} />
                : <Placeholder label={`Hero ${idx + 1}`} fill />}
            </div>
          );
        })}
        <div className="hh-veil" />
      </div>

      <div className="hh-inner">
        <div className="hh-cap">
          <span className="hh-eye"><i />{eyebrow}</span>
          <h1 className="hh-title">{title}</h1>
          <p className="hh-sub">{sub}</p>
          <form className="hh-search" role="search" onSubmit={(e) => e.preventDefault()}>
            <svg className="hh-mag" viewBox="0 0 24 24" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
            <input placeholder={t("searchPlaceholder")} aria-label={t("searchLabel")} />
            <Link href={s.href} className="btn btn-w hh-cta">{cta}</Link>
          </form>
        </div>

        <div className="hh-foot">
          <div className="hh-dots" role="tablist" aria-label={t("switchSlide")}>
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                role="tab"
                className={"hh-dot" + (idx === i ? " on" : "")}
                aria-label={t("slideAria", { n: idx + 1 })}
                aria-selected={idx === i}
                onClick={() => setI(idx)}
              />
            ))}
          </div>
          <div className="hh-meta">
            <span>{String(i + 1).padStart(2, "0")}</span>
            <em />
            <span>{String(n).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
