"use client";
import { useEffect, useState } from "react";
import Placeholder from "./Placeholder";

const slides = [
  { k: "编辑精选", h: "用镜头，留住一片风景", p: "发现记录山海与城市的创作者，订阅他们的视角。", cta: "浏览创作者" },
  { k: "本周聚焦", h: "从一座山的清晨开始", p: "风光、旅拍、纪实——来自亚洲各地的创作者。", cta: "查看排行榜" },
  { k: "创作者入驻", h: "把你的作品，变成收入", p: "开放主页、设置订阅、开直播，几分钟上线。", cta: "免费开通主页" },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const n = slides.length;
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n]);
  return (
    <section className="hero">
      <div className="slides" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, idx) => (
          <div className="slide" key={idx}>
            <Placeholder label={`Banner 占位图 ${idx + 1}\n（上线替换为授权素材）`} fill />
            <div className="veil" />
            <div className="cap">
              <span className="k">{s.k}</span>
              <h2>{s.h}</h2>
              <p>{s.p}</p>
              <button className="btn btn-w">{s.cta}</button>
            </div>
          </div>
        ))}
      </div>
      <button className="arrow prev" aria-label="上一张" onClick={() => setI((p) => (p - 1 + n) % n)}><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg></button>
      <button className="arrow next" aria-label="下一张" onClick={() => setI((p) => (p + 1) % n)}><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg></button>
      <div className="dots">{slides.map((_, idx) => (<button key={idx} className={idx === i ? "dot on" : "dot"} aria-label={`第 ${idx + 1} 张`} onClick={() => setI(idx)} />))}</div>
    </section>
  );
}
