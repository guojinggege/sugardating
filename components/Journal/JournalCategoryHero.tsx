// 分类页 Hero
import type { JournalCategory } from "@/lib/journal-data";

export default function JournalCategoryHero({ category }: { category: JournalCategory }) {
  return (
    <section className="jn-cathero">
      <div className="jn-cathero-in">
        <div className="jn-cathero-eyebrow">Sugardating Journal</div>
        <h1 className="jn-cathero-h1">{category.title}</h1>
        <p className="jn-cathero-zh">{category.titleZh}</p>
        <p className="jn-cathero-desc">{category.description}</p>
      </div>
      <style>{`
        .jn-cathero{background:linear-gradient(180deg,#FBFAF7,#F4F4F5);border-bottom:1px solid var(--line)}
        .jn-cathero-in{max-width:1240px;margin:0 auto;padding:44px 24px 40px;text-align:left}
        .jn-cathero-eyebrow{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:10px}
        .jn-cathero-h1{font-size:40px;font-weight:700;line-height:1.15;color:#161618;letter-spacing:-0.01em;margin:0 0 6px;font-family:'Plus Jakarta Sans',ui-sans-serif}
        .jn-cathero-zh{font-size:18px;color:#5a5a62;margin:0 0 14px;font-weight:500}
        .jn-cathero-desc{font-size:15.5px;line-height:1.7;color:#3d3d42;margin:0;max-width:64ch}
        @media (max-width:768px){
          .jn-cathero-in{padding:32px 20px 28px}
          .jn-cathero-h1{font-size:28px}
        }
      `}</style>
    </section>
  );
}
