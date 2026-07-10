"use client";
// Sugargirl 入驻向导主组件 · 9 步 · 左侧 Step Nav / 中间 Step Body / 右侧 Live Preview
// 草稿 localStorage 自动保存 · 提交走 POST /api/creator/apply
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/AuthProvider";
import {
  STEPS, OPTIONS, SERVICE_DEFS, DRAFT_KEY,
  createEmptyDraft, completionPercent, computeAge, normalizeUsername,
  type ApplyWizardDraft, type CreatorMediaItem, type StepKey,
} from "@/lib/apply-wizard";
import ProfilePreview from "./ProfilePreview";

// Tiny id gen for media items (client)
const uid = () => "m_" + Math.random().toString(36).slice(2, 10);

interface Props { resume?: boolean }

export default function ApplyWizard({ resume }: Props) {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  const [draft, setDraft] = useState<ApplyWizardDraft>(() => createEmptyDraft({
    email: user?.email, displayName: user?.name,
  }));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auth gate
  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login?next=/apply/start");
    }
  }, [hydrated, user, router]);

  // Load draft from localStorage on mount (client only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ApplyWizardDraft;
        setDraft((prev) => ({ ...prev, ...parsed, verification: { ...prev.verification, ...parsed.verification } }));
      }
    } catch { /* ignore */ }
    // Also try to hydrate from server if user resumes
    if (resume && user) {
      (async () => {
        try {
          const r = await fetch("/api/creator/apply", { credentials: "include", cache: "no-store" });
          const data = await r.json().catch(() => ({}));
          if (data?.ok && data.application) {
            const a = data.application;
            setDraft((prev) => ({
              ...prev,
              displayName: a.displayName || prev.displayName,
              username: a.username || prev.username,
              slogan: a.slogan || prev.slogan,
              bio: a.bio || prev.bio,
              city: a.city || prev.city,
              country: a.country || prev.country,
              languages: a.languages || prev.languages,
              interests: a.interests || prev.interests,
              status: a.status === "pending" ? "submitted" : (a.status || prev.status),
            }));
          }
        } catch { /* ignore */ }
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave to localStorage (debounced 600ms)
  useEffect(() => {
    if (typeof window === "undefined") return;
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, updatedAt: new Date().toISOString() }));
        setSaveState("saved");
      } catch { setSaveState("idle"); }
    }, 600);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [draft]);

  const patch = useCallback((partial: Partial<ApplyWizardDraft>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  }, []);
  const patchLifestyle = useCallback((partial: Partial<ApplyWizardDraft["lifestyle"]>) => {
    setDraft((prev) => ({ ...prev, lifestyle: { ...prev.lifestyle, ...partial } }));
  }, []);
  const patchVerify = useCallback((partial: Partial<ApplyWizardDraft["verification"]>) => {
    setDraft((prev) => ({ ...prev, verification: { ...prev.verification, ...partial } }));
  }, []);

  const current = STEPS[currentIdx];
  const pct = completionPercent(draft);
  const goPrev = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIdx((i) => Math.min(STEPS.length - 1, i + 1));

  async function handleSubmit() {
    setSubmitting(true); setSubmitError(null);
    try {
      // Compose payload matching /api/creator/apply
      const payload = {
        displayName: draft.displayName,
        username: normalizeUsername(draft.username),
        email: draft.email,
        phone: draft.phone,
        birthDate: draft.birthDate,
        country: draft.country,
        city: draft.city,
        languages: draft.languages,
        bio: draft.bio,
        slogan: draft.slogan,
        avatar: draft.avatar,
        coverImage: draft.coverImage,
        interests: draft.interests,
        services: draft.services,
        confirmAdult: draft.verification.confirmAdult,
        confirmTruth: draft.verification.confirmTruth,
        acceptRules: draft.verification.acceptRules,
      };
      const r = await fetch("/api/creator/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data?.ok) {
        throw new Error(data?.message || "提交失败,请检查资料后重试");
      }
      setDraft((p) => ({ ...p, status: "submitted", updatedAt: new Date().toISOString() }));
      setSubmitted(true);
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, status: "submitted" })); } catch { /* ignore */ }
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "提交失败,请稍后重试");
    } finally { setSubmitting(false); }
  }

  if (!hydrated) {
    return <div className="aw-loading">加载中…</div>;
  }
  if (!user) {
    return <div className="aw-loading">正在跳转登录…</div>;
  }
  if (submitted) {
    return <SubmittedScreen draft={draft} />;
  }

  return (
    <div className="aw">
      {/* Top bar */}
      <header className="aw-top">
        <Link href="/apply" className="aw-back">← 返回招募页</Link>
        <div className="aw-top-mid">
          <div className="aw-top-eyebrow">SUGARGIRL ONBOARDING</div>
          <h1>创建你的 sugargirl 主页</h1>
          <p>我们会一步步帮你完成 · 填写越完整,主页越容易被推荐</p>
        </div>
        <div className="aw-top-status">
          <div className="aw-top-step">步骤 {current.index} / {STEPS.length}</div>
          <div className="aw-top-pct">
            <div className="aw-top-bar"><div style={{ width: `${pct}%` }} /></div>
            <span>{pct}%</span>
          </div>
          <div className="aw-top-save">
            {saveState === "saving" ? "保存中…" : "已自动保存"}
          </div>
        </div>
      </header>

      <div className="aw-body">
        {/* Left: step nav */}
        <nav className="aw-nav" aria-label="Steps">
          {STEPS.map((s, i) => {
            const done = s.isComplete(draft);
            const active = i === currentIdx;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setCurrentIdx(i)}
                className={"aw-nav-item" + (active ? " is-active" : "") + (done ? " is-done" : "")}
              >
                <span className="aw-nav-n">{done ? "✓" : s.index}</span>
                <span className="aw-nav-txt">
                  <b>{s.label}</b>
                  <span>{s.labelEn}</span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* Center: step body */}
        <main className="aw-main">
          <div className="aw-main-head">
            <div className="aw-main-idx">Step {current.index} · {current.labelEn}</div>
            <h2>{current.label}</h2>
            <p>{current.helper}</p>
          </div>

          <StepRenderer
            step={current.key}
            draft={draft}
            patch={patch}
            patchLifestyle={patchLifestyle}
            patchVerify={patchVerify}
          />

          {submitError && <div className="aw-err">{submitError}</div>}

          {/* Bottom nav */}
          <div className="aw-actions">
            <button type="button" onClick={goPrev} disabled={currentIdx === 0} className="aw-btn aw-btn--ghost">← 上一步</button>
            <div className="aw-actions-spacer" />
            {currentIdx < STEPS.length - 1 && (
              <button type="button" onClick={goNext} className="aw-btn aw-btn--gold">保存并下一步 →</button>
            )}
            {currentIdx === STEPS.length - 1 && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !draft.verification.confirmAdult || !draft.verification.confirmTruth || !draft.verification.acceptRules}
                className="aw-btn aw-btn--gold"
              >
                {submitting ? "提交中…" : "提交审核 →"}
              </button>
            )}
          </div>
        </main>

        {/* Right: live preview */}
        <div className="aw-preview">
          <ProfilePreview draft={draft} />
        </div>
      </div>

      <style jsx>{`
        .aw{background:#F4F4F5;min-height:100vh;padding-bottom:60px}
        .aw-loading{padding:80px 24px;text-align:center;color:#8a8a92}
        .aw-top{display:grid;grid-template-columns:auto 1fr auto;gap:24px;align-items:center;padding:20px 32px;background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:30;backdrop-filter:blur(14px)}
        .aw-back{font-size:13px;color:#8a8a92;text-decoration:none;transition:color .12s;white-space:nowrap}
        .aw-back:hover{color:#161618}
        .aw-top-mid{text-align:center;min-width:0}
        .aw-top-eyebrow{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:4px}
        .aw-top-mid h1{font-family:'Cormorant Garamond',ui-serif;font-size:24px;font-weight:500;font-style:italic;color:#161618;margin:0;letter-spacing:-0.005em}
        .aw-top-mid p{font-size:12px;color:#8a8a92;margin:2px 0 0}
        .aw-top-status{display:flex;flex-direction:column;align-items:flex-end;gap:6px;min-width:180px}
        .aw-top-step{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8a8a92;font-weight:700}
        .aw-top-pct{display:flex;align-items:center;gap:8px}
        .aw-top-bar{width:140px;height:6px;background:#F4F4F5;border-radius:99px;overflow:hidden}
        .aw-top-bar > div{height:100%;background:linear-gradient(90deg,#EEDDB8,#B8A789);border-radius:99px;transition:width .3s}
        .aw-top-pct span{font-size:12px;color:#161618;font-weight:700;font-variant-numeric:tabular-nums;min-width:36px;text-align:right}
        .aw-top-save{font-size:11px;color:#B8A789;font-weight:600}

        .aw-body{display:grid;grid-template-columns:260px minmax(0,1fr) 300px;gap:24px;max-width:1400px;margin:0 auto;padding:24px 24px 0;align-items:flex-start}

        .aw-nav{display:flex;flex-direction:column;gap:4px;background:#fff;border:1px solid var(--line);border-radius:18px;padding:12px;position:sticky;top:120px}
        .aw-nav-item{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:12px;background:transparent;border:0;text-align:left;cursor:pointer;font:inherit;color:#3d3d42;transition:background .12s,color .12s}
        .aw-nav-item:hover{background:#FBFAF7}
        .aw-nav-item.is-active{background:#161618;color:#EEDDB8}
        .aw-nav-n{flex-shrink:0;width:26px;height:26px;border-radius:50%;background:#F4F4F5;color:#8a8a92;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700}
        .aw-nav-item.is-active .aw-nav-n{background:#EEDDB8;color:#1a1409}
        .aw-nav-item.is-done .aw-nav-n{background:#B8A789;color:#fff}
        .aw-nav-item.is-active.is-done .aw-nav-n{background:#EEDDB8;color:#1a1409}
        .aw-nav-txt{display:flex;flex-direction:column;min-width:0}
        .aw-nav-txt b{font-size:13.5px;font-weight:700;letter-spacing:-0.005em}
        .aw-nav-txt span{font-size:10.5px;color:currentColor;opacity:.55;letter-spacing:.06em}

        .aw-main{background:#fff;border:1px solid var(--line);border-radius:20px;padding:32px 36px 24px;min-width:0}
        .aw-main-head{padding-bottom:22px;border-bottom:1px solid var(--line);margin-bottom:24px}
        .aw-main-idx{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:8px}
        .aw-main-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:32px;font-style:italic;font-weight:500;color:#161618;margin:0 0 8px;letter-spacing:-0.01em}
        .aw-main-head p{font-size:14px;line-height:1.7;color:#5a5a62;margin:0}

        .aw-err{margin-top:16px;padding:12px 14px;background:#FEE2E2;color:#B91C1C;border-radius:10px;font-size:13.5px}
        .aw-actions{display:flex;align-items:center;gap:10px;margin-top:32px;padding-top:20px;border-top:1px solid var(--line);position:sticky;bottom:0;background:linear-gradient(180deg,transparent,#fff 30%);padding-bottom:0}
        .aw-actions-spacer{flex:1}
        .aw-btn{padding:12px 22px;border-radius:12px;font:inherit;font-weight:700;font-size:14px;cursor:pointer;border:0;transition:transform .12s,opacity .12s;min-height:48px}
        .aw-btn:disabled{opacity:.5;cursor:not-allowed}
        .aw-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;box-shadow:0 10px 22px -12px rgba(184,167,137,.55)}
        .aw-btn--gold:hover:not(:disabled){transform:translateY(-1px)}
        .aw-btn--ghost{background:#F4F4F5;color:#161618;border:1px solid var(--line)}

        .aw-preview{min-width:0}

        @media (max-width:1200px){.aw-body{grid-template-columns:220px minmax(0,1fr) 280px;gap:18px}}
        @media (max-width:1024px){
          .aw-body{grid-template-columns:1fr;gap:16px}
          .aw-nav{flex-direction:row;overflow-x:auto;position:static;scrollbar-width:none}
          .aw-nav::-webkit-scrollbar{display:none}
          .aw-nav-item{flex-shrink:0;flex-direction:column;text-align:center;padding:10px 12px}
          .aw-nav-txt{align-items:center}
          .aw-nav-txt span{display:none}
          .aw-preview{order:-1}
        }
        @media (max-width:640px){
          .aw-top{grid-template-columns:auto 1fr;padding:14px 16px;gap:12px}
          .aw-top-mid h1{font-size:18px}
          .aw-top-status{display:none}
          .aw-body{padding:14px 12px 0}
          .aw-main{padding:22px 20px 18px;border-radius:16px}
          .aw-main-head h2{font-size:24px}
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════
// Step renderer — dispatch by step key
// ══════════════════════════════════════

interface StepRProps {
  step: StepKey;
  draft: ApplyWizardDraft;
  patch: (p: Partial<ApplyWizardDraft>) => void;
  patchLifestyle: (p: Partial<ApplyWizardDraft["lifestyle"]>) => void;
  patchVerify: (p: Partial<ApplyWizardDraft["verification"]>) => void;
}

function StepRenderer(props: StepRProps) {
  switch (props.step) {
    case "identity":  return <StepIdentity {...props} />;
    case "profile":   return <StepProfile {...props} />;
    case "physical":  return <StepPhysical {...props} />;
    case "lifestyle": return <StepLifestyle {...props} />;
    case "interests": return <StepInterests {...props} />;
    case "services":  return <StepServices {...props} />;
    case "photos":    return <StepPhotos {...props} />;
    case "videos":    return <StepVideos {...props} />;
    case "verify":    return <StepVerify {...props} />;
  }
}

// ── Reusable primitives ──
const Field = ({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) => (
  <label className="fld">
    <span className="fld-l">{label}{hint && <em>{hint}</em>}</span>
    {children}
    {error && <span className="fld-err">{error}</span>}
    <style jsx>{`
      .fld{display:flex;flex-direction:column;gap:6px;min-width:0}
      .fld-l{font-size:12.5px;color:#3d3d42;font-weight:600;letter-spacing:.01em}
      .fld-l em{color:#8a8a92;font-weight:500;font-style:normal;font-size:11.5px;margin-left:6px}
      .fld-err{font-size:11.5px;color:#B91C1C}
    `}</style>
  </label>
);

const ChipGroup = ({ options, values, onToggle, max }: { options: string[]; values: string[]; onToggle: (v: string) => void; max?: number }) => (
  <div className="chips">
    {options.map((opt) => {
      const active = values.includes(opt);
      const disabled = !active && max !== undefined && values.length >= max;
      return (
        <button key={opt} type="button" onClick={() => onToggle(opt)} disabled={disabled}
          className={"chip" + (active ? " is-active" : "")}>
          {opt}
        </button>
      );
    })}
    <style jsx>{`
      .chips{display:flex;flex-wrap:wrap;gap:6px}
      .chip{padding:7px 14px;border-radius:99px;background:#F4F4F5;border:1px solid transparent;color:#3d3d42;font:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .12s}
      .chip:hover:not(:disabled){border-color:#B8A789}
      .chip.is-active{background:#161618;color:#EEDDB8;border-color:#161618;font-weight:600}
      .chip:disabled{opacity:.45;cursor:not-allowed}
    `}</style>
  </div>
);

const inputCls = "aw-in";
const InputStyles = () => (
  <style jsx global>{`
    .aw-in{width:100%;padding:11px 14px;border:1px solid #E8E8EC;border-radius:12px;background:#F8F8F9;font:inherit;font-size:14px;color:#161618;outline:none;transition:background .12s,border-color .12s;min-height:44px}
    .aw-in:focus{background:#fff;border-color:#161618}
    textarea.aw-in{resize:vertical;line-height:1.6;min-height:120px}
    @media (max-width:640px){.aw-in{font-size:16px}}
  `}</style>
);

// ══════════════════════════════════════
// Step components
// ══════════════════════════════════════

function StepIdentity({ draft, patch }: StepRProps) {
  const age = computeAge(draft.birthDate);
  return (
    <div className="grid grid-2">
      <InputStyles />
      <Field label="昵称 / Display Name *">
        <input className={inputCls} value={draft.displayName} onChange={(e) => patch({ displayName: e.target.value })} placeholder="Aria" maxLength={60} />
      </Field>
      <Field label="Username *" hint="仅小写字母、数字、短横线">
        <input className={inputCls} value={draft.username} onChange={(e) => patch({ username: normalizeUsername(e.target.value) })} placeholder="aria" maxLength={32} />
      </Field>
      <Field label="邮箱 *">
        <input className={inputCls} type="email" value={draft.email} onChange={(e) => patch({ email: e.target.value })} placeholder="you@email.com" />
      </Field>
      <Field label="手机" hint="(可选,不会公开)">
        <input className={inputCls} type="tel" value={draft.phone || ""} onChange={(e) => patch({ phone: e.target.value })} placeholder="+44 …" />
      </Field>
      <Field label="出生日期 *" hint={age != null ? `年龄 ${age}` : "18+"}>
        <input className={inputCls} type="date" value={draft.birthDate} onChange={(e) => patch({ birthDate: e.target.value })} />
      </Field>
      <Field label="国家 *">
        <select className={inputCls} value={draft.country} onChange={(e) => patch({ country: e.target.value })}>
          <option value="">选择国家</option>
          {OPTIONS.countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="城市 *">
        <input className={inputCls} value={draft.city} onChange={(e) => patch({ city: e.target.value })} placeholder="London" />
      </Field>
      <Field label="可展示城市" hint="(可选,支持多个)">
        <input className={inputCls} value={draft.availableCities.join(", ")}
          onChange={(e) => patch({ availableCities: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          placeholder="London, Manchester" />
      </Field>
      <div className="grid-full">
        <Field label="语言 *" hint="至少选择 1 个">
          <ChipGroup options={OPTIONS.languages} values={draft.languages} onToggle={(v) => patch({
            languages: draft.languages.includes(v) ? draft.languages.filter((x) => x !== v) : [...draft.languages, v],
          })} />
        </Field>
      </div>
      <p className="grid-full aw-note">
        这些信息将用于创建你的 sugargirl 主页。邮箱和手机不会公开展示;公开展示的是昵称、城市、语言与基础资料。
      </p>
      <style jsx>{`
        .grid{display:grid;gap:16px}
        .grid-2{grid-template-columns:1fr 1fr}
        .grid-full{grid-column:1/-1}
        .aw-note{font-size:12.5px;color:#8a8a92;margin:0;padding:12px 14px;background:#FBFAF7;border-radius:10px;line-height:1.6}
        @media (max-width:640px){.grid-2{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}

function StepProfile({ draft, patch }: StepRProps) {
  return (
    <div className="grid">
      <InputStyles />
      <Field label="一句话介绍 · Slogan" hint="(建议填写)">
        <input className={inputCls} value={draft.slogan} onChange={(e) => patch({ slogan: e.target.value })}
          placeholder="Life is short — dine well." maxLength={140} />
      </Field>
      <Field label={`个人简介 · Bio *`} hint={`(${draft.bio.length} / 40+ 字符)`}>
        <textarea className={inputCls} value={draft.bio} onChange={(e) => patch({ bio: e.target.value })}
          placeholder="介绍你的生活方式、性格、兴趣、希望被看见的一面…" maxLength={800} />
      </Field>
      <Field label="职业 · Occupation" hint="(建议填写)">
        <input className={inputCls} value={draft.occupation} onChange={(e) => patch({ occupation: e.target.value })}
          placeholder="Fashion Buyer · Model · Photographer" />
      </Field>
      <Field label="个人风格标签" hint="至少 2 个">
        <ChipGroup options={OPTIONS.profileTags} values={draft.profileTags} max={8}
          onToggle={(v) => patch({
            profileTags: draft.profileTags.includes(v) ? draft.profileTags.filter((x) => x !== v) : [...draft.profileTags, v],
          })} />
      </Field>
      <style jsx>{`
        .grid{display:grid;gap:18px}
      `}</style>
    </div>
  );
}

function StepPhysical({ draft, patch }: StepRProps) {
  return (
    <div className="grid grid-2">
      <InputStyles />
      <Field label="身高 (cm)">
        <input className={inputCls} type="number" min={140} max={210} value={draft.height || ""} onChange={(e) => patch({ height: e.target.value ? Number(e.target.value) : undefined })} placeholder="168" />
      </Field>
      <Field label="体重 (kg) · 可选">
        <input className={inputCls} type="number" min={35} max={140} value={draft.weight || ""} onChange={(e) => patch({ weight: e.target.value ? Number(e.target.value) : undefined })} placeholder="52" />
      </Field>
      <div className="grid-full">
        <Field label="体型 · Body Type">
          <ChipGroup options={OPTIONS.bodyType} values={draft.bodyType ? [draft.bodyType] : []}
            onToggle={(v) => patch({ bodyType: draft.bodyType === v ? undefined : v })} />
        </Field>
      </div>
      <div className="grid-full">
        <Field label="肤色">
          <ChipGroup options={OPTIONS.skinTone} values={draft.skinTone ? [draft.skinTone] : []}
            onToggle={(v) => patch({ skinTone: draft.skinTone === v ? undefined : v })} />
        </Field>
      </div>
      <div className="grid-full">
        <Field label="发色">
          <ChipGroup options={OPTIONS.hairColor} values={draft.hairColor ? [draft.hairColor] : []}
            onToggle={(v) => patch({ hairColor: draft.hairColor === v ? undefined : v })} />
        </Field>
      </div>
      <div className="grid-full">
        <Field label="眼睛颜色">
          <ChipGroup options={OPTIONS.eyeColor} values={draft.eyeColor ? [draft.eyeColor] : []}
            onToggle={(v) => patch({ eyeColor: draft.eyeColor === v ? undefined : v })} />
        </Field>
      </div>
      <Field label="星座 · 可选">
        <input className={inputCls} value={draft.zodiac || ""} onChange={(e) => patch({ zodiac: e.target.value })} placeholder="Libra" />
      </Field>
      <Field label="学历 · 可选">
        <input className={inputCls} value={draft.education || ""} onChange={(e) => patch({ education: e.target.value })} placeholder="Bachelor / Master" />
      </Field>
      <p className="grid-full aw-note">
        这些信息帮助用户更准确了解你。你可以在后续管理界面调整每个字段的公开范围。
      </p>
      <style jsx>{`
        .grid{display:grid;gap:16px}
        .grid-2{grid-template-columns:1fr 1fr}
        .grid-full{grid-column:1/-1}
        .aw-note{font-size:12.5px;color:#8a8a92;margin:0;padding:12px 14px;background:#FBFAF7;border-radius:10px;line-height:1.6}
        @media (max-width:640px){.grid-2{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}

function StepLifestyle({ draft, patchLifestyle }: StepRProps) {
  return (
    <div className="grid">
      <InputStyles />
      <Field label="吸烟"><ChipGroup options={OPTIONS.smoking} values={draft.lifestyle.smoking ? [draft.lifestyle.smoking] : []} onToggle={(v) => patchLifestyle({ smoking: draft.lifestyle.smoking === v ? undefined : v })} /></Field>
      <Field label="饮酒"><ChipGroup options={OPTIONS.drinking} values={draft.lifestyle.drinking ? [draft.lifestyle.drinking] : []} onToggle={(v) => patchLifestyle({ drinking: draft.lifestyle.drinking === v ? undefined : v })} /></Field>
      <Field label="作息"><ChipGroup options={OPTIONS.schedule} values={draft.lifestyle.schedule ? [draft.lifestyle.schedule] : []} onToggle={(v) => patchLifestyle({ schedule: draft.lifestyle.schedule === v ? undefined : v })} /></Field>
      <Field label="运动习惯"><ChipGroup options={OPTIONS.fitness} values={draft.lifestyle.fitness ? [draft.lifestyle.fitness] : []} onToggle={(v) => patchLifestyle({ fitness: draft.lifestyle.fitness === v ? undefined : v })} /></Field>
      <Field label="旅行频率"><ChipGroup options={OPTIONS.travel} values={draft.lifestyle.travel ? [draft.lifestyle.travel] : []} onToggle={(v) => patchLifestyle({ travel: draft.lifestyle.travel === v ? undefined : v })} /></Field>
      <Field label="约会偏好"><ChipGroup options={OPTIONS.datingPref} values={draft.lifestyle.datingPref ? [draft.lifestyle.datingPref] : []} onToggle={(v) => patchLifestyle({ datingPref: draft.lifestyle.datingPref === v ? undefined : v })} /></Field>
      <Field label="时区" hint="可选"><input className={inputCls} value={draft.lifestyle.timezone || ""} onChange={(e) => patchLifestyle({ timezone: e.target.value })} placeholder="GMT / GMT+8" /></Field>
      <style jsx>{`.grid{display:grid;gap:18px}`}</style>
    </div>
  );
}

function StepInterests({ draft, patch }: StepRProps) {
  return (
    <div className="grid">
      <Field label={`兴趣爱好 · ${draft.interests.length} / 12`} hint="至少 3 个,最多 12 个">
        <ChipGroup options={OPTIONS.interests} values={draft.interests} max={12}
          onToggle={(v) => patch({
            interests: draft.interests.includes(v) ? draft.interests.filter((x) => x !== v) : [...draft.interests, v],
          })} />
      </Field>
      <p className="aw-note">
        兴趣越具体,越容易匹配到对的人。 建议选择日常真实感兴趣的内容 · 不要盲目选择热门标签。
      </p>
      <style jsx>{`
        .grid{display:grid;gap:16px}
        .aw-note{font-size:12.5px;color:#8a8a92;margin:0;padding:12px 14px;background:#FBFAF7;border-radius:10px;line-height:1.6}
      `}</style>
    </div>
  );
}

function StepServices({ draft, patch }: StepRProps) {
  const toggle = (key: string) => {
    const cur = draft.services[key] || { enabled: false };
    patch({ services: { ...draft.services, [key]: { ...cur, enabled: !cur.enabled } } });
  };
  const setField = (key: string, field: "priceFrom" | "duration" | "notes", value: string) => {
    const cur = draft.services[key] || { enabled: true };
    patch({ services: { ...draft.services, [key]: { ...cur, [field]: value } } });
  };

  return (
    <div className="svcs">
      <InputStyles />
      {SERVICE_DEFS.map((s) => {
        const state = draft.services[s.key] || { enabled: false };
        return (
          <div key={s.key} className={"svc " + (state.enabled ? "is-on" : "")}>
            <div className="svc-top" onClick={() => toggle(s.key)}>
              <div className="svc-info">
                <b>{s.label}</b>
                <span className="svc-en">{s.labelEn}</span>
                <span className="svc-desc">{s.desc}</span>
              </div>
              <div className={"svc-tg " + (state.enabled ? "on" : "")} role="switch" aria-checked={state.enabled}>
                <span />
              </div>
            </div>
            {state.enabled && (
              <div className="svc-body">
                <Field label="起价" hint="(可选)">
                  <input className={inputCls} value={state.priceFrom || ""} onChange={(e) => setField(s.key, "priceFrom", e.target.value)} placeholder="S$ 280+" />
                </Field>
                <Field label="时长" hint="(可选)">
                  <select className={inputCls} value={state.duration || ""} onChange={(e) => setField(s.key, "duration", e.target.value)}>
                    <option value="">选择</option>
                    {OPTIONS.duration.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </Field>
                <div className="svc-full">
                  <Field label="备注 · 可选">
                    <input className={inputCls} value={state.notes || ""} onChange={(e) => setField(s.key, "notes", e.target.value)} placeholder="边界与偏好说明" />
                  </Field>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <style jsx>{`
        .svcs{display:flex;flex-direction:column;gap:10px}
        .svc{background:#FBFAF7;border:1px solid #EEE9DC;border-radius:14px;transition:border-color .12s,background .12s}
        .svc.is-on{background:#fff;border-color:#B8A789}
        .svc-top{display:flex;align-items:center;gap:16px;padding:14px 18px;cursor:pointer;user-select:none}
        .svc-info{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
        .svc-info b{font-size:14.5px;color:#161618;font-weight:700}
        .svc-en{font-size:10.5px;color:#B8A789;letter-spacing:.14em;text-transform:uppercase;font-weight:700}
        .svc-desc{font-size:12.5px;color:#5a5a62;line-height:1.55}
        .svc-tg{width:42px;height:24px;background:#E8E8EC;border-radius:99px;position:relative;transition:background .16s;flex-shrink:0}
        .svc-tg span{position:absolute;top:2px;left:2px;width:20px;height:20px;background:#fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.15);transition:transform .16s}
        .svc-tg.on{background:#161618}
        .svc-tg.on span{transform:translateX(18px);background:#EEDDB8}
        .svc-body{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 18px 16px}
        .svc-full{grid-column:1/-1}
        @media (max-width:640px){.svc-body{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}

function StepPhotos({ draft, patch }: StepRProps) {
  const onFile = (e: React.ChangeEvent<HTMLInputElement>, kind: "avatar" | "cover" | "gallery") => {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result);
        if (kind === "avatar") patch({ avatar: url });
        else if (kind === "cover") patch({ coverImage: url });
        else patch({ photos: [...draft.photos, { id: uid(), kind: "image", url, createdAt: new Date().toISOString() }] });
      };
      reader.readAsDataURL(f);
    }
    e.target.value = "";
  };
  const removePhoto = (id: string) => patch({ photos: draft.photos.filter((p) => p.id !== id) });
  const toggleLock = (id: string) => patch({
    photos: draft.photos.map((p) => p.id === id ? { ...p, isLocked: !p.isLocked } : p),
  });

  return (
    <div className="ph">
      {/* Avatar + Cover */}
      <div className="ph-hero">
        <div className="ph-slot">
          <div className="ph-slot-h">头像 *</div>
          <label className="ph-drop ph-drop--sq">
            {draft.avatar
              ? <img src={draft.avatar} alt="avatar" />
              : <span>+ 上传头像</span>}
            <input type="file" accept="image/*" onChange={(e) => onFile(e, "avatar")} />
          </label>
        </div>
        <div className="ph-slot ph-slot--wide">
          <div className="ph-slot-h">封面图</div>
          <label className="ph-drop">
            {draft.coverImage
              ? <img src={draft.coverImage} alt="cover" />
              : <span>+ 上传封面 · 16:10 · 用于 Hero 背景</span>}
            <input type="file" accept="image/*" onChange={(e) => onFile(e, "cover")} />
          </label>
        </div>
      </div>

      {/* Gallery */}
      <div className="ph-slot">
        <div className="ph-slot-h">图库 · 至少 3 张 · 建议 6-12 张</div>
        <div className="ph-grid">
          {draft.photos.map((p) => (
            <div key={p.id} className="ph-tile">
              <img src={p.url} alt="" />
              <div className="ph-tile-actions">
                <button type="button" onClick={() => toggleLock(p.id)}>{p.isLocked ? "🔒 付费" : "🌐 公开"}</button>
                <button type="button" onClick={() => removePhoto(p.id)}>×</button>
              </div>
            </div>
          ))}
          <label className="ph-drop ph-drop--sq ph-drop--add">
            <span>+ 添加照片</span>
            <input type="file" accept="image/*" multiple onChange={(e) => onFile(e, "gallery")} />
          </label>
        </div>
      </div>

      <p className="aw-note">
        上传的照片建议清晰、真实、多角度。至少 3 张才能保证主页视觉完整。付费解锁的照片仍展示在主页,但用户需要用 Credits 解锁查看高清版。
      </p>

      <style jsx>{`
        .ph{display:flex;flex-direction:column;gap:22px}
        .ph-hero{display:grid;grid-template-columns:180px 1fr;gap:16px}
        .ph-slot{display:flex;flex-direction:column;gap:8px;min-width:0}
        .ph-slot-h{font-size:12.5px;color:#3d3d42;font-weight:600}
        .ph-drop{position:relative;display:flex;align-items:center;justify-content:center;background:#FBFAF7;border:2px dashed #EEE9DC;border-radius:14px;color:#B8A789;font-size:13px;font-weight:600;cursor:pointer;overflow:hidden;transition:border-color .12s,background .12s;aspect-ratio:16/10}
        .ph-drop:hover{border-color:#B8A789;background:#F4F4F5}
        .ph-drop--sq{aspect-ratio:1}
        .ph-drop input{position:absolute;inset:0;opacity:0;cursor:pointer}
        .ph-drop img{width:100%;height:100%;object-fit:cover;display:block}
        .ph-drop--add{border-style:dashed}
        .ph-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}
        .ph-tile{position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;background:#F4F4F5}
        .ph-tile img{width:100%;height:100%;object-fit:cover}
        .ph-tile-actions{position:absolute;top:6px;right:6px;left:6px;display:flex;justify-content:space-between;gap:4px}
        .ph-tile-actions button{padding:3px 8px;background:rgba(0,0,0,.6);color:#fff;font-size:10.5px;font-weight:700;border:0;border-radius:99px;cursor:pointer;backdrop-filter:blur(6px)}
        .aw-note{font-size:12.5px;color:#8a8a92;margin:0;padding:12px 14px;background:#FBFAF7;border-radius:10px;line-height:1.6}
        @media (max-width:640px){.ph-hero{grid-template-columns:1fr;gap:12px}}
      `}</style>
    </div>
  );
}

function StepVideos({ draft, patch }: StepRProps) {
  const onFile = (e: React.ChangeEvent<HTMLInputElement>, kind: "cover" | "intro" | "gallery") => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      if (kind === "cover") patch({ coverVideo: url });
      else if (kind === "intro") patch({ introVideo: url });
      else patch({ videos: [...draft.videos, { id: uid(), kind: "video", url, createdAt: new Date().toISOString() }] });
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  };
  const removeVid = (id: string) => patch({ videos: draft.videos.filter((v) => v.id !== id) });

  return (
    <div className="vd">
      <div className="vd-hero">
        <div className="vd-slot">
          <div className="vd-slot-h">主页封面视频 · 用于 Hero</div>
          <label className="vd-drop">
            {draft.coverVideo
              ? <video src={draft.coverVideo} muted loop autoPlay playsInline />
              : <span>+ 上传封面视频 · 15-30s</span>}
            <input type="file" accept="video/mp4,video/webm" onChange={(e) => onFile(e, "cover")} />
          </label>
        </div>
        <div className="vd-slot">
          <div className="vd-slot-h">自我介绍视频 · 20-30s</div>
          <label className="vd-drop">
            {draft.introVideo
              ? <video src={draft.introVideo} muted controls playsInline />
              : <span>+ 上传自我介绍视频</span>}
            <input type="file" accept="video/mp4,video/webm" onChange={(e) => onFile(e, "intro")} />
          </label>
        </div>
      </div>
      <div className="vd-slot">
        <div className="vd-slot-h">视频合集 · 可选</div>
        <div className="vd-grid">
          {draft.videos.map((v) => (
            <div key={v.id} className="vd-tile">
              <video src={v.url} muted playsInline />
              <button type="button" onClick={() => removeVid(v.id)}>×</button>
            </div>
          ))}
          <label className="vd-drop vd-drop--add">
            <span>+ 添加视频</span>
            <input type="file" accept="video/mp4,video/webm" onChange={(e) => onFile(e, "gallery")} />
          </label>
        </div>
      </div>
      <p className="aw-note">
        自我介绍视频能显著提升信任 · 20 秒的语音、眼神、气息 比 30 张照片更能反映真实感。视频可以后续再补,不影响当前提交。
      </p>
      <style jsx>{`
        .vd{display:flex;flex-direction:column;gap:22px}
        .vd-hero{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .vd-slot{display:flex;flex-direction:column;gap:8px;min-width:0}
        .vd-slot-h{font-size:12.5px;color:#3d3d42;font-weight:600}
        .vd-drop{position:relative;display:flex;align-items:center;justify-content:center;background:#FBFAF7;border:2px dashed #EEE9DC;border-radius:14px;color:#B8A789;font-size:13px;font-weight:600;cursor:pointer;overflow:hidden;aspect-ratio:16/10;min-height:180px}
        .vd-drop:hover{border-color:#B8A789;background:#F4F4F5}
        .vd-drop input{position:absolute;inset:0;opacity:0;cursor:pointer}
        .vd-drop video{width:100%;height:100%;object-fit:cover;background:#000}
        .vd-drop--add{aspect-ratio:auto;min-height:120px}
        .vd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}
        .vd-tile{position:relative;aspect-ratio:16/10;border-radius:12px;overflow:hidden;background:#000}
        .vd-tile video{width:100%;height:100%;object-fit:cover}
        .vd-tile button{position:absolute;top:6px;right:6px;padding:2px 8px;background:rgba(0,0,0,.6);color:#fff;font-size:12px;border:0;border-radius:99px;cursor:pointer}
        .aw-note{font-size:12.5px;color:#8a8a92;margin:0;padding:12px 14px;background:#FBFAF7;border-radius:10px;line-height:1.6}
        @media (max-width:640px){.vd-hero{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}

function StepVerify({ draft, patchVerify }: StepRProps) {
  const checks = STEPS.map((s) => ({ ...s, done: s.isComplete(draft) }));
  return (
    <div className="vf">
      {/* Checklist */}
      <div className="vf-check">
        <h4>提交前 Checklist</h4>
        <ul>
          {checks.map((c) => (
            <li key={c.key} className={c.done ? "is-done" : ""}>
              <span className="vf-tick">{c.done ? "✓" : "○"}</span>
              <b>{c.label}</b>
              <span className="vf-hint">{c.helper}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Verification confirms */}
      <div className="vf-confirm">
        <label className="vf-row">
          <input type="checkbox" checked={draft.verification.confirmAdult} onChange={(e) => patchVerify({ confirmAdult: e.target.checked })} />
          <div>
            <b>我确认已满 18 岁</b>
            <span>平台仅面向 18+ 成年用户 · 后台会核对出生日期</span>
          </div>
        </label>
        <label className="vf-row">
          <input type="checkbox" checked={draft.verification.confirmTruth} onChange={(e) => patchVerify({ confirmTruth: e.target.checked })} />
          <div>
            <b>我确认资料真实</b>
            <span>照片、视频与文字内容均属本人真实资料 · 不使用他人素材</span>
          </div>
        </label>
        <label className="vf-row">
          <input type="checkbox" checked={draft.verification.acceptRules} onChange={(e) => patchVerify({ acceptRules: e.target.checked })} />
          <div>
            <b>我同意 Sugardating 平台规则</b>
            <span>站内沟通、无站外付款、不撮合线下交易 · 具体见 Terms &amp; Guidelines</span>
          </div>
        </label>
      </div>

      <p className="aw-note">
        身份认证、真人识别、视频认证会在提交后由审核团队引导完成。当前无需上传证件。
      </p>

      <style jsx>{`
        .vf{display:flex;flex-direction:column;gap:22px}
        .vf-check{background:#FBFAF7;border:1px solid #EEE9DC;border-radius:14px;padding:20px 22px}
        .vf-check h4{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#B8A789;font-weight:700;margin:0 0 12px}
        .vf-check ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
        .vf-check li{display:grid;grid-template-columns:24px 1fr;grid-template-rows:auto auto;column-gap:10px;font-size:13.5px;color:#3d3d42;opacity:.6}
        .vf-check li.is-done{opacity:1}
        .vf-check li b{color:#161618;font-weight:700;grid-column:2}
        .vf-check li .vf-tick{grid-row:span 2;width:22px;height:22px;border-radius:50%;background:#E8E8EC;color:#8a8a92;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:800}
        .vf-check li.is-done .vf-tick{background:#161618;color:#EEDDB8}
        .vf-check li .vf-hint{grid-column:2;font-size:12px;color:#8a8a92;line-height:1.55}
        .vf-confirm{display:flex;flex-direction:column;gap:10px}
        .vf-row{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;background:#fff;border:1px solid var(--line);border-radius:12px;cursor:pointer}
        .vf-row input{width:18px;height:18px;margin-top:2px;flex-shrink:0;accent-color:#161618}
        .vf-row b{display:block;font-size:14px;color:#161618;font-weight:700;margin-bottom:2px}
        .vf-row span{font-size:12.5px;color:#5a5a62;line-height:1.55}
        .aw-note{font-size:12.5px;color:#8a8a92;margin:0;padding:12px 14px;background:#FBFAF7;border-radius:10px;line-height:1.6}
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════
// Submitted screen
// ══════════════════════════════════════

function SubmittedScreen({ draft }: { draft: ApplyWizardDraft }) {
  return (
    <div className="ss">
      <div className="ss-in">
        <div className="ss-ic">✓</div>
        <div className="ss-eyebrow">Application Submitted</div>
        <h1>你的 sugargirl 入驻申请已提交</h1>
        <p>
          我们会审核你的资料。审核通过后,你将获得 sugargirl 主页展示机会。
          你可以继续完善照片、视频和服务信息,提高通过率和主页吸引力。
        </p>
        <div className="ss-info">
          <div><span>Username</span><b>@{draft.username}</b></div>
          <div><span>Status</span><b className="ss-tag">Reviewing</b></div>
        </div>
        <div className="ss-cta">
          <Link href="/apply" className="ss-btn ss-btn--gold">返回招募页</Link>
          <Link href="/apply/start?resume=1" className="ss-btn ss-btn--ghost">继续完善资料</Link>
          <Link href="/" className="ss-btn ss-btn--ghost">返回首页</Link>
        </div>
      </div>
      <style jsx>{`
        .ss{min-height:calc(100vh - 120px);background:#F4F4F5;display:flex;align-items:center;justify-content:center;padding:60px 24px}
        .ss-in{max-width:600px;text-align:center;background:#fff;border:1px solid var(--line);border-radius:24px;padding:48px 40px;box-shadow:0 30px 80px -30px rgba(0,0,0,.2)}
        .ss-ic{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;display:inline-flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;margin-bottom:20px}
        .ss-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:12px}
        .ss-in h1{font-family:'Cormorant Garamond',ui-serif;font-size:32px;font-style:italic;font-weight:500;color:#161618;margin:0 0 14px;letter-spacing:-0.01em}
        .ss-in p{font-size:14.5px;line-height:1.75;color:#3d3d42;margin:0 0 24px}
        .ss-info{display:flex;justify-content:center;gap:32px;padding:16px 20px;background:#FBFAF7;border-radius:12px;margin-bottom:24px}
        .ss-info > div{display:flex;flex-direction:column;gap:2px;text-align:left}
        .ss-info span{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#8a8a92;font-weight:700}
        .ss-info b{font-size:15px;color:#161618;font-weight:700}
        .ss-tag{background:#EEDDB8;color:#1a1409;padding:3px 10px;border-radius:99px;font-size:12px}
        .ss-cta{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
        .ss-btn{padding:12px 22px;border-radius:12px;font-size:13.5px;font-weight:700;text-decoration:none;transition:transform .12s}
        .ss-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}
        .ss-btn--ghost{background:#F4F4F5;color:#161618;border:1px solid var(--line)}
        .ss-btn:hover{transform:translateY(-1px)}
        @media (max-width:640px){
          .ss-in{padding:32px 24px}
          .ss-in h1{font-size:24px}
          .ss-info{flex-direction:column;gap:12px}
        }
      `}</style>
    </div>
  );
}
