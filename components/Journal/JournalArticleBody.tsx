// 渲染 JournalBlock[] → 高级排版
import type { JournalBlock } from "@/lib/journal-data";

interface Props {
  blocks: JournalBlock[];
}

export default function JournalArticleBody({ blocks }: Props) {
  return (
    <div className="jn-article-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "paragraph":
            return <p key={i} className="jn-p">{b.text}</p>;
          case "heading":
            return <h2 key={i} className="jn-h2">{b.text}</h2>;
          case "quote":
            return (
              <blockquote key={i} className="jn-quote">
                <p>{b.text}</p>
                {b.attribution && <cite>— {b.attribution}</cite>}
              </blockquote>
            );
          case "list":
            return (
              <ul key={i} className="jn-ul">
                {b.items.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            );
          case "insight":
            return (
              <aside key={i} className="jn-insight" role="note">
                <div className="jn-insight-h">{b.title}</div>
                <p className="jn-insight-p">{b.text}</p>
              </aside>
            );
          case "checklist":
            return (
              <div key={i} className="jn-checklist">
                <div className="jn-checklist-h">{b.title}</div>
                <ul>
                  {b.items.map((it, j) => (
                    <li key={j}>
                      <span className="jn-check-ic" aria-hidden>✓</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            );
        }
      })}
      <style>{`
        .jn-article-body{font-size:17px;line-height:1.85;color:#3d3d42;max-width:68ch}
        .jn-p{margin:0 0 22px}
        .jn-h2{font-size:24px;line-height:1.35;color:#161618;font-weight:700;margin:36px 0 16px;letter-spacing:-0.008em}
        .jn-ul{list-style:none;padding:0;margin:0 0 24px}
        .jn-ul li{position:relative;padding-left:22px;margin-bottom:10px;line-height:1.7}
        .jn-ul li:before{content:"";position:absolute;left:0;top:14px;width:8px;height:1px;background:#B8A789}
        .jn-quote{margin:28px 0;padding:20px 28px;border-left:3px solid #B8A789;background:#FBFAF7;border-radius:0 12px 12px 0;font-style:italic;color:#161618;font-size:18px;line-height:1.7}
        .jn-quote cite{display:block;font-size:13px;color:#8a8a92;font-style:normal;margin-top:8px;font-weight:600}
        .jn-insight{margin:28px 0;padding:22px 26px;background:linear-gradient(135deg,#FBFAF7,#F4F4F5);border-radius:16px;border:1px solid #EEE9DC}
        .jn-insight-h{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:8px}
        .jn-insight-p{margin:0;font-size:16px;line-height:1.7;color:#161618;font-weight:500}
        .jn-checklist{margin:28px 0;padding:22px 26px;background:#fff;border:1px solid #E8E8EC;border-radius:16px}
        .jn-checklist-h{font-size:13px;letter-spacing:.05em;color:#161618;font-weight:700;margin-bottom:12px;text-transform:uppercase}
        .jn-checklist ul{list-style:none;margin:0;padding:0}
        .jn-checklist li{display:flex;gap:12px;align-items:flex-start;padding:8px 0;font-size:15.5px;line-height:1.6;color:#3d3d42;border-bottom:1px dashed #F4F4F5}
        .jn-checklist li:last-child{border-bottom:0}
        .jn-check-ic{flex-shrink:0;width:22px;height:22px;border-radius:50%;background:#161618;color:#EEDDB8;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700}
        @media (max-width:900px){
          .jn-article-body{font-size:16px}
          .jn-h2{font-size:20px;margin:28px 0 14px}
        }
      `}</style>
    </div>
  );
}
