// 5 event scenarios (Yacht / Cocktail / Photoshoot / Business / Members Club)
import Link from "next/link";
import Img from "@/components/Img";
import { premiumEvents } from "@/lib/premium-events";

export default function EventScenarios() {
  return (
    <section className="hv-ev" aria-label="Premium event scenarios">
      <div className="hv-ev-in">
        <div className="hv-ev-head">
          <div className="hv-ev-eyebrow">Premium Event Companion</div>
          <h2>为高端场合<em> · 匹配合适的 sugargirl</em></h2>
          <p>不是随便找人陪你出席活动 — 根据场合、城市、时间、语言、风格和预算,由平台帮你缩小选择范围。</p>
        </div>
        <div className="hv-ev-grid">
          {premiumEvents.map((ev) => (
            <Link key={ev.key} href="/art-services" className="hv-ev-card">
              <div className="hv-ev-media">
                <Img src={ev.coverImage} alt={ev.titleEn} sizes="(max-width:900px) 100vw, 260px" />
                <div className="hv-ev-veil" />
              </div>
              <div className="hv-ev-body">
                <div className="hv-ev-key">{ev.titleEn}</div>
                <h3>{ev.title}</h3>
                <p>{ev.tagline}</p>
                <span className="hv-ev-cta">定制这个场景 →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .hv-ev{background:#0F0F11;color:#EEDDB8;padding:80px 0}
        .hv-ev-in{max-width:1280px;margin:0 auto;padding:0 24px}
        .hv-ev-head{max-width:64ch;margin-bottom:40px}
        .hv-ev-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .hv-ev-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:38px;font-style:italic;font-weight:500;line-height:1.2;color:#fff;margin:0 0 12px;letter-spacing:-0.01em}
        .hv-ev-head h2 em{font-style:italic;color:#B8A789}
        .hv-ev-head p{font-size:15px;line-height:1.75;color:rgba(238,221,184,.7);margin:0}
        .hv-ev-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
        .hv-ev-card{background:#181818;border:1px solid rgba(238,221,184,.12);border-radius:20px;overflow:hidden;text-decoration:none;color:inherit;display:flex;flex-direction:column;transition:transform .2s,border-color .2s}
        .hv-ev-card:hover{transform:translateY(-3px);border-color:rgba(238,221,184,.4)}
        .hv-ev-media{position:relative;aspect-ratio:4/5;overflow:hidden;background:#0a0a0c}
        .hv-ev-media img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
        .hv-ev-card:hover .hv-ev-media img{transform:scale(1.06)}
        .hv-ev-veil{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(15,15,17,.75));pointer-events:none}
        .hv-ev-body{padding:16px 18px 18px;display:flex;flex-direction:column;gap:6px;flex:1}
        .hv-ev-key{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#B8A789;font-weight:700}
        .hv-ev-body h3{font-family:'Cormorant Garamond',ui-serif;font-size:22px;font-style:italic;font-weight:500;color:#fff;margin:0;letter-spacing:-0.005em}
        .hv-ev-body p{font-size:12.5px;line-height:1.55;color:rgba(255,255,255,.72);margin:0;flex:1}
        .hv-ev-cta{margin-top:8px;font-size:12.5px;font-weight:700;color:#EEDDB8}
        @media (max-width:1024px){.hv-ev-grid{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:640px){
          .hv-ev{padding:60px 0}
          .hv-ev-head h2{font-size:26px}
          .hv-ev-grid{grid-template-columns:1fr}
        }
      `}</style>
    </section>
  );
}
