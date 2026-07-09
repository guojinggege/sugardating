// /massage — 情趣按摩频道首页 (Directory Home)
import type { Metadata } from "next";
import Link from "next/link";
import { cities, providers, listProviders, sortProviders } from "@/lib/massage-data";
import MassageBreadcrumb from "@/components/Massage/MassageBreadcrumb";
import MassageHero from "@/components/Massage/MassageHero";
import MassageSearchPanel from "@/components/Massage/MassageSearchPanel";
import MassageQuickFilters from "@/components/Massage/MassageQuickFilters";
import MassageFeaturedGrid from "@/components/Massage/MassageFeaturedGrid";
import MassageSafetySection from "@/components/Massage/MassageSafetySection";
import MassageRelatedAreas from "@/components/Massage/MassageRelatedAreas";
import MassageFAQ from "@/components/Massage/MassageFAQ";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sensual Massage · 情趣按摩 · Sugardating",
  description: "Premium Sensual Massage & Private Relaxation. 浏览已认证的 18+ 按摩服务者,按城市、语言、认证信息与视频资料筛选。",
};

export default function MassageDirectoryPage() {
  const featured = sortProviders(listProviders({ verifiedOnly: true }), "recommended")
    .filter((p) => p.featured)
    .slice(0, 4);
  const totalProviders = providers.length;

  return (
    <div className="ms-page">
      <MassageHero />

      <div className="ms-shell">
        <MassageBreadcrumb items={[
          { href: "/", label: "首页 / Home" },
          { label: "Sensual Massage" },
        ]} />

        <div className="ms-search-wrap"><MassageSearchPanel /></div>

        <MassageQuickFilters />

        {featured.length > 0 && <MassageFeaturedGrid providers={featured} />}

        {/* City grid */}
        <section className="ms-cities" aria-label="Browse by city">
          <div className="ms-cities-head">
            <h2>Browse by City</h2>
            <span className="ms-cities-total">{totalProviders} providers across the UK</span>
          </div>
          <div className="ms-cities-grid">
            {cities.map((c) => {
              const count = listProviders({ city: c.slug }).length;
              return (
                <Link key={c.slug} href={`/massage/${c.slug}`} className="ms-city-card">
                  <div className="ms-city-name">
                    <span>{c.label}</span>
                    <span className="ms-city-zh">{c.labelZh}</span>
                  </div>
                  <div className="ms-city-count">
                    <b>{count}</b>
                    <span>providers</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <MassageSafetySection />
        <MassageRelatedAreas />
        <MassageFAQ />
      </div>

      <style>{`
        .ms-page{background:#F4F4F5;min-height:100vh;padding-bottom:80px}
        .ms-shell{max-width:1280px;margin:0 auto;padding:20px 24px 0;display:flex;flex-direction:column;gap:8px}
        .ms-search-wrap{margin:14px 0 4px}
        .ms-cities{margin-top:20px}
        .ms-cities-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line)}
        .ms-cities-head h2{font-size:20px;font-weight:700;color:#161618;margin:0}
        .ms-cities-total{font-size:12.5px;color:#8a8a92;font-weight:500}
        .ms-cities-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .ms-city-card{display:flex;justify-content:space-between;align-items:center;padding:18px 22px;background:#fff;border:1px solid var(--line);border-radius:16px;text-decoration:none;transition:transform .12s,border-color .12s}
        .ms-city-card:hover{transform:translateY(-2px);border-color:#161618}
        .ms-city-name{display:flex;flex-direction:column;gap:2px}
        .ms-city-name > span:first-child{font-size:16px;font-weight:700;color:#161618;letter-spacing:-0.005em}
        .ms-city-zh{font-size:12px;color:#8a8a92}
        .ms-city-count{text-align:right}
        .ms-city-count b{display:block;font-size:20px;color:#B8A789;font-weight:800;line-height:1;font-variant-numeric:tabular-nums}
        .ms-city-count span{font-size:10.5px;color:#8a8a92;text-transform:uppercase;letter-spacing:.06em;font-weight:600}
        @media (max-width:900px){.ms-cities-grid{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:640px){
          .ms-shell{padding:16px 16px 0}
          .ms-cities-grid{grid-template-columns:1fr}
        }
      `}</style>
    </div>
  );
}
