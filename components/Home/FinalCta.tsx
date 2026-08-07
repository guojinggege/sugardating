// Home 底部深色 CTA — 替换旧的 "今天就开始你的旅程" 模块
import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="fc" aria-label="Get started">
      <div className="fc-in">
        <div className="fc-eyebrow">GET STARTED · FREE TO BROWSE</div>
        <h2 className="fc-h">
          开始你的<em>高端私密社交体验</em>
        </h2>
        <p className="fc-lead">
          浏览已认证的高质量 profiles · 使用私密聊天与视频确认 · 决定权始终在你手中。
        </p>
        <div className="fc-cta">
          <Link href="/register" className="fc-btn fc-btn--gold">注册领 30 Credits</Link>
          <Link href="/male-artists" className="fc-btn fc-btn--ghost">先浏览资料</Link>
          <Link href="/apply?apply=1" className="fc-btn fc-btn--ghost">申请入驻 sugargirl</Link>
        </div>
        <div className="fc-fine">注册免费 · 无义务 · 18+ · 可随时注销</div>
      </div>
      <style>{`
        .fc{background:radial-gradient(ellipse at center top,rgba(184,167,137,.18),transparent 60%),linear-gradient(180deg,#161618 0%,#0F0F11 100%);color:#EEDDB8;padding:120px 24px;text-align:center;border-radius:24px;margin:32px 0 8px;position:relative;overflow:hidden}
        .fc:before{content:"";position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(238,221,184,.04) 1px,transparent 0);background-size:24px 24px;pointer-events:none;opacity:.6}
        .fc-in{max-width:900px;margin:0 auto;position:relative;z-index:1}
        .fc-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:18px}
        .fc-h{font-family:'Cormorant Garamond','Plus Jakarta Sans',ui-serif;font-size:52px;font-weight:500;line-height:1.15;color:#fff;margin:0 0 16px;letter-spacing:-0.015em}
        .fc-h em{font-style:italic;color:transparent;background:linear-gradient(135deg,#EEDDB8 0%,#D4BF95 45%,#B8A789 100%);-webkit-background-clip:text;background-clip:text}
        .fc-lead{font-size:16.5px;line-height:1.7;color:rgba(238,221,184,.78);margin:0 0 32px}
        .fc-cta{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:18px}
        .fc-btn{padding:15px 28px;border-radius:99px;font-size:14px;font-weight:700;text-decoration:none;transition:transform .12s,box-shadow .12s;letter-spacing:.01em;display:inline-flex;align-items:center;justify-content:center;min-height:48px}
        .fc-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;box-shadow:0 16px 40px -14px rgba(238,221,184,.55)}
        .fc-btn--gold:hover{transform:translateY(-1px);box-shadow:0 20px 48px -14px rgba(238,221,184,.7)}
        .fc-btn--ghost{background:rgba(255,255,255,.06);border:1px solid rgba(238,221,184,.24);color:#EEDDB8;backdrop-filter:blur(6px)}
        .fc-btn--ghost:hover{background:rgba(255,255,255,.12);border-color:rgba(238,221,184,.5)}
        .fc-fine{font-size:11.5px;color:rgba(238,221,184,.5);letter-spacing:.04em}
        @media (max-width:640px){
          .fc{padding:80px 20px;border-radius:20px}
          .fc-h{font-size:30px}
          .fc-lead{font-size:14.5px}
          .fc-cta{gap:8px}
          .fc-cta .fc-btn{flex:1;min-width:calc(50% - 5px);padding:13px 12px;font-size:13px}
          .fc-cta .fc-btn:last-child{flex:1 1 100%}
        }
      `}</style>
    </section>
  );
}
