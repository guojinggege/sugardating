// Home Journal 预览 — 4 篇文章卡片入口 · 不修改 /community 页面
import Link from "next/link";

interface Preview {
  href: string;
  category: string;
  title: string;
  readTime: string;
}

const PREVIEWS: Preview[] = [
  {
    href: "/community/asian-southeast-asian-culture/post/how-to-meet-verified-asian-sugargirls-in-london",
    category: "ASIAN & SOUTHEAST ASIAN CULTURE",
    title: "How to Meet Verified Asian Sugargirls in London",
    readTime: "6 min read",
  },
  {
    href: "/community/wealth-privacy-risk/post/gentlemans-guide-privacy-first-dating-london",
    category: "WEALTH · PRIVACY · RISK",
    title: "The Gentleman's Guide to Privacy-First Dating in London",
    readTime: "7 min read",
  },
  {
    href: "/community/chinese-in-uk/post/london-sugardating-shouren-zhinan",
    category: "CHINESE IN UK",
    title: "伦敦 Sugardating 新手指南:如何筛选真实 Sugargirls",
    readTime: "5 分钟阅读",
  },
  {
    href: "/community/asian-southeast-asian-culture/post/thai-filipina-vietnamese-respectful-guide",
    category: "ASIAN & SOUTHEAST ASIAN CULTURE",
    title: "Thai, Filipina and Vietnamese Sugargirls: A Respectful Guide for European Men",
    readTime: "7 min read",
  },
];

export default function JournalPreview() {
  return (
    <section className="jp" aria-label="Sugardating Journal preview">
      <div className="jp-head">
        <div>
          <div className="jp-eyebrow">SUGARDATING JOURNAL</div>
          <h2 className="jp-h">
            不只是平台,<em>也是高端社交指南</em>
          </h2>
          <p className="jp-lead">
            阅读关于伦敦生活方式、亚洲与东南亚文化、隐私安全、男性状态、
            商务旅行与平台使用策略的深度内容。
          </p>
        </div>
        <Link href="/community" className="jp-more">进入 Journal →</Link>
      </div>

      <div className="jp-grid">
        {PREVIEWS.map((p) => (
          <Link key={p.href} href={p.href} className="jp-card">
            <div className="jp-card-media" aria-hidden />
            <div className="jp-card-body">
              <div className="jp-card-cat">{p.category}</div>
              <h3 className="jp-card-title">{p.title}</h3>
              <div className="jp-card-meta">{p.readTime}</div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .jp{padding:64px 0}
        .jp-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:32px;padding-bottom:16px;border-bottom:1px solid var(--line);flex-wrap:wrap}
        .jp-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:12px}
        .jp-h{font-family:'Cormorant Garamond','Plus Jakarta Sans',ui-serif;font-size:38px;font-weight:500;line-height:1.2;color:#161618;margin:0 0 10px;letter-spacing:-0.01em;max-width:20ch}
        .jp-h em{font-style:italic;color:#B8A789}
        .jp-lead{font-size:14.5px;line-height:1.7;color:#5a5a62;margin:0;max-width:60ch}
        .jp-more{font-size:13.5px;font-weight:700;color:#161618;text-decoration:none;padding:10px 18px;border:1px solid var(--line);border-radius:99px;background:#fff;transition:border-color .12s,background .12s;white-space:nowrap}
        .jp-more:hover{border-color:#161618;background:#FBFAF7}
        .jp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        .jp-card{display:flex;flex-direction:column;background:#FBFAF7;border:1px solid #EEE9DC;border-radius:18px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .16s,border-color .16s,box-shadow .16s}
        .jp-card:hover{transform:translateY(-3px);border-color:#B8A789;box-shadow:0 20px 40px -22px rgba(0,0,0,.14)}
        .jp-card-media{aspect-ratio:16/10;background:linear-gradient(135deg,#F4F4F5 0%,#EEE9DC 100%)}
        .jp-card-body{padding:16px 18px 18px;display:flex;flex-direction:column;gap:8px;flex:1}
        .jp-card-cat{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#B8A789;font-weight:700}
        .jp-card-title{font-size:15px;font-weight:700;color:#161618;margin:0;line-height:1.4;letter-spacing:-0.005em;flex:1;font-family:'Plus Jakarta Sans',ui-sans-serif}
        .jp-card-meta{font-size:11.5px;color:#8a8a92;margin-top:6px}
        @media (max-width:1024px){.jp-grid{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:640px){
          .jp{padding:52px 0}
          .jp-h{font-size:26px}
          .jp-grid{grid-template-columns:1fr}
        }
      `}</style>
    </section>
  );
}
