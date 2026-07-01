"use client";
// Gift Panel — 6 gifts: Rose / Coffee / Dinner / Luxury / Diamond / Custom
// 主内容区域使用的大版本;Hero right 是 mini 4-gift 版本
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";

const GIFTS: { k: string; emoji: string; price: string }[] = [
  { k: "rose",    emoji: "🌹", price: "S$ 2" },
  { k: "coffee",  emoji: "☕", price: "S$ 5" },
  { k: "dinner",  emoji: "🍽️", price: "S$ 20" },
  { k: "luxury",  emoji: "👑", price: "S$ 50" },
  { k: "diamond", emoji: "💎", price: "S$ 200" },
  { k: "custom",  emoji: "✨", price: "—" },
];

export default function CreatorGiftPanel() {
  const t = useTranslations("creatorProfile.gifts");
  const requireLogin = useRequireLogin();

  const send = () => { if (!requireLogin()) return; /* TODO: 打赏流程 */ };

  return (
    <div className="cr-gp">
      <div className="cr-gp-h">
        <h4>{t("title")}</h4>
        <p>{t("subtitle")}</p>
      </div>
      <div className="cr-gp-grid">
        {GIFTS.map((g) => (
          <button key={g.k} type="button" onClick={send} className="cr-gp-item">
            <span className="cr-gp-emoji" aria-hidden>{g.emoji}</span>
            <span className="cr-gp-name">{t(`items.${g.k}`)}</span>
            <span className="cr-gp-price">{g.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
