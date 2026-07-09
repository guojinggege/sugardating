// Featured / VIP grid
import type { MassageProvider } from "@/lib/massage-data";
import MassageProviderCard from "./MassageProviderCard";

export default function MassageFeaturedGrid({ providers }: { providers: MassageProvider[] }) {
  if (!providers.length) return null;
  return (
    <section className="ms-feat" aria-label="Featured Providers">
      <div className="ms-feat-head">
        <div>
          <h2 className="ms-feat-h">Featured Massage Providers</h2>
          <p className="ms-feat-sub">编辑精选 · 认证优先 · 视频资料</p>
        </div>
      </div>
      <div className="ms-feat-grid">
        {providers.map((p) => (
          <MassageProviderCard key={p.id} provider={p} variant="gallery" />
        ))}
      </div>
      <style>{`
        .ms-feat{margin-bottom:36px}
        .ms-feat-head{margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:flex-end}
        .ms-feat-h{font-size:20px;font-weight:700;color:#161618;margin:0}
        .ms-feat-sub{font-size:12.5px;color:#8a8a92;margin:4px 0 0}
        .ms-feat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        @media (max-width:1200px){.ms-feat-grid{grid-template-columns:repeat(3,1fr)}}
        @media (max-width:900px){.ms-feat-grid{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:520px){.ms-feat-grid{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
