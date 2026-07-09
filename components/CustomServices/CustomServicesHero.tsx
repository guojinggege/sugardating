// Cinematic hero — dark full-cover with champagne gold accents
import Link from "next/link";
import Img from "@/components/Img";
import { pick } from "@/lib/images";

export default function CustomServicesHero() {
  const bg = pick(4, 30) ?? "/images/placeholder.png";
  return (
    <section className="cs-hero">
      <div className="cs-hero-bg">
        <Img src={bg} alt="Premium Event Companion" sizes="100vw" />
        <div className="cs-hero-veil" />
      </div>
      <div className="cs-hero-in">
        <div className="cs-hero-eyebrow">
          <span className="cs-hero-18">18+</span>
          Premium Event Companion Service
        </div>
        <h1 className="cs-hero-h1">
          为你的高端场合<br />匹配合适的 sugargirl
        </h1>
        <p className="cs-hero-lead">
          从游艇派对到私人晚宴,从商务伴游到会员俱乐部之夜 — 告诉我们你的场景、
          城市、时间和偏好,平台将按需推荐更合适的 sugargirl。
        </p>
        <p className="cs-hero-en">
          Yacht Parties · Luxury Cocktail Nights · Private Photoshoots · Business Companions · Members' Club Evenings.
        </p>
        <div className="cs-hero-cta">
          <a href="#request" className="cs-btn cs-btn--gold">提交定制需求</a>
          <a href="#scenarios" className="cs-btn cs-btn--ghost">查看五大场景</a>
        </div>
        <div className="cs-hero-tags">
          <span>游艇派对</span>
          <span>高端酒会</span>
          <span>私人拍摄</span>
          <span>商务伴游</span>
          <span>会员俱乐部之夜</span>
        </div>
        <div className="cs-hero-badges">
          <span>🔞 18+ Only</span>
          <span>🪪 Verified Sugargirls</span>
          <span>🔒 Privacy First</span>
          <span>✨ Tailored Matching</span>
        </div>
      </div>
      <style>{`
        .cs-hero{position:relative;min-height:760px;overflow:hidden;color:#fff;isolation:isolate}
        .cs-hero-bg{position:absolute;inset:0;z-index:-2}
        .cs-hero-bg img{width:100%;height:100%;object-fit:cover;object-position:center 30%;filter:saturate(.85) contrast(.98)}
        .cs-hero-veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,12,.65) 0%,rgba(10,10,12,.35) 40%,rgba(10,10,12,.9) 100%),radial-gradient(ellipse at 30% 40%,rgba(184,167,137,.14),transparent 55%);pointer-events:none}
        .cs-hero-in{max-width:1280px;margin:0 auto;padding:120px 24px 90px;position:relative;z-index:1}
        .cs-hero-eyebrow{display:inline-flex;align-items:center;gap:12px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#EEDDB8;font-weight:700;margin-bottom:22px}
        .cs-hero-18{background:#EEDDB8;color:#1a1409;padding:3px 8px;border-radius:4px;letter-spacing:.02em}
        .cs-hero-h1{font-family:'Cormorant Garamond','Plus Jakarta Sans',ui-serif;font-size:64px;font-weight:600;font-style:italic;letter-spacing:-0.015em;line-height:1.05;color:#fff;margin:0 0 26px;max-width:20ch;text-shadow:0 2px 20px rgba(0,0,0,.35)}
        .cs-hero-lead{font-size:18px;line-height:1.7;color:rgba(255,255,255,.92);margin:0 0 10px;max-width:60ch}
        .cs-hero-en{font-size:13px;color:rgba(238,221,184,.7);margin:0 0 34px;font-style:italic;letter-spacing:.01em}
        .cs-hero-cta{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:32px}
        .cs-btn{display:inline-flex;align-items:center;padding:14px 28px;border-radius:999px;font-size:14px;font-weight:700;text-decoration:none;transition:transform .12s,box-shadow .12s,background .12s}
        .cs-btn--gold{background:linear-gradient(135deg,#EEDDB8 0%,#D4BF95 50%,#B8A789 100%);color:#1a1409;box-shadow:0 12px 32px -12px rgba(184,167,137,.6)}
        .cs-btn--gold:hover{transform:translateY(-1px);box-shadow:0 16px 40px -14px rgba(184,167,137,.75)}
        .cs-btn--ghost{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.24);color:#fff;backdrop-filter:blur(8px)}
        .cs-btn--ghost:hover{background:rgba(255,255,255,.14);border-color:rgba(238,221,184,.5)}
        .cs-hero-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
        .cs-hero-tags span{padding:6px 14px;border:1px solid rgba(238,221,184,.3);border-radius:99px;font-size:12.5px;color:#EEDDB8;letter-spacing:.02em;font-weight:500;backdrop-filter:blur(4px);background:rgba(0,0,0,.15)}
        .cs-hero-badges{display:flex;flex-wrap:wrap;gap:14px;padding-top:22px;border-top:1px solid rgba(255,255,255,.14);font-size:12px;color:rgba(255,255,255,.75)}
        .cs-hero-badges span{display:inline-flex;align-items:center;gap:6px;font-weight:500}
        @media (max-width:900px){
          .cs-hero{min-height:640px}
          .cs-hero-in{padding:80px 20px 60px}
          .cs-hero-h1{font-size:40px}
          .cs-hero-lead{font-size:16px}
        }
        @media (max-width:640px){
          .cs-hero-h1{font-size:32px}
        }
      `}</style>
    </section>
  );
}
