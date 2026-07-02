// Right rail — 18+ 提示卡 + 今晚在聊 + 活跃社区 + 会员卡
import Link from "next/link";
import type { CommunityCategory, TrendingTopic, CommunityColor } from "@/lib/communityMock";

const DOT_COLOR: Record<CommunityColor, string> = {
  pink: "#EC4C86", purple: "#7C5CFF", gold: "#D6B86A", cyan: "#22D3EE",
  amber: "#F59E0B", emerald: "#10B981", rose: "#FB7185", indigo: "#818CF8",
};

interface Props {
  topics: TrendingTopic[];
  activeCommunities: CommunityCategory[];
}

export default function CommunityRightSidebar({ topics, activeCommunities }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* 18+ 验证提示卡 */}
      <div className="rounded-[16px] p-4 border border-white/[0.08] bg-[var(--cm-surface)]">
        <div className="flex items-center gap-2 mb-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[var(--cm-emerald)]" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/></svg>
          <h5 className="text-[13px] font-bold text-white">你已通过 18+ 验证</h5>
        </div>
        <p className="text-[12px] text-[var(--cm-muted)] leading-[1.6] mb-3">
          这里是成年人的社区,没有露骨内容,但话题可能更真实、更直接。
        </p>
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="px-2 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[var(--cm-muted)]">安全年龄校验</span>
          <span className="px-2 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[var(--cm-muted)]">支持匿名发帖</span>
        </div>
      </div>

      {/* 今晚在聊 */}
      <div className="rounded-[16px] p-4 border border-white/[0.08] bg-[var(--cm-surface)]">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-[13px] font-bold text-white">今晚在聊</h5>
          <span className="text-[10.5px] font-semibold text-[var(--cm-muted)] uppercase tracking-[.1em]">Trending</span>
        </div>
        <ol className="flex flex-col gap-2.5">
          {topics.map((t) => (
            <li key={t.rank} className="flex items-start gap-2.5 group cursor-pointer">
              <span className="text-[15px] font-bold text-[var(--cm-muted)] w-5 shrink-0 leading-tight">{t.rank}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-white leading-tight group-hover:text-[var(--cm-pink)] transition-colors truncate">{t.title}</div>
              </div>
              {t.badge && <TopicBadge label={t.badge} />}
            </li>
          ))}
        </ol>
      </div>

      {/* 你的社区,活跃中 */}
      <div className="rounded-[16px] p-4 border border-white/[0.08] bg-[var(--cm-surface)]">
        <h5 className="text-[13px] font-bold text-white mb-3">你的社区,活跃中</h5>
        <ul className="flex flex-col gap-2">
          {activeCommunities.map((c) => (
            <li key={c.id}>
              <Link href={`/community/${c.slug}`} className="flex items-center gap-2.5 group">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: DOT_COLOR[c.color] }} />
                <span className="text-[12.5px] text-white font-medium truncate flex-1 group-hover:text-[var(--cm-pink)] transition-colors">{c.name}</span>
                {c.onlineCount !== undefined && (
                  <span className="text-[10.5px] text-[var(--cm-muted)] tabular-nums">{c.onlineCount.toLocaleString("en-US")} 在线</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 夜谈会员卡 */}
      <div
        className="rounded-[16px] p-4 border border-white/[0.1] relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(214,184,106,0.18) 0%, rgba(124,92,255,0.14) 100%)" }}
      >
        <div className="text-[13px] font-bold text-white mb-2">夜谈会员</div>
        <ul className="flex flex-col gap-1.5 text-[12px] text-[var(--cm-text)]/90 mb-3">
          <Li>去广告</Li>
          <Li>匿名马甲</Li>
          <Li>会员标识</Li>
          <Li>优先推荐</Li>
        </ul>
        <Link
          href="/membership"
          className="block text-center h-10 leading-10 rounded-full text-[13px] font-bold text-[#1a1409]"
          style={{ background: "linear-gradient(135deg,#d4bf95 0%,#b8a789 50%,#f0c9a3 100%)" }}
        >
          ¥25/月 起
        </Link>
      </div>
    </div>
  );
}

function TopicBadge({ label }: { label: TrendingTopic["badge"] }) {
  const styles: Record<string, string> = {
    "NEW":     "bg-[var(--cm-pink)]/15   text-[var(--cm-pink)]   border-[var(--cm-pink)]/30",
    "热":      "bg-[var(--cm-gold)]/15   text-[var(--cm-gold)]   border-[var(--cm-gold)]/30",
    "+188%":   "bg-[var(--cm-emerald)]/15 text-[var(--cm-emerald)] border-[var(--cm-emerald)]/30",
    "+612%":   "bg-[var(--cm-emerald)]/15 text-[var(--cm-emerald)] border-[var(--cm-emerald)]/30",
    "+322%":   "bg-[var(--cm-emerald)]/15 text-[var(--cm-emerald)] border-[var(--cm-emerald)]/30",
  };
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none border ${styles[String(label)] || ""}`}>
      {label}
    </span>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-1.5">
      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-[var(--cm-gold)]" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10"/></svg>
      {children}
    </li>
  );
}
