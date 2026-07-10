// Homepage Hero — cinematic full-cover with narrative CTA
import Link from "next/link";
import Img from "@/components/Img";
import { pick } from "@/lib/images";

export default function HomeHero() {
  const bg = pick(0, 5) ?? "/images/placeholder.png";
  return (
    <section className="hv-hero">
      <div className="hv-hero-bg">
        <Img src={bg} alt="Sugardating Premium Social Dating" sizes="100vw" />
        <div className="hv-hero-veil" />
      </div>
      <div className="hv-hero-in">
        <div className="hv-hero-eyebrow">
          <span className="hv-hero-18">18+</span>
          Premium Social Dating · Since 2024
        </div>
        <h1 className="hv-hero-h1">
          进入一个更高质量的<br />私密社交世界
        </h1>
        <p className="hv-hero-lead">
          在 Sugardating,你可以浏览已认证的 Sugargirls、Sugarboys 与高端服务者 —
          通过私密聊天、视频资料、金币解锁与定制服务,建立更安全、更清晰、更有质感的连接。
        </p>
        <p className="hv-hero-en">
          Verified profiles · Private in-app chat · Video introductions · Custom event matching.
        </p>
        <div className="hv-hero-cta">
          <Link href="/male-artists" className="hv-btn hv-btn--gold">浏览 Sugargirls</Link>
          <Link href="/sugarboy" className="hv-btn hv-btn--ghost">探索 Sugarboy</Link>
          <Link href="/art-services" className="hv-btn hv-btn--ghost">提交定制需求</Link>
        </div>
        <div className="hv-hero-chips">
          <Link href="/male-artists">Sugargirl</Link>
          <Link href="/sugarboy">Sugarboy</Link>
          <Link href="/massage">情趣按摩</Link>
          <Link href="/art-services">定制服务</Link>
          <Link href="/community">Sugardating Journal</Link>
          <Link href="/membership">Premium</Link>
          <Link href="/membership">Credits</Link>
        </div>
        <div className="hv-hero-badges" aria-label="Platform values">
          <span>🔞 18+ Only</span>
          <span>🪪 Verified Profiles</span>
          <span>🔒 Privacy First</span>
          <span>✨ Premium Social Dating</span>
        </div>
      </div>
      <a href="#channels" className="hv-hero-scroll" aria-label="Scroll">↓</a>

      <style>{`
        .hv-hero{position:relative;min-height:min(860px,100vh);overflow:hidden;color:#fff;isolation:isolate;display:flex;align-items:center}
        .hv-hero-bg{position:absolute;inset:0;z-index:-2}
        .hv-hero-bg img{width:100%;height:100%;object-fit:cover;object-position:center 30%;filter:saturate(.9) contrast(1.02)}
        .hv-hero-veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,12,.7) 0%,rgba(10,10,12,.28) 45%,rgba(10,10,12,.92) 100%),radial-gradient(ellipse at 30% 40%,rgba(184,167,137,.16),transparent 60%);pointer-events:none}
        .hv-hero-in{max-width:1280px;margin:0 auto;padding:120px 24px 80px;position:relative;z-index:1;width:100%}
        .hv-hero-eyebrow{display:inline-flex;align-items:center;gap:12px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#EEDDB8;font-weight:700;margin-bottom:24px}
        .hv-hero-18{background:#EEDDB8;color:#1a1409;padding:3px 8px;border-radius:4px;letter-spacing:.02em}
        .hv-hero-h1{font-family:'Cormorant Garamond','Plus Jakarta Sans',ui-serif;font-size:72px;font-weight:600;font-style:italic;letter-spacing:-0.02em;line-height:1.02;color:#fff;margin:0 0 26px;max-width:20ch;text-shadow:0 2px 24px rgba(0,0,0,.35)}
        .hv-hero-lead{font-size:19px;line-height:1.7;color:rgba(255,255,255,.94);margin:0 0 12px;max-width:62ch;font-weight:400}
        .hv-hero-en{font-size:13.5px;color:rgba(238,221,184,.72);margin:0 0 36px;font-style:italic;letter-spacing:.01em}
        .hv-hero-cta{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:32px}
        .hv-btn{display:inline-flex;align-items:center;padding:14px 28px;border-radius:999px;font-size:14px;font-weight:700;text-decoration:none;transition:transform .12s,box-shadow .12s,background .12s;letter-spacing:.01em}
        .hv-btn--gold{background:linear-gradient(135deg,#EEDDB8 0%,#D4BF95 50%,#B8A789 100%);color:#1a1409;box-shadow:0 14px 34px -12px rgba(184,167,137,.6)}
        .hv-btn--gold:hover{transform:translateY(-1px);box-shadow:0 20px 44px -14px rgba(184,167,137,.8)}
        .hv-btn--ghost{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.24);color:#fff;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
        .hv-btn--ghost:hover{background:rgba(255,255,255,.14);border-color:rgba(238,221,184,.45)}
        .hv-hero-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:22px}
        .hv-hero-chips a{padding:6px 14px;border:1px solid rgba(238,221,184,.28);border-radius:999px;font-size:12.5px;color:#EEDDB8;text-decoration:none;letter-spacing:.02em;font-weight:500;background:rgba(0,0,0,.18);backdrop-filter:blur(4px);transition:border-color .12s,background .12s}
        .hv-hero-chips a:hover{border-color:#EEDDB8;background:rgba(238,221,184,.1)}
        .hv-hero-badges{display:flex;flex-wrap:wrap;gap:16px;padding-top:22px;border-top:1px solid rgba(255,255,255,.14);font-size:12px;color:rgba(255,255,255,.72)}
        .hv-hero-badges span{display:inline-flex;align-items:center;gap:6px;font-weight:500}
        .hv-hero-scroll{position:absolute;left:50%;bottom:26px;transform:translateX(-50%);width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;font-size:18px;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.2);animation:hv-bounce 2.4s infinite}
        @keyframes hv-bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(6px)}}
        @media (max-width:900px){
          .hv-hero{min-height:640px}
          .hv-hero-in{padding:72px 20px 56px}
          .hv-hero-h1{font-size:40px;letter-spacing:-0.01em}
          .hv-hero-lead{font-size:15.5px}
          .hv-btn{padding:12px 20px;font-size:13px}
          .hv-hero-scroll{display:none}
        }
        @media (max-width:640px){
          .hv-hero-h1{font-size:32px}
          .hv-hero-cta{gap:8px}
          .hv-hero-cta .hv-btn{flex:1;justify-content:center;min-width:calc(50% - 4px)}
        }
      `}</style>
    </section>
  );
}
