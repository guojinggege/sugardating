// Directory Hero (only used at /massage index)
import Link from "next/link";
import Img from "@/components/Img";
import { pick } from "@/lib/images";

export default function MassageHero() {
  const heroImg = pick(2, 4) ?? "/images/placeholder.png";
  return (
    <section className="ms-hero">
      <div className="ms-hero-in">
        <div className="ms-hero-text">
          <div className="ms-hero-eyebrow">
            <span className="ms-hero-18">18+</span>
            Sensual Massage · Wellness Companion
          </div>
          <h1 className="ms-hero-h1">
            高端情趣按摩<br />与私密放松体验
          </h1>
          <p className="ms-hero-lead">
            浏览已认证的 18+ 按摩服务者,按城市、语言、服务方式、认证状态和在线情况筛选。
            使用站内聊天、视频介绍与预约工具建立更清晰、更安全的联系。
          </p>
          <p className="ms-hero-en">
            Premium Sensual Massage &amp; Private Relaxation Experiences.
            Browse verified 18+ providers by city, language, availability and verification.
          </p>
          <div className="ms-hero-cta">
            <Link href="/massage/london" className="ms-btn ms-btn--primary">浏览 London 按摩服务者</Link>
            <Link href="/massage/london?verified=1" className="ms-btn ms-btn--ghost">查看已认证资料</Link>
          </div>
        </div>
        <div className="ms-hero-media">
          <Img src={heroImg} alt="Sensual Massage · Wellness Companion" sizes="(max-width:900px) 100vw, 46vw" />
          <div className="ms-hero-veil" />
        </div>
      </div>
      <style>{`
        .ms-hero{background:linear-gradient(180deg,#FBFAF7 0%,#F4F4F5 100%);border-bottom:1px solid var(--line)}
        .ms-hero-in{max-width:1280px;margin:0 auto;padding:56px 24px 60px;display:grid;grid-template-columns:1.1fr 1fr;gap:48px;align-items:center}
        .ms-hero-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .ms-hero-18{background:#161618;color:#EEDDB8;padding:3px 8px;border-radius:4px;letter-spacing:.02em}
        .ms-hero-h1{font-size:42px;font-weight:700;line-height:1.15;color:#161618;letter-spacing:-0.01em;margin:0 0 18px;font-family:'Plus Jakarta Sans',ui-sans-serif}
        .ms-hero-lead{font-size:16px;line-height:1.7;color:#3d3d42;margin:0 0 12px;max-width:56ch}
        .ms-hero-en{font-size:13px;line-height:1.5;color:#8a8a92;font-style:italic;margin:0 0 26px}
        .ms-hero-cta{display:flex;flex-wrap:wrap;gap:10px}
        .ms-btn{display:inline-flex;align-items:center;padding:11px 18px;border-radius:999px;font-size:13.5px;font-weight:600;text-decoration:none;transition:transform .12s}
        .ms-btn--primary{background:#161618;color:#fff}
        .ms-btn--primary:hover{transform:translateY(-1px)}
        .ms-btn--ghost{background:#fff;color:#161618;border:1px solid #E8E8EC}
        .ms-btn--ghost:hover{border-color:#161618}
        .ms-hero-media{position:relative;aspect-ratio:5/4;border-radius:24px;overflow:hidden;background:#1a1a1c;box-shadow:0 24px 60px -30px rgba(0,0,0,.3)}
        .ms-hero-media img{width:100%;height:100%;object-fit:cover}
        .ms-hero-veil{position:absolute;inset:0;background:linear-gradient(140deg,transparent 42%,rgba(0,0,0,.32));pointer-events:none}
        @media (max-width:900px){
          .ms-hero-in{grid-template-columns:1fr;padding:36px 20px 44px;gap:28px}
          .ms-hero-h1{font-size:30px}
          .ms-hero-media{aspect-ratio:16/10}
        }
      `}</style>
    </section>
  );
}
