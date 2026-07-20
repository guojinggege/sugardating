import type { ReportAction } from "@/lib/reports/types";

const KIND_LABEL: Record<string, string> = {
  acknowledge:      "已收到",
  request_evidence: "要求补充材料",
  internal_note:    "内部备注",
  reply:            "回复",
  resolve:          "已处理",
  dismiss:          "已驳回",
  escalate:         "已上报",
};

function fmt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("zh-CN", { hour12: false, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function ReportStatusTimeline({ actions }: { actions: ReportAction[] }) {
  return (
    <ol className="tl">
      {actions.map((a) => (
        <li key={a.id} className={"tl-item" + (a.kind === "internal_note" ? " is-internal" : "")}>
          <span className={"tl-dot tl-dot--" + a.kind} />
          <div className="tl-body">
            <div className="tl-h">
              <b>{KIND_LABEL[a.kind] ?? a.kind}</b>
              <span>· {a.actorName || (a.actorRole === "user" ? "你" : "S&T 团队")}</span>
              {a.kind === "internal_note" && <span className="tl-int">内部</span>}
              <time>{fmt(a.createdAt)}</time>
            </div>
            {a.message && <p className="tl-msg">{a.message}</p>}
          </div>
        </li>
      ))}
      <style>{`
        .tl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px;position:relative}
        .tl:before{content:"";position:absolute;left:9px;top:6px;bottom:6px;width:1px;background:#E9E3DA}
        .tl-item{display:flex;gap:12px;align-items:flex-start;position:relative}
        .tl-item.is-internal .tl-body{background:#F7F4EF;border:1px dashed #E9E3DA;border-radius:10px;padding:8px 12px;margin-top:-2px}
        .tl-dot{width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid #E9E3DA;flex-shrink:0;margin-top:2px;z-index:1}
        .tl-dot--acknowledge{border-color:#77716A}
        .tl-dot--request_evidence{border-color:#B77945;background:#FBEDD5}
        .tl-dot--reply{border-color:#4B5E80;background:#E4EBF3}
        .tl-dot--resolve{border-color:#42856B;background:#DCEEDF}
        .tl-dot--dismiss{border-color:#a19a91;background:#F3F1EE}
        .tl-dot--escalate{border-color:#8C4B54;background:#F1E1E4}
        .tl-dot--internal_note{border-color:#B8A789;background:#FBFAF7}
        .tl-body{flex:1;min-width:0}
        .tl-h{display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;font-size:12px;color:var(--muted)}
        .tl-h b{color:var(--ink);font-weight:800;font-size:13px}
        .tl-int{background:#F0EAE1;color:#77716A;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
        .tl-h time{margin-left:auto;font-variant-numeric:tabular-nums;font-size:11.5px}
        .tl-msg{margin:4px 0 0;font-size:13px;line-height:1.7;color:#3d3a35}
      `}</style>
    </ol>
  );
}
