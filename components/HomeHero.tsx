"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Placeholder from "./Placeholder";

const slides = [
  { k: "编辑精选", h: "用镜头，留住一片风景", p: "发现记录山海与城市的创作者，订阅他们的视角。", cta: "浏览创作者", href: "/creators" },
  { k: "本周聚焦", h: "从一座山的清晨开始", p: "风光、旅拍、纪实——来自亚洲各地的创作者。", cta: "查看排行榜", href: "/rankings" },
  { k: "创作者入驻", h: "把你的作品，变成可持续的收入", p: "开放主页、设置订阅、开直播，几分钟上线。", cta: "免费开通主页", href: "/register" },
];

export default function HomeHero() {
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
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={"hh-slide" + (idx === i ? " on" : "")}
            aria-hidden={idx !== i}
          >
            <Placeholder label={`Hero 占位图 ${idx + 1}\n（上线替换为授权素材）`} fill />
          </div>
        ))}
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
