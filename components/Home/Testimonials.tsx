// 首页用户评价 — 横向滚动,scroll-snap;6 条占位评价
import { getTranslations } from "next-intl/server";

const KEYS = ["james", "sofia", "daniel", "yuna", "marcus", "eva"] as const;

export default async function Testimonials() {
  const t = await getTranslations("home.testimonials.items");
  return (
    <div className="testi-rail">
      {KEYS.map((k) => (
        <article key={k} className="testi-card">
          <div className="testi-stars" aria-label="5/5">{"★★★★★"}</div>
          <p className="testi-quote">&ldquo;{t(`${k}.quote`)}&rdquo;</p>
          <div className="testi-meta">
            <div className="testi-avatar" aria-hidden>{t(`${k}.name`).charAt(0)}</div>
            <div>
              <div className="testi-name">{t(`${k}.name`)}</div>
              <div className="testi-loc">{t(`${k}.location`)}</div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
