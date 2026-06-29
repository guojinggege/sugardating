import Link from "next/link";
import ServiceGallery from "./ServiceGallery";

interface Props {
  id: string;              // 用于 hash anchor (#dating / #travel / ...)
  eyebrow: string;         // 英文小标 e.g. "DATING"
  title: string;           // 中文大标
  intro: string;           // 2-3 行简介
  images: string[];        // 4 张
  ctaHref: string;         // "了解更多"按钮跳转
  ctaLabel?: string;       // 默认 "了解更多"
}

// 单个服务模块 — 桌面端 5/7 双栏 (左文 右图),移动端单列堆叠
export default function ServiceSection({
  id, eyebrow, title, intro, images, ctaHref, ctaLabel = "了解更多",
}: Props) {
  return (
    <section
      id={id}
      // scroll-mt 给 sticky nav 让位,避免 anchor 跳转后标题被 nav 遮住
      className="scroll-mt-24 py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
          {/* 左:文字 + CTA */}
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-7 bg-gold/70" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold">
                {eyebrow}
              </span>
            </div>
            <h2 className="font-serif text-[40px] italic leading-[1.04] tracking-tight text-feed-ink md:text-[52px]">
              {title}
            </h2>
            <p className="max-w-md text-[15px] leading-relaxed text-feed-mute md:text-[16px]">
              {intro}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Link
                href={ctaHref}
                className="group inline-flex items-center gap-2 rounded-pill bg-gold px-6 py-3 text-[13.5px] font-semibold text-feed-bg transition hover:bg-gold-bright"
              >
                {ctaLabel}
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.4] transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-1.5 rounded-pill border border-feed-line2 px-5 py-3 text-[13px] font-medium text-feed-ink transition hover:border-gold hover:text-gold"
              >
                联系顾问
              </Link>
            </div>
          </div>

          {/* 右:2x2 gallery */}
          <div>
            <ServiceGallery images={images} alt={title} />
          </div>
        </div>
      </div>
    </section>
  );
}
