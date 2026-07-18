"use client";
// Segmented control · 私语广场 ↔ Journal
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CommunityModeSwitcher() {
  const pathname = usePathname() || "";
  const isJournal = pathname.startsWith("/community/journal");

  return (
    <div className="cm">
      <Link
        href="/community"
        className={"cm-opt" + (!isJournal ? " is-active" : "")}
        aria-pressed={!isJournal}
      >
        <span className="cm-dot cm-dot--story" aria-hidden />
        私语广场
      </Link>
      <Link
        href="/community/journal"
        className={"cm-opt" + (isJournal ? " is-active" : "")}
        aria-pressed={isJournal}
      >
        <span className="cm-dot cm-dot--gold" aria-hidden />
        Sugardating Journal
      </Link>

      <style>{`
        .cm{display:inline-flex;padding:5px;background:rgba(255,255,255,.68);backdrop-filter:blur(12px);border:1px solid #E9E3DA;border-radius:999px;gap:2px;box-shadow:0 1px 2px rgba(23,21,18,.03)}
        .cm-opt{display:inline-flex;align-items:center;gap:8px;padding:9px 20px;font-size:13.5px;font-weight:600;color:#77716A;letter-spacing:-0.005em;border-radius:999px;text-decoration:none;transition:color .15s,background .15s;font-family:inherit}
        .cm-opt:hover{color:#171512}
        .cm-opt.is-active{background:#171512;color:#F5EEDD}
        .cm-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
        .cm-dot--story{background:#A96F78}
        .cm-dot--gold{background:linear-gradient(135deg,#EEDDB8,#C5A56A)}
        @media (max-width:640px){.cm-opt{padding:8px 14px;font-size:12.5px}}
      `}</style>
    </div>
  );
}
