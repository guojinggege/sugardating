// Horizontal 8-metric card. 位于 Hero 之下,主内容之前
// Followers / Likes / Posts / Reviews (rating) / Response Rate / Reply Time / Member Since / Completed Dates
import { getTranslations } from "next-intl/server";
import type { CreatorStatsData, AvailabilityData } from "@/lib/creatorProfileMock";

function fmt(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

interface Props {
  stats: CreatorStatsData;
  availability: AvailabilityData;
  rating: number;   // average review rating 0-5
  likes: number;
  reviewCount: number;
  gifts: number;
}

const IC = {
  heart: <svg viewBox="0 0 24 24"><path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" /></svg>,
  users: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" /></svg>,
  doc:   <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>,
  star:  <svg viewBox="0 0 24 24"><path d="M12 2l3 7 7 .6-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.6L2 9.6 9 9z" /></svg>,
  chart: <svg viewBox="0 0 24 24"><path d="M3 3v18h18" /><path d="M8 15V9M13 15V6M18 15V12" /></svg>,
  bolt:  <svg viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>,
  cal:   <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>,
  gift:  <svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="4" /><path d="M5 12v9h14v-9M12 8v13M8 8a2 2 0 1 1 0-4c1.5 0 4 4 4 4h-4zM16 8a2 2 0 1 0 0-4c-1.5 0-4 4-4 4h4z" /></svg>,
};

export default async function QuickStats({ stats, availability, rating, likes, reviewCount, gifts }: Props) {
  const t = await getTranslations("creatorProfile.quickStats");

  const items = [
    { ic: IC.users, k: "followers", v: fmt(stats.followers), label: t("followers") },
    { ic: IC.heart, k: "likes",     v: fmt(likes),           label: t("likes"), tint: "rose" },
    { ic: IC.doc,   k: "posts",     v: String(stats.posts),  label: t("posts") },
    { ic: IC.star,  k: "rating",    v: rating.toFixed(2),    label: `${t("rating")} (${reviewCount})`, tint: "gold" },
    { ic: IC.chart, k: "response",  v: `${availability.responseRate}%`, label: t("responseRate"), tint: "green" },
    { ic: IC.bolt,  k: "reply",     v: availability.replyMinutes < 60 ? `${availability.replyMinutes} min` : `< ${Math.round(availability.replyMinutes/60)}h`, label: t("avgReply"), tint: "green" },
    { ic: IC.gift,  k: "gifts",     v: fmt(gifts),           label: t("gifts"), tint: "gold" },
    { ic: IC.cal,   k: "completed", v: `${availability.completedDates}+`, label: t("completedDates") },
  ];

  return (
    <section className="cr-quick" aria-label={t("ariaLabel")}>
      {items.map((it) => (
        <div key={it.k} className={"cr-quick-item" + (it.tint ? " tint-" + it.tint : "")}>
          <div className="cr-quick-ic" aria-hidden>{it.ic}</div>
          <div className="cr-quick-body">
            <b className="cr-quick-v">{it.v}</b>
            <span className="cr-quick-l">{it.label}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
