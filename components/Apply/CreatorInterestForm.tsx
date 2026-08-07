"use client";
// Sugargirl 入驻意向表单 · /apply 页面共用组件
// 提交 POST /api/creator/apply-intent · 成功后显示感谢态
// - nickname / city / status 必填 · telephone / email / mobile 至少一项
// - 前端与后端两层校验一致
// - 输入字号 16px 避免 iOS 聚焦缩放
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type Status = "" | "student" | "employed" | "freelancer";

interface Props {
  source?: "hero" | "inline" | "sticky" | "final";
  onSuccess?: () => void;
  compact?: boolean;               // 弹窗内使用 · 减少内边距
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function CreatorInterestForm({ source = "inline", onSuccess, compact }: Props) {
  const t = useTranslations("apply.interest");
  const locale = (useLocale() === "zh" ? "zh" : "en") as "zh" | "en";

  const [nickname, setNickname] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<Status>("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  function validate(): { ok: boolean; errs: Record<string, string> } {
    const errs: Record<string, string> = {};
    const nk = nickname.trim();
    if (nk.length < 2 || nk.length > 30) errs.nickname = t("errNickname");
    const c = city.trim();
    if (c.length < 2 || c.length > 60) errs.city = t("errCity");
    if (!status) errs.status = t("errStatus");
    const hasAnyContact = !!(telephone.trim() || email.trim() || mobile.trim());
    if (!hasAnyContact) errs.contact = t("errContact");
    if (email.trim() && !EMAIL_RE.test(email.trim().toLowerCase())) errs.email = t("errEmail");
    return { ok: Object.keys(errs).length === 0, errs };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const { ok, errs } = validate();
    setErrors(errs);
    if (!ok) return;
    setBusy(true);
    try {
      const r = await fetch("/api/creator/apply-intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim(),
          city: city.trim(),
          status,
          telephone: telephone.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          locale,
          source,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) {
        // 后端 code → 字段级错误 · 敏感字段值本身不落客户端日志
        const errsSrv: Record<string, string> = {};
        const code = d?.code || "UNKNOWN";
        switch (code) {
          case "INVALID_NICKNAME": errsSrv.nickname = t("errNickname"); break;
          case "INVALID_CITY":     errsSrv.city = t("errCity"); break;
          case "INVALID_STATUS":   errsSrv.status = t("errStatus"); break;
          case "CONTACT_REQUIRED": errsSrv.contact = t("errContact"); break;
          case "INVALID_EMAIL":    errsSrv.email = t("errEmail"); break;
          case "TOO_MANY_SUBMISSIONS": errsSrv.contact = t("errTooMany"); break;
          default:                 errsSrv.contact = t("errNetwork");
        }
        setErrors(errsSrv);
        return;
      }
      setDone(true);
      onSuccess?.();
    } catch {
      setErrors({ contact: t("errNetwork") });
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className={"cif cif--done" + (compact ? " cif--compact" : "")}>
        <div className="cif-done-emoji" aria-hidden>✓</div>
        <h3>{t("thanksTitle")}</h3>
        <p>{t("thanksDesc")}</p>
      </div>
    );
  }

  return (
    <form className={"cif" + (compact ? " cif--compact" : "")} onSubmit={onSubmit} noValidate>
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
        {errors.status && <span className="cif-err">{errors.status}</span>}
      </div>

      <div className="cif-contact-hint">{t("contactHint")}</div>

      <div className="cif-row">
        <label className="cif-label" htmlFor="cif-tel">{t("telephoneLabel")}</label>
        <input id="cif-tel" className="cif-input" type="tel" inputMode="tel"
          value={telephone} onChange={(e) => setTelephone(e.target.value)}
          placeholder={t("telephonePh")} autoComplete="tel" maxLength={40} />
      </div>

      <div className="cif-row">
        <label className="cif-label" htmlFor="cif-email">{t("emailLabel")}</label>
        <input id="cif-email" className={"cif-input" + (errors.email ? " is-err" : "")}
          type="email" inputMode="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com" autoComplete="email" maxLength={120} />
        {errors.email && <span className="cif-err">{errors.email}</span>}
      </div>

      <div className="cif-row">
        <label className="cif-label" htmlFor="cif-mob">{t("mobileLabel")}</label>
        <input id="cif-mob" className="cif-input" type="tel" inputMode="tel"
          value={mobile} onChange={(e) => setMobile(e.target.value)}
          placeholder={t("mobilePh")} autoComplete="tel-national" maxLength={40} />
        {errors.contact && <span className="cif-err">{errors.contact}</span>}
      </div>

      <p className="cif-privacy">{t("privacyNote")}</p>

      <button type="submit" className="cif-submit" disabled={busy}>
        {busy ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
