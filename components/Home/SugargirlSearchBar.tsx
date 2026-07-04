// 首页 Sugargirl 筛选条 — 紧凑目录型入口 (Hero 下方)
// UI 展示型 · 不实现真实搜索逻辑 · 点搜索跳 /creators
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function SugargirlSearchBar() {
  const t = await getTranslations("home.filterBar");

  return (
    <div className="hf-bar">
      <div className="hf-row">
        <label className="hf-field">
          <span className="hf-lbl">{t("region")}</span>
          <select className="hf-sel" defaultValue="">
            <option value="" disabled>{t("regionPh")}</option>
            <option>东南亚</option><option>东亚</option><option>大中华</option><option>欧洲</option><option>北美</option>
          </select>
        </label>
        <label className="hf-field">
          <span className="hf-lbl">{t("city")}</span>
          <select className="hf-sel" defaultValue="">
            <option value="" disabled>{t("cityPh")}</option>
            <option>新加坡</option><option>东京</option><option>首尔</option><option>香港</option><option>台北</option><option>曼谷</option><option>上海</option><option>吉隆坡</option>
          </select>
        </label>
        <label className="hf-field">
          <span className="hf-lbl">{t("online")}</span>
          <select className="hf-sel" defaultValue="">
            <option value="" disabled>{t("onlinePh")}</option>
            <option>在线中</option><option>今日活跃</option><option>本周活跃</option>
          </select>
        </label>
        <label className="hf-field">
          <span className="hf-lbl">{t("verified")}</span>
          <select className="hf-sel" defaultValue="">
            <option value="" disabled>{t("verifiedPh")}</option>
            <option>已认证</option><option>真人视频认证</option><option>身份认证</option>
          </select>
        </label>
        <Link href="/creators" className="hf-cta">
          {t("cta")}
          <svg viewBox="0 0 24 24" className="hf-arrow" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </Link>
      </div>
    </div>
  );
}
