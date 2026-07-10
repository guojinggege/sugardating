// Premium Membership showcase
import Link from "next/link";

export default function PremiumSection() {
  const perks = [
    { ic: "∞", h: "无限畅聊",       p: "无沟通额度限制,专注对的对话" },
    { ic: "⭐", h: "优先推荐",       p: "在首页与列表页享有更高曝光" },
    { ic: "🔍", h: "更多筛选",       p: "解锁高级筛选,精准命中匹配" },
    { ic: "👁", h: "查看更多资料",  p: "阅读更多完整资料与视频" },
    { ic: "🎖", h: "Premium Badge", p: "个人资料显示 Premium 徽章" },
    { ic: "🪙", h: "Credits 优惠",  p: "月度 Credits 赠送与充值折扣" },
  ];
  return (
    <section className="hv-pm" aria-label="Premium Membership">
      <div className="hv-pm-in">
        <div className="hv-pm-head">
          <div className="hv-pm-eyebrow">Premium Membership</div>
          <h2>减少无效沟通<em> · 提升筛选效率</em></h2>
          <p>Premium 更适合希望节省时间、提高沟通效率、优先浏览高质量 profiles 的用户。</p>
        </div>
        <div className="hv-pm-grid">
          {perks.map((p) => (
            <div key={p.h} className="hv-pm-card">
              <div className="hv-pm-ic" aria-hidden>{p.ic}</div>
              <h4>{p.h}</h4>
              <p>{p.p}</p>
            </div>
          ))}
        </div>
        <div className="hv-pm-cta">
          <Link href="/membership" className="hv-pm-btn hv-pm-btn--gold">开通 Premium</Link>
          <Link href="/membership" className="hv-pm-btn hv-pm-btn--ghost">了解会员权益</Link>
        </div>
      </div>
      <style>{`
        .hv-pm{background:linear-gradient(180deg,#0F0F11 0%,#161618 100%);color:#EEDDB8;padding:80px 0}
        .hv-pm-in{max-width:1280px;margin:0 auto;padding:0 24px}
        .hv-pm-head{text-align:center;max-width:64ch;margin:0 auto 44px}
        .hv-pm-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .hv-pm-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:40px;font-weight:500;line-height:1.2;color:#fff;margin:0 0 12px;letter-spacing:-0.01em}
        .hv-pm-head h2 em{font-style:italic;color:#B8A789}
        .hv-pm-head p{font-size:15px;line-height:1.75;color:rgba(238,221,184,.72);margin:0}
        .hv-pm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:40px}
        .hv-pm-card{padding:22px 22px;background:rgba(255,255,255,.05);border:1px solid rgba(238,221,184,.16);border-radius:18px;transition:border-color .12s,transform .12s}
        .hv-pm-card:hover{border-color:rgba(238,221,184,.4);transform:translateY(-2px)}
        .hv-pm-ic{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;display:inline-flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;margin-bottom:12px}
        .hv-pm-card h4{font-size:15.5px;font-weight:700;color:#fff;margin:0 0 6px;letter-spacing:-0.005em}
        .hv-pm-card p{font-size:13px;line-height:1.65;color:rgba(238,221,184,.7);margin:0}
        .hv-pm-cta{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
        .hv-pm-btn{padding:14px 26px;border-radius:99px;font-size:14px;font-weight:700;text-decoration:none;transition:transform .12s,box-shadow .12s}
        .hv-pm-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;box-shadow:0 14px 34px -14px rgba(238,221,184,.5)}
        .hv-pm-btn--gold:hover{transform:translateY(-1px)}
        .hv-pm-btn--ghost{background:rgba(255,255,255,.05);border:1px solid rgba(238,221,184,.24);color:#EEDDB8}
        @media (max-width:1024px){.hv-pm-grid{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:640px){
          .hv-pm{padding:60px 0}
          .hv-pm-head h2{font-size:28px}
          .hv-pm-grid{grid-template-columns:1fr}
          .hv-pm-cta .hv-pm-btn{flex:1;text-align:center}
        }
      `}</style>
    </section>
  );
}
