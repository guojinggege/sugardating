"use client";
// 6-step 举报 wizard · 单文件封装所有步骤 · 状态提升到 wizard 顶层
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { WizardState, ReportScene, ReportCategory, ReportTargetType, ReportEvidence } from "@/lib/reports/types";
import { ONLINE_CATEGORIES, OFFLINE_CATEGORIES, TARGET_TYPES, getCategoryMeta } from "@/lib/reports/categories";

const STEPS = ["场景", "对象", "关联", "分类", "证据", "确认"] as const;

const initial: WizardState = {
  step: 0,
  scene: undefined,
  category: undefined,
  target: undefined,
  title: "",
  description: "",
  occurredAt: "",
  location: "",
  contactPreference: "in_app",
  evidence: [],
  agreedToTerms: false,
};

const MAX_TITLE = 120;
const MAX_DESC = 4000;
const MAX_EVIDENCE = 8;
const MAX_SIZE = 50 * 1024 * 1024;

export default function UserReportWizard() {
  const router = useRouter();
  const [s, setS] = useState<WizardState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof WizardState>(k: K, v: WizardState[K]) =>
    setS((prev) => ({ ...prev, [k]: v }));

  const canGoNext = useMemo(() => {
    switch (s.step) {
      case 0: return !!s.scene;
      case 1: return !!s.target?.type;
      case 2: return true;  // context 可选
      case 3: return !!s.category;
      case 4: return true;  // 证据可选
      case 5: return s.title.trim().length >= 4 && s.description.trim().length >= 20 && s.agreedToTerms;
      default: return false;
    }
  }, [s]);

  async function submit() {
    if (submitting || !s.scene || !s.category || !s.target) return;
    setSubmitting(true); setError(null);
    try {
      const r = await fetch("/api/reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          scene: s.scene,
          category: s.category,
          target: s.target,
          title: s.title,
          description: s.description,
          occurredAt: s.occurredAt || undefined,
          location: s.location || undefined,
          contactPreference: s.contactPreference,
          agreedToTerms: s.agreedToTerms,
          evidence: s.evidence,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.message || "提交失败");
      router.push(`/me/reports/${d.report.id}?created=1`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "提交失败");
      setSubmitting(false);
    }
  }

  return (
    <div className="w">
      {/* Stepper */}
      <div className="w-steps">
        {STEPS.map((label, i) => (
          <div key={label} className={"w-step" + (i === s.step ? " is-active" : i < s.step ? " is-done" : "")}>
            <span className="w-step-n">{i + 1}</span>
            <span className="w-step-l">{label}</span>
            {i < STEPS.length - 1 && <span className="w-step-bar" />}
          </div>
        ))}
      </div>

      <div className="w-body">
        {s.step === 0 && <SceneStep value={s.scene} onPick={(v) => { set("scene", v); set("step", 1); }} />}
        {s.step === 1 && <TargetTypeStep value={s.target?.type} onPick={(t) => { set("target", { type: t }); }} />}
        {s.step === 2 && <ContextPickerStep target={s.target} onChange={(v) => set("target", v)} />}
        {s.step === 3 && <CategoryStep scene={s.scene!} value={s.category} onPick={(c) => { set("category", c); set("step", 4); }} />}
        {s.step === 4 && <EvidenceStep value={s.evidence} onChange={(v) => set("evidence", v)} />}
        {s.step === 5 && <ReviewStep s={s} setS={setS} />}
      </div>

      {error && <div className="w-err">{error}</div>}

      <div className="w-nav">
        {s.step > 0 && (
          <button type="button" onClick={() => set("step", s.step - 1)} className="w-btn w-btn--ghost">上一步</button>
        )}
        <div className="w-nav-r">
          {s.step < STEPS.length - 1 && (
            <button type="button" onClick={() => set("step", s.step + 1)} disabled={!canGoNext} className="w-btn w-btn--dark">下一步 →</button>
          )}
          {s.step === STEPS.length - 1 && (
            <button type="button" onClick={submit} disabled={!canGoNext || submitting} className="w-btn w-btn--gold">
              {submitting ? "提交中…" : "确认并提交"}
            </button>
          )}
        </div>
      </div>

      <style>{wizardStyles}</style>
    </div>
  );
}

