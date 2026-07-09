// 快速发现 chips — 目录型平台的横向次导航入口
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const CHIPS = [
  { keyName: "verified",     emoji: "🛡️", href: "/creators?verified=1" },
  { keyName: "new",          emoji: "✨", href: "/creators?sort=new" },
  { keyName: "asia",         emoji: "🌏", href: "/creators?region=asia" },
  { keyName: "hotVideos",    emoji: "▶", href: "/video" },
  { keyName: "highReply",    emoji: "💬", href: "/creators?filter=replyRate" },
  { keyName: "nearby",       emoji: "📍", href: "/creators?nearby=1" },
  { keyName: "vip",          emoji: "👑", href: "/membership" },
] as const;

export default async function QuickDiscoverChips() {
  const t = await getTranslations("home.quickDiscover");
  return (
    <div className="qd-wrap">
      <div className="qd-head">
        <h3 className="qd-title">{t("title")}</h3>
        <p className="qd-sub">{t("subtitle")}</p>
      </div>
      <div className="qd-rail">
        {CHIPS.map((c) => (
          <Link key={c.keyName} href={c.href} className="qd-chip">
            <span className="qd-emoji" aria-hidden>{c.emoji}</span>
            <span>{t(`items.${c.keyName}`)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
