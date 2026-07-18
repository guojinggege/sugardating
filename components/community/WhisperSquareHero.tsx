import Link from "next/link";
import CommunityModeSwitcher from "./CommunityModeSwitcher";

export default function WhisperSquareHero() {
  return (
    <section className="hero" aria-label="私语广场">
      <div className="hero-shell">
        <div className="hero-switch">
          <CommunityModeSwitcher />
        </div>
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-eyebrow">PRIVATE STORIES · REAL QUESTIONS</div>
            <h1 className="hero-h1">私语广场</h1>
            <div className="hero-sub">真实故事、匿名心事与关系问答</div>
            <p className="hero-body">
              那些不方便对熟人说的话,可以在这里被听见。<br />
              分享真实经历,提出关系问题,看看不同人的答案。
            </p>
            <div className="hero-cta">
              <Link href="/community/compose/story" className="hero-btn hero-btn--dark">
                <span aria-hidden>❦</span>
                讲一个故事
              </Link>
              <Link href="/community/compose/question" className="hero-btn hero-btn--gold">
                <span aria-hidden>?</span>
                提一个问题
              </Link>
            </div>
            <ul className="hero-tags">
              <li>支持匿名</li>
              <li>18+ 社区</li>
              <li>隐私优先</li>
              <li>尊重边界</li>
            </ul>
          </div>
          <div className="hero-right" aria-hidden>
            <div className="hero-card hero-card--story">
              <div className="hero-card-badge">情感私话</div>
              <div className="hero-card-t">在 Mayfair 的第一次晚餐很顺,回家后他却安静了一周</div>
              <div className="hero-card-meta">Mira · 46 评论</div>
            </div>
            <div className="hero-card hero-card--qa">
              <div className="hero-card-badge">问答专区</div>
              <div className="hero-card-t">第一次见面前必须先视频吗?我比较重视隐私</div>
              <div className="hero-card-meta">匿名 · 12 回答</div>
            </div>
            <div className="hero-card hero-card--anon">
              <div className="hero-card-badge">匿名投稿</div>
              <div className="hero-card-t">我在第三次约会时说"我需要更慢",他谢谢我</div>
              <div className="hero-card-meta">匿名 · 78 评论</div>
            </div>
            <div className="hero-glow" />
          </div>
        </div>
      </div>

      <style>{`
        .hero{position:relative;background:linear-gradient(180deg,#F7F4EF 0%,#FBF7EF 50%,#F7F4EF 100%);overflow:hidden;border-bottom:1px solid #E9E3DA}
        .hero:before{content:"";position:absolute;top:-40%;right:-10%;width:60%;height:120%;background:radial-gradient(closest-side,rgba(197,165,106,.18),transparent 70%);pointer-events:none}
        .hero-shell{position:relative;max-width:1380px;margin:0 auto;padding:32px 32px 56px}
        .hero-switch{margin-bottom:32px}
        .hero-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:56px;align-items:center;min-height:340px}
        .hero-left{display:flex;flex-direction:column;gap:14px}
        .hero-eyebrow{font-size:11px;letter-spacing:.24em;color:#C5A56A;font-weight:700}
        .hero-h1{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-weight:500;font-size:60px;line-height:1.02;color:#171512;letter-spacing:-0.02em;margin:2px 0 0}
        .hero-sub{font-size:18px;color:#77716A;font-weight:500;margin-top:2px}
        .hero-body{font-size:15.5px;line-height:1.75;color:#3d3a35;max-width:44ch;margin:12px 0 6px}
        .hero-cta{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
        .hero-btn{display:inline-flex;align-items:center;gap:10px;padding:14px 24px;border-radius:999px;font:inherit;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:-0.005em;transition:transform .12s,box-shadow .12s}
        .hero-btn span{width:22px;height:22px;background:rgba(255,255,255,.16);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:12px}
        .hero-btn--dark{background:#171512;color:#F5EEDD;box-shadow:0 10px 24px -14px rgba(23,21,18,.5)}
        .hero-btn--dark:hover{transform:translateY(-1px)}
        .hero-btn--gold{background:linear-gradient(135deg,#EEDDB8,#C5A56A);color:#2A1D0A;box-shadow:0 10px 24px -14px rgba(197,165,106,.55)}
        .hero-btn--gold:hover{transform:translateY(-1px)}
        .hero-btn--gold span{background:rgba(23,21,18,.14);color:#2A1D0A}
        .hero-tags{list-style:none;margin:16px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:6px;font-size:11.5px;color:#77716A}
        .hero-tags li{display:inline-flex;align-items:center;padding:3px 10px;background:rgba(255,255,255,.6);border:1px solid #E9E3DA;border-radius:999px;font-weight:600;letter-spacing:.02em}

        .hero-right{position:relative;height:340px}
        .hero-card{position:absolute;background:#fff;border:1px solid #E9E3DA;border-radius:20px;padding:18px 20px;width:78%;min-height:120px;box-shadow:0 20px 46px -20px rgba(23,21,18,.16);transition:transform .3s;display:flex;flex-direction:column;gap:6px}
        .hero-card-badge{font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;padding:2px 10px;border-radius:999px;align-self:flex-start}
        .hero-card--story .hero-card-badge{background:rgba(169,111,120,.12);color:#8C4B54}
        .hero-card--qa .hero-card-badge{background:rgba(102,122,155,.12);color:#4B5E80}
        .hero-card--anon .hero-card-badge{background:rgba(119,113,106,.14);color:#544f47}
        .hero-card-t{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:18px;line-height:1.35;color:#171512;font-weight:500;letter-spacing:-0.005em}
        .hero-card-meta{font-size:11px;color:#a19a91;margin-top:auto}
        .hero-card--story{top:0;right:0;transform:rotate(2.5deg);z-index:3}
        .hero-card--qa{top:112px;left:2%;transform:rotate(-3deg);z-index:2}
        .hero-card--anon{bottom:0;right:6%;transform:rotate(1.5deg);z-index:1;opacity:.94}
        .hero-glow{position:absolute;top:22%;right:14%;width:220px;height:220px;background:radial-gradient(closest-side,rgba(238,221,184,.55),transparent 70%);z-index:0;pointer-events:none}

        @media (max-width:1024px){
          .hero-grid{grid-template-columns:1fr;gap:32px}
          .hero-right{height:280px}
        }
        @media (max-width:640px){
          .hero-shell{padding:24px 16px 40px}
          .hero-h1{font-size:44px}
          .hero-sub{font-size:16px}
          .hero-body{font-size:14.5px}
          .hero-right{display:none}
        }
      `}</style>
    </section>
  );
}
