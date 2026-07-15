"use client";
// Google SERP 桌面版预览 · 与 Google 视觉一致
import { truncateForSerpTitle, truncateForSerpDescription, displaySerpUrl } from "@/lib/journal/seo";

interface Props {
  title: string;             // effective SEO title (fallback: article title)
  description: string;       // effective SEO description (fallback: excerpt)
  slug: string;
  categorySlug: string;
}

export default function JournalSerpPreview({ title, description, slug, categorySlug }: Props) {
  const t = truncateForSerpTitle(title || "文章标题");
  const d = truncateForSerpDescription(description || "SERP 描述会显示在这里。写 120-158 字符能覆盖 Google 桌面版一行显示区域。");
  const url = displaySerpUrl(slug || "your-slug", categorySlug || "relationship-intelligence");

  return (
    <div className="sp">
      <div className="sp-fav">
        <span className="sp-favicon">S</span>
        <div className="sp-site">
          <b>Sugardating</b>
          <span>{url}</span>
        </div>
      </div>
      <div className="sp-title">{t}</div>
      <div className="sp-desc">{d}</div>
      <style>{`
        .sp{padding:14px 16px;background:#fff;border:1px solid #E5E7EB;border-radius:10px;font-family:arial,sans-serif}
        .sp-fav{display:flex;align-items:center;gap:10px;margin-bottom:6px}
        .sp-favicon{width:22px;height:22px;background:#111;color:#EEDDB8;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:700}
        .sp-site{display:flex;flex-direction:column;line-height:1.2}
        .sp-site b{font-size:12.5px;color:#0F172A}
        .sp-site span{font-size:11.5px;color:#5F6368}
        .sp-title{font-size:19px;line-height:1.3;color:#1a0dab;font-weight:400;letter-spacing:-0.006em;margin:2px 0 4px;cursor:pointer}
        .sp-title:hover{text-decoration:underline}
        .sp-desc{font-size:13.5px;line-height:1.55;color:#4d5156}
      `}</style>
    </div>
  );
}
