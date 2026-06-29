import Image from "next/image";
import Link from "next/link";

// /art-services 页 hero banner
// 全屏宽背景图 + 暗色径向渐变压底 + 中央 wordmark + 副标 + CTA
export default function ServiceHero({
  bg,
  ctaHref = "/membership",
}: {
  bg: string;
  ctaHref?: string;
}) {
  return (
    <section className="relative isolate w-full overflow-hidden bg-black">
      {/* 背景图 */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/30 to-feed-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(184,167,137,0.18),transparent_55%)]" />
      </div>

      {/* 内容 */}
      <div className="relative z-10 mx-auto flex min-h-[58vh] max-w-[1100px] flex-col items-center justify-center px-5 py-24 text-center md:min-h-[70vh] md:px-8">
        <div className="inline-flex items-center gap-2.5">
          <span className="h-px w-8 bg-gold" />
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
            Sugardating · 定制服务
          </span>
          <span className="h-px w-8 bg-gold" />
        </div>

        <h1 className="mt-6 font-serif text-[44px] italic leading-[1.02] tracking-tight text-feed-ink md:text-[68px]">
          为你定制的私享体验
        </h1>

        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-feed-ink/72 md:text-[17px]">
          从约会、旅行、镜头到视频对话 —— 4 类礼宾级服务,由专属顾问按你的节奏与品味量身规划。
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 rounded-pill bg-gold px-7 py-3 text-[14px] font-semibold text-feed-bg transition hover:bg-gold-bright"
          >
            开始体验
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.4] transition-transform duration-300 ease-out group-hover:translate-x-0.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link
            href="#dating"
            className="inline-flex items-center gap-1.5 rounded-pill border border-white/20 bg-white/[0.04] px-6 py-3 text-[13.5px] font-medium text-feed-ink backdrop-blur transition hover:border-gold/70 hover:text-gold"
          >
            浏览服务
          </Link>
        </div>
      </div>
    </section>
  );
}
