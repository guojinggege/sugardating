// 投票组件 — 未投票显示选项 hover 高亮,已投票显示 % + 进度条
"use client";
import { useState } from "react";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import type { PollOption } from "@/lib/communityMock";

interface Props {
  options: PollOption[];
  totalVotes: number;
}

export default function CommunityPollCard({ options, totalVotes: initialTotal }: Props) {
  const [voted, setVoted] = useState<string | null>(null);
  const [totals, setTotals] = useState(() => new Map(options.map((o) => [o.id, o.votes])));
  const [total, setTotal] = useState(initialTotal);
  const requireLogin = useRequireLogin();

  const handleVote = (id: string) => {
    if (voted) return;
    if (!requireLogin()) return;
    setVoted(id);
    const next = new Map(totals);
    next.set(id, (next.get(id) || 0) + 1);
    setTotals(next);
    setTotal(total + 1);
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const v = totals.get(o.id) || 0;
        const pct = total > 0 ? Math.round((v / total) * 100) : 0;
        const isChosen = voted === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => handleVote(o.id)}
            disabled={voted !== null}
            className={`relative w-full text-left h-11 px-4 rounded-full border transition-all overflow-hidden ${
              voted
                ? "border-white/[0.08] cursor-default"
                : "border-white/[0.1] hover:border-[var(--cm-pink)] hover:bg-white/[0.05] cursor-pointer"
            } ${isChosen ? "border-[var(--cm-pink)]" : ""}`}
            style={{ background: voted ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.02)" }}
          >
            {/* Progress fill (only after vote) */}
            {voted && (
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${pct}%`,
                  background: isChosen ? "rgba(236,76,134,0.18)" : "rgba(255,255,255,0.04)",
                }}
                aria-hidden
              />
            )}
            <div className="relative flex items-center justify-between gap-3">
              <span className={`text-[13px] font-medium truncate ${isChosen ? "text-white" : "text-[var(--cm-text)]"}`}>
                {o.text}
              </span>
              {voted ? (
                <span className={`text-[13px] font-bold tabular-nums flex-shrink-0 ${isChosen ? "text-[var(--cm-pink)]" : "text-[var(--cm-muted)]"}`}>
                  {pct}%
                </span>
              ) : (
                <span className="text-[11.5px] text-[var(--cm-muted)] flex-shrink-0">点击查看</span>
              )}
            </div>
          </button>
        );
      })}
      <div className="text-[11.5px] text-[var(--cm-muted)] px-1 pt-1 tabular-nums">
        {total.toLocaleString("en-US")} 人参与投票
      </div>
    </div>
  );
}
