// /me/reports/[id] · 详情 + 时间线 + 补交证据
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { getReportById } from "@/lib/reports/repository";
import { canView } from "@/lib/reports/permissions";
import { getAdminSession } from "@/lib/admin/auth";
import { getCategoryMeta, TARGET_TYPES } from "@/lib/reports/categories";
import ReportStatusTimeline from "@/components/reports/ReportStatusTimeline";
import ReportAdditionalEvidence from "@/components/reports/ReportAdditionalEvidence";
import type { ReportStatus } from "@/lib/reports/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "举报详情 · Sugardating",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<ReportStatus, { label: string; bg: string; fg: string }> = {
  submitted:         { label: "已提交",     bg: "#F0EAE1", fg: "#77716A" },
  reviewing:         { label: "处理中",     bg: "#E4EBF3", fg: "#4B5E80" },
  awaiting_evidence: { label: "等待你补充", bg: "#FBEDD5", fg: "#7A4C27" },
  resolved:          { label: "已完成",     bg: "#DCEEDF", fg: "#2B6249" },
  dismissed:         { label: "已驳回",     bg: "#F3F1EE", fg: "#a19a91" },
  escalated:         { label: "已上报",     bg: "#F1E1E4", fg: "#8C4B54" },
};

function fmt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("zh-CN", { hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

interface Props {
  params: { id: string };
  searchParams?: { created?: string };
}

export default function ReportDetailPage({ params, searchParams }: Props) {
  const s = getSession();
  if (!s) redirect(`/login?next=/me/reports/${params.id}`);

  const admin = !!getAdminSession();
  const r = getReportById(params.id);
  if (!r || !canView(r, s.userId, admin)) notFound();

  const st = STATUS_LABEL[r.status];
  const catMeta = getCategoryMeta(r.category);
  const targetMeta = TARGET_TYPES.find((t) => t.key === r.target.type);
  const closed = r.status === "resolved" || r.status === "dismissed";
  const visibleActions = r.actions.filter((a) => a.visibleToUser);
  const isJustCreated = searchParams?.created === "1";

  return (
    <div className="rd-page">
      <div className="rd-shell">
        <nav className="rd-crumb" aria-label="Breadcrumb">
          <Link href="/me">我的</Link>
          <span>/</span>
          <Link href="/me/reports">举报与安全中心</Link>
          <span>/</span>
          <span>{r.publicRef}</span>
        </nav>

        {isJustCreated && (
          <div className="rd-success">
            <b>提交成功 · {r.publicRef}</b>
            <span>安全团队已收到你的举报,你可以随时回来这里查看进度或补交材料。</span>
          </div>
        )}

        <header className="rd-h">
          <div className="rd-h-l">
            <div className="rd-ref-row">
              <span className="rd-ref">{r.publicRef}</span>
              <span className="rd-badge" style={{ background: st.bg, color: st.fg }}>{st.label}</span>
              <span className="rd-scene">{r.scene === "online" ? "线上" : "线下"} · {catMeta?.label ?? r.category}</span>
            </div>
            <h1>{r.title}</h1>
            <div className="rd-meta">
              <span>提交于 {fmt(r.createdAt)}</span>
              {r.updatedAt !== r.createdAt && <span>· 更新于 {fmt(r.updatedAt)}</span>}
              {r.assignedTo && <span>· 处理人 {r.assignedTo}</span>}
            </div>
          </div>
        </header>

        <div className="rd-grid">
          <div className="rd-main">
            <section className="rd-card">
              <h3>详细经过</h3>
              <div className="rd-desc">
                {r.description.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}
              </div>
              {(r.occurredAt || r.location) && (
                <div className="rd-facts">
                  {r.occurredAt && <div><b>发生时间</b><span>{fmt(r.occurredAt)}</span></div>}
                  {r.location   && <div><b>地点</b><span>{r.location}</span></div>}
                </div>
              )}
            </section>

            <section className="rd-card">
              <h3>处理时间线</h3>
              <ReportStatusTimeline actions={visibleActions} />
            </section>

            <section className="rd-card">
              <div className="rd-card-h">
                <h3>证据材料 · {r.evidence.length}</h3>
              </div>
              {r.evidence.length === 0 ? (
                <p className="rd-empty">还没有上传证据</p>
              ) : (
                <ul className="rd-ev-list">
                  {r.evidence.map((e) => (
                    <li key={e.id}>
                      <div className="rd-ev-h">
                        <b>{e.filename}</b>
                        <span>{fmtSize(e.sizeBytes)} · {e.mimeType.split("/")[0]}</span>
                      </div>
                      {e.description && <p>{e.description}</p>}
                      <div className="rd-ev-meta">{e.addedBy === "user" ? "你" : "S&T 团队"} · {fmt(e.addedAt)}</div>
                    </li>
                  ))}
                </ul>
              )}
              <ReportAdditionalEvidence reportId={r.id} disabled={closed} />
            </section>
          </div>

          <aside className="rd-side">
            <section className="rd-card">
              <h3>对象</h3>
              <div className="rd-target">
                <b>{targetMeta?.label ?? r.target.type}</b>
                {r.target.label && <span>{r.target.label}</span>}
                {r.target.id && <code>{r.target.id}</code>}
              </div>
            </section>
            <section className="rd-card">
              <h3>联系偏好</h3>
              <p className="rd-cp">
                {r.contactPreference === "in_app" ? "站内消息 · 优先" :
                 r.contactPreference === "email"  ? "邮件"           :
                 "不需要联系"}
              </p>
              {r.reporterEmail && <p className="rd-cp-em">{r.reporterEmail}</p>}
            </section>
            <section className="rd-card rd-safety">
              <h3>需要紧急支援?</h3>
              <p>如果情况紧急,请优先联系当地紧急服务或可信赖的人。平台举报不能替代紧急援助。</p>
            </section>
          </aside>
        </div>
      </div>

      <style>{`
        .rd-page{background:var(--page);min-height:100vh;padding:24px 0 60px}
        .rd-shell{max-width:1080px;margin:0 auto;padding:0 24px;display:flex;flex-direction:column;gap:16px}
        .rd-crumb{font-size:12.5px;color:var(--muted);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
        .rd-crumb a{color:var(--muted);text-decoration:none}
        .rd-crumb a:hover{color:var(--ink)}

        .rd-success{background:linear-gradient(135deg,#DCFCE7,#BBF7D0);border:1px solid #86EFAC;border-radius:14px;padding:14px 18px;display:flex;flex-direction:column;gap:2px}
        .rd-success b{color:#0F5132;font-weight:800;font-size:14px}
        .rd-success span{color:#166534;font-size:12.5px;line-height:1.6}

        .rd-h{padding:24px 0 4px}
        .rd-ref-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;color:var(--muted)}
        .rd-ref{font-family:ui-monospace,monospace;font-size:12px;color:#77716A;background:#fff;padding:3px 10px;border:1px solid var(--line);border-radius:6px;font-weight:700}
        .rd-badge{font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;font-weight:800;padding:3px 10px;border-radius:99px}
        .rd-scene{color:#77716A}
        .rd-h h1{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:32px;font-weight:500;color:var(--ink);letter-spacing:-0.018em;margin:8px 0 6px;line-height:1.25}
        .rd-meta{font-size:12px;color:var(--muted);display:flex;gap:6px;flex-wrap:wrap}

        .rd-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:16px;align-items:flex-start}
        @media(max-width:900px){.rd-grid{grid-template-columns:1fr}}
        .rd-main,.rd-side{display:flex;flex-direction:column;gap:16px;min-width:0}

        .rd-card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:20px 22px;display:flex;flex-direction:column;gap:14px}
        .rd-card h3{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:800;margin:0}
        .rd-card-h{display:flex;justify-content:space-between;align-items:baseline}

        .rd-desc p{margin:0 0 10px;font-size:14px;line-height:1.8;color:#3d3a35}
        .rd-desc p:last-child{margin-bottom:0}
        .rd-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;padding-top:10px;border-top:1px dashed #F0EAE1;font-size:12.5px}
        .rd-facts b{display:block;color:#77716A;font-size:11px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:2px}
        .rd-facts span{color:var(--ink);font-weight:600}

        .rd-empty{margin:0;font-size:12.5px;color:var(--muted)}
        .rd-ev-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
        .rd-ev-list li{padding:10px 12px;background:#FBFAF7;border:1px solid var(--line);border-radius:10px}
        .rd-ev-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
        .rd-ev-h b{font-size:12.5px;color:var(--ink);font-weight:700}
        .rd-ev-h span{font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums}
        .rd-ev-list p{font-size:12.5px;color:#3d3a35;margin:4px 0 0;line-height:1.55}
        .rd-ev-meta{font-size:10.5px;color:#a19a91;margin-top:4px}

        .rd-target{display:flex;flex-direction:column;gap:4px}
        .rd-target b{font-size:13px;color:var(--ink);font-weight:800}
        .rd-target span{font-size:12.5px;color:#3d3a35}
        .rd-target code{font-family:ui-monospace,monospace;font-size:11.5px;color:#77716A;background:#F7F4EF;padding:2px 8px;border-radius:6px;width:fit-content}
        .rd-cp{margin:0;font-size:13px;color:var(--ink);font-weight:700}
        .rd-cp-em{margin:2px 0 0;font-size:11.5px;color:var(--muted)}

        .rd-safety{background:#FBEDD5;border-color:rgba(183,121,69,.28)}
        .rd-safety h3{color:#7A4C27}
        .rd-safety p{margin:0;font-size:12.5px;line-height:1.65;color:#7A4C27}
      `}</style>
    </div>
  );
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
