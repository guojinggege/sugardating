import Image from "next/image";

// /video 频道页 Banner — 比 SugarGirl / 定制服务 hero 紧凑,留给下面 grid 更多空间
export default function VideoHero({ bg }: { bg: string }) {
  return (
    <section className="relative isolate w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image src={bg} alt="" fill priority sizes="100vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-feed-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,rgba(184,167,137,0.18),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[34vh] max-w-[1100px] flex-col items-center justify-center px-5 py-16 text-center md:min-h-[40vh] md:px-8 md:py-20">
        <div className="inline-flex items-center gap-2.5">
          <span className="h-px w-8 bg-gold" />
          <span className="text-[10.5px] font-bold uppercase tracking-[0.32em] text-gold">
            Sugardating · Video
          </span>
          <span className="h-px w-8 bg-gold" />
        </div>

        <h1 className="mt-5 font-serif text-[40px] italic leading-[1.04] tracking-tight text-feed-ink md:text-[58px]">
          视频专区
        </h1>

        <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-feed-ink/72 md:text-[16px]">
          Vlog、短篇、教程、旅行 · 来自创作者的镜头记录,按你的兴趣发现。
        </p>
      </div>
    </section>
  );
}
