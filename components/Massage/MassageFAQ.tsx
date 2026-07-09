// FAQ (static, safety-first)
export default function MassageFAQ() {
  const qs = [
    {
      q: "Sugardating 的按摩频道适合谁?",
      a: "面向 18 岁以上、希望通过认证资料、视频介绍和站内沟通获得高质量私密放松体验的成年用户。所有服务者均需完成身份认证。",
    },
    {
      q: "如何判断一位服务者是真实的?",
      a: "看认证徽章、视频资料和语言风格的一致性。有 Video 徽章的资料已上传自我介绍视频 — 建议开始沟通前先看视频。",
    },
    {
      q: "预约前如何降低风险?",
      a: "通过站内视频通话确认对方,首次见面选公共场所大堂,始终使用站内聊天,预约前不做任何形式的转账。",
    },
    {
      q: "为什么必须使用站内 Credits?",
      a: "所有 Credits 消费均记录在钱包账本,可追溯、可举报。这也让平台在出现问题时能更快介入。任何要求站外付款的对方都请立刻停止沟通并使用举报工具。",
    },
    {
      q: "遇到不当行为如何举报?",
      a: "每个 Provider 主页均有举报入口,聊天窗口内也可举报单条消息。举报会由风控团队复核。",
    },
    {
      q: "平台是否撮合线下交易?",
      a: "不。Sugardating 不撮合任何形式的线下面对面交易,不作为中介,不背书任何线下行为。平台只提供发现、沟通与沟通工具。",
    },
  ];
  return (
    <section className="ms-faq" aria-label="Frequently asked questions">
      <div className="ms-faq-head">
        <h2>常见问题 · FAQ</h2>
      </div>
      <div className="ms-faq-list">
        {qs.map((it, i) => (
          <details key={i} className="ms-faq-item">
            <summary>{it.q}</summary>
            <p>{it.a}</p>
          </details>
        ))}
      </div>
      <style>{`
        .ms-faq{margin-top:24px;padding:32px 36px;background:#fff;border:1px solid var(--line);border-radius:20px}
        .ms-faq-head h2{font-size:20px;font-weight:700;color:#161618;margin:0 0 18px;letter-spacing:-0.005em}
        .ms-faq-list{display:flex;flex-direction:column}
        .ms-faq-item{border-bottom:1px solid var(--line);padding:14px 0}
        .ms-faq-item:last-child{border-bottom:0}
        .ms-faq-item summary{cursor:pointer;font-size:15px;font-weight:700;color:#161618;list-style:none;padding-right:20px;position:relative}
        .ms-faq-item summary::-webkit-details-marker{display:none}
        .ms-faq-item summary::after{content:"+";position:absolute;right:0;top:0;font-size:20px;color:#8a8a92;line-height:1}
        .ms-faq-item[open] summary::after{content:"−"}
        .ms-faq-item p{margin:10px 0 0;font-size:14px;line-height:1.7;color:#3d3d42}
        @media (max-width:640px){.ms-faq{padding:22px 20px}}
      `}</style>
    </section>
  );
}
