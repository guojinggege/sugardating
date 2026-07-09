// Large-type narrative section — "每个高端场合,都需要不同的气质"
import Img from "@/components/Img";
import { pick } from "@/lib/images";

export default function ScenarioNarrative() {
  const img = pick(8, 220) ?? "/images/placeholder.png";
  return (
    <section className="cs-narr">
      <div className="cs-narr-in">
        <div className="cs-narr-text">
          <div className="cs-narr-eyebrow">Curated · Not Searched</div>
          <h2>每个高端场合<br /><em>都需要不同的气质</em></h2>
          <div className="cs-narr-lines">
            <p><span>游艇派对</span> 需要自然松弛与镜头感。</p>
            <p><span>高端酒会</span> 需要得体表达与社交边界。</p>
            <p><span>私人拍摄</span> 需要视觉表现力。</p>
            <p><span>商务伴游</span> 需要时间感、语言与分寸。</p>
            <p><span>会员俱乐部之夜</span> 需要低调、优雅与隐私意识。</p>
          </div>
          <p className="cs-narr-close">
            Sugardating 不让用户盲目搜索,而是让用户提交场景需求,由平台根据活动属性
            推荐更合适的 sugargirl。
          </p>
        </div>
        <div className="cs-narr-media">
          <Img src={img} alt="Curated matching" sizes="(max-width:900px) 100vw, 44vw" />
          <div className="cs-narr-media-veil" />
        </div>
      </div>
      <style>{`
        .cs-narr{background:#FBFAF7;padding:80px 0}
        .cs-narr-in{max-width:1280px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:1.05fr 1fr;gap:60px;align-items:center}
        .cs-narr-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:20px}
        .cs-narr-text h2{font-family:'Cormorant Garamond',ui-serif;font-size:52px;font-weight:500;line-height:1.1;color:#161618;margin:0 0 32px;letter-spacing:-0.015em}
        .cs-narr-text h2 em{font-style:italic;color:#B8A789}
        .cs-narr-lines{font-size:18px;line-height:1.9;color:#3d3d42;margin-bottom:28px}
        .cs-narr-lines p{margin:0 0 6px}
        .cs-narr-lines span{color:#161618;font-weight:700;font-style:normal;font-family:'Plus Jakarta Sans',ui-sans-serif;font-size:16.5px;letter-spacing:-0.005em}
        .cs-narr-close{font-size:15px;line-height:1.75;color:#5a5a62;margin:0;padding-top:26px;border-top:1px solid #E8E8EC;max-width:56ch}
        .cs-narr-media{position:relative;aspect-ratio:4/5;border-radius:24px;overflow:hidden;background:#1a1a1c;box-shadow:0 30px 60px -30px rgba(0,0,0,.35)}
        .cs-narr-media img{width:100%;height:100%;object-fit:cover}
        .cs-narr-media-veil{position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(0,0,0,.25))}
        @media (max-width:1024px){
          .cs-narr-in{grid-template-columns:1fr;gap:40px}
          .cs-narr-text h2{font-size:38px}
          .cs-narr-media{aspect-ratio:16/10}
        }
        @media (max-width:640px){
          .cs-narr{padding:60px 0}
          .cs-narr-text h2{font-size:30px}
          .cs-narr-lines{font-size:16px;line-height:1.85}
        }
      `}</style>
    </section>
  );
}
