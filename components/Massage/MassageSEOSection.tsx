// SEO copy section for city / area pages
import type { City } from "@/lib/massage-data";

export default function MassageSEOSection({ city }: { city: City }) {
  return (
    <section className="ms-seo" aria-label="About this directory">
      <h2 className="ms-seo-h">{city.seoTitle}</h2>
      <p className="ms-seo-zh">{city.seoTitleZh}</p>
      <div className="ms-seo-body">
        <p>{city.seoIntro}</p>
        <p>{city.seoIntroZh}</p>

        <h3>Why verified massage profiles matter</h3>
        <p>Identity verification, a phone check and a short video introduction combine to reduce noise and unclear listings. On Sugardating, providers with a full verification badge have completed all three, and their profile is discoverable to logged-in members only.</p>

        <h3>How to filter by language and availability</h3>
        <p>Use the sidebar to narrow results by primary language (Chinese, English, Thai, Vietnamese, Filipino, Japanese, Korean), by online status, or by same-day availability. Quick filters at the top of the page apply single toggles instantly.</p>

        <h3>Why a video introduction improves trust</h3>
        <p>Twenty seconds of natural speech reveals more about tone and pace than any set of photos. Providers with the &ldquo;Video&rdquo; badge have uploaded a short introduction — worth watching before you begin a conversation.</p>

        <h3>Privacy-first communication</h3>
        <p>All chat, video and payment (via Credits) happen in the platform. You never need to share your real phone number or move to an off-platform app. If a provider asks for off-platform payment, treat it as a signal, not a shortcut — and use the report tool.</p>

        <h3>How Credits and locked media work</h3>
        <p>Credits are the platform&rsquo;s in-app currency. Some photos and videos may be locked and cost a small amount to unlock. Once unlocked, they remain available to you. Credits also power tipping and priority messages. All of this stays on-platform.</p>

        <h3>Safety before appointment</h3>
        <p>Confirm identity via video call, meet in a public venue lobby first, keep messaging on the platform, and never transfer money before a session. Sugardating does not facilitate off-platform payments and never brokers offline arrangements.</p>
      </div>

      <style>{`
        .ms-seo{background:#fff;border:1px solid var(--line);border-radius:20px;padding:32px 36px;margin-top:36px}
        .ms-seo-h{font-size:22px;font-weight:700;color:#161618;margin:0 0 4px;letter-spacing:-0.005em}
        .ms-seo-zh{font-size:14px;color:#B8A789;margin:0 0 20px;font-weight:600}
        .ms-seo-body{font-size:14.5px;line-height:1.75;color:#3d3d42}
        .ms-seo-body h3{font-size:16px;color:#161618;font-weight:700;margin:22px 0 8px}
        .ms-seo-body p{margin:0 0 14px;max-width:74ch}
        @media (max-width:640px){
          .ms-seo{padding:22px 20px}
          .ms-seo-h{font-size:19px}
        }
      `}</style>
    </section>
  );
}
