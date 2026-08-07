"use client";
// Sugargirl 全球招募意向表单 · 页面内嵌 / Dialog / Drawer 三处共用
// 字段:昵称 · 城市 · 当前状态 · WhatsApp · Ins · X · 其他 · 18+ · 同意
// 联系方式四选一必填 · 提交前后端两层校验一致
// 只在拿到真实 leadId 才展示成功页
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type Status = "" | "student" | "employed" | "freelancer";
type Source =
  | "inline_form" | "header_apply" | "hero_apply"
  | "floating_primary" | "floating_secondary"
  | "onboarding_cta" | "footer_apply" | "mobile_menu_apply";

interface Props {
  source?: Source;
  onSuccess?: (leadId: string) => void;
  compact?: boolean;
}

const SocialIcon = {
  wa: (<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden><path d="M17.5 14.4c-.3-.2-1.8-.9-2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.3 8.3 0 0 1-2.4-1.5 9.1 9.1 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5s0-.4 0-.5-.7-1.7-.9-2.3-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.5 3.5 0 0 0-1.1 2.6c0 1.5 1.1 3 1.3 3.2s2.2 3.4 5.4 4.7a18 18 0 0 0 1.8.6 4.4 4.4 0 0 0 2 .1 3.3 3.3 0 0 0 2.1-1.5 2.6 2.6 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.5 15.3L2 22l4.9-1.3A10 10 0 1 0 12 2z"/></svg>),
  ig: (<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>),
  x:  (<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden><path d="M18.24 3H21l-6.55 7.48L22 21h-6.83l-4.66-6.1L5.2 21H2.42l7-8L2 3h6.98l4.22 5.58L18.24 3zm-1.19 16.2h1.53L7.02 4.72H5.4L17.05 19.2z"/></svg>),
};

/** URL search params → 归因字段 · 只在客户端 mount 时读一次 */
function readAttribution() {
  if (typeof window === "undefined") return {};
  const u = new URL(window.location.href);
  const q = u.searchParams;
  return {
    pagePath: u.pathname,
    referrer: (document.referrer || "").slice(0, 500),
    utmSource:   q.get("utm_source")   || null,
    utmMedium:   q.get("utm_medium")   || null,
    utmCampaign: q.get("utm_campaign") || null,
    utmContent:  q.get("utm_content")  || null,
  };
}

