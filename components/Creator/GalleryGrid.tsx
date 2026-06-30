"use client";
// 相册 — 3-col grid + 简易 lightbox 看大图;每张 lazy load
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { GalleryItem } from "@/lib/creatorProfileMock";

const CATS: GalleryItem["category"][] = ["旅行", "时尚", "拍摄", "生活"];

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const t = useTranslations("creatorProfile.gallery");
  const [cat, setCat] = useState<GalleryItem["category"] | "all">("all");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const list = cat === "all" ? items : items.filter((i) => i.category === cat);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowLeft") setOpenIdx((i) => (i === null ? null : (i - 1 + list.length) % list.length));
      if (e.key === "ArrowRight") setOpenIdx((i) => (i === null ? null : (i + 1) % list.length));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIdx, list.length]);

  return (
    <div className="cr-gallery">
      <div className="cr-gallery-cats">
        <button
          type="button"
          onClick={() => setCat("all")}
          className={"cr-gc" + (cat === "all" ? " on" : "")}
        >
          {t("all")}
        </button>
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={"cr-gc" + (cat === c ? " on" : "")}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="cr-gallery-grid">
        {list.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => setOpenIdx(i)}
            className="cr-gallery-tile"
            aria-label={t("openLarge")}
          >
            <Image
              src={it.src}
              alt={it.alt}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
            <div className="cr-gallery-veil" />
          </button>
        ))}
      </div>

      {openIdx !== null && list[openIdx] && (
        <div
          className="cr-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenIdx(null)}
        >
          <button
            type="button"
            className="cr-lb-close"
            aria-label={t("close")}
            onClick={() => setOpenIdx(null)}
          >
            ×
          </button>
          <button
            type="button"
            className="cr-lb-nav cr-lb-prev"
            aria-label={t("prev")}
            onClick={(e) => { e.stopPropagation(); setOpenIdx((i) => (i === null ? 0 : (i - 1 + list.length) % list.length)); }}
          >
            ‹
          </button>
          <div className="cr-lb-frame" onClick={(e) => e.stopPropagation()}>
            <Image
              src={list[openIdx].src}
              alt={list[openIdx].alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>
          <button
            type="button"
            className="cr-lb-nav cr-lb-next"
            aria-label={t("next")}
            onClick={(e) => { e.stopPropagation(); setOpenIdx((i) => (i === null ? 0 : (i + 1) % list.length)); }}
          >
            ›
          </button>
          <div className="cr-lb-count tabular-nums">{openIdx + 1} / {list.length}</div>
        </div>
      )}
    </div>
  );
}
