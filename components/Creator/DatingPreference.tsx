// Dating Preference — 9 preference chip grid
// 展示 Creator 偏好的约会活动类型
import { getTranslations } from "next-intl/server";

const KEYS = [
  { k: "coffee",    emoji: "☕" },
  { k: "dinner",    emoji: "🍽️" },
  { k: "travel",    emoji: "✈️" },
  { k: "photo",     emoji: "📷" },
  { k: "shopping",  emoji: "🛍️" },
  { k: "weekend",   emoji: "🏖️" },
  { k: "museum",    emoji: "🖼️" },
  { k: "concert",   emoji: "🎶" },
  { k: "language",  emoji: "🗣️" },
] as const;

export default async function DatingPreference() {
  const t = await getTranslations("creatorProfile.dating");
  return (
    <div className="cr-dp">
      <div className="cr-dp-grid">
        {KEYS.map((p) => (
          <div key={p.k} className="cr-dp-item">
            <span className="cr-dp-emoji" aria-hidden>{p.emoji}</span>
            <span className="cr-dp-label">{t(`items.${p.k}`)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
