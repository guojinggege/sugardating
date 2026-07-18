"use client";
// Sticky feed nav · 顶部 Tab 切换 · 支持 unanswered 徽标
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  unansweredCount?: number;
}

const TABS: { href: string; label: string; matchExact?: boolean }[] = [
  { href: "/community",             label: "为你推荐", matchExact: true },
  { href: "/community/stories",     label: "情感私话" },
  { href: "/community/questions",   label: "问答专区" },
  { href: "/community/latest",      label: "最新" },
  { href: "/community/unanswered",  label: "等待回答" },
];

export default function CommunityFeedTabs({ unansweredCount }: Props) {
  const pathname = usePathname() || "";
  return (
    <nav className="ct" aria-label="Community feed">
      <div className="ct-scroll">
        {TABS.map((t) => {
          const active = t.matchExact ? pathname === t.href : pathname.startsWith(t.href);
          return (
            <Link key={t.href} href={t.href} className={"ct-tab" + (active ? " is-active" : "")}>
              {t.label}
              {t.href === "/community/unanswered" && unansweredCount ? (
                <span className="ct-badge">{unansweredCount}</span>
              ) : null}
            </Link>
          );
        })}
      </div>

      <style>{`
        .ct{position:sticky;top:60px;z-index:20;background:rgba(247,244,239,.92);backdrop-filter:blur(14px);border-bottom:1px solid #E9E3DA;padding:12px 0 10px}
        .ct-scroll{max-width:1380px;margin:0 auto;padding:0 32px;display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
        .ct-scroll::-webkit-scrollbar{display:none}
        .ct-tab{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;font-size:13.5px;font-weight:600;color:#77716A;text-decoration:none;border-radius:999px;transition:color .12s,background .12s;white-space:nowrap;letter-spacing:-0.005em}
        .ct-tab:hover{color:#171512;background:rgba(233,227,218,.6)}
        .ct-tab.is-active{color:#171512;background:#fff;box-shadow:0 1px 4px rgba(23,21,18,.06);position:relative}
        .ct-tab.is-active:after{content:"";position:absolute;bottom:-11px;left:50%;transform:translateX(-50%);width:24px;height:2px;background:#C5A56A;border-radius:2px}
        .ct-badge{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 6px;background:#B77945;color:#fff;font-size:10.5px;font-weight:700;border-radius:999px;font-variant-numeric:tabular-nums}
        @media (max-width:640px){
          .ct-scroll{padding:0 16px}
          .ct-tab{padding:7px 12px;font-size:12.5px}
        }
      `}</style>
    </nav>
  );
}
