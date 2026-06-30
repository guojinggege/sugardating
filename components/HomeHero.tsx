"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Img from "./Img";
import Placeholder from "./Placeholder";

// 只保留 2 张:第一张是创作者发现入口,第二张直接复用 SugarGirl 频道 hero 那张图
// bgIndex 指向 photos[] 数组(lib/images.ts sort 后顺序);bgIndex=6 与 /male-artists hero 的 pick(0,6) 同图
const slides = [
  { k: "编辑精选",               h: "用镜头，留住一片风景",         p: "发现记录山海与城市的创作者,订阅他们的视角。", cta: "浏览创作者",      href: "/creators",     bgIndex: 0 },
  { k: "Sugardating · Collection", h: "精选 200 位真人优质 SugarGirl", p: "国家、城市、兴趣可筛选,按你的节奏发现。",     cta: "浏览 SugarGirl",  href: "/male-artists", bgIndex: 6 },
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
    const apply = () => {
      if (window.scrollY > 40) document.body.classList.add("nav-scrolled");
      else document.body.classList.remove("nav-scrolled");
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
            <input placeholder="搜索创作者、风格或地区…" aria-label="搜索" />
            <Link href={s.href} className="btn btn-w hh-cta">{s.cta}</Link>
          </form>
        </div>

        <div className="hh-foot">
          <div className="hh-dots" role="tablist" aria-label="切换 banner">
            {slides.map((_, idx) => (
              <button
                key={idx}
                role="tab"
                className={"hh-dot" + (idx === i ? " on" : "")}
                aria-label={`第 ${idx + 1} 张`}
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
