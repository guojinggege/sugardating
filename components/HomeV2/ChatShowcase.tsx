// Private chat + translation showcase — mockup UI + feature list
export default function ChatShowcase() {
  const features = [
    { ic: "💬", h: "私密聊天",       p: "WhatsApp / Telegram 风格 · 站内闭环 · 不需要真实手机号" },
    { ic: "🌐", h: "多语言翻译",     p: "中文 · English · ไทย · Tiếng Việt · Filipino 之间自动翻译" },
    { ic: "🎥", h: "视频确认",       p: "预约前在站内视频通话 · 减少 90% 无效沟通" },
    { ic: "⚡", h: "快捷开场白",     p: "5 种语言预设开场,不用从零想第一句话" },
    { ic: "🚫", h: "举报 / 拉黑",   p: "任何一条消息都可举报,风控团队 24h 复核" },
    { ic: "🔒", h: "隐私优先",       p: "不需要交换 WhatsApp / 微信 / 支付方式即可深入沟通" },
  ];
  return (
    <section className="hv-chat" aria-label="Private chat and translation">
      <div className="hv-chat-in">
        <div className="hv-chat-text">
          <div className="hv-chat-eyebrow">Chat · Translate · Video</div>
          <h2>先聊天<em> · 再决定</em></h2>
          <p>站内私密聊天支持 5 种语言之间的自动翻译,适合跨语言沟通 —— 也适合在预约前确认边界、风格与时间。</p>
          <ul className="hv-chat-list">
            {features.map((f) => (
              <li key={f.h}>
                <span className="hv-chat-ic" aria-hidden>{f.ic}</span>
                <div>
                  <b>{f.h}</b>
                  <span>{f.p}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="hv-chat-mock" aria-hidden>
          <div className="hv-chat-mock-frame">
            <div className="hv-chat-mock-head">
              <div className="hv-chat-mock-avatar">M</div>
              <div>
                <div className="hv-chat-mock-name">Mira <span className="hv-chat-mock-dot" /></div>
                <div className="hv-chat-mock-status">在线 · ZH</div>
              </div>
            </div>
            <div className="hv-chat-mock-body">
              <div className="hv-chat-mock-bubble hv-chat-mock-bubble--other">
                <p>Hi, thanks for reaching out.</p>
                <div className="hv-chat-mock-tr">
                  <span>中文 · 翻译</span>
                  <p>你好,谢谢关注。</p>
                </div>
              </div>
              <div className="hv-chat-mock-bubble hv-chat-mock-bubble--me">
                <p>看到你的主页,想约一次周五的高端酒会。</p>
                <span className="hv-chat-mock-time">14:22 ✓✓</span>
              </div>
              <div className="hv-chat-mock-bubble hv-chat-mock-bubble--other">
                <p>Sure — let's video first to align style and timing.</p>
              </div>
            </div>
            <div className="hv-chat-mock-input">
              <span>🌐 → EN</span>
              <div className="hv-chat-mock-ph">输入消息…</div>
              <button aria-label="send">↑</button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .hv-chat{background:#FBFAF7;padding:80px 0}
        .hv-chat-in{max-width:1280px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:1.05fr 1fr;gap:56px;align-items:center}
        .hv-chat-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .hv-chat-text h2{font-family:'Cormorant Garamond',ui-serif;font-size:44px;font-weight:500;line-height:1.15;color:#161618;margin:0 0 16px;letter-spacing:-0.015em}
        .hv-chat-text h2 em{font-style:italic;color:#B8A789}
        .hv-chat-text > p{font-size:15.5px;line-height:1.75;color:#3d3d42;margin:0 0 28px;max-width:52ch}
        .hv-chat-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .hv-chat-list li{display:flex;gap:12px;align-items:flex-start}
        .hv-chat-ic{flex-shrink:0;width:36px;height:36px;border-radius:10px;background:#161618;color:#EEDDB8;display:inline-flex;align-items:center;justify-content:center;font-size:16px}
        .hv-chat-list b{display:block;font-size:14px;color:#161618;font-weight:700;letter-spacing:-0.005em;margin-bottom:2px}
        .hv-chat-list span{font-size:12.5px;line-height:1.55;color:#5a5a62;display:block}
        .hv-chat-mock{display:flex;justify-content:center}
        .hv-chat-mock-frame{width:100%;max-width:340px;background:#F4F4F5;border-radius:28px;padding:14px;box-shadow:0 40px 80px -40px rgba(0,0,0,.35),0 20px 40px -24px rgba(0,0,0,.2);border:1px solid rgba(238,221,184,.28)}
        .hv-chat-mock-head{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#161618;color:#fff;border-radius:16px 16px 6px 6px;margin-bottom:6px}
        .hv-chat-mock-avatar{width:36px;height:36px;border-radius:50%;background:#B8A789;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:700}
        .hv-chat-mock-name{font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:6px}
        .hv-chat-mock-dot{width:8px;height:8px;background:#34C759;border-radius:50%}
        .hv-chat-mock-status{font-size:10.5px;color:rgba(255,255,255,.6)}
        .hv-chat-mock-body{padding:12px;display:flex;flex-direction:column;gap:8px;min-height:220px}
        .hv-chat-mock-bubble{max-width:80%;padding:9px 12px;border-radius:14px;font-size:13px;line-height:1.5}
        .hv-chat-mock-bubble p{margin:0}
        .hv-chat-mock-bubble--other{background:#fff;color:#161618;border-bottom-left-radius:4px;border:1px solid #E8E8EC;align-self:flex-start}
        .hv-chat-mock-bubble--me{background:#161618;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
        .hv-chat-mock-tr{margin-top:6px;padding-top:6px;border-top:1px dashed #E8E8EC;font-size:11.5px;color:#5a5a62}
        .hv-chat-mock-tr span{display:block;font-size:9.5px;color:#B8A789;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px}
        .hv-chat-mock-tr p{color:#161618}
        .hv-chat-mock-time{display:block;font-size:10px;text-align:right;color:rgba(255,255,255,.5);margin-top:4px}
        .hv-chat-mock-input{display:flex;align-items:center;gap:8px;background:#fff;border-radius:14px;padding:6px 6px 6px 12px;margin-top:6px}
        .hv-chat-mock-input > span:first-child{font-size:10.5px;background:#161618;color:#EEDDB8;padding:4px 8px;border-radius:99px;font-weight:700;letter-spacing:.02em}
        .hv-chat-mock-ph{flex:1;font-size:12px;color:#8a8a92}
        .hv-chat-mock-input button{width:32px;height:32px;border-radius:50%;background:#161618;color:#EEDDB8;border:0;font-weight:800;cursor:pointer}
        @media (max-width:1024px){
          .hv-chat-in{grid-template-columns:1fr;gap:36px}
          .hv-chat-mock{order:-1}
        }
        @media (max-width:640px){
          .hv-chat{padding:60px 0}
          .hv-chat-text h2{font-size:30px}
          .hv-chat-list{grid-template-columns:1fr}
        }
      `}</style>
    </section>
  );
}
