// Custom Services — Premium Event Companion (5 场景 + 定制需求表单)
import type { Metadata } from "next";
import CustomServicesHero from "@/components/CustomServices/CustomServicesHero";
import PremiumEventScenarioGrid from "@/components/CustomServices/PremiumEventScenarioGrid";
import ScenarioNarrative from "@/components/CustomServices/ScenarioNarrative";
import HowItWorksSection from "@/components/CustomServices/HowItWorksSection";
import CustomRequestForm from "@/components/CustomServices/CustomRequestForm";
import RecommendationPreview from "@/components/CustomServices/RecommendationPreview";
import BudgetSection from "@/components/CustomServices/BudgetSection";
import SafetyPrivacySection from "@/components/CustomServices/SafetyPrivacySection";
import PremiumEventFAQ from "@/components/CustomServices/PremiumEventFAQ";
import StickyCustomServiceCTA from "@/components/CustomServices/StickyCustomServiceCTA";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "高端活动定制服务 | 游艇派对 · 高端酒会 · 私人拍摄 · 商务伴游 · Sugardating",
  description: "在 Sugardating 提交你的高端活动需求,平台可根据游艇派对、高端酒会、私人拍摄、商务伴游与会员俱乐部之夜等场景,为你推荐更合适的 sugargirl。全程站内沟通、认证优先、隐私保护。",
};

export default function CustomServicesPage() {
  return (
    <div className="cs-page">
      <CustomServicesHero />

      <PremiumEventScenarioGrid />

      <ScenarioNarrative />

      <HowItWorksSection />

      {/* Request form + Recommendation preview */}
      <section id="request" className="cs-req">
        <div className="cs-req-in">
          <div className="cs-req-head">
            <div className="cs-req-eyebrow">Request · Match · Confirm</div>
            <h2>让平台推荐合适的 sugargirl</h2>
            <p>填写活动场景、时间与偏好,平台将根据需求匹配 3-5 位候选。所有沟通建议先通过站内聊天与视频确认。</p>
          </div>
          <div className="cs-req-grid">
            <CustomRequestForm />
            <aside className="cs-req-aside">
              <RecommendationPreview />
              <div className="cs-req-tips">
                <div className="cs-req-tips-h">高质量提交提示</div>
                <ul>
                  <li>写清楚活动人数与着装要求 — 帮平台缩小语言与气质范围。</li>
                  <li>建议勾选&ldquo;仅推荐已认证&rdquo; — 减少无效沟通。</li>
                  <li>时间与城市越具体,匹配越快。</li>
                  <li>不要在需求中透露真实联系方式 — 全部通过站内进行。</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <BudgetSection />

      <SafetyPrivacySection />

      <PremiumEventFAQ />

      {/* Bottom CTA */}
      <section className="cs-bottom">
        <div className="cs-bottom-in">
          <h3>开始定制你的高端活动</h3>
          <p>Yacht · Cocktail · Photoshoot · Business · Members&rsquo; Club — 一次提交,平台按需推荐。</p>
          <a href="#request" className="cs-bottom-cta">提交定制需求 →</a>
        </div>
      </section>

      <StickyCustomServiceCTA />

      <style>{`
        .cs-page{background:#F4F4F5}
        .cs-req{background:#F4F4F5;padding:80px 0}
        .cs-req-in{max-width:1280px;margin:0 auto;padding:0 24px}
        .cs-req-head{max-width:64ch;margin:0 auto 40px;text-align:center}
        .cs-req-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .cs-req-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:36px;font-style:italic;font-weight:500;line-height:1.2;color:#161618;margin:0 0 12px;letter-spacing:-0.01em}
        .cs-req-head p{font-size:15.5px;line-height:1.75;color:#3d3d42;margin:0}
        .cs-req-grid{display:grid;grid-template-columns:1.35fr 1fr;gap:32px;align-items:flex-start}
        .cs-req-aside{display:flex;flex-direction:column;gap:20px;position:sticky;top:80px}
        .cs-req-tips{background:#161618;color:#EEDDB8;border-radius:18px;padding:22px 24px}
        .cs-req-tips-h{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:10px}
        .cs-req-tips ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
        .cs-req-tips li{position:relative;padding-left:18px;font-size:13px;line-height:1.65;color:rgba(238,221,184,.85)}
        .cs-req-tips li:before{content:"";position:absolute;left:0;top:10px;width:8px;height:1px;background:#B8A789}
        .cs-bottom{background:linear-gradient(180deg,#161618 0%,#0F0F11 100%);color:#EEDDB8;padding:72px 0;text-align:center}
        .cs-bottom-in{max-width:800px;margin:0 auto;padding:0 24px}
        .cs-bottom h3{font-family:'Cormorant Garamond',ui-serif;font-size:38px;font-style:italic;font-weight:500;color:#fff;margin:0 0 12px;letter-spacing:-0.01em}
        .cs-bottom p{font-size:15px;color:rgba(238,221,184,.72);margin:0 0 28px;letter-spacing:.02em}
        .cs-bottom-cta{display:inline-flex;padding:16px 34px;border-radius:999px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;font-weight:800;font-size:15px;text-decoration:none;box-shadow:0 16px 40px -16px rgba(238,221,184,.5);transition:transform .12s}
        .cs-bottom-cta:hover{transform:translateY(-1px)}
        @media (max-width:1024px){
          .cs-req-grid{grid-template-columns:1fr;gap:24px}
          .cs-req-aside{position:static}
        }
        @media (max-width:640px){
          .cs-req{padding:60px 0}
          .cs-req-head h2{font-size:28px}
          .cs-bottom h3{font-size:28px}
        }
      `}</style>
    </div>
  );
}
