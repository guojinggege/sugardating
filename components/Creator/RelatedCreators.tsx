"use client";
// 底部相关创作者横向 carousel — 4 板块切换 (猜你喜欢 / 相似 Sugargirl / 最近浏览 / 热门推荐)
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Creator } from "@/lib/types";

export interface RelatedSet {
  key: "guess" | "similar" | "recent" | "hot";
  items: { creator: Creator; photo: string }[];
}

interface Props {
  sets: RelatedSet[];
}

export default function RelatedCreators({ sets }: Props) {
  const t = useTranslations("creatorProfile.related");
  const [active, setActive] = useState<RelatedSet["key"]>(sets[0]?.key ?? "guess");
  const railRef = useRef<HTMLDivElement>(null);

  const current = sets.find((s) => s.key === active) ?? sets[0];

  const scroll = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (220 + 16), behavior: "smooth" });
  };

  return (
    <section className="cr-related">
      <div className="cr-related-h">
        <div className="cr-related-tabs">
          {sets.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive(s.key)}
              className={"cr-related-tab" + (active === s.key ? " on" : "")}
            >
              {t(s.key)}
            </button>
          ))}
        </div>
        <div className="cr-related-nav">
          <button type="button" onClick={() => scroll(-1)} aria-label={t("prev")} className="cr-related-arr">
            <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={t("next")} className="cr-related-arr">
            <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
      <div
        ref={railRef}
        className="cr-related-rail [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {current?.items.map(({ creator, photo }) => (
          <Link key={creator.slug} href={`/creators/${creator.slug}`} className="cr-related-card">
            <div className="cr-related-cover">
              <Image
                src={photo}
                alt={creator.name}
                fill
                loading="lazy"
                sizes="240px"
                className="object-cover transition-transform duration-500 ease-out hover:scale-[1.05]"
              />
              <div className="cr-related-veil" />
            </div>
            <div className="cr-related-info">
              <div className="cr-related-name">{creator.name}</div>
              <div className="cr-related-meta">{creator.region}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
