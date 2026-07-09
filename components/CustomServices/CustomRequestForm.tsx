"use client";
// Custom event request form — POST /api/custom-services/request
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/components/Auth/AuthProvider";
import {
  EVENT_KEY_LABEL, BUDGET_TIERS, STYLE_PREFS, LANG_PREFS,
  type EventKey,
} from "@/lib/premium-events-labels";

export default function CustomRequestForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [events, setEvents] = useState<EventKey[]>([]);
  const [country, setCountry] = useState("United Kingdom");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [langs, setLangs] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [needsPhotoVideo, setNeedsPhotoVideo] = useState(false);
  const [needsVideoConfirm, setNeedsVideoConfirm] = useState(true);
  const [requiresVerified, setRequiresVerified] = useState(true);
  const [wantsRecommendations, setWantsRecommendations] = useState(true);
  const [budgetRange, setBudgetRange] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmAdult, setConfirmAdult] = useState(false);
  const [acceptRules, setAcceptRules] = useState(false);

  const toggle = <T extends string>(list: T[], setList: (v: T[]) => void, val: T) => {
    setList(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null); setLoading(true);
    try {
      const res = await fetch("/api/custom-services/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name, email, phone,
          eventTypes: events,
          country, city, area, venue,
          date, startTime, duration,
          languages: langs,
          stylePreferences: styles,
          guestCount: guestCount ? Number(guestCount) : undefined,
          dressCode,
          needsPhotoVideo, needsVideoConfirmation: needsVideoConfirm,
          requiresVerified, wantsRecommendations,
          budgetRange, notes,
          confirmAdult, acceptPlatformRules: acceptRules,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.message || "提交失败,请稍后重试");
        return;
      }
      setSuccess(data.requestId);
    } catch {
      setError("网络错误,请稍后重试");
    } finally { setLoading(false); }
  }

  if (success) {
    return (
      <div className="cs-form cs-form--success">
        <div className="cs-success-ic">✓</div>
        <h3>需求已提交</h3>
        <p>
          平台会根据你的活动场景、城市、时间和偏好,为你推荐合适的 sugargirl。
          建议保持登录状态,方便接收推荐结果。
        </p>
        <div className="cs-success-id">Request ID: <code>{success}</code></div>
        {!user && (
          <div className="cs-success-cta">
            <Link href="/register" className="cs-form-btn cs-form-btn--primary">注册以接收推荐</Link>
            <Link href="/login" className="cs-form-btn cs-form-btn--ghost">登录</Link>
          </div>
        )}
        <button type="button" className="cs-form-btn cs-form-btn--ghost" onClick={() => setSuccess(null)}>
          提交另一个需求
        </button>
        <style jsx>{formStyles}</style>
      </div>
    );
  }

  return (
    <form className="cs-form" onSubmit={onSubmit} noValidate>
      <div className="cs-form-h">
        <h3>提交你的定制需求</h3>
        <p>告诉我们你的活动场景、时间、城市和偏好,平台将根据需求推荐合适的 sugargirl。</p>
      </div>

      {/* 基础信息 */}
      <fieldset className="cs-fs">
        <legend>基础信息</legend>
        <div className="cs-row">
          <label className="cs-f">
            <span>姓名 / 称呼 <b>*</b></span>
            <input type="text" required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex / 陈先生" />
          </label>
          <label className="cs-f">
            <span>邮箱 <b>*</b></span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          </label>
          <label className="cs-f">
            <span>手机 <em>(可选)</em></span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 …" />
          </label>
        </div>
        {user && <div className="cs-hint">✓ 已登录 · 需求将绑定到你的账户</div>}
      </fieldset>

      {/* 活动类型 */}
      <fieldset className="cs-fs">
        <legend>活动类型 <b>*</b></legend>
        <div className="cs-chips">
          {(Object.keys(EVENT_KEY_LABEL) as EventKey[]).map((k) => (
            <label key={k} className={"cs-chip" + (events.includes(k) ? " is-active" : "")}>
              <input type="checkbox" checked={events.includes(k)} onChange={() => toggle(events, setEvents, k)} />
              <span>{EVENT_KEY_LABEL[k].title}</span>
              <em>{EVENT_KEY_LABEL[k].titleEn}</em>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 活动地点 */}
      <fieldset className="cs-fs">
        <legend>活动地点</legend>
        <div className="cs-row">
          <label className="cs-f"><span>国家</span><input type="text" value={country} onChange={(e) => setCountry(e.target.value)} /></label>
          <label className="cs-f"><span>城市</span><input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="London" /></label>
          <label className="cs-f"><span>区域</span><input type="text" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Mayfair" /></label>
          <label className="cs-f cs-f--wide"><span>具体场地 <em>(可选)</em></span><input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Claridge's · Marina · Studio…" /></label>
        </div>
      </fieldset>

      {/* 时间安排 */}
      <fieldset className="cs-fs">
        <legend>时间安排</legend>
        <div className="cs-row">
          <label className="cs-f"><span>日期</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label className="cs-f"><span>开始时间</span><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></label>
          <label className="cs-f">
            <span>持续时长</span>
            <select value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="">选择</option>
              <option>2 小时</option>
              <option>4 小时</option>
              <option>半天</option>
              <option>全天</option>
              <option>2 天+</option>
            </select>
          </label>
        </div>
      </fieldset>

      {/* 需求偏好 */}
      <fieldset className="cs-fs">
        <legend>需求偏好</legend>
        <div className="cs-sub">语言</div>
        <div className="cs-chips cs-chips--sm">
          {LANG_PREFS.map((l) => (
            <label key={l} className={"cs-chip" + (langs.includes(l) ? " is-active" : "")}>
              <input type="checkbox" checked={langs.includes(l)} onChange={() => toggle(langs, setLangs, l)} />
              <span>{l}</span>
            </label>
          ))}
        </div>
        <div className="cs-sub">风格偏好</div>
        <div className="cs-chips cs-chips--sm">
          {STYLE_PREFS.map((s) => (
            <label key={s} className={"cs-chip" + (styles.includes(s) ? " is-active" : "")}>
              <input type="checkbox" checked={styles.includes(s)} onChange={() => toggle(styles, setStyles, s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 活动细节 */}
      <fieldset className="cs-fs">
        <legend>活动细节</legend>
        <div className="cs-row">
          <label className="cs-f"><span>预计人数</span><input type="number" min={1} value={guestCount} onChange={(e) => setGuestCount(e.target.value)} placeholder="1-30" /></label>
          <label className="cs-f cs-f--wide"><span>着装要求</span><input type="text" value={dressCode} onChange={(e) => setDressCode(e.target.value)} placeholder="Cocktail · Black-tie · Smart casual…" /></label>
        </div>
        <div className="cs-checks">
          <label className="cs-check"><input type="checkbox" checked={needsPhotoVideo} onChange={(e) => setNeedsPhotoVideo(e.target.checked)} /> 需要拍照 / 视频</label>
          <label className="cs-check"><input type="checkbox" checked={needsVideoConfirm} onChange={(e) => setNeedsVideoConfirm(e.target.checked)} /> 需要先视频确认</label>
          <label className="cs-check"><input type="checkbox" checked={requiresVerified} onChange={(e) => setRequiresVerified(e.target.checked)} /> 仅推荐已认证 sugargirl</label>
          <label className="cs-check"><input type="checkbox" checked={wantsRecommendations} onChange={(e) => setWantsRecommendations(e.target.checked)} /> 希望平台推荐 3-5 位候选</label>
        </div>
      </fieldset>

      {/* 预算 */}
      <fieldset className="cs-fs">
        <legend>预算范围</legend>
        <div className="cs-chips cs-chips--sm">
          {BUDGET_TIERS.map((b) => (
            <label key={b.value} className={"cs-chip" + (budgetRange === b.value ? " is-active" : "")}>
              <input type="radio" name="budget" checked={budgetRange === b.value} onChange={() => setBudgetRange(b.value)} />
              <span>{b.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Notes */}
      <fieldset className="cs-fs">
        <legend>其他说明 <em>(可选)</em></legend>
        <textarea rows={4} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="边界说明、特殊需求、活动亮点…" />
      </fieldset>

      {/* Confirm */}
      <fieldset className="cs-fs cs-fs--confirm">
        <label className="cs-check"><input type="checkbox" required checked={confirmAdult} onChange={(e) => setConfirmAdult(e.target.checked)} /> 我确认自己已满 18 岁</label>
        <label className="cs-check"><input type="checkbox" required checked={acceptRules} onChange={(e) => setAcceptRules(e.target.checked)} /> 我同意通过站内沟通确认细节,并理解平台只提供匹配与沟通工具</label>
      </fieldset>

      {error && <div className="cs-form-err">{error}</div>}

      <div className="cs-form-actions">
        <button type="submit" disabled={loading} className="cs-form-btn cs-form-btn--gold">
          {loading ? "提交中…" : "提交定制需求"}
        </button>
        <p className="cs-form-note">
          提交后平台会根据你的活动场景、语言、时间与预算,为你推荐更合适的 sugargirl。
          实际匹配结果视资料完整度与在线情况而定,平台不做强制承诺。
        </p>
      </div>

      <style jsx>{formStyles}</style>
    </form>
  );
}

const formStyles = `
.cs-form{background:#fff;border:1px solid var(--line);border-radius:22px;padding:32px 34px;display:flex;flex-direction:column;gap:24px;box-shadow:0 20px 60px -30px rgba(0,0,0,.15)}
.cs-form-h h3{font-family:'Cormorant Garamond',ui-serif;font-size:28px;font-style:italic;font-weight:500;color:#161618;margin:0 0 6px;letter-spacing:-0.005em}
.cs-form-h p{font-size:14px;color:#5a5a62;margin:0;line-height:1.65}
.cs-fs{border:0;padding:0;margin:0}
.cs-fs legend{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:10px;padding:0}
.cs-fs legend b{color:#C73E3A}
.cs-fs legend em{font-style:normal;color:#8a8a92;font-weight:500;letter-spacing:.05em;text-transform:none;font-size:11.5px;margin-left:4px}
.cs-fs--confirm{background:#FBFAF7;padding:16px 18px;border-radius:12px;display:flex;flex-direction:column;gap:8px;border:1px solid #EEE9DC}
.cs-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.cs-f{display:flex;flex-direction:column;gap:5px;min-width:0}
.cs-f--wide{grid-column:span 3}
.cs-f > span{font-size:12px;color:#3d3d42;font-weight:600}
.cs-f > span b{color:#C73E3A}
.cs-f > span em{color:#8a8a92;font-weight:500;font-style:normal;font-size:11.5px;margin-left:4px}
.cs-f input,.cs-f select,.cs-fs textarea{width:100%;padding:10px 12px;border:1px solid #E8E8EC;border-radius:10px;background:#F8F8F9;font:inherit;font-size:14px;color:#161618;outline:none;transition:background .12s,border-color .12s}
.cs-fs textarea{padding:12px;resize:vertical;min-height:96px;line-height:1.55}
.cs-f input:focus,.cs-f select:focus,.cs-fs textarea:focus{background:#fff;border-color:#161618}
.cs-hint{font-size:12px;color:#5a5a62;margin-top:8px;padding:8px 12px;background:#EEF7EE;border-radius:8px;color:#166534}
.cs-sub{font-size:12px;color:#8a8a92;font-weight:600;margin:0 0 6px;letter-spacing:.02em}
.cs-sub:not(:first-child){margin-top:14px}
.cs-chips{display:flex;flex-wrap:wrap;gap:6px}
.cs-chips--sm .cs-chip{padding:6px 12px;font-size:12.5px}
.cs-chip{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#F4F4F5;border:1px solid #E8E8EC;border-radius:99px;cursor:pointer;font-size:13px;font-weight:500;color:#3d3d42;transition:all .12s;user-select:none}
.cs-chip input{display:none}
.cs-chip:hover{border-color:#B8A789}
.cs-chip.is-active{background:#161618;color:#EEDDB8;border-color:#161618}
.cs-chip em{font-style:normal;font-size:11px;color:#8a8a92;font-weight:400;margin-left:2px}
.cs-chip.is-active em{color:rgba(238,221,184,.65)}
.cs-checks{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px}
.cs-check{display:flex;align-items:flex-start;gap:8px;padding:8px 4px;font-size:13.5px;color:#3d3d42;cursor:pointer;line-height:1.5;user-select:none}
.cs-check input{margin-top:2px;width:16px;height:16px;flex-shrink:0;accent-color:#161618}
.cs-form-err{padding:12px 14px;background:#FEE2E2;color:#B91C1C;border-radius:10px;font-size:13.5px;font-weight:500}
.cs-form-actions{display:flex;flex-direction:column;align-items:stretch;gap:12px}
.cs-form-btn{padding:14px 24px;border-radius:14px;font:inherit;font-weight:700;font-size:14.5px;cursor:pointer;border:0;text-align:center;text-decoration:none;transition:transform .12s,opacity .12s}
.cs-form-btn:disabled{opacity:.6;cursor:not-allowed}
.cs-form-btn--gold{background:linear-gradient(135deg,#EEDDB8 0%,#D4BF95 50%,#B8A789 100%);color:#1a1409;box-shadow:0 12px 28px -14px rgba(184,167,137,.55)}
.cs-form-btn--gold:hover:not(:disabled){transform:translateY(-1px)}
.cs-form-btn--primary{background:#161618;color:#fff}
.cs-form-btn--ghost{background:#F4F4F5;color:#161618;border:1px solid #E8E8EC}
.cs-form-note{font-size:11.5px;color:#8a8a92;margin:0;line-height:1.6;text-align:center}
.cs-form--success{text-align:center;padding:48px 34px}
.cs-success-ic{width:64px;height:64px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;margin-bottom:18px}
.cs-form--success h3{font-family:'Cormorant Garamond',ui-serif;font-size:32px;font-style:italic;color:#161618;margin:0 0 12px}
.cs-form--success p{font-size:14.5px;line-height:1.7;color:#3d3d42;max-width:52ch;margin:0 auto 20px}
.cs-success-id{font-size:12px;color:#8a8a92;margin-bottom:22px}
.cs-success-id code{background:#F4F4F5;padding:3px 8px;border-radius:6px;color:#161618;font-family:ui-monospace,monospace}
.cs-success-cta{display:flex;justify-content:center;gap:10px;margin-bottom:16px}
@media (max-width:900px){
  .cs-form{padding:24px 22px}
  .cs-row{grid-template-columns:1fr 1fr}
  .cs-f--wide{grid-column:span 2}
  .cs-checks{grid-template-columns:1fr}
}
@media (max-width:640px){
  .cs-row{grid-template-columns:1fr}
  .cs-f--wide{grid-column:auto}
  .cs-f input,.cs-f select,.cs-fs textarea{font-size:16px}
}
`;
