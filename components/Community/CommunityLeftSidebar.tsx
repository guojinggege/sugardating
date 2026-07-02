// Left rail — 主导航 + 我加入的社区 + 发现专区 + 会员升级卡
import Link from "next/link";
import type { CommunityCategory, CommunityColor } from "@/lib/communityMock";

const DOT_COLOR: Record<CommunityColor, string> = {
  pink:    "#EC4C86",
  purple:  "#7C5CFF",
  gold:    "#D6B86A",
  cyan:    "#22D3EE",
  amber:   "#F59E0B",
  emerald: "#10B981",
  rose:    "#FB7185",
  indigo:  "#818CF8",
};

const NAV = [
  { k: "home",     label: "首页",       icon: "M3 12l9-9 9 9v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z" },
  { k: "discover", label: "发现社区",   icon: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 15a5 5 0 1 1 5-5 5 5 0 0 1-5 5z" },
  { k: "dm",       label: "私信",       icon: "M21 12a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 12z" },
  { k: "member",   label: "夜谈会员",   icon: "M12 2l2.4 6H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.6z" },
  { k: "me",       label: "我的主页",   icon: "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" },
];

function CategoryRow({ c, active }: { c: CommunityCategory; active?: boolean }) {
  return (
    <Link
      href={`/community/${c.slug}`}
      className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] transition-colors ${
        active ? "bg-white/10" : "hover:bg-white/[0.05]"
      }`}
    >
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ background: DOT_COLOR[c.color], boxShadow: `0 0 8px ${DOT_COLOR[c.color]}66` }}
      />
      <span className="text-[13.5px] font-medium text-[var(--cm-text)] truncate flex-1">{c.name}</span>
      {c.isHot && (
        <span className="text-[10px] font-bold text-[var(--cm-pink)] bg-[var(--cm-pink)]/10 border border-[var(--cm-pink)]/25 px-1.5 py-0.5 rounded-full leading-none">HOT</span>
      )}
    </Link>
  );
}

interface Props {
  joined: CommunityCategory[];
  discover: CommunityCategory[];
  activeSlug?: string;
}

export default function CommunityLeftSidebar({ joined, discover, activeSlug = "home" }: Props) {
  return (
    <nav className="flex flex-col gap-6 text-[var(--cm-text)]">
      {/* 主导航 */}
      <ul className="flex flex-col gap-1">
        {NAV.map((n) => (
          <li key={n.k}>
            <Link
              href="#"
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] transition-colors ${
                n.k === activeSlug ? "bg-white/10 text-white" : "text-[var(--cm-text)] hover:bg-white/[0.05]"
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-90"><path d={n.icon} /></svg>
              <span className="text-[13.5px] font-semibold">{n.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* 我加入的社区 */}
      <div>
        <h5 className="text-[10.5px] font-bold uppercase tracking-[.14em] text-[var(--cm-muted)] mb-2 px-2.5">我加入的社区</h5>
        <ul className="flex flex-col gap-0.5">
          {joined.map((c) => <li key={c.id}><CategoryRow c={c} /></li>)}
        </ul>
      </div>

      {/* 发现专区 */}
      <div>
        <h5 className="text-[10.5px] font-bold uppercase tracking-[.14em] text-[var(--cm-muted)] mb-2 px-2.5">发现专区</h5>
        <ul className="flex flex-col gap-0.5">
          {discover.map((c) => <li key={c.id}><CategoryRow c={c} /></li>)}
        </ul>
      </div>

      {/* 会员升级卡 */}
      <div className="rounded-[18px] p-4 border border-white/[0.08] bg-gradient-to-br from-[rgba(214,184,106,0.14)] to-[rgba(124,92,255,0.10)]">
        <div className="text-[13px] font-bold text-white mb-1">升级夜谈会员</div>
        <div className="text-[11.5px] text-[var(--cm-muted)] leading-[1.5] mb-3">去广告 · 匿名马甲 · 已读不回</div>
        <Link
          href="/membership"
          className="block text-center h-9 leading-9 rounded-full text-[12px] font-bold text-[#1a1409]"
          style={{ background: "linear-gradient(135deg,#d4bf95 0%,#b8a789 50%,#f0c9a3 100%)" }}
        >
          了解一下
        </Link>
      </div>
    </nav>
  );
}
