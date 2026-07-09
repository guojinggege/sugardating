// Journal Hero — 首页顶部 · 高级杂志感
import Link from "next/link";
import Img from "@/components/Img";
import { pick } from "@/lib/images";

export default function JournalHero() {
  const heroImg = pick(1, 2) ?? "/images/placeholder.png";
  return (
    <section className="jn-hero">
      <div className="jn-hero-in">
        <div className="jn-hero-text">
          <div className="jn-hero-eyebrow">Sugardating Journal</div>
          <h1 className="jn-hero-h1">
            高端男性关系、伦敦生活方式<br />与隐私社交指南
          </h1>
          <p className="jn-hero-lead">
            围绕高端关系、亚洲与东南亚文化、伦敦生活方式、隐私安全、健身恢复、
            商务旅行和平台使用策略,为成熟用户提供更清晰、更安全、更高效的社交参考。
          </p>
          <p className="jn-hero-en">
            Relationships, Lifestyle, Wellness and Privacy for High-Value Men in London.
          </p>
          <div className="jn-hero-cta">
            <Link href="#latest" className="jn-btn jn-btn--primary">浏览最新文章</Link>
            <Link href="/male-artists" className="jn-btn jn-btn--ghost">查看 London Sugargirls</Link>
            <Link href="/membership" className="jn-btn jn-btn--ghost">了解 Premium</Link>
          </div>
        </div>
        <div className="jn-hero-media">
          <Img src={heroImg} alt="Sugardating Journal · London Elite Lifestyle" sizes="(max-width:900px) 100vw, 44vw" />
          <div className="jn-hero-media-veil" />
        </div>
      </div>
      <style>{`
        .jn-hero{background:linear-gradient(180deg,#FBFAF7 0%,#F4F4F5 100%);border-bottom:1px solid var(--line)}
        .jn-hero-in{max-width:1240px;margin:0 auto;padding:56px 24px 64px;display:grid;grid-template-columns:1.15fr 1fr;gap:48px;align-items:center}
        .jn-hero-eyebrow{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .jn-hero-h1{font-size:44px;font-weight:700;line-height:1.15;color:#161618;letter-spacing:-0.01em;margin:0 0 18px;font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui}
        .jn-hero-lead{font-size:16.5px;line-height:1.7;color:#3d3d42;margin:0 0 12px;max-width:56ch}
        .jn-hero-en{font-size:13px;line-height:1.5;color:#8a8a92;font-style:italic;margin:0 0 26px;letter-spacing:.01em}
        .jn-hero-cta{display:flex;gap:10px;flex-wrap:wrap}
        .jn-btn{display:inline-flex;align-items:center;justify-content:center;padding:11px 18px;border-radius:999px;font-size:13.5px;font-weight:600;text-decoration:none;transition:transform .12s,opacity .12s,box-shadow .12s}
        .jn-btn--primary{background:#161618;color:#fff}
        .jn-btn--primary:hover{transform:translateY(-1px);box-shadow:0 10px 24px -12px rgba(0,0,0,.4)}
        .jn-btn--ghost{background:#fff;color:#161618;border:1px solid #E8E8EC}
        .jn-btn--ghost:hover{border-color:#161618}
        .jn-hero-media{position:relative;aspect-ratio:5/4;border-radius:24px;overflow:hidden;background:#1a1a1c;box-shadow:0 24px 64px -32px rgba(0,0,0,.35)}
        .jn-hero-media img{width:100%;height:100%;object-fit:cover;display:block}
        .jn-hero-media-veil{position:absolute;inset:0;background:linear-gradient(140deg,transparent 40%,rgba(0,0,0,.28));pointer-events:none}
        @media (max-width:900px){
          .jn-hero-in{grid-template-columns:1fr;padding:40px 20px 48px;gap:32px}
          .jn-hero-h1{font-size:32px}
          .jn-hero-lead{font-size:15px}
          .jn-hero-media{aspect-ratio:16/10}
        }
      `}</style>
    </section>
  );
}