// ══════════════════════════════════════
// Step 1 · Scene
// ══════════════════════════════════════
function SceneStep({ value, onPick }: { value?: ReportScene; onPick: (v: ReportScene) => void }) {
  return (
    <div>
      <StepHeader eyebrow="Step 1 / 6" title="选择问题发生的场景" hint="不同场景对应不同的举报类型和证据要求" />
      <div className="w-cards w-cards--2">
        <SelectableCard
          selected={value === "online"}
          onClick={() => onPick("online")}
          badge="ONLINE"
          title="线上问题"
          desc="发生在私密聊天、资料浏览、预约沟通、社区互动等平台内环节"
        />
        <SelectableCard
          selected={value === "offline"}
          onClick={() => onPick("offline")}
          badge="OFFLINE"
          title="线下问题"
          desc="发生在线下见面、餐厅、酒店、按摩场所或其他线下接触环节"
        />
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// Step 2 · Target type
// ══════════════════════════════════════
function TargetTypeStep({ value, onPick }: { value?: ReportTargetType; onPick: (t: ReportTargetType) => void }) {
  return (
    <div>
      <StepHeader eyebrow="Step 2 / 6" title="举报对象" hint="选择这个问题最相关的对象类型" />
      <div className="w-cards w-cards--2">
        {TARGET_TYPES.map((t) => (
          <SelectableCard
            key={t.key}
            selected={value === t.key}
            onClick={() => onPick(t.key)}
            title={t.label}
            desc={t.hint}
          />
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// Step 3 · Context picker
// ══════════════════════════════════════
function ContextPickerStep({ target, onChange }: { target?: WizardState["target"]; onChange: (v: WizardState["target"]) => void }) {
  const meta = TARGET_TYPES.find((t) => t.key === target?.type);
  if (!meta) return null;
  if (!meta.needsContextPicker) {
    return (
      <div>
        <StepHeader eyebrow="Step 3 / 6" title="关联记录" hint="所选类型无需关联具体记录 · 可以直接下一步" />
        <div className="w-note">
          {meta.label} · 会记录在举报中,后续可在描述里补充更多信息。
        </div>
      </div>
    );
  }
  return (
    <div>
      <StepHeader eyebrow="Step 3 / 6" title="关联具体记录" hint="如能填写具体 ID 或链接,安全团队处理更快 (可选)" />
      <div className="w-fields">
        <label>
          <span>{meta.label} · 具体 ID</span>
          <input
            type="text"
            value={target?.id || ""}
            onChange={(e) => onChange({ type: target!.type, id: e.target.value, label: target?.label })}
            placeholder={placeholderForTarget(target!.type)}
            maxLength={120}
          />
        </label>
        <label>
          <span>展示名称 (方便你和团队辨认)</span>
          <input
            type="text"
            value={target?.label || ""}
            onChange={(e) => onChange({ type: target!.type, id: target?.id, label: e.target.value })}
            placeholder="例:Aria M. · sugargirl / 2026-05-24 Mayfair 晚餐"
            maxLength={200}
          />
        </label>
      </div>
      <p className="w-fine">
        不确定填什么可以留空。安全团队会根据你在下一步的详细描述定位记录。
      </p>
    </div>
  );
}

function placeholderForTarget(type: ReportTargetType): string {
  switch (type) {
    case "creator":        return "creator slug · 例: aria";
    case "chat":           return "聊天 ID · 或对方用户名";
    case "booking":        return "预约 ID · bk_...";
    case "custom_service": return "定制需求 ID";
    case "media":          return "媒体 URL 或 ID";
    case "community_post": return "帖子 slug";
    default:               return "";
  }
}

// ══════════════════════════════════════
// Step 4 · Category
// ══════════════════════════════════════
function CategoryStep({ scene, value, onPick }: { scene: ReportScene; value?: ReportCategory; onPick: (c: ReportCategory) => void }) {
  const cats = scene === "online" ? ONLINE_CATEGORIES : OFFLINE_CATEGORIES;
  return (
    <div>
      <StepHeader
        eyebrow="Step 4 / 6"
        title="问题类型"
        hint={scene === "online" ? "常见的线上问题" : "常见的线下问题 · 涉及人身安全请优先联系当地紧急服务"}
      />
      <div className="w-cats">
        {cats.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => onPick(c.key)}
            className={"w-cat" + (value === c.key ? " is-active" : "")}
          >
            <div className="w-cat-h">
              <b>{c.label}</b>
              <span className={"w-cat-sev w-cat-sev--" + c.defaultSeverity}>{severityLabel(c.defaultSeverity)}</span>
            </div>
            <p>{c.hint}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function severityLabel(sev: string): string {
  return { low: "一般", medium: "中等", high: "严重", critical: "紧急" }[sev] ?? sev;
}

// ══════════════════════════════════════
// Step 5 · Evidence
// ══════════════════════════════════════
function EvidenceStep({ value, onChange }: { value: WizardState["evidence"]; onChange: (v: WizardState["evidence"]) => void }) {
  function onPick(files: FileList | null) {
    if (!files) return;
    const next = [...value];
    for (const f of Array.from(files)) {
      if (next.length >= MAX_EVIDENCE) break;
      if (f.size > MAX_SIZE) continue;
      next.push({
        filename: f.name.slice(0, 200),
        mimeType: f.type || "application/octet-stream",
        sizeBytes: f.size,
        description: "",
      });
    }
    onChange(next);
  }
  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function updateDesc(i: number, d: string) {
    onChange(value.map((e, idx) => idx === i ? { ...e, description: d.slice(0, 500) } : e));
  }

  return (
    <div>
      <StepHeader eyebrow="Step 5 / 6" title="上传证据 (可选)" hint="截图、照片或其他文件 · P0 阶段仅记录文件名与描述 · 不上传内容" />

      <label className="w-drop">
        <input type="file" multiple accept="image/*,video/*,.pdf,.txt,.doc,.docx"
          onChange={(e) => { onPick(e.target.files); e.target.value = ""; }} />
        <span className="w-drop-ic">+</span>
        <b>选择文件</b>
        <em>最多 {MAX_EVIDENCE} 份 · 单个文件不超过 50MB</em>
      </label>

      {value.length > 0 && (
        <ul className="w-ev">
          {value.map((e, i) => (
            <li key={i}>
              <div className="w-ev-h">
                <b>{e.filename}</b>
                <span>{fmtSize(e.sizeBytes)} · {e.mimeType.split("/")[0]}</span>
                <button type="button" onClick={() => removeAt(i)}>删除</button>
              </div>
              <input type="text" value={e.description || ""} onChange={(ev) => updateDesc(i, ev.target.value)}
                placeholder="简单描述这份材料 · 例:对方发来的转账要求截图" maxLength={500} />
            </li>
          ))}
        </ul>
      )}

      <div className="w-privacy">
        <b>隐私提示</b>
        <p>提交前请打上马赛克或裁剪 · 尽量避免露出你的真名、真实电话、地址、公司或其它可识别第三方身份的信息。</p>
      </div>
    </div>
  );
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

// ══════════════════════════════════════
// Step 6 · Review + Submit
// ══════════════════════════════════════
function ReviewStep({ s, setS }: { s: WizardState; setS: React.Dispatch<React.SetStateAction<WizardState>> }) {
  const cat = s.category ? getCategoryMeta(s.category) : undefined;
  return (
    <div>
      <StepHeader eyebrow="Step 6 / 6" title="填写详情并确认提交" hint="写下时间线、当事人的具体行为,方便团队快速判断" />

      <div className="w-recap">
        <RecapRow label="场景" value={s.scene === "online" ? "线上" : "线下"} />
        <RecapRow label="对象" value={TARGET_TYPES.find((t) => t.key === s.target?.type)?.label ?? "-"} />
        {s.target?.label && <RecapRow label="关联" value={s.target.label} />}
        <RecapRow label="问题类型" value={cat?.label ?? "-"} />
        <RecapRow label="证据数量" value={`${s.evidence.length} 份`} />
      </div>

      <div className="w-fields">
        <label>
          <span>标题 · 一句话说明发生了什么 (4-120 字)</span>
          <input type="text" value={s.title} onChange={(e) => setS((p) => ({ ...p, title: e.target.value.slice(0, MAX_TITLE) }))}
            placeholder="例:对方在第二次聊天时索要 5000 rmb 转账" maxLength={MAX_TITLE} />
          <em>{s.title.length}/{MAX_TITLE}</em>
        </label>
        <label>
          <span>详细经过 (20-4000 字)</span>
          <textarea rows={7} value={s.description} onChange={(e) => setS((p) => ({ ...p, description: e.target.value.slice(0, MAX_DESC) }))}
            placeholder={"请按时间线描述:\n· 什么时候第一次接触\n· 对方说了什么、做了什么\n· 你的反应\n· 目前状态"} maxLength={MAX_DESC} />
          <em>{s.description.length}/{MAX_DESC}</em>
        </label>
        <div className="w-fields-row">
          <label>
            <span>事件发生时间 (可选)</span>
            <input type="datetime-local" value={s.occurredAt} onChange={(e) => setS((p) => ({ ...p, occurredAt: e.target.value }))} />
          </label>
          <label>
            <span>地点 (线下时可填)</span>
            <input type="text" value={s.location} onChange={(e) => setS((p) => ({ ...p, location: e.target.value.slice(0, 120) }))}
              placeholder="城市 / 区域 · 无需精确地址" />
          </label>
        </div>
        <label>
          <span>联系偏好</span>
          <select value={s.contactPreference} onChange={(e) => setS((p) => ({ ...p, contactPreference: e.target.value as any }))}>
            <option value="in_app">站内消息 · 优先</option>
            <option value="email">邮件</option>
            <option value="no_contact">不需要联系 · 只作反馈</option>
          </select>
        </label>
      </div>

      <label className="w-terms">
        <input type="checkbox" checked={s.agreedToTerms} onChange={(e) => setS((p) => ({ ...p, agreedToTerms: e.target.checked }))} />
        <div>
          <b>我已确认</b>
          <span>本次内容为真实经历,不诽谤、不虚构 · 已按平台隐私提示处理敏感信息 · 同意让安全团队查看提交内容 (仅授权人员) 用于处理本次问题。</span>
        </div>
      </label>
    </div>
  );
}

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-recap-row">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function StepHeader({ eyebrow, title, hint }: { eyebrow: string; title: string; hint: string }) {
  return (
    <div className="w-h">
      <div className="w-h-eye">{eyebrow}</div>
      <h2>{title}</h2>
      <p>{hint}</p>
    </div>
  );
}

function SelectableCard({ selected, onClick, badge, title, desc }: { selected: boolean; onClick: () => void; badge?: string; title: string; desc: string }) {
  return (
    <button type="button" onClick={onClick} className={"w-sel" + (selected ? " is-selected" : "")}>
      {badge && <span className="w-sel-badge">{badge}</span>}
      <b>{title}</b>
      <p>{desc}</p>
    </button>
  );
}

const wizardStyles = `
  .w{background:#fff;border:1px solid var(--line);border-radius:20px;padding:32px 36px;display:flex;flex-direction:column;gap:22px}

  .w-steps{display:flex;justify-content:space-between;gap:4px;padding-bottom:14px;border-bottom:1px solid var(--line);position:relative}
  .w-step{display:flex;align-items:center;gap:6px;color:#a19a91;font-size:12px;font-weight:600;flex:1;min-width:0}
  .w-step-n{width:22px;height:22px;border-radius:50%;background:#F0EAE1;color:#77716A;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0}
  .w-step.is-active .w-step-n{background:#171512;color:#F5EEDD}
  .w-step.is-done .w-step-n{background:#42856B;color:#fff}
  .w-step.is-active .w-step-l{color:#171512;font-weight:800}
  .w-step-bar{flex:1;height:1px;background:#F0EAE1;margin:0 6px}
  .w-step.is-done .w-step-bar{background:#42856B}
  .w-step-l{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  @media(max-width:640px){.w-step-l{display:none}.w{padding:20px 18px}}

  .w-body{min-height:280px}
  .w-h-eye{font-size:10.5px;letter-spacing:.2em;color:#C5A56A;font-weight:800;text-transform:uppercase}
  .w-h h2{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:26px;font-weight:500;color:var(--ink);letter-spacing:-0.012em;margin:6px 0 4px}
  .w-h p{font-size:13px;color:var(--muted);margin:0 0 18px;line-height:1.65}

  .w-cards{display:grid;gap:12px}
  .w-cards--2{grid-template-columns:1fr 1fr}
  @media(max-width:640px){.w-cards--2{grid-template-columns:1fr}}

  .w-sel{background:#fff;border:2px solid var(--line);border-radius:14px;padding:16px 18px;text-align:left;font:inherit;cursor:pointer;transition:border-color .12s,background .12s;display:flex;flex-direction:column;gap:6px}
  .w-sel:hover{border-color:#D6B980}
  .w-sel.is-selected{border-color:#171512;background:#FBFAF7}
  .w-sel-badge{font-size:9.5px;letter-spacing:.16em;color:#C5A56A;font-weight:800}
  .w-sel b{font-size:14px;font-weight:800;color:var(--ink);letter-spacing:-0.005em}
  .w-sel p{font-size:12.5px;color:var(--muted);margin:0;line-height:1.6}

  .w-cats{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  @media(max-width:640px){.w-cats{grid-template-columns:1fr}}
  .w-cat{background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px 14px;text-align:left;font:inherit;cursor:pointer;display:flex;flex-direction:column;gap:4px}
  .w-cat:hover{border-color:#D6B980}
  .w-cat.is-active{border-color:#171512;background:#FBFAF7}
  .w-cat-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
  .w-cat b{font-size:13.5px;color:var(--ink);font-weight:700}
  .w-cat p{margin:0;font-size:12px;color:var(--muted);line-height:1.55}
  .w-cat-sev{font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;font-weight:800;padding:1px 8px;border-radius:99px;flex-shrink:0}
  .w-cat-sev--low{background:#F3F1EE;color:#77716A}
  .w-cat-sev--medium{background:#E4EBF3;color:#4B5E80}
  .w-cat-sev--high{background:#FBEDD5;color:#7A4C27}
  .w-cat-sev--critical{background:#F1E1E4;color:#8C4B54}

  .w-fields{display:flex;flex-direction:column;gap:14px}
  .w-fields-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  @media(max-width:640px){.w-fields-row{grid-template-columns:1fr}}
  .w-fields label{display:flex;flex-direction:column;gap:4px;position:relative}
  .w-fields span{font-size:12px;color:#3d3a35;font-weight:700}
  .w-fields input,.w-fields select,.w-fields textarea{padding:10px 12px;border:1px solid var(--line);border-radius:10px;font:inherit;font-size:13.5px;color:var(--ink);background:#FBFAF7;outline:none;resize:vertical}
  .w-fields input:focus,.w-fields select:focus,.w-fields textarea:focus{border-color:#171512;background:#fff}
  .w-fields em{position:absolute;right:8px;bottom:4px;font-style:normal;font-size:10.5px;color:#a19a91;font-variant-numeric:tabular-nums}
  .w-fine{font-size:11.5px;color:var(--muted);margin-top:8px}
  .w-note{padding:12px 14px;background:#FBFAF7;border:1px dashed var(--line);border-radius:10px;font-size:13px;color:#3d3a35}

  .w-drop{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:28px 20px;background:#FBFAF7;border:2px dashed var(--line);border-radius:14px;cursor:pointer;transition:border-color .12s,background .12s}
  .w-drop:hover{border-color:#171512;background:#fff}
  .w-drop input{display:none}
  .w-drop-ic{width:36px;height:36px;background:#171512;color:#F5EEDD;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:22px}
  .w-drop b{font-size:14px;color:var(--ink);font-weight:800}
  .w-drop em{font-size:11.5px;color:var(--muted);font-style:normal}

  .w-ev{list-style:none;margin:14px 0 0;padding:0;display:flex;flex-direction:column;gap:8px}
  .w-ev li{padding:10px 12px;background:#FBFAF7;border:1px solid var(--line);border-radius:10px;display:flex;flex-direction:column;gap:6px}
  .w-ev-h{display:flex;align-items:center;gap:8px}
  .w-ev-h b{font-size:12.5px;color:var(--ink);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700}
  .w-ev-h span{font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums}
  .w-ev-h button{background:none;border:0;color:#B77945;font-size:11.5px;font-weight:700;cursor:pointer}
  .w-ev input{padding:6px 10px;border:1px solid var(--line);border-radius:6px;font:inherit;font-size:12.5px;background:#fff;outline:none}
  .w-ev input:focus{border-color:#171512}

  .w-privacy{margin-top:14px;padding:12px 14px;background:#FBEDD5;border:1px solid rgba(183,121,69,.28);border-radius:10px;color:#7A4C27}
  .w-privacy b{display:block;font-size:12.5px;margin-bottom:4px;font-weight:800}
  .w-privacy p{margin:0;font-size:12.5px;line-height:1.65}

  .w-recap{background:#FBFAF7;border:1px solid var(--line);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
  .w-recap-row{display:flex;justify-content:space-between;gap:12px;font-size:12.5px;color:var(--muted)}
  .w-recap-row b{color:var(--ink);font-weight:700}

  .w-terms{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;background:#FEF3C7;border:1px dashed #F5D073;border-radius:10px;cursor:pointer;font-size:12.5px;color:#7C5A05;line-height:1.65;margin-top:14px}
  .w-terms input{margin-top:3px;flex-shrink:0;width:16px;height:16px;accent-color:#171512}
  .w-terms b{display:block;font-weight:800;margin-bottom:2px}

  .w-nav{display:flex;justify-content:space-between;padding-top:14px;border-top:1px solid var(--line);gap:8px}
  .w-nav-r{margin-left:auto;display:flex;gap:8px}
  .w-btn{padding:10px 20px;border-radius:999px;font:inherit;font-size:13px;font-weight:800;border:0;cursor:pointer;letter-spacing:-0.005em}
  .w-btn:disabled{opacity:.4;cursor:not-allowed}
  .w-btn--dark{background:#171512;color:#F5EEDD}
  .w-btn--dark:hover:not(:disabled){background:#2b2822}
  .w-btn--ghost{background:#F7F4EF;color:var(--ink);border:1px solid var(--line)}
  .w-btn--gold{background:linear-gradient(135deg,#EEDDB8,#C5A56A);color:#2A1D0A;box-shadow:0 10px 24px -14px rgba(197,165,106,.55)}
  .w-err{padding:10px 14px;background:#FEE2E2;color:#B91C1C;border-radius:10px;font-size:13px}
`;
