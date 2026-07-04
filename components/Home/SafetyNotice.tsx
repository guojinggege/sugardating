// 首页底部合规 / 安全 / 隐私提示 — 轻量,不做大 CTA
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const TAGS = ["18+", "resumeReview", "reportBlock", "privacy", "antiFraud", "localLaw"] as const;

export default async function SafetyNotice() {
  const t = await getTranslations("home.safety");
  return (
    <div className="sf-wrap">
      <div className="sf-head">
        <h3 className="sf-title">{t("title")}</h3>
        <p className="sf-desc">{t("desc")}</p>
      </div>
      <div className="sf-tags">
        {TAGS.map((k) => (
          <span key={k} className="sf-tag">{t(`tags.${k}`)}</span>
        ))}
      </div>
      <div className="sf-actions">
        <Link href="/community/guidelines" className="sf-link">{t("cta")} →</Link>
      </div>
    </div>
  );
}
