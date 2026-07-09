// Results — client component 读 view=gallery/list 切 layout
"use client";
import { useSearchParams } from "next/navigation";
import type { MassageProvider } from "@/lib/massage-labels";
import MassageProviderCard from "./MassageProviderCard";

export default function MassageResults({ providers }: { providers: MassageProvider[] }) {
  const sp = useSearchParams();
  const view = sp.get("view") === "list" ? "list" : "gallery";

  if (!providers.length) {
    return (
      <div className="ms-empty">
        <div className="ms-empty-ic">🔍</div>
        <div className="ms-empty-h">当前筛选下暂无结果</div>
        <p>请调整筛选条件或切换城市。</p>
        <style jsx>{`
          .ms-empty{background:#fff;border:1px solid var(--line);border-radius:18px;padding:60px 24px;text-align:center;color:#8a8a92}
          .ms-empty-ic{font-size:36px;margin-bottom:12px}
          .ms-empty-h{font-size:15px;color:#161618;font-weight:700;margin-bottom:6px}
          .ms-empty p{margin:0;font-size:13.5px}
        `}</style>
      </div>
    );
  }

  return (
    <div className={view === "list" ? "ms-results ms-results--list" : "ms-results ms-results--gallery"}>
      {providers.map((p) => (
        <MassageProviderCard key={p.id} provider={p} variant={view} />
      ))}
      <style jsx>{`
        .ms-results--gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .ms-results--list{display:flex;flex-direction:column;gap:14px}
        @media (max-width:1200px){.ms-results--gallery{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:640px){.ms-results--gallery{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
