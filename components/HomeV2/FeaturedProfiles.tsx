// Today's featured — mix of Sugargirls + Sugarboys
import Link from "next/link";
import Img from "@/components/Img";
import { sugarGirls } from "@/lib/sugarGirlMock";
import { sugarBoys } from "@/lib/sugarBoyMock";

interface FeatureCard {
  slug: string; name: string; age: number; city: string;
  online: boolean; tags: string[]; cover: string; lang: string;
  href: string; kind: "girl" | "boy";
}

export default function FeaturedProfiles() {
  const girls: FeatureCard[] = sugarGirls
    .filter((s) => s.featured)
    .slice(0, 4)
    .map((s) => ({
      slug: s.id, name: s.name, age: s.age, city: s.city,
      online: s.online, tags: s.tags, cover: s.cover, lang: s.languages[0],
      href: `/creators/${s.id}`, kind: "girl",
    }));
  const boys: FeatureCard[] = sugarBoys
    .filter((s) => s.featured)
    .slice(0, 4)
    .map((s) => ({
      slug: s.id, name: s.name, age: s.age, city: s.city,
      online: s.online, tags: s.tags, cover: s.cover, lang: s.languages[0],
      href: `/sugarboy/${s.id}`, kind: "boy",
    }));
  const list = [...girls, ...boys];

  return (
    <section className="hv-feat" aria-label="Featured profiles today">
      <div className="hv-feat-in">
        <div className="hv-feat-head">
          <div>
            <div className="hv-feat-eyebrow">Today's Featured</div>
            <h2>今日推荐 · Sugargirls &amp; Sugarboys</h2>
            <p>精选在线、认证、资料完整度更高的 profiles。</p>
          </div>
          <div className="hv-feat-actions">
            <Link href="/male-artists" className="hv-feat-link">Sugargirls →</Link>
            <Link href="/sugarboy" className="hv-feat-link">Sugarboys →</Link>
          </div>
        </div>
        <div className="hv-feat-grid">
          {list.map((c) => (
            <article key={`${c.kind}-${c.slug}`} className="hv-feat-card">
              <Link href={c.href} className="hv-feat-media">
                <Img src={c.cover} alt={c.name} sizes="(max-width:900px) 50vw, 300px" />
                <div className="hv-feat-badges">
                  {c.online && <span className="hv-feat-online"><span className="hv-dot" /> Online</span>}
                  {c.tags.includes("VIP") && <span className="hv-feat-vip">VIP</span>}
                  {c.tags.includes("Verified") && <span className="hv-feat-verify">Verified</span>}
                </div>
              </Link>
              <div className="hv-feat-body">
                <h4><Link href={c.href}>{c.name}</Link><span>{c.age}</span></h4>
                <div className="hv-feat-meta">{c.city} · {c.lang}</div>
                <div className="hv-feat-cta">
                  <Link href={c.href} className="hv-feat-btn hv-feat-btn--ghost">主页</Link>
                  <Link href={`${c.href}#chat`} className="hv-feat-btn hv-feat-btn--primary">聊天</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        .hv-feat{background:#F4F4F5;padding:80px 0}
        .hv-feat-in{max-width:1280px;margin:0 auto;padding:0 24px}
        .hv-feat-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:32px;padding-bottom:16px;border-bottom:1px solid var(--line);flex-wrap:wrap}
        .hv-feat-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:10px}
        .hv-feat-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:34px;font-style:italic;font-weight:500;color:#161618;margin:0 0 6px;letter-spacing:-0.01em}
        .hv-feat-head p{font-size:14px;color:#5a5a62;margin:0}
        .hv-feat-actions{display:flex;gap:14px}
        .hv-feat-link{font-size:13px;font-weight:700;color:#161618;text-decoration:none;padding:8px 14px;border:1px solid var(--line);border-radius:99px;background:#fff;transition:border-color .12s}
        .hv-feat-link:hover{border-color:#161618}
        .hv-feat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        .hv-feat-card{background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;transition:transform .16s,box-shadow .16s,border-color .16s}
        .hv-feat-card:hover{transform:translateY(-3px);box-shadow:0 24px 44px -22px rgba(15,23,42,.15);border-color:#dcdce0}
        .hv-feat-media{display:block;position:relative;aspect-ratio:4/5;overflow:hidden;background:#F4F4F5}
        .hv-feat-media img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
        .hv-feat-card:hover .hv-feat-media img{transform:scale(1.05)}
        .hv-feat-badges{position:absolute;top:10px;left:10px;right:10px;display:flex;flex-wrap:wrap;gap:5px}
        .hv-feat-badges span{padding:3px 8px;border-radius:99px;font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
        .hv-feat-online{background:rgba(52,199,89,.94);color:#fff;display:inline-flex;align-items:center;gap:4px}
        .hv-dot{width:6px;height:6px;border-radius:50%;background:#fff}
        .hv-feat-vip{background:rgba(238,221,184,.95);color:#1a1409}
        .hv-feat-verify{background:rgba(22,22,24,.85);color:#fff}
        .hv-feat-body{padding:14px 16px 16px;display:flex;flex-direction:column;gap:6px}
        .hv-feat-body h4{font-size:16px;font-weight:700;color:#161618;margin:0;letter-spacing:-0.005em;display:flex;align-items:baseline;gap:6px}
        .hv-feat-body h4 a{color:inherit;text-decoration:none}
        .hv-feat-body h4 span{font-size:13px;color:#8a8a92;font-weight:500}
        .hv-feat-meta{font-size:12px;color:#8a8a92}
        .hv-feat-cta{display:flex;gap:6px;margin-top:8px}
        .hv-feat-btn{flex:1;text-align:center;padding:7px 10px;border-radius:99px;font-size:12px;font-weight:700;text-decoration:none;transition:opacity .12s}
        .hv-feat-btn--ghost{background:#F4F4F5;color:#161618}
        .hv-feat-btn--primary{background:#161618;color:#fff}
        @media (max-width:1024px){.hv-feat-grid{grid-template-columns:repeat(3,1fr)}}
        @media (max-width:768px){.hv-feat-grid{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:640px){
          .hv-feat{padding:60px 0}
          .hv-feat-head h2{font-size:26px}
        }
      `}</style>
    </section>
  );
}
