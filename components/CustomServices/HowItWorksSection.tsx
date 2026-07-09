// Timeline · 5 steps
export default function HowItWorksSection() {
  const steps = [
    { n: "01", h: "选择活动类型", p: "游艇派对、高端酒会、私人拍摄、商务伴游、会员俱乐部之夜。" },
    { n: "02", h: "填写活动信息", p: "城市、日期、时间、人数、着装要求、语言、预算与边界说明。" },
    { n: "03", h: "平台筛选匹配", p: "根据在线状态、认证、语言、城市、资料完整度、照片视频、服务偏好筛选。" },
    { n: "04", h: "先沟通再确认", p: "建议先通过站内聊天与视频确认风格、时间与细节。" },
    { n: "05", h: "安全完成预约", p: "全程使用站内沟通、平台记录与举报拉黑机制,不做站外付款。" },
  ];
  return (
    <section className="cs-how" aria-label="How platform matching works">
      <div className="cs-how-in">
        <div className="cs-how-head">
          <div className="cs-how-eyebrow">Platform Matching</div>
          <h2 className="cs-how-h">告诉我们你的场景 · 我们帮你缩小选择范围</h2>
          <p className="cs-how-sub">
            Platform Matching · Tell us your event, we narrow the field for you.
          </p>
        </div>
        <ol className="cs-how-timeline">
          {steps.map((s) => (
            <li key={s.n} className="cs-how-step">
              <div className="cs-how-n">{s.n}</div>
              <div>
                <h4>{s.h}</h4>
                <p>{s.p}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        .cs-how{background:#fff;padding:80px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
        .cs-how-in{max-width:1280px;margin:0 auto;padding:0 24px}
        .cs-how-head{text-align:center;max-width:64ch;margin:0 auto 48px}
        .cs-how-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .cs-how-h{font-family:'Cormorant Garamond',ui-serif;font-size:36px;font-weight:500;line-height:1.2;color:#161618;margin:0 0 8px;letter-spacing:-0.01em;font-style:italic}
        .cs-how-sub{font-size:14px;color:#8a8a92;margin:0;font-style:italic}
        .cs-how-timeline{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);gap:16px;counter-reset:steps}
        .cs-how-step{position:relative;padding:24px 20px;background:#FBFAF7;border:1px solid #EEE9DC;border-radius:18px;text-align:left;transition:transform .12s,border-color .12s}
        .cs-how-step:hover{transform:translateY(-2px);border-color:#B8A789}
        .cs-how-n{font-family:'Cormorant Garamond',ui-serif;font-size:32px;font-style:italic;font-weight:500;color:#B8A789;line-height:1;margin-bottom:12px;letter-spacing:-0.01em}
        .cs-how-step h4{font-size:15px;font-weight:700;color:#161618;margin:0 0 6px;letter-spacing:-0.005em}
        .cs-how-step p{font-size:13.5px;line-height:1.65;color:#5a5a62;margin:0}
        @media (max-width:1024px){.cs-how-timeline{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:640px){
          .cs-how{padding:60px 0}
          .cs-how-h{font-size:26px}
          .cs-how-timeline{grid-template-columns:1fr;gap:12px}
        }
      `}</style>
    </section>
  );
}
