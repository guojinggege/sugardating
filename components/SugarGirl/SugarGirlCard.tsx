"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import type { SugarGirlEntry, SugarTag } from "@/lib/sugarGirlMock";

const TAG_STYLE: Record<SugarTag, string> = {
  VIP:      "bg-gold/15 text-gold border border-gold/40",
  Verified: "bg-sky-400/15 text-sky-200 border border-sky-300/30",
  New:      "bg-emerald-400/15 text-emerald-200 border border-emerald-300/30",
};

export default function SugarGirlCard({ entry }: { entry: SugarGirlEntry }) {
  const t = useTranslations("sugarGirl.card");
  const requireLogin = useRequireLogin();
  const [fav, setFav] = useState(false);

  const onFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireLogin()) return;
    setFav((v) => !v);
  };

  const tagLabel = (tag: SugarTag): string => {
    if (tag === "Verified") return t("verified");
    if (tag === "New")      return t("newcomer");
    return tag;
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-feed-line bg-feed-surface transition duration-300 ease-out hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]">
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent transition group-hover:ring-gold/30" />

      {/* 大图 3:4 */}
      <Link href={`/creators/${entry.id}`} className="relative block overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <Image
          src={entry.cover}
          alt={entry.name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />

        {entry.online && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-pill bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-feed-ink backdrop-blur">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-block h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {t("online")}
          </div>
        )}

        <button
          type="button"
          aria-label={t("favorite")}
          aria-pressed={fav}
          onClick={onFav}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${
            fav
              ? "bg-rose-500/30 text-rose-200 ring-1 ring-rose-300/40"
              : "bg-black/40 text-feed-ink/85 hover:bg-black/55 hover:text-rose-200"
          }`}
        >
          <svg viewBox="0 0 24 24" className={`h-[18px] w-[18px] transition ${fav ? "fill-current" : "fill-none stroke-current stroke-[1.8]"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" />
          </svg>
        </button>

        {entry.tags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span key={tag} className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold tracking-wider backdrop-blur ${TAG_STYLE[tag]}`}>
                {tagLabel(tag)}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* 文字区 */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <div className="min-w-0 truncate text-[16px] font-semibold tracking-tight text-feed-ink">
            {entry.name} <span className="text-feed-mute font-normal">· {entry.age}</span>
          </div>
        </div>

        {/* 国家 · 城市 */}
        <div className="flex items-center gap-1.5 text-[11.5px] text-feed-dim">
          <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current" strokeWidth={2}>
            <path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" />
          </svg>
          {entry.country} · {entry.city}
        </div>

        {/* 一句话简介 */}
        <p className="line-clamp-2 text-[12.5px] leading-relaxed text-feed-mute">{entry.intro}</p>

        {/* 底部:身高 + 查看资料 */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[11px] text-feed-dim tabular-nums">
            {entry.height} cm · {entry.languages[0]}
          </span>
          <Link
            href={`/creators/${entry.id}`}
            className="inline-flex items-center gap-1 rounded-pill border border-feed-line2 px-3 py-1.5 text-[12px] font-semibold text-feed-ink transition hover:border-gold hover:text-gold"
          >
            {t("viewProfile")}
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current stroke-[2.4]">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
