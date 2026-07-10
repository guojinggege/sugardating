// 6-step how-it-works timeline (browse → filter → chat → unlock → book → safe)
export default function HowItWorks() {
  const steps = [
    { n: "01", h: "选择频道",       p: "Sugargirl、Sugarboy、情趣按摩、定制服务或 Journal。" },
    { n: "02", h: "筛选真实资料",   p: "按城市、语言、在线状态、认证、照片、视频与服务偏好筛选。" },
    { n: "03", h: "先聊天,再决定", p: "通过站内私密聊天、多语言翻译与视频资料确认对方风格与真实感。" },
    { n: "04", h: "解锁更多内容",   p: "使用 Credits 解锁私密照片、视频或 VIP 内容,先看公开资料再决定继续。" },
    { n: "05", h: "预约或定制",     p: "选择聊天、视频、私拍、预约、活动陪同或提交定制服务需求。" },
    { n: "06", h: "保持隐私和安全", p: "使用站内沟通、认证资料、举报拉黑与安全规则,降低风险。" },
  ];
  return (
    <section className="hv-how" aria-label="How Sugardating works">
      <div className="hv-how-in">
        <div className="hv-how-head">
          <div className="hv-how-eyebrow">Efficient · Verified · Private</div>
          <h2>从浏览到真实连接<em> · 只需几步</em></h2>
          <p>不是无止境浏览,而是清晰的路径 — 帮你把时间花在对的对话上。</p>
        </div>
        <ol className="hv-how-steps">
          {steps.map((s) => (
            <li key={s.n} className="hv-how-step">
              <div className="hv-how-n">{s.n}</div>
              <h4>{s.h}</h4>
              <p>{s.p}</p>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        .hv-how{background:#fff;padding:80px 0;border-bottom:1px solid var(--line)}
        .hv-how-in{max-width:1280px;margin:0 auto;padding:0 24px}
        .hv-how-head{max-width:64ch;margin:0 auto 44px;text-align:center}
        .hv-how-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .hv-how-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:40px;font-weight:500;line-height:1.2;color:#161618;margin:0 0 12px;letter-spacing:-0.01em}
        .hv-how-head h2 em{font-style:italic;color:#B8A789}
        .hv-how-head p{font-size:15.5px;line-height:1.75;color:#3d3d42;margin:0}
        .hv-how-steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .hv-how-step{padding:26px 24px;background:#FBFAF7;border:1px solid #EEE9DC;border-radius:20px;transition:transform .12s,border-color .12s,box-shadow .12s}
        .hv-how-step:hover{transform:translateY(-2px);border-color:#B8A789;box-shadow:0 20px 40px -22px rgba(0,0,0,.15)}
        .hv-how-n{font-family:'Cormorant Garamond',ui-serif;font-size:34px;font-style:italic;font-weight:500;color:#B8A789;line-height:1;margin-bottom:14px}
        .hv-how-step h4{font-size:16px;font-weight:700;color:#161618;margin:0 0 6px;letter-spacing:-0.005em}
        .hv-how-step p{font-size:13.5px;line-height:1.7;color:#5a5a62;margin:0}
        @media (max-width:1024px){.hv-how-steps{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:640px){
          .hv-how{padding:60px 0}
          .hv-how-head h2{font-size:28px}
          .hv-how-steps{grid-template-columns:1fr}
        }
      `}</style>
    </section>
  );
}
