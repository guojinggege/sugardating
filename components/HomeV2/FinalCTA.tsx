// Final CTA — big centered call to action
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="hv-fc" aria-label="Get started">
      <div className="hv-fc-in">
        <div className="hv-fc-eyebrow">Get Started · Free to Browse</div>
        <h2>开始你的高端<em>私密社交体验</em></h2>
        <p>浏览已认证的高质量 profiles · 使用私密聊天与视频确认 · 决定权始终在你手中。</p>
        <div className="hv-fc-cta">
          <Link href="/register" className="hv-fc-btn hv-fc-btn--gold">注册领 30 Credits</Link>
          <Link href="/male-artists" className="hv-fc-btn hv-fc-btn--ghost">先浏览资料</Link>
          <Link href="/apply" className="hv-fc-btn hv-fc-btn--ghost">申请入驻 sugargirl</Link>
        </div>
        <div className="hv-fc-fine">
          注册免费 · 无义务 · 18+ · 可随时注销
        </div>
      </div>
      <style>{`
        .hv-fc{background:radial-gradient(ellipse at center top,rgba(184,167,137,.18),transparent 60%),linear-gradient(180deg,#161618 0%,#0F0F11 100%);color:#EEDDB8;padding:96px 0;text-align:center}
        .hv-fc-in{max-width:800px;margin:0 auto;padding:0 24px}
        .hv-fc-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:18px}
        .hv-fc h2{font-family:'Cormorant Garamond',ui-serif;font-size:52px;font-weight:500;line-height:1.15;color:#fff;margin:0 0 16px;letter-spacing:-0.015em}
        .hv-fc h2 em{font-style:italic;color:#B8A789}
        .hv-fc p{font-size:16.5px;line-height:1.7;color:rgba(238,221,184,.78);margin:0 0 32px}
        .hv-fc-cta{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:18px}
        .hv-fc-btn{padding:15px 28px;border-radius:99px;font-size:14px;font-weight:700;text-decoration:none;transition:transform .12s,box-shadow .12s;letter-spacing:.01em}
        .hv-fc-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;box-shadow:0 16px 40px -14px rgba(238,221,184,.55)}
        .hv-fc-btn--gold:hover{transform:translateY(-1px)}
        .hv-fc-btn--ghost{background:rgba(255,255,255,.06);border:1px solid rgba(238,221,184,.24);color:#EEDDB8}
        .hv-fc-fine{font-size:11.5px;color:rgba(238,221,184,.5);letter-spacing:.04em}
        @media (max-width:640px){
          .hv-fc{padding:72px 0}
          .hv-fc h2{font-size:32px}
          .hv-fc p{font-size:15px}
          .hv-fc-cta .hv-fc-btn{flex:1;min-width:calc(50% - 5px);text-align:center;padding:13px 16px;font-size:13px}
        }
      `}</style>
    </section>
  );
}
