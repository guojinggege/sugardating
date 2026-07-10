// Home 「先聊天,再决定」— 6 功能点 + 手机聊天 UI mockup
// 米白背景 · 香槟金强调 · 与首页现有 .container / .sec 节奏融合
export default function ChatDecision() {
  const features = [
    { ic: "💬", h: "私密聊天",     p: "WhatsApp / Telegram 风格 · 站内闭环 · 不需要真实手机号" },
    { ic: "🌐", h: "多语言翻译",   p: "中文 · English · ไทย · Tiếng Việt · Filipino 之间自动翻译" },
    { ic: "🎥", h: "视频确认",     p: "预约前可先视频沟通 · 减少无效见面" },
    { ic: "⚡", h: "快捷开场白",   p: "5 种语言预设开场 · 不用从零想第一句话" },
    { ic: "🚫", h: "举报 / 拉黑", p: "任何一条消息都可举报 · 风控团队 24h 处理" },
    { ic: "🔒", h: "隐私优先",     p: "不需要交换 WhatsApp / 微信 / 支付方式,也可以深入沟通" },
  ];
  return (
    <section className="cd" aria-label="Chat · Translate · Video">
      <div className="cd-text">
        <div className="cd-eyebrow">CHAT · TRANSLATE · VIDEO</div>
        <h2 className="cd-h">
          先聊天,<em>再决定</em>
        </h2>
        <p className="cd-lead">
          站内私密聊天支持 5 种语言之间的自动翻译,适合跨语言沟通 —
          也适合在预约前确认边界、风格与时间。
        </p>
        <ul className="cd-list">
          {features.map((f) => (
            <li key={f.h}>
              <span className="cd-ic" aria-hidden>{f.ic}</span>
              <div>
                <b>{f.h}</b>
                <span>{f.p}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="cd-mock" aria-hidden>
        <div className="cd-mock-frame">
          <div className="cd-mock-head">
            <div className="cd-mock-avatar">M</div>
            <div className="cd-mock-info">
              <div className="cd-mock-name">Mira <span className="cd-mock-online" /></div>
              <div className="cd-mock-status">在线 · ZH</div>
            </div>
          </div>
          <div className="cd-mock-body">
            <div className="cd-bubble cd-bubble--other">
              <p>Hi, thanks for reaching out.</p>
              <div className="cd-tr">
                <span>中文 · 翻译</span>
                <p>你好,谢谢关注。</p>
              </div>
            </div>
            <div className="cd-bubble cd-bubble--me">
              <p>看到你的主页,想约一次周五的高端酒会。</p>
              <span className="cd-time">14:22 ✓✓</span>
            </div>
            <div className="cd-bubble cd-bubble--other">
              <p>Sure — let&apos;s video first to align style and timing.</p>
            </div>
          </div>
          <div className="cd-mock-input">
            <span>🌐 → EN</span>
            <div className="cd-mock-ph">输入消息…</div>
            <button aria-label="send">↑</button>
          </div>
        </div>
      </div>

      <style>{`
        .cd{display:grid;grid-template-columns:1.15fr 1fr;gap:48px;align-items:center;padding:64px 0}
        .cd-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .cd-h{font-family:'Cormorant Garamond','Plus Jakarta Sans',ui-serif;font-size:44px;font-weight:500;line-height:1.15;color:#161618;margin:0 0 16px;letter-spacing:-0.015em}
        .cd-h em{font-style:italic;color:#B8A789}
        .cd-lead{font-size:15.5px;line-height:1.75;color:#3d3d42;margin:0 0 28px;max-width:52ch}
        .cd-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .cd-list li{display:flex;gap:12px;align-items:flex-start}
        .cd-ic{flex-shrink:0;width:36px;height:36px;border-radius:10px;background:#161618;color:#EEDDB8;display:inline-flex;align-items:center;justify-content:center;font-size:16px}
        .cd-list b{display:block;font-size:14px;color:#161618;font-weight:700;letter-spacing:-0.005em;margin-bottom:2px}
        .cd-list span{font-size:12.5px;line-height:1.55;color:#5a5a62;display:block}
        .cd-mock{display:flex;justify-content:center}
        .cd-mock-frame{width:100%;max-width:340px;background:#F4F4F5;border-radius:28px;padding:14px;box-shadow:0 40px 80px -40px rgba(0,0,0,.35),0 20px 40px -24px rgba(0,0,0,.2);border:1px solid rgba(238,221,184,.28);animation:cd-float 6s ease-in-out infinite}
        @keyframes cd-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .cd-mock-head{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#161618;color:#fff;border-radius:16px 16px 6px 6px;margin-bottom:6px}
        .cd-mock-avatar{width:36px;height:36px;border-radius:50%;background:#B8A789;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:700}
        .cd-mock-info{display:flex;flex-direction:column}
        .cd-mock-name{font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:6px}
        .cd-mock-online{width:8px;height:8px;background:#34C759;border-radius:50%}
        .cd-mock-status{font-size:10.5px;color:rgba(255,255,255,.6)}
        .cd-mock-body{padding:12px;display:flex;flex-direction:column;gap:8px;min-height:220px}
        .cd-bubble{max-width:80%;padding:9px 12px;border-radius:14px;font-size:13px;line-height:1.5}
        .cd-bubble p{margin:0}
        .cd-bubble--other{background:#fff;color:#161618;border-bottom-left-radius:4px;border:1px solid #E8E8EC;align-self:flex-start}
        .cd-bubble--me{background:#161618;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
        .cd-tr{margin-top:6px;padding-top:6px;border-top:1px dashed #E8E8EC;font-size:11.5px;color:#5a5a62}
        .cd-tr span{display:block;font-size:9.5px;color:#B8A789;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px}
        .cd-tr p{color:#161618}
        .cd-time{display:block;font-size:10px;text-align:right;color:rgba(255,255,255,.5);margin-top:4px}
        .cd-mock-input{display:flex;align-items:center;gap:8px;background:#fff;border-radius:14px;padding:6px 6px 6px 12px;margin-top:6px}
        .cd-mock-input > span:first-child{font-size:10.5px;background:#161618;color:#EEDDB8;padding:4px 8px;border-radius:99px;font-weight:700;letter-spacing:.02em;white-space:nowrap}
        .cd-mock-ph{flex:1;font-size:12px;color:#8a8a92}
        .cd-mock-input button{width:32px;height:32px;border-radius:50%;background:#161618;color:#EEDDB8;border:0;font-weight:800;cursor:pointer;flex-shrink:0}
        @media (max-width:900px){
          .cd{grid-template-columns:1fr;gap:36px;padding:52px 0}
          .cd-h{font-size:32px}
          .cd-list{grid-template-columns:1fr}
        }
      `}</style>
    </section>
  );
}
