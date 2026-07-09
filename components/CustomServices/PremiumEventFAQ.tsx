// FAQ
export default function PremiumEventFAQ() {
  const qs = [
    { q: "定制服务和普通浏览有什么区别?", a: "普通浏览是你自己搜索和联系 sugargirl。定制服务是你提交场景需求(游艇派对、酒会、拍摄、商务伴游、俱乐部之夜),平台根据活动属性、语言、气质与在线情况为你推荐 3-5 位候选,减少无效沟通。" },
    { q: "提交需求后多久收到推荐?", a: "常见场景 12-24 小时内。伦敦城市中心 + 认证 sugargirl 覆盖率较高;需要特定语言、特定风格或非工作日的场景可能需要更长时间。" },
    { q: "推荐结果不满意怎么办?", a: "你可以在需求下补充说明或重新提交。任何一次推荐都不构成承诺。所有沟通建议先通过站内聊天与视频确认。" },
    { q: "预算是强制的吗?", a: "不。示例预算仅供参考。实际由双方在站内沟通中确认;平台不撮合线下交易,不为任何线下付款背书。" },
    { q: "隐私如何保护?", a: "站内聊天与视频不会暴露真实号码。资料默认对已登录用户可见。任何要求站外付款、微信或加密货币的对方,请立即使用站内举报工具。" },
    { q: "未登录可以提交吗?", a: "可以,但建议注册或登录后再提交 — 便于接收推荐通知、查看沟通记录和保持隐私账本。" },
    { q: "平台会撮合线下交易吗?", a: "不。Sugardating 不撮合任何形式的线下面对面交易,不作为中介,不背书任何线下行为。平台只提供发现、沟通与工具。" },
  ];
  return (
    <section className="cs-faq" aria-label="Frequently asked questions">
      <div className="cs-faq-in">
        <div className="cs-faq-head">
          <div className="cs-faq-eyebrow">FAQ</div>
          <h2>关于定制服务</h2>
        </div>
        <div className="cs-faq-list">
          {qs.map((it, i) => (
            <details key={i} className="cs-faq-item">
              <summary>{it.q}</summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
      <style>{`
        .cs-faq{background:#fff;padding:72px 0}
        .cs-faq-in{max-width:900px;margin:0 auto;padding:0 24px}
        .cs-faq-head{margin-bottom:24px}
        .cs-faq-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:12px}
        .cs-faq-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:32px;font-style:italic;font-weight:500;color:#161618;margin:0;letter-spacing:-0.01em}
        .cs-faq-list{display:flex;flex-direction:column}
        .cs-faq-item{border-bottom:1px solid var(--line);padding:18px 0}
        .cs-faq-item:last-child{border-bottom:0}
        .cs-faq-item summary{cursor:pointer;font-size:15.5px;font-weight:700;color:#161618;list-style:none;padding-right:28px;position:relative;letter-spacing:-0.003em}
        .cs-faq-item summary::-webkit-details-marker{display:none}
        .cs-faq-item summary::after{content:"+";position:absolute;right:0;top:-2px;font-size:22px;color:#B8A789;line-height:1;font-weight:400}
        .cs-faq-item[open] summary::after{content:"−"}
        .cs-faq-item p{margin:12px 0 0;font-size:14.5px;line-height:1.75;color:#3d3d42;max-width:70ch}
        @media (max-width:640px){.cs-faq{padding:56px 0}}
      `}</style>
    </section>
  );
}
