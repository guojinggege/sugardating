// 文章底部动态 CTA — 根据文章 cta 数组渲染
import Link from "next/link";
import type { JournalCtaVariant } from "@/lib/journal-data";

const CTA_MAP: Record<JournalCtaVariant, { label: string; href: string; desc?: string }> = {
  "browse-sugargirls": { label: "浏览 London Sugargirls", href: "/male-artists", desc: "已认证 · 支持隐私聊天" },
  "browse-asian":      { label: "浏览 Asian Sugargirls", href: "/male-artists?region=asia", desc: "亚洲文化背景的 Sugargirl" },
  "browse-london":     { label: "浏览 London Sugargirls", href: "/male-artists?city=london", desc: "伦敦本地资料" },
  "premium":           { label: "开通 Premium 无限畅聊", href: "/membership", desc: "月度订阅 · 无沟通摩擦" },
  "credits":           { label: "购买 Credits", href: "/membership", desc: "礼物、视频、直播、优先互动" },
  "safety":            { label: "阅读安全与隐私", href: "/community/safety-privacy-trust", desc: "身份、隐私、消费安全" },
  "apply-creator":     { label: "申请入驻 Sugargirl", href: "/apply", desc: "免费写真支持 · 全流程指导" },
  "video-profiles":    { label: "查看含视频的资料", href: "/male-artists?has=video", desc: "视频 = 更高信任" },
};

interface Props {
  variants: JournalCtaVariant[];
}

export default function JournalCTA({ variants }: Props) {
  if (!variants || variants.length === 0) return null;
  const items = variants.map((v) => CTA_MAP[v]).filter(Boolean);
  return (
    <section className="jn-cta" aria-label="Next Step">
      <div className="jn-cta-eyebrow">Next Step</div>
      <h3 className="jn-cta-h">继续阅读或前往这些页面</h3>
      <div className="jn-cta-grid">
        {items.map((it, i) => (
          <Link key={i} href={it.href} className="jn-cta-card">
            <div className="jn-cta-card-h">{it.label}</div>
            {it.desc && <div className="jn-cta-card-p">{it.desc}</div>}
            <span className="jn-cta-card-arrow" aria-hidden>→</span>
          </Link>
        ))}
      </div>
      <style>{`
        .jn-cta{margin:56px 0 12px;padding:32px 28px;background:linear-gradient(135deg,#161618 0%,#2b2620 100%);border-radius:22px;color:#fff}
        .jn-cta-eyebrow{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#EEDDB8;font-weight:700;margin-bottom:8px}
        .jn-cta-h{font-size:22px;font-weight:700;color:#fff;margin:0 0 22px;letter-spacing:-0.005em}
        .jn-cta-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}
        .jn-cta-card{position:relative;display:block;padding:16px 46px 16px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:14px;color:#fff;text-decoration:none;transition:background .12s,border-color .12s}
        .jn-cta-card:hover{background:rgba(255,255,255,.12);border-color:rgba(238,221,184,.3)}
        .jn-cta-card-h{font-size:14.5px;font-weight:700;margin-bottom:4px}
        .jn-cta-card-p{font-size:12.5px;line-height:1.5;color:rgba(255,255,255,.68)}
        .jn-cta-card-arrow{position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:18px;color:#EEDDB8;font-weight:700}
        @media (max-width:640px){
          .jn-cta{padding:24px 20px;margin:40px 0 8px}
          .jn-cta-grid{grid-template-columns:1fr}
        }
      `}</style>
    </section>
  );
}
