// Safety & Verification — 8 icon cards
export default function SafetyGrid() {
  const items = [
    { ic: "🔞", h: "18+ Only",           p: "所有资料与用户默认 18 岁以上" },
    { ic: "🪪", h: "Identity Review",    p: "身份证件核验后才可发布资料" },
    { ic: "📱", h: "Phone Verification", p: "手机号绑定 · 反复注册被系统识别" },
    { ic: "✉️", h: "Email Verification", p: "邮箱验证 · 减少机器人账户" },
    { ic: "🎥", h: "Video Profile",      p: "自我介绍视频 · 20 秒判断真实感" },
    { ic: "🔒", h: "Privacy First",      p: "站内聊天不暴露真实手机号" },
    { ic: "🚫", h: "Report & Block",     p: "任意消息一键举报 · 24h 复核" },
    { ic: "🤝", h: "Safe Meet",          p: "公共场所大堂 · 视频预确认 · 不站外付款" },
  ];
  return (
    <section className="hv-sf" aria-label="Safety and verification">
      <div className="hv-sf-in">
        <div className="hv-sf-head">
          <div className="hv-sf-eyebrow">Safety · Verification · Trust</div>
          <h2>高端社交<em> · 安全是底线</em></h2>
          <p>Sugardating 鼓励 18+、认证资料、站内沟通、视频确认、隐私保护与举报/拉黑机制。</p>
        </div>
        <div className="hv-sf-grid">
          {items.map((it) => (
            <div key={it.h} className="hv-sf-card">
              <div className="hv-sf-ic" aria-hidden>{it.ic}</div>
              <h4>{it.h}</h4>
              <p>{it.p}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .hv-sf{background:#F4F4F5;padding:80px 0}
        .hv-sf-in{max-width:1280px;margin:0 auto;padding:0 24px}
        .hv-sf-head{max-width:64ch;margin:0 auto 40px;text-align:center}
        .hv-sf-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .hv-sf-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:40px;font-weight:500;line-height:1.2;color:#161618;margin:0 0 12px;letter-spacing:-0.01em}
        .hv-sf-head h2 em{font-style:italic;color:#B8A789}
        .hv-sf-head p{font-size:15px;line-height:1.75;color:#3d3d42;margin:0}
        .hv-sf-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .hv-sf-card{padding:24px 22px;background:#fff;border:1px solid var(--line);border-radius:18px;transition:transform .12s,border-color .12s,box-shadow .12s}
        .hv-sf-card:hover{transform:translateY(-2px);border-color:#B8A789;box-shadow:0 20px 40px -22px rgba(0,0,0,.14)}
        .hv-sf-ic{width:44px;height:44px;border-radius:12px;background:#161618;color:#EEDDB8;display:inline-flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:14px}
        .hv-sf-card h4{font-size:15px;font-weight:700;color:#161618;margin:0 0 6px;letter-spacing:-0.005em}
        .hv-sf-card p{font-size:13px;line-height:1.65;color:#5a5a62;margin:0}
        @media (max-width:1024px){.hv-sf-grid{grid-template-columns:repeat(3,1fr)}}
        @media (max-width:640px){
          .hv-sf{padding:60px 0}
          .hv-sf-head h2{font-size:28px}
          .hv-sf-grid{grid-template-columns:repeat(2,1fr);gap:10px}
          .hv-sf-card{padding:18px 16px}
        }
      `}</style>
    </section>
  );
}
