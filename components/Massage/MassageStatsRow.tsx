// City header stats row
import type { CityStats } from "@/lib/massage-data";

export default function MassageStatsRow({ stats, cityLabel }: { stats: CityStats; cityLabel: string }) {
  const items = [
    { n: stats.total,           l: "Providers",       zh: "位服务者" },
    { n: stats.online,          l: "Online Now",      zh: "位在线" },
    { n: stats.verified,        l: "Verified",        zh: "位已认证" },
    { n: stats.withVideo,       l: "With Video",      zh: "位有视频" },
    { n: stats.availableToday,  l: "Available Today", zh: "位今日可预约" },
  ];
  return (
    <div className="ms-stats" aria-label={`${cityLabel} directory stats`}>
      {items.map((it, i) => (
        <div key={i} className="ms-stat">
          <b>{it.n}</b>
          <span>{it.l}</span>
          <span className="ms-stat-zh">{it.zh}</span>
        </div>
      ))}
      <style>{`
        .ms-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:16px 18px;background:#fff;border:1px solid var(--line);border-radius:16px;margin:14px 0 4px}
        .ms-stat{display:flex;flex-direction:column;gap:2px;text-align:left;min-width:0}
        .ms-stat b{font-size:20px;font-weight:800;color:#161618;letter-spacing:-0.02em;line-height:1;font-variant-numeric:tabular-nums}
        .ms-stat span{font-size:11px;color:#8a8a92;text-transform:uppercase;letter-spacing:.06em;font-weight:600}
        .ms-stat-zh{text-transform:none !important;letter-spacing:0 !important;color:#B8A789 !important;font-weight:500 !important;font-size:10.5px !important;margin-top:1px}
        @media (max-width:640px){
          .ms-stats{grid-template-columns:repeat(2,1fr);gap:12px;padding:14px}
          .ms-stat b{font-size:18px}
        }
      `}</style>
    </div>
  );
}
