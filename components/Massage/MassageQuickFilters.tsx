"use client";
// Quick filter chips — 通过 URL search params 切换
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Chip { key: string; value?: string; label: string }

const CHIPS: Chip[] = [
  { key: "online",       value: "1",         label: "在线中" },
  { key: "verified",     value: "1",         label: "已认证" },
  { key: "today",        value: "1",         label: "今日可预约" },
  { key: "video",        value: "1",         label: "有视频" },
  { key: "vip",          value: "1",         label: "VIP" },
  { key: "language",     value: "Chinese",   label: "支持中文" },
  { key: "language",     value: "English",   label: "English" },
  { key: "language",     value: "Thai",      label: "Thai" },
  { key: "tag",          value: "filipina",  label: "Filipina" },
  { key: "tag",          value: "vietnamese",label: "Vietnamese" },
  { key: "tag",          value: "asian",     label: "Asian" },
  { key: "fastReply",    value: "1",         label: "快速回复" },
];

export default function MassageQuickFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function toggle(chip: Chip) {
    const params = new URLSearchParams(sp.toString());
    const current = params.get(chip.key);
    if (current === chip.value) {
      params.delete(chip.key);
    } else {
      params.set(chip.key, chip.value ?? "1");
    }
    router.push(params.toString() ? `${pathname}?${params}` : pathname);
  }

  return (
    <div className="ms-qf" role="group" aria-label="Quick filters">
      {CHIPS.map((c, i) => {
        const active = sp.get(c.key) === c.value;
        return (
          <button
            key={i}
            type="button"
            onClick={() => toggle(c)}
            className={"ms-qf-chip" + (active ? " is-active" : "")}
          >
            {c.label}
          </button>
        );
      })}
      <style jsx>{`
        .ms-qf{display:flex;gap:6px;padding:12px 0;overflow-x:auto;scrollbar-width:none}
        .ms-qf::-webkit-scrollbar{display:none}
        .ms-qf-chip{flex-shrink:0;padding:7px 14px;border-radius:999px;background:#fff;border:1px solid #E8E8EC;color:#3d3d42;font:inherit;font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .12s}
        .ms-qf-chip:hover{border-color:#161618}
        .ms-qf-chip.is-active{background:#161618;color:#EEDDB8;border-color:#161618}
      `}</style>
    </div>
  );
}
