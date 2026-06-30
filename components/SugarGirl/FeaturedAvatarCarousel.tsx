"use client";
// FeaturedAvatarCarousel — 横向圆形头像滚动
// 圆形头像 + 金色品牌渐变描边,下方昵称 + 在线状态点
// PC 一行 10-12 张可见;移动端横向 swipe
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { SugarGirlEntry } from "@/lib/sugarGirlMock";

export default function FeaturedAvatarCarousel({ items }: { items: SugarGirlEntry[] }) {
  const t = useTranslations("sugarGirl.featured");
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // 滚 = 4 张 (一组) 宽度
    el.scrollBy({ left: dir * 4 * 108, behavior: "smooth" });
  };

  return (
    <section className="pt-10 md:pt-14">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold">{t("eyebrow")}</div>
          <h2 className="mt-1.5 font-serif text-[28px] italic tracking-tight text-feed-ink md:text-[34px]">
            {t("title")}
          </h2>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={t("prev")}
            className="grid h-9 w-9 place-items-center rounded-full border border-feed-line2 bg-feed-surface text-feed-ink transition hover:border-gold hover:text-gold"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2.2}><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={t("next")}
            className="grid h-9 w-9 place-items-center rounded-full border border-feed-line2 bg-feed-surface text-feed-ink transition hover:border-gold hover:text-gold"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2.2}><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
      <div
        ref={railRef}
        className="flex snap-x snap-proximity gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((e) => <Avatar key={e.id} e={e} />)}
      </div>
    </section>
  );
}

function Avatar({ e }: { e: SugarGirlEntry }) {
  return (
    <Link
      href="/membership"
      className="group flex w-[88px] shrink-0 snap-start flex-col items-center gap-2 md:w-[96px]"
      title={e.name}
    >
      {/* 金色品牌渐变描边 — 用 conic 渐变,inside 留间隙形成 ring */}
      <div className="relative h-[76px] w-[76px] md:h-[84px] md:w-[84px]">
        <div
          className="absolute inset-0 rounded-full p-[2.5px] transition-transform duration-300 ease-out group-hover:scale-105"
          style={{
            background:
              "conic-gradient(from 140deg, #B8A789, #D4BF95, #8E7B5F, #B8A789)",
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-full bg-feed-bg">
            <Image
              src={e.cover}
              alt={e.name}
              fill
              loading="lazy"
              sizes="96px"
              className="object-cover transition duration-500 ease-out group-hover:scale-[1.08]"
            />
          </div>
        </div>
        {/* 在线状态点 */}
        {e.online && (
          <span className="absolute bottom-0.5 right-0.5 inline-flex h-3 w-3 items-center justify-center md:h-3.5 md:w-3.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative h-2.5 w-2.5 rounded-full border-2 border-feed-bg bg-emerald-400 md:h-3 md:w-3" />
          </span>
        )}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="max-w-[88px] truncate text-[12.5px] font-semibold text-feed-ink md:max-w-[96px]">
          {e.name}
        </span>
        <span className="text-[10.5px] text-feed-dim">{e.city}</span>
      </div>
    </Link>
  );
}
