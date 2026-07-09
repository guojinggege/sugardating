// Budget guidance cards (indicative, not binding)
import { premiumEvents } from "@/lib/premium-events";

export default function BudgetSection() {
  return (
    <section className="cs-budget" aria-label="Indicative budget">
      <div className="cs-budget-in">
        <div className="cs-budget-head">
          <div className="cs-budget-eyebrow">Indicative Budget</div>
          <h2>预算取决于场景、时间与要求</h2>
          <p>
            不同活动对时间、城市、语言、着装、拍摄、出行与隐私要求不同。
            平台根据你的需求推荐更合适的 sugargirl,由双方通过站内沟通确认细节。
          </p>
        </div>
        <div className="cs-budget-grid">
          {premiumEvents.map((ev) => (
            <div key={ev.key} className="cs-budget-card">
              <div className="cs-budget-title">
                <b>{ev.title}</b>
                <span>{ev.titleEn}</span>
              </div>
              <div className="cs-budget-price">
                <em>{ev.budgetFrom}</em>
                <span>{ev.budgetDuration}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="cs-budget-note">
          以上为示例预算,实际以双方沟通与确认结果为准。平台不做强制价格承诺、不撮合线下交易、不保证匹配结果。
        </div>
      </div>
      <style>{`
        .cs-budget{background:#FBFAF7;padding:72px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
        .cs-budget-in{max-width:1280px;margin:0 auto;padding:0 24px}
        .cs-budget-head{max-width:64ch;margin-bottom:36px}
        .cs-budget-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:12px}
        .cs-budget-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:34px;font-style:italic;font-weight:500;color:#161618;margin:0 0 12px;letter-spacing:-0.01em}
        .cs-budget-head p{font-size:15px;line-height:1.75;color:#3d3d42;margin:0}
        .cs-budget-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:16px}
        .cs-budget-card{background:#fff;border:1px solid #EEE9DC;border-radius:16px;padding:20px 22px;display:flex;flex-direction:column;gap:16px;transition:border-color .12s,transform .12s}
        .cs-budget-card:hover{border-color:#B8A789;transform:translateY(-2px)}
        .cs-budget-title b{display:block;font-size:15px;color:#161618;font-weight:700;letter-spacing:-0.005em}
        .cs-budget-title span{display:block;font-size:11.5px;color:#8a8a92;margin-top:2px;letter-spacing:.02em}
        .cs-budget-price{border-top:1px dashed var(--line);padding-top:14px}
        .cs-budget-price em{display:block;font-family:'Cormorant Garamond',ui-serif;font-size:24px;font-style:italic;color:#B8A789;font-weight:600;letter-spacing:-0.01em;line-height:1}
        .cs-budget-price span{display:block;font-size:11.5px;color:#8a8a92;margin-top:6px}
        .cs-budget-note{font-size:12.5px;color:#8a8a92;line-height:1.65;padding-top:16px;border-top:1px dashed var(--line);max-width:80ch}
        @media (max-width:1024px){.cs-budget-grid{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:640px){
          .cs-budget{padding:60px 0}
          .cs-budget-head h2{font-size:26px}
          .cs-budget-grid{grid-template-columns:1fr}
        }
      `}</style>
    </section>
  );
}
