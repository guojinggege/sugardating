import Image from "next/image";
import type { FeedMedia } from "./types";

// 根据媒体数量自适应栅格:
// 1 → 16:9 单图;  2 → 双列 1:1;  3 → 左 1 大右 2 小;
// 4 → 2x2;  5-6 → 3 列;  7-9 → 3 列(最多 9 张)
export default function MediaGrid({ media }: { media: FeedMedia[] }) {
  if (!media || media.length === 0) return null;
  const list = media.slice(0, 9);
  const n = list.length;

  if (n === 1) {
    const m = list[0];
    return (
      <div className="relative w-full overflow-hidden rounded-card border border-feed-line">
        <div className="relative w-full" style={{ aspectRatio: m.ratio ?? "16/9" }}>
          <Image
            src={m.src}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover transition duration-500 ease-out hover:scale-[1.02]"
          />
          {m.type === "video" && <PlayBadge />}
        </div>
      </div>
    );
  }

  if (n === 2) {
    return (
      <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-card border border-feed-line">
        {list.map((m, i) => (
          <Cell key={i} m={m} sizes="(max-width: 768px) 50vw, 320px" />
        ))}
      </div>
    );
  }

  if (n === 3) {
    return (
      <div className="grid grid-cols-2 gap-1.5 overflow-hidden rounded-card border border-feed-line" style={{ aspectRatio: "16/10" }}>
        <Cell m={list[0]} sizes="(max-width: 768px) 50vw, 320px" full />
        <div className="grid grid-rows-2 gap-1.5">
          <Cell m={list[1]} sizes="(max-width: 768px) 50vw, 320px" />
          <Cell m={list[2]} sizes="(max-width: 768px) 50vw, 320px" />
        </div>
      </div>
    );
  }

  // 4-9 → 3 列方块
  const cols = n === 4 ? 2 : 3;
  return (
    <div
      className={`grid gap-1.5 overflow-hidden rounded-card border border-feed-line ${cols === 2 ? "grid-cols-2" : "grid-cols-3"}`}
    >
      {list.map((m, i) => (
        <Cell key={i} m={m} sizes="(max-width: 768px) 33vw, 213px" />
      ))}
    </div>
  );
}

function Cell({ m, sizes, full = false }: { m: FeedMedia; sizes: string; full?: boolean }) {
  return (
    <div className={`relative overflow-hidden ${full ? "h-full" : ""}`} style={full ? undefined : { aspectRatio: "1/1" }}>
      <Image
        src={m.src}
        alt=""
        fill
        sizes={sizes}
        className="object-cover transition duration-500 ease-out hover:scale-[1.04]"
      />
      {m.type === "video" && <PlayBadge />}
    </div>
  );
}

function PlayBadge() {
  return (
    <span className="pointer-events-none absolute inset-0 grid place-items-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-black/55 backdrop-blur">
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  );
}
