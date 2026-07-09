// Safety / Trust section
export default function MassageSafetySection() {
  const badges = [
    { ic: "🔞", label: "18+ Only" },
    { ic: "🪪", label: "Identity Verified" },
    { ic: "📱", label: "Phone Verified" },
    { ic: "🎥", label: "Video Verified" },
    { ic: "🔒", label: "Privacy First" },
    { ic: "🚫", label: "Report & Block" },
    { ic: "🤝", label: "Safe Meet" },
  ];
  return (
    <section className="ms-safety" aria-label="Safety and trust">
      <div className="ms-safety-head">
        <div>
          <div className="ms-safety-eyebrow">Safety · Privacy · Trust</div>
          <h2 className="ms-safety-h">更安全的私密放松体验</h2>
        </div>
      </div>
      <p className="ms-safety-p">
        平台鼓励 18+ 身份认证、站内沟通、视频确认、举报与拉黑、隐私保护。
        建议在预约前先通过聊天和视频了解对方,始终避免站外付款。
      </p>
      <p className="ms-safety-p ms-safety-en">
        Sugardating encourages 18+ identity verification, in-platform communication,
        video confirmation, report &amp; block tools, and privacy-first design.
        Never transfer money before a session. Never move contact off-platform.
      </p>
      <div className="ms-safety-badges">
        {badges.map((b) => (
          <span key={b.label} className="ms-safety-badge">
            <span aria-hidden>{b.ic}</span> {b.label}
          </span>
        ))}
      </div>
      <style>{`
        .ms-safety{background:linear-gradient(135deg,#161618,#2b2620);border-radius:22px;padding:32px 36px;color:#EEDDB8;margin-top:24px}
        .ms-safety-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px}
        .ms-safety-eyebrow{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:8px}
        .ms-safety-h{font-size:22px;color:#fff;margin:0;font-weight:700;letter-spacing:-0.005em}
        .ms-safety-p{font-size:14px;line-height:1.7;color:rgba(238,221,184,.85);margin:0 0 10px;max-width:72ch}
        .ms-safety-en{color:rgba(238,221,184,.65);font-size:13px;font-style:italic;margin-bottom:18px}
        .ms-safety-badges{display:flex;flex-wrap:wrap;gap:8px}
        .ms-safety-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:rgba(255,255,255,.06);border:1px solid rgba(238,221,184,.2);border-radius:99px;font-size:12px;color:#EEDDB8;font-weight:600}
        @media (max-width:640px){
          .ms-safety{padding:24px 22px}
          .ms-safety-h{font-size:18px}
        }
      `}</style>
    </section>
  );
}
