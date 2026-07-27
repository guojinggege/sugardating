"use client";
// 互动社区顶部三段式导航 · 博客 / 帖子 / 动态
// 博客 → /community/journal (长文章 · Journal)
// 帖子 → /community/stories (留学生吃瓜 · 短内容 · 匿名分享)
// 动态 → /community/feed (话题 · 问答 · Creator Post)
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/community/journal", label: "博客", hint: "长文章 · Journal" },
  { href: "/community/stories", label: "帖子", hint: "短内容 · 留学生吃瓜" },
  { href: "/community/feed",    label: "动态", hint: "话题 · 问答 · Post" },
];

export default function CommunityModeSwitcher() {
  const pathname = usePathname() || "";
  const activeIdx = (() => {
    if (pathname.startsWith("/community/journal")) return 0;
    if (pathname.startsWith("/community/stories") || pathname.startsWith("/community/story"))     return 1;
    if (pathname.startsWith("/community/feed") ||
        pathname.startsWith("/community/questions") ||
        pathname.startsWith("/community/question") ||
        pathname.startsWith("/community/latest") ||
        pathname.startsWith("/community/unanswered")) return 2;
    if (pathname === "/community") return 2;   // 默认落到动态
    return -1;
  })();

  return (
    <div className="cm">
      {TABS.map((t, i) => (
        <Link key={t.href} href={t.href}
          className={"cm-opt" + (activeIdx === i ? " is-active" : "")}
          aria-pressed={activeIdx === i}
        >
          <b>{t.label}</b>
          <em>{t.hint}</em>
        </Link>
      ))}
      <style>{`
        .cm{display:inline-flex;padding:5px;background:rgba(255,255,255,.7);backdrop-filter:blur(12px);border:1px solid #E9E3DA;border-radius:16px;gap:2px;box-shadow:0 1px 2px rgba(23,21,18,.04)}
        .cm-opt{display:inline-flex;flex-direction:column;align-items:center;gap:1px;padding:9px 20px;font:inherit;color:#77716A;letter-spacing:-0.005em;border-radius:12px;text-decoration:none;transition:color .12s,background .12s;min-width:110px}
        .cm-opt:hover{color:#171512}
        .cm-opt.is-active{background:#171512;color:#F5EEDD}
        .cm-opt b{font-size:13.5px;font-weight:700}
        .cm-opt em{font-size:10.5px;font-style:normal;letter-spacing:.04em;opacity:.6}
        .cm-opt.is-active em{color:rgba(238,221,184,.7);opacity:1}
        @media (max-width:640px){
          .cm{gap:0}
          .cm-opt{min-width:auto;padding:8px 14px}
          .cm-opt em{display:none}
        }
      `}</style>
    </div>
  );
}
