// Provider card — gallery (grid) + list (horizontal) variants
import Link from "next/link";
import Img from "@/components/Img";
import type { MassageProvider } from "@/lib/massage-labels";
import { SERVICE_STYLE_LABEL } from "@/lib/massage-labels";

interface Props {
  provider: MassageProvider;
  variant?: "gallery" | "list";
}

function Badges({ p }: { p: MassageProvider }) {
  return (
    <>
      {p.vip && <span className="ms-badge ms-badge--vip">VIP</span>}
      {p.verification.identity && <span className="ms-badge ms-badge--verify">Verified</span>}
      {p.availability.online && <span className="ms-badge ms-badge--online"><span className="ms-dot" /> Online</span>}
      {p.verification.video && <span className="ms-badge ms-badge--video">Video</span>}
    </>
  );
}

export default function MassageProviderCard({ provider: p, variant = "gallery" }: Props) {
  const href = `/massage/profile/${p.slug}`;

  if (variant === "list") {
    return (
      <article className="ms-card ms-card--list">
        <Link href={href} className="ms-card-media">
          <Img src={p.coverImage} alt={p.displayName} sizes="240px" />
          <div className="ms-card-badges">
            <Badges p={p} />
          </div>
        </Link>
        <div className="ms-card-body">
          <div className="ms-card-top">
            <div>
              <h3 className="ms-card-name">
                <Link href={href}>{p.displayName}</Link>
                <span className="ms-card-age">{p.age}</span>
              </h3>
              <div className="ms-card-loc">
                {p.cityLabel}{p.areaLabel ? ` · ${p.areaLabel}` : ""} · {p.languages.slice(0, 2).join(", ")}
              </div>
            </div>
            <div className="ms-card-price"><b>{p.currency}{p.priceFrom}</b>/hr</div>
          </div>
          <p className="ms-card-bio">{p.bio}</p>
          <div className="ms-card-tags">
            {p.serviceStyles.slice(0, 4).map((s) => (
              <span key={s} className="ms-tag">{SERVICE_STYLE_LABEL[s].en}</span>
            ))}
          </div>
          <div className="ms-card-foot">
            <span className="ms-card-reply">Replies in ~{p.availability.replyMinutes} min</span>
            <div className="ms-card-cta">
              <Link href={href} className="ms-btn-sm ms-btn-sm--ghost">View profile</Link>
              <Link href={`${href}#chat`} className="ms-btn-sm ms-btn-sm--primary">Chat</Link>
            </div>
          </div>
        </div>
        <style>{styles}</style>
      </article>
    );
  }

  return (
    <article className="ms-card ms-card--gallery">
      <Link href={href} className="ms-card-media">
        <Img src={p.coverImage} alt={p.displayName} sizes="(max-width:900px) 50vw, 320px" />
        <div className="ms-card-badges">
          <Badges p={p} />
        </div>
      </Link>
      <div className="ms-card-body">
        <div className="ms-card-top">
          <div>
            <h3 className="ms-card-name">
              <Link href={href}>{p.displayName}</Link>
              <span className="ms-card-age">{p.age}</span>
            </h3>
            <div className="ms-card-loc">{p.cityLabel}{p.areaLabel ? ` · ${p.areaLabel}` : ""}</div>
          </div>
          <div className="ms-card-price"><b>{p.currency}{p.priceFrom}</b>/hr</div>
        </div>
        <div className="ms-card-lang">{p.languages.slice(0, 3).join(" · ")}</div>
        <div className="ms-card-tags">
          {p.serviceStyles.slice(0, 3).map((s) => (
            <span key={s} className="ms-tag">{SERVICE_STYLE_LABEL[s].en}</span>
          ))}
        </div>
        <div className="ms-card-foot">
          <span className="ms-card-reply">~{p.availability.replyMinutes} min</span>
          <Link href={href} className="ms-btn-sm ms-btn-sm--primary">View →</Link>
        </div>
      </div>
      <style>{styles}</style>
    </article>
  );
}

const styles = `
.ms-card{background:#fff;border:1px solid #E8E8EC;border-radius:22px;overflow:hidden;box-shadow:0 8px 24px -14px rgba(15,23,42,.05);transition:transform .18s,box-shadow .18s,border-color .18s}
.ms-card:hover{transform:translateY(-3px);box-shadow:0 20px 40px -18px rgba(15,23,42,.15);border-color:#dcdce0}
.ms-card-media{display:block;position:relative;background:#F4F4F5;overflow:hidden}
.ms-card--gallery .ms-card-media{aspect-ratio:4/5}
.ms-card-media img{width:100%;height:100%;object-fit:cover;transition:transform .35s}
.ms-card:hover .ms-card-media img{transform:scale(1.04)}
.ms-card-badges{position:absolute;top:10px;left:10px;right:10px;display:flex;gap:5px;flex-wrap:wrap}
.ms-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:99px;font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.ms-badge--vip{background:rgba(238,221,184,.95);color:#1a1409}
.ms-badge--verify{background:rgba(22,22,24,.85);color:#fff}
.ms-badge--online{background:rgba(52,199,89,.95);color:#fff}
.ms-badge--video{background:rgba(255,255,255,.9);color:#161618}
.ms-dot{width:6px;height:6px;background:#fff;border-radius:50%}
.ms-card-body{padding:16px 18px 18px;display:flex;flex-direction:column;gap:8px}
.ms-card-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.ms-card-name{font-size:17px;font-weight:700;color:#161618;margin:0;display:flex;align-items:baseline;gap:6px;letter-spacing:-0.005em}
.ms-card-name a{color:inherit;text-decoration:none}
.ms-card-name a:hover{opacity:.75}
.ms-card-age{font-size:13px;color:#8a8a92;font-weight:500}
.ms-card-loc{font-size:12.5px;color:#8a8a92;margin-top:2px}
.ms-card-price{font-size:12px;color:#8a8a92;white-space:nowrap;text-align:right}
.ms-card-price b{font-size:15px;color:#B8A789;font-weight:800;letter-spacing:-0.01em}
.ms-card-lang{font-size:12px;color:#5a5a62;font-weight:500}
.ms-card-bio{font-size:13.5px;line-height:1.65;color:#3d3d42;margin:6px 0 8px}
.ms-card-tags{display:flex;flex-wrap:wrap;gap:4px}
.ms-tag{padding:3px 8px;background:#F4F4F5;border-radius:99px;font-size:10.5px;color:#3d3d42;font-weight:600;white-space:nowrap}
.ms-card-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:6px;padding-top:10px;border-top:1px solid #F4F4F5}
.ms-card-reply{font-size:11.5px;color:#8a8a92}
.ms-card-cta{display:flex;gap:6px}
.ms-btn-sm{padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;text-decoration:none;transition:opacity .12s}
.ms-btn-sm--ghost{background:#F4F4F5;color:#161618}
.ms-btn-sm--primary{background:#161618;color:#fff}
.ms-card--list{display:grid;grid-template-columns:240px 1fr;gap:0}
.ms-card--list .ms-card-media{aspect-ratio:1;height:100%}
.ms-card--list .ms-card-body{padding:20px 22px 20px}
@media (max-width:640px){
  .ms-card--list{grid-template-columns:120px 1fr}
  .ms-card--list .ms-card-body{padding:12px 14px}
  .ms-card-bio{-webkit-line-clamp:2;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}
}
`;
