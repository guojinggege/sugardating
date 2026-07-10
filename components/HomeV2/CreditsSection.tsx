// Credits / Locked Media section — dark card + feature list + CTA
import Link from "next/link";

export default function CreditsSection() {
  const points = [
    { h: "免费预览",      p: "公开照片和资料对所有登录用户可见,不需要付费" },
    { h: "私密内容解锁",  p: "部分照片和视频用 Credits 解锁,一次解锁永久可看" },
    { h: "礼物与打赏",    p: "站内虚拟礼物,提升消息优先级和 Creator 关注度" },
    { h: "隐私优先",      p: "未解锁内容原始高清 src 不会进入 DOM,防止右键保存" },
    { h: "全部站内记录",  p: "所有 Credits 消费均在钱包账本,可追溯、可举报" },
  ];
  return (
    <section className="hv-cr" aria-label="Credits and locked media">
      <div className="hv-cr-in">
        <div className="hv-cr-mock" aria-hidden>
          <div className="hv-cr-tile hv-cr-tile--locked">
            <div className="hv-cr-lock">
              <div className="hv-cr-lock-ic">🔒</div>
              <div className="hv-cr-lock-price">12 金币解锁</div>
              <div className="hv-cr-lock-cta">查看高清照片</div>
            </div>
          </div>
          <div className="hv-cr-tile hv-cr-tile--unlocked">
            <div className="hv-cr-unlocked-badge">已解锁</div>
          </div>
          <div className="hv-cr-balance">
            <div>钱包余额</div>
            <b>128 <span>Credits</span></b>
          </div>
        </div>
        <div className="hv-cr-text">
          <div className="hv-cr-eyebrow">Credits · Locked Media</div>
          <h2>用 Credits 解锁<br /><em>更完整的主页内容</em></h2>
          <p>部分照片和视频可免费浏览 · 部分内容需要 Credits 解锁。你可以先看公开资料,再决定是否继续了解。</p>
          <ul className="hv-cr-list">
            {points.map((it) => (
              <li key={it.h}><b>{it.h}</b><span>{it.p}</span></li>
            ))}
          </ul>
          <div className="hv-cr-cta">
            <Link href="/membership" className="hv-cr-btn hv-cr-btn--gold">了解 Credits</Link>
            <Link href="/male-artists" className="hv-cr-btn hv-cr-btn--ghost">浏览可解锁内容</Link>
          </div>
        </div>
      </div>
      <style>{`
        .hv-cr{background:#161618;color:#EEDDB8;padding:80px 0}
        .hv-cr-in{max-width:1280px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:1fr 1.05fr;gap:56px;align-items:center}
        .hv-cr-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .hv-cr-text h2{font-family:'Cormorant Garamond',ui-serif;font-size:44px;font-weight:500;line-height:1.15;color:#fff;margin:0 0 16px;letter-spacing:-0.015em}
        .hv-cr-text h2 em{font-style:italic;color:#B8A789}
        .hv-cr-text > p{font-size:15.5px;line-height:1.75;color:rgba(238,221,184,.75);margin:0 0 22px;max-width:52ch}
        .hv-cr-list{list-style:none;margin:0 0 28px;padding:0;display:flex;flex-direction:column;gap:10px}
        .hv-cr-list li{padding-left:16px;position:relative}
        .hv-cr-list li:before{content:"";position:absolute;left:0;top:11px;width:8px;height:1px;background:#B8A789}
        .hv-cr-list b{display:block;font-size:14px;color:#fff;font-weight:700}
        .hv-cr-list span{font-size:13px;line-height:1.6;color:rgba(238,221,184,.72)}
        .hv-cr-cta{display:flex;flex-wrap:wrap;gap:10px}
        .hv-cr-btn{padding:12px 22px;border-radius:99px;font-size:13.5px;font-weight:700;text-decoration:none;transition:transform .12s}
        .hv-cr-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}
        .hv-cr-btn--ghost{background:rgba(255,255,255,.06);border:1px solid rgba(238,221,184,.24);color:#EEDDB8}
        .hv-cr-btn:hover{transform:translateY(-1px)}
        .hv-cr-mock{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:440px;margin:0 auto}
        .hv-cr-tile{aspect-ratio:3/4;border-radius:18px;position:relative;overflow:hidden;background:#2b2620;border:1px solid rgba(238,221,184,.16)}
        .hv-cr-tile--locked{background:linear-gradient(135deg,#3a2f22 0%,#1a1409 100%)}
        .hv-cr-tile--unlocked{background:linear-gradient(135deg,#B8A789 0%,#5a4a30 100%)}
        .hv-cr-lock{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:16px;gap:6px;color:#fff}
        .hv-cr-lock-ic{font-size:36px;filter:drop-shadow(0 2px 8px rgba(0,0,0,.5))}
        .hv-cr-lock-price{font-size:15px;font-weight:700;color:#EEDDB8;margin-top:6px;text-shadow:0 1px 4px rgba(0,0,0,.5)}
        .hv-cr-lock-cta{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.72)}
        .hv-cr-unlocked-badge{position:absolute;top:12px;right:12px;padding:4px 10px;background:rgba(238,221,184,.94);color:#1a1409;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-radius:99px}
        .hv-cr-balance{grid-column:span 2;padding:18px 22px;background:rgba(238,221,184,.08);border:1px solid rgba(238,221,184,.24);border-radius:14px;display:flex;justify-content:space-between;align-items:center}
        .hv-cr-balance > div{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:rgba(238,221,184,.72)}
        .hv-cr-balance b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:32px;color:#EEDDB8;font-weight:600;letter-spacing:-0.01em}
        .hv-cr-balance b span{font-size:13px;color:rgba(238,221,184,.6);margin-left:4px;font-style:normal;font-family:'Plus Jakarta Sans',ui-sans-serif;font-weight:500}
        @media (max-width:1024px){
          .hv-cr-in{grid-template-columns:1fr;gap:36px}
          .hv-cr-mock{max-width:340px}
        }
        @media (max-width:640px){
          .hv-cr{padding:60px 0}
          .hv-cr-text h2{font-size:30px}
        }
      `}</style>
    </section>
  );
}
