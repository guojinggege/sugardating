"use client";
// Results toolbar — count + active filters + sort + view toggle + save search
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/Auth/AuthProvider";
import type { SortKey } from "@/lib/massage-labels";

interface Props {
  total: number;
  cityLabel: string;
  activeSummary?: string[];
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "online-first", label: "Online first" },
  { value: "top-rated", label: "Top rated" },
  { value: "fast-reply", label: "Fast reply" },
  { value: "price-asc", label: "Price low → high" },
  { value: "price-desc", label: "Price high → low" },
  { value: "video-first", label: "Video first" },
  { value: "gifts", label: "Most gifted" },
];

export default function MassageResultsToolbar({ total, cityLabel, activeSummary = [] }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const { user } = useAuth();

  const sort = (sp.get("sort") as SortKey) || "recommended";
  const view = sp.get("view") === "list" ? "list" : "gallery";

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(sp.toString());
    if (value) p.set(key, value); else p.delete(key);
    router.push(p.toString() ? `${pathname}?${p}` : pathname);
  }

  function saveSearch() {
    if (!user) {
      alert("登录后可保存筛选并接收提醒");
      return;
    }
    const filters = Array.from(sp.entries()).map(([k, v]) => `${k}=${v}`).join(" · ");
    alert(`已保存筛选条件${filters ? ":\n" + filters : ""}`);
  }

  return (
    <div className="ms-tb">
      <div className="ms-tb-left">
        <div className="ms-tb-count">
          <b>{total}</b> Sensual Massage Providers <span className="ms-tb-in">in</span> {cityLabel}
        </div>
        {activeSummary.length > 0 && (
          <div className="ms-tb-summary">{activeSummary.join(" · ")}</div>
        )}
      </div>
      <div className="ms-tb-right">
        <div className="ms-tb-sort">
          <label>Sort</label>
          <select value={sort} onChange={(e) => setParam("sort", e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="ms-tb-view" role="group" aria-label="View">
          <button
            type="button"
            className={"ms-tb-view-btn" + (view === "gallery" ? " is-active" : "")}
            onClick={() => setParam("view", "gallery")}
            aria-pressed={view === "gallery"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>
            Gallery
          </button>
          <button
            type="button"
            className={"ms-tb-view-btn" + (view === "list" ? " is-active" : "")}
            onClick={() => setParam("view", "list")}
            aria-pressed={view === "list"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/></svg>
            List
          </button>
        </div>
        <button type="button" className="ms-tb-save" onClick={saveSearch}>
          ★ Save search
        </button>
      </div>
      <style jsx>{`
        .ms-tb{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 18px;background:#fff;border:1px solid var(--line);border-radius:16px;margin:12px 0 20px;flex-wrap:wrap}
        .ms-tb-left{display:flex;flex-direction:column;gap:4px;min-width:0}
        .ms-tb-count{font-size:14px;color:#161618}
        .ms-tb-count b{font-weight:700;font-size:16px}
        .ms-tb-in{color:#8a8a92;margin:0 4px}
        .ms-tb-summary{font-size:12px;color:#B8A789;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
        .ms-tb-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .ms-tb-sort{display:flex;align-items:center;gap:6px}
        .ms-tb-sort label{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#8a8a92;font-weight:700}
        .ms-tb-sort select{padding:7px 10px;border:1px solid var(--line);border-radius:10px;background:#F8F8F9;font:inherit;font-size:13px;color:#161618;outline:none}
        .ms-tb-sort select:focus{border-color:#161618;background:#fff}
        .ms-tb-view{display:inline-flex;background:#F4F4F5;padding:3px;border-radius:12px}
        .ms-tb-view-btn{padding:6px 12px;border-radius:10px;border:0;background:transparent;color:#3d3d42;font:inherit;font-size:12.5px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
        .ms-tb-view-btn.is-active{background:#fff;color:#161618;box-shadow:0 1px 4px rgba(0,0,0,.06)}
        .ms-tb-save{padding:8px 14px;border-radius:999px;background:#fff;border:1px solid var(--line);color:#161618;font:inherit;font-size:12.5px;font-weight:600;cursor:pointer;transition:border-color .12s}
        .ms-tb-save:hover{border-color:#161618}
        @media (max-width:640px){
          .ms-tb{padding:12px 14px}
          .ms-tb-right{gap:6px}
          .ms-tb-view-btn{padding:6px 10px}
          .ms-tb-save{padding:8px 12px}
        }
      `}</style>
    </div>
  );
}