export default function CreatorInterestForm({ source = "inline_form", onSuccess, compact }: Props) {
  const t = useTranslations("apply.interest");
  const locale = (useLocale() === "zh" ? "zh" : "en") as "zh" | "en";

  const [nickname, setNickname] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<Status>("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [otherContact, setOtherContact] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [contactConsent, setContactConsent] = useState(false);
  const [hp, setHp] = useState("");    // honeypot

  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [doneId, setDoneId] = useState<string | null>(null);

  const waRef = useRef<HTMLInputElement>(null);

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    const nk = nickname.trim();
    if (nk.length < 2 || nk.length > 30) errs.nickname = t("errNickname");
    const c = city.trim();
    if (c.length < 2 || c.length > 60) errs.city = t("errCity");
    if (!status) errs.currentStatus = t("errStatus");
    const hasContact = [whatsapp, instagram, xHandle, otherContact].some((v) => v.trim().length > 0);
    if (!hasContact) errs.contact = t("errContact");
    if (!ageConfirmed) errs.ageConfirmed = t("errAge");
    if (!contactConsent) errs.contactConsent = t("errConsent");
    return errs;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      if (errs.contact && waRef.current) waRef.current.focus();
      return;
    }
    setBusy(true);
    try {
      const attr = readAttribution();
      const r = await fetch("/api/creator/apply-intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim(),
          city: city.trim(),
          currentStatus: status,
          whatsapp: whatsapp.trim(),
          instagram: instagram.trim(),
          xHandle: xHandle.trim(),
          otherContact: otherContact.trim(),
          ageConfirmed,
          contactConsent,
          hp,
          locale,
          source,
          ...attr,
        }),
      });
      const d = await r.json().catch(() => ({}));
      // 三条齐:ok · success · leadId
      if (!r.ok || !d?.success || !d?.leadId) {
        const errsSrv: Record<string, string> = {};
        const code = d?.code || "UNKNOWN";
        switch (code) {
          case "INVALID_NICKNAME":    errsSrv.nickname = t("errNickname"); break;
          case "INVALID_CITY":        errsSrv.city = t("errCity"); break;
          case "INVALID_STATUS":      errsSrv.currentStatus = t("errStatus"); break;
          case "AGE_NOT_CONFIRMED":   errsSrv.ageConfirmed = t("errAge"); break;
          case "CONSENT_REQUIRED":    errsSrv.contactConsent = t("errConsent"); break;
          case "CONTACT_REQUIRED":    errsSrv.contact = t("errContact"); break;
          case "TOO_MANY_SUBMISSIONS":errsSrv.contact = t("errTooMany"); break;
          case "TABLE_MISSING":
          case "DB_ERROR":
          case "DATABASE_INSERT_FAILED":
                                      errsSrv.contact = t("errPersist"); break;
          default:                    errsSrv.contact = t("errNetwork");
        }
        setErrors(errsSrv);
        return;
      }
      setDoneId(d.leadId);
      onSuccess?.(d.leadId);
    } catch {
      setErrors({ contact: t("errNetwork") });
    } finally { setBusy(false); }
  }

  if (doneId) {
    return (
      <div className={"cif cif--done" + (compact ? " cif--compact" : "")}>
        <div className="cif-done-emoji" aria-hidden>✓</div>
        <h3>{t("thanksTitle")}</h3>
        <p>{t("thanksDesc")}</p>
        <div className="cif-done-id" title={doneId}>ID · {doneId}</div>
      </div>
    );
  }

  return (
    <form className={"cif" + (compact ? " cif--compact" : "")} onSubmit={onSubmit} noValidate>
      {/* Honeypot — 视觉隐藏但可被 bot 表单库自动填 */}
      <div aria-hidden style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
        <label>Do not fill<input value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" /></label>
      </div>

      {/* 基础信息 */}
      <div className="cif-row">
        <label className="cif-label" htmlFor="cif-nickname">{t("nicknameLabel")} <em>*</em></label>
        <input id="cif-nickname" className={"cif-input" + (errors.nickname ? " is-err" : "")}
          value={nickname} onChange={(e) => setNickname(e.target.value)}
          placeholder={t("nicknamePh")} autoComplete="nickname" maxLength={32} />
        {errors.nickname && <span className="cif-err">{errors.nickname}</span>}
      </div>

      <div className="cif-row">
        <label className="cif-label" htmlFor="cif-city">{t("cityLabel")} <em>*</em></label>
        <input id="cif-city" className={"cif-input" + (errors.city ? " is-err" : "")}
          value={city} onChange={(e) => setCity(e.target.value)}
          placeholder={t("cityPh")} autoComplete="address-level2" maxLength={62} />
        {errors.city && <span className="cif-err">{errors.city}</span>}
      </div>

      <div className="cif-row">
        <span className="cif-label">{t("statusLabel")} <em>*</em></span>
        <div className="cif-radios" role="radiogroup" aria-label={t("statusLabel")}>
          {(["student", "employed", "freelancer"] as const).map((v) => (
            <label key={v} className={"cif-radio" + (status === v ? " on" : "")}>
              <input type="radio" name="cif-status" value={v}
                checked={status === v} onChange={() => setStatus(v)} />
              <b>{t(`status_${v}`)}</b>
            </label>
          ))}
        </div>
        {errors.currentStatus && <span className="cif-err">{errors.currentStatus}</span>}
      </div>

      {/* 联系方式 · WhatsApp / Ins / X / 其他 · 严格 DOM 顺序 */}
      <div className="cif-section-h">
        <span>{t("contactMethods")}</span>
        <em>{t("contactHint")}</em>
      </div>

      <div className="cif-contact-grid">
        <div className="cif-row">
          <label className="cif-label" htmlFor="cif-wa">
            <span className="cif-lbl-ico">{SocialIcon.wa}</span>{t("whatsappLabel")}
          </label>
          <input ref={waRef} id="cif-wa" className="cif-input contact-input" type="tel" inputMode="tel"
            value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
            placeholder={t("whatsappPh")} autoComplete="tel" maxLength={40} />
          <span className="cif-hint">{t("whatsappHint")}</span>
        </div>

        <div className="cif-row">
          <label className="cif-label" htmlFor="cif-ig">
            <span className="cif-lbl-ico">{SocialIcon.ig}</span>{t("instagramLabel")}
          </label>
          <input id="cif-ig" className="cif-input contact-input"
            value={instagram} onChange={(e) => setInstagram(e.target.value)}
            placeholder="@username" maxLength={160} />
          <span className="cif-hint">{t("instagramHint")}</span>
        </div>

        <div className="cif-row">
          <label className="cif-label" htmlFor="cif-x">
            <span className="cif-lbl-ico">{SocialIcon.x}</span>{t("xLabel")}
          </label>
          <input id="cif-x" className="cif-input contact-input"
            value={xHandle} onChange={(e) => setXHandle(e.target.value)}
            placeholder="@username" maxLength={160} />
          <span className="cif-hint">{t("xHint")}</span>
        </div>

        <div className="cif-row">
          <label className="cif-label" htmlFor="cif-other">{t("otherContactLabel")}</label>
          <input id="cif-other" className="cif-input contact-input"
            value={otherContact} onChange={(e) => setOtherContact(e.target.value)}
            placeholder={t("otherContactPh")} maxLength={160} />
        </div>
      </div>

      {errors.contact && <div className="cif-err cif-err--block">{errors.contact}</div>}

      {/* 合规 */}
      <label className="cif-check">
        <input type="checkbox" checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} />
        <span>{t("ageLabel")} <em>*</em></span>
      </label>
      {errors.ageConfirmed && <span className="cif-err">{errors.ageConfirmed}</span>}

      <label className="cif-check">
        <input type="checkbox" checked={contactConsent} onChange={(e) => setContactConsent(e.target.checked)} />
        <span>
          {t.rich("consentLabel", {
            privacy: (chunks) => <a href="/privacy" target="_blank" rel="noopener noreferrer">{chunks}</a>,
          })} <em>*</em>
        </span>
      </label>
      {errors.contactConsent && <span className="cif-err">{errors.contactConsent}</span>}

      <p className="cif-privacy">{t("privacyNote")}</p>

      <button type="submit" className="cif-submit" disabled={busy}>
        {busy ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
