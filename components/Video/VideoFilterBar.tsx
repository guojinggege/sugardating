"use client";
import { VIDEO_TOP_FILTERS, type VideoCategoryKey } from "@/lib/videoMock";

interface Props {
  active: VideoCategoryKey;
  onChange: (k: VideoCategoryKey) => void;
}

// 顶部横向 chip 筛选,sticky top
export default function VideoFilterBar({ active, onChange }: Props) {
  return (
    <div className="sticky top-[60px] z-30 -mx-3 border-y border-feed-line bg-feed-bg/85 px-3 backdrop-blur-xl md:top-[64px]">
      <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
        <Chip
          on={active === "all"}
          onClick={() => onChange("all")}
          label="全部"
        />
        {VIDEO_TOP_FILTERS.map((f) => (
          <Chip
            key={f.key}
            on={active === f.key}
            onClick={() => onChange(f.key)}
            label={f.label}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`shrink-0 rounded-pill px-4 py-1.5 text-[13.5px] font-semibold transition ${
        on
          ? "bg-gold text-feed-bg shadow-[0_4px_18px_-6px_rgba(184,167,137,0.6)]"
          : "border border-feed-line bg-feed-surface text-feed-mute hover:border-feed-line2 hover:text-feed-ink"
      }`}
    >
      {label}
    </button>
  );
}
