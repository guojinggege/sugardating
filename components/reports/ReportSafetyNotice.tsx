export default function ReportSafetyNotice() {
  return (
    <div className="rsn">
      <div className="rsn-h">
        <span aria-hidden className="rsn-ic">⛨</span>
        <b>你的安全值得被认真对待</b>
      </div>
      <p>
        如果你在线上沟通、预约或线下接触中遇到诈骗、骚扰、隐私泄露、威胁、强迫、资料不实
        或其他安全问题,可以通过这里向平台举报。举报内容仅供授权的安全审核人员处理。
      </p>
      <p className="rsn-em">
        如你正处于即时人身危险中,请优先联系当地紧急服务或可信赖的人 ·
        平台举报不能替代紧急援助。
      </p>
      <style>{`
        .rsn{background:linear-gradient(135deg,#FBF7EF,#F4EEDF);border:1px solid #EEE0C4;border-radius:16px;padding:18px 20px;display:flex;flex-direction:column;gap:8px}
        .rsn-h{display:flex;align-items:center;gap:8px}
        .rsn-h b{font-size:14px;color:#171512;font-weight:800;letter-spacing:-0.005em}
        .rsn-ic{width:22px;height:22px;background:#B77945;color:#fff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800}
        .rsn p{font-size:13px;line-height:1.7;color:#3d3a35;margin:0}
        .rsn-em{color:#7A4C27;background:rgba(183,121,69,.08);padding:8px 12px;border-radius:8px;font-size:12.5px}
      `}</style>
    </div>
  );
}
