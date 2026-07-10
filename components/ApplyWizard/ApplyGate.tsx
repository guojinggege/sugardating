"use client";
// Apply landing 页登录状态感知 CTA · 替代旧的整段长表单
// 未登录 → 引导登录 (带 next=/apply/start)
// 已登录 · 无草稿 → 开始填写入驻资料
// 已登录 · 有草稿 → 继续完善
// 已登录 · 已提交 → 显示状态
// 已登录 · 已通过 → 跳我的 sugargirl 主页
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import type { WizardStatus } from "@/lib/apply-wizard";

interface ServerAppSnapshot {
  status?: WizardStatus | "pending";
  slug?: string;
  completion?: number;
}

export default function ApplyGate() {
  const { user, hydrated } = useAuth();
  const [snap, setSnap] = useState<ServerAppSnapshot | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) { setChecking(false); return; }
    (async () => {
      try {
        const r = await fetch("/api/creator/apply", { credentials: "include", cache: "no-store" });
        const data = await r.json().catch(() => ({}));
        if (data?.ok && data.application) {
          setSnap({ status: data.application.status, slug: data.application.slug });
        }
      } catch { /* ignore */ }
      finally { setChecking(false); }
    })();
  }, [hydrated, user]);

  // Compose CTA state
  const state = (() => {
    if (!hydrated || checking) return "loading" as const;
    if (!user) return "unauth" as const;
    const s = snap?.status;
    if (s === "approved") return "approved" as const;
    if (s === "pending" || s === "submitted" || s === "reviewing") return "submitted" as const;
    if (snap) return "draft" as const;
    return "new" as const;
  })();

  return (
    <section className="ag" aria-label="Start your Sugargirl onboarding">
      <div className="ag-in">
        <div className="ag-eyebrow">SUGARGIRL ONBOARDING · 4 – 10 MIN</div>
        <h2 className="ag-h">
          准备好开始你的<em>sugargirl 入驻</em>了吗?
        </h2>
        <p className="ag-lead">
          我们会一步步引导你完成主页资料、照片视频、服务设置与安全确认。
          整个过程可以保存草稿,之后继续完善。
        </p>

        <div className="ag-checklist">
          <span>✓ 9 步分段填写 · 每步可保存</span>
          <span>✓ 实时主页预览</span>
          <span>✓ 免费写真与视频支持</span>
          <span>✓ 提交后专属审核团队跟进</span>
        </div>

        {state === "loading" && (
          <div className="ag-loading">正在检查你的申请状态…</div>
        )}

        {state === "unauth" && (
          <div className="ag-actions">
            <Link href="/login?next=/apply/start" className="ag-btn ag-btn--gold">登录 · 开始填写</Link>
            <Link href="/register?next=/apply/start" className="ag-btn ag-btn--ghost">注册新账号</Link>
          </div>
        )}

        {state === "new" && (
          <div className="ag-actions">
            <Link href="/apply/start" className="ag-btn ag-btn--gold">开始填写入驻资料 →</Link>
            <span className="ag-fine">整个流程约 4 – 10 分钟 · 支持随时保存</span>
          </div>
        )}

        {state === "draft" && (
          <div className="ag-actions">
            <div className="ag-status ag-status--draft">
              <b>草稿保存中</b>
              <span>{snap?.slug ? `已使用 username: @${snap.slug}` : "未提交"}</span>
            </div>
            <Link href="/apply/start?resume=1" className="ag-btn ag-btn--gold">继续完善入驻资料 →</Link>
          </div>
        )}

        {state === "submitted" && (
          <div className="ag-actions">
            <div className="ag-status ag-status--submitted">
              <b>你的入驻申请已提交</b>
              <span>正在审核中 · 通常 24-48 小时反馈 · 你可以继续完善资料提升通过率</span>
            </div>
            <Link href="/apply/start?resume=1" className="ag-btn ag-btn--ghost">继续完善资料</Link>
          </div>
        )}

        {state === "approved" && (
          <div className="ag-actions">
            <div className="ag-status ag-status--approved">
              <b>你的 sugargirl 主页已创建</b>
              <span>感谢加入 · 你可以随时更新资料、照片与服务设置</span>
            </div>
            {snap?.slug && (
              <Link href={`/creators/${snap.slug}`} className="ag-btn ag-btn--gold">查看我的 sugargirl 主页 →</Link>
            )}
            <Link href="/apply/start?resume=1" className="ag-btn ag-btn--ghost">编辑资料</Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .ag{padding:56px 0}
        .ag-in{max-width:820px;margin:0 auto;padding:44px 44px 46px;background:#fff;border:1px solid var(--line);border-radius:24px;box-shadow:0 20px 60px -32px rgba(15,23,42,.14)}
        .ag-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .ag-h{font-family:'Cormorant Garamond',ui-serif;font-size:36px;font-weight:500;line-height:1.2;color:#161618;margin:0 0 14px;letter-spacing:-0.01em}
        .ag-h em{font-style:italic;color:#B8A789}
        .ag-lead{font-size:15.5px;line-height:1.75;color:#3d3d42;margin:0 0 22px;max-width:60ch}
        .ag-checklist{display:flex;flex-wrap:wrap;gap:14px 22px;font-size:13px;color:#5a5a62;margin-bottom:28px;padding:16px 20px;background:#FBFAF7;border:1px dashed #EEE9DC;border-radius:14px}
        .ag-checklist span{display:inline-flex;align-items:center}
        .ag-loading{padding:14px 18px;background:#F4F4F5;border-radius:10px;font-size:13.5px;color:#5a5a62;text-align:center}
        .ag-actions{display:flex;flex-direction:column;gap:12px}
        .ag-btn{display:inline-flex;align-items:center;justify-content:center;padding:15px 26px;border-radius:14px;font-size:14.5px;font-weight:700;text-decoration:none;transition:transform .12s,box-shadow .12s;min-height:52px}
        .ag-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;box-shadow:0 14px 32px -14px rgba(184,167,137,.55)}
        .ag-btn--gold:hover{transform:translateY(-1px);box-shadow:0 20px 44px -14px rgba(184,167,137,.7)}
        .ag-btn--ghost{background:#F4F4F5;color:#161618;border:1px solid var(--line)}
        .ag-btn--ghost:hover{border-color:#161618}
        .ag-status{padding:14px 18px;border-radius:12px;display:flex;flex-direction:column;gap:4px;font-size:13.5px}
        .ag-status b{color:#161618;font-weight:700;font-size:14.5px}
        .ag-status span{color:#5a5a62;font-size:13px;line-height:1.55}
        .ag-status--draft{background:#FBFAF7;border:1px solid #EEE9DC}
        .ag-status--submitted{background:linear-gradient(135deg,#FBFAF7,#F4F4F5);border:1px solid #EEE9DC}
        .ag-status--approved{background:linear-gradient(135deg,#161618,#2b2620);color:#EEDDB8}
        .ag-status--approved b{color:#fff}
        .ag-status--approved span{color:rgba(238,221,184,.75)}
        .ag-fine{font-size:12px;color:#8a8a92;text-align:center}
        @media (max-width:640px){
          .ag{padding:36px 0}
          .ag-in{padding:28px 22px 30px;border-radius:20px}
          .ag-h{font-size:26px}
          .ag-lead{font-size:14.5px}
        }
      `}</style>
    </section>
  );
}
