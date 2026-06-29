import Image from "next/image";
import Link from "next/link";

// SugarGirl 频道页 Hero — 全宽 bg 图 + 暗色渐变 + 中央 wordmark + 双 CTA
export default function SugarGirlHero({ bg, totalCount }: { bg: string; totalCount: number }) {
  return (
    <section className="relative isolate w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image src={bg} alt="" fill priority sizes="100vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-feed-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_75%,rgba(184,167,137,0.20),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[54vh] max-w-[1100px] flex-col items-center justify-center px-5 py-20 text-center md:min-h-[64vh] md:px-8">
        <div className="inline-flex items-center gap-2.5">
          <span className="h-px w-8 bg-gold" />
          <span className="text-[10.5px] font-bold uppercase tracking-[0.32em] text-gold">
            Sugardating · Collection
          </span>
          <span className="h-px w-8 bg-gold" />
        </div>

        <h1 className="mt-6 font-serif text-[44px] italic leading-[1.02] tracking-tight text-feed-ink md:text-[68px]">
          SugarGirl
        </h1>

        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-feed-ink/72 md:text-[17px]">
          精选 {totalCount} 位创作者 · 国家、城市、兴趣可筛选,按你的节奏发现。
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#directory"
            className="group inline-flex items-center gap-2 rounded-pill bg-gold px-7 py-3 text-[14px] font-semibold text-feed-bg transition hover:bg-gold-bright"
          >
            浏览全部
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.4] transition-transform duration-300 ease-out group-hover:translate-y-0.5">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </Link>
          <Link
            href="/membership"
            className="inline-flex items-center gap-1.5 rounded-pill border border-white/20 bg-white/[0.04] px-6 py-3 text-[13.5px] font-medium text-feed-ink backdrop-blur transition hover:border-gold/70 hover:text-gold"
          >
            开通会员
          </Link>
        </div>
      </div>
    </section>
  );
}
