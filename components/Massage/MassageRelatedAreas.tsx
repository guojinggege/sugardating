// Related cities / areas / tags
import Link from "next/link";
import { cities, type City } from "@/lib/massage-data";

interface Props { currentCity?: City }

const TAG_QUERIES: { slug: string; label: string; href: string }[] = [
  { slug: "asian",      label: "Asian Massage",      href: "?tag=asian" },
  { slug: "thai",       label: "Thai Massage",       href: "?tag=thai" },
  { slug: "filipina",   label: "Filipina Massage",   href: "?tag=filipina" },
  { slug: "vietnamese", label: "Vietnamese Massage", href: "?tag=vietnamese" },
  { slug: "chinese",    label: "Chinese Massage",    href: "?tag=chinese" },
  { slug: "verified",   label: "Verified Providers", href: "?verified=1" },
  { slug: "video",      label: "Video Introduction", href: "?video=1" },
  { slug: "hotel",      label: "Hotel Appointment",  href: "?apt=hotel-visit" },
];

export default function MassageRelatedAreas({ currentCity }: Props) {
  const otherCities = cities.filter((c) => c.slug !== currentCity?.slug);
  const areas = currentCity?.areas ?? [];
  const cityPrefix = currentCity ? `/massage/${currentCity.slug}` : "/massage/london";

  return (
    <section className="ms-rel" aria-label="Related areas and tags">
      {areas.length > 0 && (
        <div className="ms-rel-blk">
          <h3>{currentCity!.label} Areas</h3>
          <div className="ms-rel-chips">
            {areas.map((a) => (
              <Link key={a.slug} href={`/massage/${currentCity!.slug}/${a.slug}`} className="ms-rel-chip">
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="ms-rel-blk">
        <h3>Related Cities</h3>
        <div className="ms-rel-chips">
          {otherCities.map((c) => (
            <Link key={c.slug} href={`/massage/${c.slug}`} className="ms-rel-chip">
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="ms-rel-blk">
        <h3>Related Tags</h3>
        <div className="ms-rel-chips">
          {TAG_QUERIES.map((t) => (
            <Link key={t.slug} href={`${cityPrefix}${t.href}`} className="ms-rel-chip">
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .ms-rel{display:flex;flex-direction:column;gap:22px;margin-top:24px;padding:26px 30px;background:#fff;border:1px solid var(--line);border-radius:20px}
        .ms-rel-blk h3{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#8a8a92;font-weight:700;margin:0 0 12px}
        .ms-rel-chips{display:flex;flex-wrap:wrap;gap:6px}
        .ms-rel-chip{padding:7px 12px;background:#F4F4F5;border:1px solid transparent;border-radius:99px;color:#3d3d42;font-size:12.5px;font-weight:600;text-decoration:none;transition:all .12s}
        .ms-rel-chip:hover{background:#fff;border-color:#161618;color:#161618}
        @media (max-width:640px){.ms-rel{padding:20px 18px}}
      `}</style>
    </section>
  );
}
