// Preview of what recommendations look like — 3 sugargirl example cards
import Link from "next/link";
import Img from "@/components/Img";
import { pick } from "@/lib/images";
import { listCreators } from "@/lib/queries";

export default async function RecommendationPreview() {
  const all = await listCreators();
  const picks = all.slice(0, 3);
  const samples = picks.map((c, i) => ({
    slug: c.slug,
    name: c.name,
    city: c.region,
    langs: i % 2 === 0 ? "中文 / English" : "English / French",
    fit: [
      ["私人拍摄", "高端酒会"],
      ["商务伴游", "会员俱乐部之夜"],
      ["游艇派对", "高端酒会"],
    ][i] || ["高端酒会"],
    photo: pick(i * 3 + 6, 300 + i * 40) ?? "/images/placeholder.png",
  }));

  return (
    <div className="cs-rec">
      <div className="cs-rec-h">
        <div className="cs-rec-eyebrow">Sample Recommendations</div>
        <h4>你可能收到这样的推荐</h4>
        <p>提交需求后,平台会根据你的场景、城市、语言与偏好挑选类似候选。</p>
      </div>
      <div className="cs-rec-list">
        {samples.map((s) => (
          <article key={s.slug} className="cs-rec-card">
            <Link href={`/creators/${s.slug}`} className="cs-rec-media">
              <Img src={s.photo} alt={s.name} sizes="120px" />
              <div className="cs-rec-badges">
                <span className="cs-rec-verified">Verified</span>
                <span className="cs-rec-video">Video</span>
              </div>
            </Link>
            <div className="cs-rec-body">
              <h5><Link href={`/creators/${s.slug}`}>{s.name}</Link></h5>
              <div className="cs-rec-meta">{s.city} · {s.langs}</div>
              <div className="cs-rec-fit">
                <span className="cs-rec-fit-h">适合</span>
                {s.fit.map((f) => <span key={f} className="cs-rec-tag">{f}</span>)}
              </div>
              <div className="cs-rec-cta">
                <Link href={`/creators/${s.slug}`} className="cs-rec-btn cs-rec-btn--ghost">查看主页</Link>
                <Link href={`/creators/${s.slug}#chat`} className="cs-rec-btn cs-rec-btn--primary">发起聊天</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="cs-rec-note">
        示例卡片,展示推荐结果形态。实际候选取决于你的活动需求与平台匹配结果。
      </div>
      <style>{`
        .cs-rec{background:#fff;border:1px solid var(--line);border-radius:22px;padding:26px 26px 22px}
        .cs-rec-h{margin-bottom:20px}
        .cs-rec-eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:10px}
        .cs-rec-h h4{font-family:'Cormorant Garamond',ui-serif;font-size:22px;font-style:italic;font-weight:500;color:#161618;margin:0 0 6px;letter-spacing:-0.005em}
        .cs-rec-h p{font-size:13px;line-height:1.65;color:#5a5a62;margin:0}
        .cs-rec-list{display:flex;flex-direction:column;gap:12px}
        .cs-rec-card{display:grid;grid-template-columns:96px 1fr;gap:12px;padding:12px;background:#FBFAF7;border:1px solid #EEE9DC;border-radius:14px;transition:border-color .12s}
        .cs-rec-card:hover{border-color:#B8A789}
        .cs-rec-media{position:relative;aspect-ratio:1;border-radius:10px;overflow:hidden;background:#F4F4F5}
        .cs-rec-media img{width:100%;height:100%;object-fit:cover}
        .cs-rec-badges{position:absolute;top:6px;left:6px;right:6px;display:flex;flex-wrap:wrap;gap:3px}
        .cs-rec-verified,.cs-rec-video{padding:2px 6px;font-size:9px;letter-spacing:.05em;text-transform:uppercase;font-weight:700;border-radius:99px;backdrop-filter:blur(4px)}
        .cs-rec-verified{background:rgba(22,22,24,.85);color:#EEDDB8}
        .cs-rec-video{background:rgba(255,255,255,.9);color:#161618}
        .cs-rec-body{display:flex;flex-direction:column;gap:4px;min-width:0}
        .cs-rec-body h5{font-size:15px;font-weight:700;color:#161618;margin:0;letter-spacing:-0.005em}
        .cs-rec-body h5 a{color:inherit;text-decoration:none}
        .cs-rec-body h5 a:hover{opacity:.75}
        .cs-rec-meta{font-size:12px;color:#8a8a92}
        .cs-rec-fit{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:4px}
        .cs-rec-fit-h{font-size:10px;color:#B8A789;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
        .cs-rec-tag{padding:2px 8px;background:#F4F4F5;border-radius:99px;font-size:11px;color:#3d3d42;font-weight:500}
        .cs-rec-cta{display:flex;gap:6px;margin-top:8px}
        .cs-rec-btn{padding:5px 10px;border-radius:99px;font-size:11.5px;font-weight:700;text-decoration:none;transition:opacity .12s}
        .cs-rec-btn--ghost{background:#fff;color:#161618;border:1px solid var(--line)}
        .cs-rec-btn--primary{background:#161618;color:#fff}
        .cs-rec-note{margin-top:14px;font-size:11.5px;color:#8a8a92;line-height:1.55}
      `}</style>
    </div>
  );
}
