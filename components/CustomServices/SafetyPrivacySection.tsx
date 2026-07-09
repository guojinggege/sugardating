// Compact safety module for Custom Services
export default function SafetyPrivacySection() {
  const badges = [
    { ic: "🔞", label: "18+ Only" },
    { ic: "🪪", label: "Identity Verified" },
    { ic: "🎥", label: "Video Profile" },
    { ic: "🔒", label: "Privacy First" },
    { ic: "🚫", label: "Report & Block" },
    { ic: "🤝", label: "Safe Meet" },
  ];
  return (
    <section className="cs-safety" aria-label="Safety and privacy">
      <div className="cs-safety-in">
        <div className="cs-safety-head">
          <div className="cs-safety-eyebrow">Safety · Privacy · Trust</div>
          <h2>高端场合,更需要清晰边界和隐私保护</h2>
        </div>
        <p className="cs-safety-p">
          Sugardating 鼓励用户在确认任何线下活动前,通过站内聊天、视频资料、认证信息与
          平台记录进行初步了解。平台提供身份认证、手机认证、邮箱认证、视频认证、
          举报与拉黑机制,帮助减少无效沟通和不安全互动。
        </p>
        <p className="cs-safety-p cs-safety-en">
          Verify identity in-app · Confirm on video · Report &amp; block anytime · Never transfer money before a session.
        </p>
        <div className="cs-safety-badges">
          {badges.map((b) => (
            <span key={b.label} className="cs-safety-badge"><span aria-hidden>{b.ic}</span>{b.label}</span>
          ))}
        </div>
      </div>
      <style>{`
        .cs-safety{background:linear-gradient(135deg,#161618,#2b2620);color:#EEDDB8;padding:60px 0}
        .cs-safety-in{max-width:1280px;margin:0 auto;padding:0 24px}
        .cs-safety-head{margin-bottom:16px}
        .cs-safety-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:10px}
        .cs-safety-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:30px;font-style:italic;font-weight:500;color:#fff;margin:0;letter-spacing:-0.01em;line-height:1.25}
        .cs-safety-p{font-size:15px;line-height:1.75;color:rgba(238,221,184,.85);margin:0 0 10px;max-width:72ch}
        .cs-safety-en{color:rgba(238,221,184,.6);font-size:13px;font-style:italic;margin-bottom:20px}
        .cs-safety-badges{display:flex;flex-wrap:wrap;gap:8px}
        .cs-safety-badge{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(238,221,184,.2);border-radius:99px;font-size:12.5px;font-weight:500}
        @media (max-width:640px){
          .cs-safety{padding:48px 0}
          .cs-safety-head h2{font-size:22px}
        }
      `}</style>
    </section>
  );
}
