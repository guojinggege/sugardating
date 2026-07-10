// Trust strip — horizontal marquee-style badges
export default function TrustStrip() {
  const items = [
    { ic: "🔞", label: "18+ 成年用户" },
    { ic: "🪪", label: "身份认证" },
    { ic: "💬", label: "站内私密聊天" },
    { ic: "🎥", label: "视频确认" },
    { ic: "🔒", label: "隐私优先" },
    { ic: "🚫", label: "举报 / 拉黑" },
    { ic: "🪙", label: "Credits 解锁" },
    { ic: "🌐", label: "多语言翻译" },
  ];
  return (
    <section className="hv-trust" aria-label="Platform trust">
      <div className="hv-trust-in">
        {items.map((it) => (
          <div key={it.label} className="hv-trust-item">
            <span aria-hidden>{it.ic}</span>
            <span>{it.label}</span>
          </div>
        ))}
      </div>
      <style>{`
        .hv-trust{background:#0F0F11;border-bottom:1px solid rgba(238,221,184,.1)}
        .hv-trust-in{max-width:1440px;margin:0 auto;padding:16px 24px;display:flex;gap:22px;overflow-x:auto;scrollbar-width:none}
        .hv-trust-in::-webkit-scrollbar{display:none}
        .hv-trust-item{display:inline-flex;align-items:center;gap:8px;flex-shrink:0;font-size:12.5px;color:rgba(238,221,184,.72);font-weight:500;letter-spacing:.01em}
        .hv-trust-item span:first-child{font-size:15px;line-height:1}
        @media (max-width:640px){.hv-trust-in{padding:14px 16px;gap:18px}.hv-trust-item{font-size:12px}}
      `}</style>
    </section>
  );
}
