// 8 项统计 tile: 粉丝 / 关注 / 动态 / 视频 / 图片 / 收藏 / 加入时间 / 资料完成度
import { getTranslations } from "next-intl/server";
import type { CreatorStatsData } from "@/lib/creatorProfileMock";

function fmtCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

export default async function CreatorStats({ data }: { data: CreatorStatsData }) {
  const t = await getTranslations("creatorProfile.stats");
  const items: { key: string; value: string; label: string }[] = [
    { key: "followers",  value: fmtCount(data.followers),  label: t("followers") },
    { key: "following",  value: fmtCount(data.following),  label: t("following") },
    { key: "posts",      value: String(data.posts),         label: t("posts") },
    { key: "videos",     value: String(data.videos),        label: t("videos") },
    { key: "photos",     value: String(data.photos),        label: t("photos") },
    { key: "saved",      value: String(data.saved),         label: t("saved") },
    { key: "joinedAt",   value: data.joinedAt,              label: t("joinedAt") },
    { key: "completion", value: `${data.completion}%`,      label: t("completion") },
  ];
  return (
    <section className="cr-stats" aria-label={t("ariaLabel")}>
      {items.map((it) => (
        <div key={it.key} className="cr-stat">
          <b className="cr-stat-v">{it.value}</b>
          <span className="cr-stat-l">{it.label}</span>
        </div>
      ))}
    </section>
  );
}
