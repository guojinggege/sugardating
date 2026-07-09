// Journal Sidebar — 热门 / 分类 / CTA
import Link from "next/link";
import { journalCategories, popularPosts } from "@/lib/journal-data";
import JournalPostCard from "./JournalPostCard";

interface Props {
  basePath?: string;
  activeCategorySlug?: string;
}

export default function JournalSidebar({ basePath = "/community", activeCategorySlug }: Props) {
  const popular = popularPosts(5);
  return (
    <aside className="jn-side">
      {/* Popular */}
      <div className="jn-side-card">
        <h4 className="jn-side-h">Popular Articles</h4>
        <div className="jn-side-list">
          {popular.map((p) => (
            <JournalPostCard key={p.id} post={p} variant="compact" basePath={basePath} />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="jn-side-card">
        <h4 className="jn-side-h">Categories</h4>
        <ul className="jn-side-cats">
          {journalCategories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`${basePath}/${c.slug}`}
                className={"jn-side-cat" + (c.slug === activeCategorySlug ? " is-active" : "")}
              >
                <span>{c.title}</span>
                <span className="jn-side-cat-zh">{c.titleZh}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Safety & Privacy CTA */}
      <div className="jn-side-cta jn-side-cta--safety">
        <div className="jn-side-cta-ic" aria-hidden>🛡️</div>
        <div>
          <div className="jn-side-cta-h">Safety & Privacy</div>
          <p className="jn-side-cta-p">了解 Sugardating 如何保护身份、隐私与消费安全。</p>
          <Link href={`${basePath}/safety-privacy-trust`} className="jn-side-cta-btn">阅读安全指南</Link>
        </div>
      </div>

      {/* Premium CTA */}
      <div className="jn-side-cta jn-side-cta--premium">
        <div className="jn-side-cta-h">Premium 无限畅聊</div>
        <p className="jn-side-cta-p">减少无效沟通,专注对的对话。</p>
        <Link href="/membership" className="jn-side-cta-btn jn-side-cta-btn--gold">了解 Premium</Link>
      </div>

      {/* Credits CTA */}
      <div className="jn-side-cta">
        <div className="jn-side-cta-h">Credits 使用指南</div>
        <p className="jn-side-cta-p">礼物、视频解锁、直播打赏与优先互动。</p>
        <Link href={`${basePath}/wealth-privacy-risk`} className="jn-side-cta-btn">查看指南</Link>
      </div>

      {/* Browse Sugargirls */}
      <div className="jn-side-cta">
        <div className="jn-side-cta-h">Browse London Sugargirls</div>
        <p className="jn-side-cta-p">已认证 · 含视频资料 · 支持隐私聊天。</p>
        <Link href="/male-artists" className="jn-side-cta-btn">浏览 Sugargirls</Link>
      </div>

      <style>{`
        .jn-side{display:flex;flex-direction:column;gap:20px;position:sticky;top:74px}
        .jn-side-card{background:#fff;border:1px solid #E8E8EC;border-radius:18px;padding:18px 20px}
        .jn-side-h{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#8a8a92;font-weight:700;margin:0 0 14px}
        .jn-side-list{display:flex;flex-direction:column;gap:6px}
        .jn-side-cats{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
        .jn-side-cat{display:flex;flex-direction:column;padding:9px 12px;border-radius:10px;color:#3d3d42;text-decoration:none;font-size:13px;line-height:1.3;transition:background .12s}
        .jn-side-cat:hover{background:#F4F4F5;color:#161618}
        .jn-side-cat.is-active{background:#161618;color:#fff}
        .jn-side-cat-zh{font-size:11px;color:#8a8a92;margin-top:1px}
        .jn-side-cat.is-active .jn-side-cat-zh{color:rgba(255,255,255,.6)}
        .jn-side-cta{background:#fff;border:1px solid #E8E8EC;border-radius:18px;padding:18px 20px}
        .jn-side-cta--safety{background:linear-gradient(135deg,#FBFAF7,#F4F4F5);border-color:#EEE9DC;display:flex;gap:14px;align-items:flex-start}
        .jn-side-cta-ic{font-size:26px;line-height:1}
        .jn-side-cta--premium{background:linear-gradient(135deg,#1a1a1c,#2b2620);border-color:#2b2620;color:#EEDDB8}
        .jn-side-cta--premium .jn-side-cta-p{color:rgba(238,221,184,.75)}
        .jn-side-cta-h{font-size:15px;font-weight:700;color:inherit;margin:0 0 6px;letter-spacing:-0.005em}
        .jn-side-cta-p{font-size:13px;line-height:1.55;color:#5a5a62;margin:0 0 12px}
        .jn-side-cta-btn{display:inline-flex;align-items:center;padding:8px 14px;border-radius:999px;background:#161618;color:#fff;font-size:12.5px;font-weight:600;text-decoration:none;transition:opacity .12s,transform .12s}
        .jn-side-cta-btn:hover{transform:translateY(-1px)}
        .jn-side-cta-btn--gold{background:#EEDDB8;color:#1a1a1c}
        @media (max-width:1024px){.jn-side{position:static}}
      `}</style>
    </aside>
  );
}
