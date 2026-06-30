// 首页 FAQ — 原生 <details>/<summary> accordion,SSR 渲染,无 client JS 成本
import { getTranslations } from "next-intl/server";

const KEYS = ["what", "verified", "free", "privacy", "cancel", "start"] as const;

export default async function FAQ() {
  const t = await getTranslations("home.faq.items");
  return (
    <div className="faq">
      {KEYS.map((k, i) => (
        <details key={k} className="faq-item" name="home-faq" open={i === 0}>
          <summary>{t(`${k}.q`)}</summary>
          <p>{t(`${k}.a`)}</p>
        </details>
      ))}
    </div>
  );
}
