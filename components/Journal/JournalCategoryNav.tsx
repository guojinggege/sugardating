// 横向分类导航 — 支持 mobile 横向滚动
import Link from "next/link";
import { journalCategories } from "@/lib/journal-data";

interface Props {
  activeSlug?: string;
  basePath?: string;   // 默认 /community
}

export default function JournalCategoryNav({ activeSlug, basePath = "/community" }: Props) {
  return (
    <nav className="jn-catnav" aria-label="Journal categories">
      <div className="jn-catnav-in">
        <Link
          href={basePath}
          className={"jn-cat" + (!activeSlug ? " is-active" : "")}
        >
          Featured
        </Link>
        {journalCategories.map((c) => (
          <Link
            key={c.slug}
            href={`${basePath}/${c.slug}`}
            className={"jn-cat" + (c.slug === activeSlug ? " is-active" : "")}
          >
            <span className="jn-cat-en">{c.title}</span>
            <span className="jn-cat-zh">{c.titleZh}</span>
          </Link>
        ))}
      </div>
      <style>{`
        .jn-catnav{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:20;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:rgba(255,255,255,.94)}
        .jn-catnav-in{max-width:1240px;margin:0 auto;padding:12px 24px;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}
        .jn-catnav-in::-webkit-scrollbar{display:none}
        .jn-cat{flex-shrink:0;padding:8px 14px;border-radius:999px;font-size:13px;font-weight:600;color:#3d3d42;text-decoration:none;transition:background .12s,color .12s;display:inline-flex;flex-direction:column;line-height:1.15;text-align:center;white-space:nowrap}
        .jn-cat:hover{background:#F4F4F5;color:#161618}
        .jn-cat.is-active{background:#161618;color:#fff}
        .jn-cat-zh{font-size:10.5px;color:#8a8a92;font-weight:500;margin-top:1px}
        .jn-cat.is-active .jn-cat-zh{color:rgba(255,255,255,.65)}
        @media (max-width:768px){
          .jn-catnav-in{padding:10px 16px}
          .jn-cat{padding:7px 12px;font-size:12.5px}
          .jn-cat-zh{display:none}
        }
      `}</style>
    </nav>
  );
}
