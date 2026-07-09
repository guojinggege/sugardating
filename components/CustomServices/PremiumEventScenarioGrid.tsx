// 5 scenarios · 2+3 layout (first large, four smaller)
import Img from "@/components/Img";
import { premiumEvents } from "@/lib/premium-events";

export default function PremiumEventScenarioGrid() {
  const [first, ...rest] = premiumEvents;
  return (
    <section id="scenarios" className="cs-scen" aria-label="Five premium scenarios">
      <div className="cs-scen-in">
        <div className="cs-scen-head">
          <div className="cs-scen-eyebrow">Five Premium Scenarios</div>
          <h2 className="cs-scen-h">五大高端场景 · 每一个都值得被认真匹配</h2>
          <p className="cs-scen-sub">
            平台不让你盲目搜索;告诉我们你的场景,由平台按活动属性、语言、气质、时间与边界为你推荐更合适的 sugargirl。
          </p>
        </div>

        <div className="cs-scen-grid">
          {/* Hero card (first, spans two rows on desktop) */}
          <article className="cs-scen-card cs-scen-card--hero">
            <div className="cs-scen-media">
              <Img src={first.coverImage} alt={first.titleEn} sizes="(max-width:900px) 100vw, 640px" />
              <div className="cs-scen-veil" />
            </div>
            <div className="cs-scen-body">
              <div className="cs-scen-key">{first.titleEn}</div>
              <h3>{first.title}</h3>
              <p className="cs-scen-tag">{first.tagline}</p>
              <p className="cs-scen-desc">{first.description}</p>
              <div className="cs-scen-meta">
                <div>
                  <div className="cs-scen-meta-h">适合场景</div>
                  <div className="cs-scen-chips">
                    {first.fits.map((f) => <span key={f}>{f}</span>)}
                  </div>
                </div>
                <div>
                  <div className="cs-scen-meta-h">推荐 sugargirl 类型</div>
                  <div className="cs-scen-chips">
                    {first.matchTraits.map((f) => <span key={f}>{f}</span>)}
                  </div>
                </div>
              </div>
              <a href="#request" className="cs-scen-cta">定制这个场景 →</a>
            </div>
          </article>

          {/* Other 4 cards */}
          {rest.map((ev) => (
            <article key={ev.key} className="cs-scen-card">
              <div className="cs-scen-media">
                <Img src={ev.coverImage} alt={ev.titleEn} sizes="(max-width:900px) 100vw, 400px" />
                <div className="cs-scen-veil" />
              </div>
              <div className="cs-scen-body">
                <div className="cs-scen-key">{ev.titleEn}</div>
                <h3>{ev.title}</h3>
                <p className="cs-scen-tag">{ev.tagline}</p>
                <p className="cs-scen-desc">{ev.description}</p>
                <div className="cs-scen-chips cs-scen-chips--sm">
                  {ev.fits.slice(0, 3).map((f) => <span key={f}>{f}</span>)}
                </div>
                <a href="#request" className="cs-scen-cta">定制这个场景 →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        .cs-scen{background:#0F0F11;color:#EEDDB8;padding:80px 0 96px}
        .cs-scen-in{max-width:1280px;margin:0 auto;padding:0 24px}
        .cs-scen-head{margin-bottom:40px;max-width:74ch}
        .cs-scen-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .cs-scen-h{font-family:'Cormorant Garamond',ui-serif;font-size:38px;font-style:italic;font-weight:500;line-height:1.2;letter-spacing:-0.01em;color:#fff;margin:0 0 14px}
        .cs-scen-sub{font-size:15.5px;line-height:1.75;color:rgba(238,221,184,.7);margin:0}
        .cs-scen-grid{display:grid;grid-template-columns:1.15fr 1fr 1fr;grid-template-rows:auto auto;gap:20px}
        .cs-scen-card{position:relative;background:#181818;border:1px solid rgba(238,221,184,.12);border-radius:22px;overflow:hidden;display:flex;flex-direction:column;transition:transform .2s,border-color .2s,box-shadow .2s}
        .cs-scen-card:hover{transform:translateY(-3px);border-color:rgba(238,221,184,.35);box-shadow:0 24px 48px -24px rgba(0,0,0,.6)}
        .cs-scen-card--hero{grid-row:1/3;grid-column:1/2}
        .cs-scen-card--hero .cs-scen-media{aspect-ratio:5/4}
        .cs-scen-card--hero .cs-scen-body{padding:28px 30px 30px}
        .cs-scen-media{position:relative;aspect-ratio:16/10;overflow:hidden;background:#0a0a0c}
        .cs-scen-media img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
        .cs-scen-card:hover .cs-scen-media img{transform:scale(1.05)}
        .cs-scen-veil{position:absolute;inset:0;background:linear-gradient(180deg,transparent 35%,rgba(15,15,17,.72) 100%);pointer-events:none}
        .cs-scen-body{padding:22px 24px 24px;display:flex;flex-direction:column;flex:1;gap:10px}
        .cs-scen-key{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:#B8A789;font-weight:700}
        .cs-scen-body h3{font-family:'Cormorant Garamond',ui-serif;font-size:26px;font-style:italic;font-weight:500;color:#fff;margin:0;letter-spacing:-0.005em}
        .cs-scen-card--hero .cs-scen-body h3{font-size:34px}
        .cs-scen-tag{font-size:12.5px;color:#EEDDB8;margin:0;letter-spacing:.02em;font-weight:500}
        .cs-scen-desc{font-size:14px;line-height:1.7;color:rgba(255,255,255,.75);margin:0}
        .cs-scen-meta{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:6px}
        .cs-scen-meta-h{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:rgba(238,221,184,.55);font-weight:700;margin-bottom:6px}
        .cs-scen-chips{display:flex;flex-wrap:wrap;gap:4px}
        .cs-scen-chips span{padding:3px 9px;background:rgba(238,221,184,.08);border:1px solid rgba(238,221,184,.16);border-radius:99px;font-size:10.5px;color:#EEDDB8;font-weight:500}
        .cs-scen-chips--sm{margin-top:2px}
        .cs-scen-cta{margin-top:auto;padding-top:12px;font-size:13px;font-weight:700;color:#EEDDB8;text-decoration:none;letter-spacing:.02em;transition:color .12s;align-self:flex-start}
        .cs-scen-cta:hover{color:#fff}
        @media (max-width:1024px){
          .cs-scen-grid{grid-template-columns:1fr 1fr}
          .cs-scen-card--hero{grid-row:1/2;grid-column:1/-1}
        }
        @media (max-width:640px){
          .cs-scen{padding:60px 0 72px}
          .cs-scen-h{font-size:28px}
          .cs-scen-grid{grid-template-columns:1fr}
          .cs-scen-card--hero{grid-row:auto;grid-column:auto}
          .cs-scen-body{padding:20px}
          .cs-scen-card--hero .cs-scen-body{padding:22px 20px 24px}
          .cs-scen-body h3{font-size:22px}
          .cs-scen-card--hero .cs-scen-body h3{font-size:26px}
          .cs-scen-meta{grid-template-columns:1fr}
        }
      `}</style>
    </section>
  );
}
