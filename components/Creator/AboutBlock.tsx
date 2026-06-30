// 关于 Ta — 个人简介 / 兴趣爱好 / 语言 / 城市 / 常去国家 / 旅行计划 / 加入时间
import { getTranslations } from "next-intl/server";
import type { CreatorAbout } from "@/lib/creatorProfileMock";

export default async function AboutBlock({ about }: { about: CreatorAbout }) {
  const t = await getTranslations("creatorProfile.about");

  const row = (label: string, value: React.ReactNode) => (
    <div className="cr-about-row">
      <div className="cr-about-label">{label}</div>
      <div className="cr-about-value">{value}</div>
    </div>
  );

  return (
    <div className="cr-about">
      <p className="cr-about-bio">{about.bio}</p>
      <div className="cr-about-grid">
        {row(t("interests"),
          <div className="cr-chips">
            {about.interests.map((i) => <span key={i} className="cr-chip">{i}</span>)}
          </div>
        )}
        {row(t("languages"), about.languages.join(" / "))}
        {row(t("city"), about.city)}
        {row(t("frequent"),
          <div className="cr-chips">
            {about.frequentCountries.map((c) => <span key={c} className="cr-chip">{c}</span>)}
          </div>
        )}
        {row(t("travelPlans"),
          <ul className="cr-list">
            {about.travelPlans.map((p) => <li key={p}>{p}</li>)}
          </ul>
        )}
        {row(t("joinedAt"), about.joinedAt)}
      </div>
    </div>
  );
}
