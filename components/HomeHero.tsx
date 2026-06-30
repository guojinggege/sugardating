"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Img from "./Img";
import Placeholder from "./Placeholder";

// Hero 文案 — 国际化品牌定位,英文为主
// bgIndex 指向 photos[] 数组(lib/images.ts sort 后顺序);第一张沿用 SugarGirl 同图
const slides = [
  {
    k: "Sugardating · International",
    h: "Discover Genuine Connections Across Borders",
    p: "Connecting verified Sugargirls with members worldwide through meaningful conversations, shared experiences and premium social connections.",
    cta: "Explore Sugargirls",
    href: "/male-artists",
    bgIndex: 6,
  },
  {
    k: "Sugardating · Verified",
    h: "Real People. Real Experiences.",
    p: "From elegant first meetings to long-term travel companionship — find your match across countries, time zones and interests.",
    cta: "Join Now",
    href: "/register",
    bgIndex: 0,
  },
];

export default function HomeHero({ photos = [] }: { photos?: string[] }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % n), 6500);
    return () => clearInterval(t);
  }, [n]);

  // Nav transparency on home: overlay over hero, solid after scroll.
  // body 上的 class 切换样式;Nav 组件本身保持不动。
  // scroll 事件用 rAF 节流,高频 scroll 不会反复写 DOM。
  useEffect(() => {
    document.body.classList.add("home-immersive");
    let raf = 0;
    const heroEl = document.querySelector<HTMLElement>(".hh");
    const stackEl = document.querySelector<HTMLElement>(".hh-stack");
    const apply = () => {
      const y = window.scrollY;
      if (y > 40) document.body.classList.add("nav-scrolled");
      else document.body.classList.remove("nav-scrolled");
      // Parallax: hero bg layer drifts at 0.35× scroll speed
      // 限定在 hero 自身高度内,避免 bg 飘出页面后仍然 transform 浪费 GPU
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

  const s = slides[i];

  return (
    <section className="hh" aria-roledescription="carousel">
      <div className="hh-stack">
        {slides.map((slide, idx) => {
          const photo = photos.length > 0 ? photos[slide.bgIndex % photos.length] : undefined;
          return (
            <div
              key={idx}
              className={"hh-slide" + (idx === i ? " on" : "")}
              aria-hidden={idx !== i}
            >
              {photo
                ? <Img src={photo} alt={slide.h} sizes="100vw" priority={idx === 0} />
                : <Placeholder label={`Hero 占位图 ${idx + 1}\n（上线替换为授权素材）`} fill />}
            </div>
          );
        })}
        <div className="hh-veil" />
      </div>

      <div className="hh-inner">
        <div className="hh-cap">
          <span className="hh-eye"><i />{s.k}</span>
          <h1 className="hh-title">{s.h}</h1>
          <p className="hh-sub">{s.p}</p>
          <form className="hh-search" role="search" onSubmit={(e) => e.preventDefault()}>
            <svg className="hh-mag" viewBox="0 0 24 24" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
            <input placeholder="Search by city, interest or language…" aria-label="Search" />
            <Link href={s.href} className="btn btn-w hh-cta">{s.cta}</Link>
          </form>
        </div>

        <div className="hh-foot">
          <div className="hh-dots" role="tablist" aria-label="Switch slide">
            {slides.map((_, idx) => (
              <button
                key={idx}
                role="tab"
                className={"hh-dot" + (idx === i ? " on" : "")}
                aria-label={`Slide ${idx + 1}`}
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
