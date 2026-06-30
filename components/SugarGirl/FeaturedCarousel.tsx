"use client";
// FeaturedCarousel — 横向 scroll-snap 推荐区
// 卡片更窄 (固定宽度),区分主目录的 Grid;支持 ← → 按钮 + 拖拽 + 触屏
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { SugarGirlEntry } from "@/lib/sugarGirlMock";

export default function FeaturedCarousel({ items }: { items: SugarGirlEntry[] }) {
  const t = useTranslations("sugarGirl");
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // 滚 = 一张卡 + gap 宽度,粗略按 280+16
    el.scrollBy({ left: dir * (280 + 16), behavior: "smooth" });
  };

  return (
    <section className="pt-12 md:pt-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold">{t("featured.eyebrow")}</div>
          <h2 className="mt-1.5 font-serif text-[28px] italic tracking-tight text-feed-ink md:text-[34px]">
            {t("featured.title")}
          </h2>
          <p className="mt-1.5 text-[13px] text-feed-mute md:text-[14px]">{t("featured.subtitle")}</p>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={t("featured.prev")}
            className="grid h-10 w-10 place-items-center rounded-full border border-feed-line2 bg-feed-surface text-feed-ink transition hover:border-gold hover:text-gold"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2.2}><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={t("featured.next")}
            className="grid h-10 w-10 place-items-center rounded-full border border-feed-line2 bg-feed-surface text-feed-ink transition hover:border-gold hover:text-gold"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2.2}><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((e) => <FeaturedCard key={e.id} e={e} />)}
      </div>
    </section>
  );
}

function FeaturedCard({ e }: { e: SugarGirlEntry }) {
  const t = useTranslations("sugarGirl");
  return (
    <Link
      href="/membership"
      className="group relative block w-[240px] shrink-0 snap-start overflow-hidden rounded-2xl border border-feed-line bg-feed-surface transition duration-300 ease-out hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] md:w-[280px]"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={e.cover}
          alt={e.name}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 240px, 280px"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        {e.online && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-pill bg-black/55 px-2.5 py-1 text-[10.5px] font-semibold text-feed-ink backdrop-blur">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-block h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {t("card.online")}
          </div>
        )}
        {e.tags.includes("Verified") && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-pill border border-sky-300/40 bg-sky-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-100 backdrop-blur">
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-current"><path d="M9 17l-5-5 1.4-1.4L9 14.2l9.6-9.6L20 6z" /></svg>
            {t("card.verified")}
          </span>
        )}

        {/* 底部信息覆盖图 */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-3.5">
          <div className="text-[15.5px] font-semibold tracking-tight text-feed-ink">
            {e.name} <span className="font-normal text-feed-ink/70">· {e.age}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-feed-ink/72">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current" strokeWidth={2}>
              <path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" />
            </svg>
            {e.country} · {e.city}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 p-3.5">
        <span className="line-clamp-1 flex-1 text-[12px] text-feed-mute">{e.intro}</span>
        <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-gold">
          {t("card.viewProfile")}
          <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current" strokeWidth={2.4}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
      </div>
    </Link>
  );
}
