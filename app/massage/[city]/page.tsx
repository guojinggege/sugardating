// /massage/[city] — 城市列表页
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  cities, getCity, listProviders, sortProviders, getCityStats,
} from "@/lib/massage-data";
import { parseFilter, parseSort, buildSummary } from "@/lib/massage-filters";
import MassageBreadcrumb from "@/components/Massage/MassageBreadcrumb";
import MassageSearchPanel from "@/components/Massage/MassageSearchPanel";
import MassageQuickFilters from "@/components/Massage/MassageQuickFilters";
import MassageFilterSidebar from "@/components/Massage/MassageFilterSidebar";
import MassageResultsToolbar from "@/components/Massage/MassageResultsToolbar";
import MassageFeaturedGrid from "@/components/Massage/MassageFeaturedGrid";
import MassageResults from "@/components/Massage/MassageResults";
import MassageStatsRow from "@/components/Massage/MassageStatsRow";
import MassageSEOSection from "@/components/Massage/MassageSEOSection";
import MassageSafetySection from "@/components/Massage/MassageSafetySection";
import MassageRelatedAreas from "@/components/Massage/MassageRelatedAreas";
import MassageFAQ from "@/components/Massage/MassageFAQ";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const c = getCity(params.city);
  if (!c) return { title: "Sensual Massage · Sugardating" };
  return {
    title: `${c.seoTitle} · Sugardating`,
    description: c.seoIntro,
  };
}

interface Props {
  params: { city: string };
  searchParams: { [k: string]: string | string[] | undefined };
}

export default function MassageCityPage({ params, searchParams }: Props) {
  const city = getCity(params.city);
  if (!city) notFound();

  const filter = parseFilter(searchParams, city.slug);
  const sortKey = parseSort(searchParams);
  const summary = buildSummary(filter);

  const filtered = listProviders(filter);
  const sorted = sortProviders(filtered, sortKey);
  const featured = listProviders({ city: city.slug })
    .filter((p) => p.featured)
    .slice(0, 4);
  const stats = getCityStats(city.slug);

  return (
    <div className="ms-page">
      <div className="ms-city-hero">
        <div className="ms-shell">
          <MassageBreadcrumb items={[
            { href: "/", label: "首页 / Home" },
            { href: "/massage", label: "Sensual Massage" },
            { href: `/massage/${city.slug}`, label: "United Kingdom" },
            { label: city.label },
          ]} />
          <div className="ms-city-head">
            <div className="ms-city-eyebrow"><span className="ms-city-18">18+</span> Sensual Massage Directory</div>
            <h1>{city.seoTitle}</h1>
            <p className="ms-city-zh">{city.seoTitleZh}</p>
            <p className="ms-city-desc">{city.seoIntroZh}</p>
          </div>
          <MassageStatsRow stats={stats} cityLabel={city.label} />
          <div className="ms-search-wrap"><MassageSearchPanel defaultCity={city.slug} /></div>
          <MassageQuickFilters />
        </div>
      </div>

      <div className="ms-shell">
        {featured.length > 0 && <MassageFeaturedGrid providers={featured} />}

        <div className="ms-body-grid">
          <MassageFilterSidebar />
          <main className="ms-main">
            <MassageResultsToolbar total={sorted.length} cityLabel={city.label} activeSummary={summary} />
            <MassageResults providers={sorted} />
          </main>
        </div>

        <MassageSEOSection city={city} />
        <MassageSafetySection />
        <MassageRelatedAreas currentCity={city} />
        <MassageFAQ />
      </div>

      <style>{`
        .ms-page{background:#F4F4F5;min-height:100vh;padding-bottom:80px}
        .ms-city-hero{background:linear-gradient(180deg,#FBFAF7,#F4F4F5);border-bottom:1px solid var(--line)}
        .ms-shell{max-width:1280px;margin:0 auto;padding:24px 24px 0;display:flex;flex-direction:column;gap:14px}
        .ms-city-head{margin-top:6px}
        .ms-city-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:10px}
        .ms-city-18{background:#161618;color:#EEDDB8;padding:3px 8px;border-radius:4px;letter-spacing:.02em}
        .ms-city-head h1{font-size:34px;font-weight:700;color:#161618;letter-spacing:-0.01em;margin:0 0 4px;line-height:1.2;font-family:'Plus Jakarta Sans',ui-sans-serif}
        .ms-city-zh{font-size:16px;color:#5a5a62;margin:0 0 10px;font-weight:500}
        .ms-city-desc{font-size:14.5px;line-height:1.65;color:#3d3d42;margin:0;max-width:70ch}
        .ms-search-wrap{margin:6px 0 4px}
        .ms-body-grid{display:grid;grid-template-columns:300px minmax(0,1fr);gap:32px;margin-top:8px}
        .ms-main{min-width:0}
        @media (max-width:1024px){
          .ms-body-grid{grid-template-columns:1fr;gap:0}
        }
        @media (max-width:640px){
          .ms-shell{padding:16px 16px 0}
          .ms-city-head h1{font-size:24px}
        }
      `}</style>
    </div>
  );
}
