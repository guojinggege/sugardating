import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { pick } from "@/lib/images";
import { getCreatorBySlug, listCommentsByCreator, listCreators } from "@/lib/queries";
import { sugarGirls } from "@/lib/sugarGirlMock";
import type { SugarGirlEntry } from "@/lib/sugarGirlMock";
import type { Creator, Tier } from "@/lib/types";
import {
  makeFeed, makeVideos, makeGallery, makeServices,
  deriveStats, deriveAbout, deriveAvailability,
  deriveTrust, deriveTravel, deriveTimeline, deriveExtraStats,
} from "@/lib/creatorProfileMock";

import CreatorHero from "@/components/Creator/CreatorHero";
import CreatorTabs from "@/components/Creator/CreatorTabs";
import QuickStats from "@/components/Creator/QuickStats";
import CreatorTrust from "@/components/Creator/CreatorTrust";
import CreatorGiftPanel from "@/components/Creator/CreatorGiftPanel";
import FeedList from "@/components/Creator/FeedList";
import VideoGrid from "@/components/Creator/VideoGrid";
import GalleryGrid from "@/components/Creator/GalleryGrid";
import ServiceCards from "@/components/Creator/ServiceCards";
import ReviewList from "@/components/Creator/ReviewList";
import AboutBlock from "@/components/Creator/AboutBlock";
import TravelPlan from "@/components/Creator/TravelPlan";
import CreatorTimeline from "@/components/Creator/CreatorTimeline";
import RightSidebar from "@/components/Creator/RightSidebar";
import RelatedCreators from "@/components/Creator/RelatedCreators";
import MobileCTABar from "@/components/Creator/MobileCTABar";
import FloatingCTA from "@/components/Creator/FloatingCTA";
import CommentForm from "./CommentForm";

export const dynamic = "force-dynamic";

function offsetFromSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function fmtNum(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

// SugarGirl fallback
function loadFromSugarGirls(slug: string): { creator: Creator; bio: string; sg: SugarGirlEntry } | null {
  const sg = sugarGirls.find((x) => x.id === slug);
  if (!sg) return null;
  return {
    creator: {
      slug: sg.id, name: sg.name, category: "SugarGirl",
      specialty: sg.intro, region: `${sg.country} · ${sg.city}`,
      price: "—", tier: "elite" as Tier,
      subs: "—", followers: fmtNum(Math.round(sg.popularity * 3)),
      works: String(sg.categories.length),
    },
    bio: sg.bio, sg,
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const detail = await getCreatorBySlug(params.slug);
  if (detail) return { title: `${detail.creator.name} · Sugardating`, description: detail.bio || `${detail.creator.name} on Sugardating` };
  const fromSg = loadFromSugarGirls(params.slug);
  if (fromSg) return { title: `${fromSg.creator.name} · Sugardating`, description: fromSg.bio };
  return { title: "Creator · Sugardating" };
}

const PROFESSIONS = ["Travel Creator", "Fashion Blogger", "Fitness Coach", "Foodie", "Photographer", "Model"];
const ZODIACS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SLOGANS = [
  "Let's explore the world together.",
  "Slow living, deep conversation.",
  "Wander, wonder, remember.",
  "Elegance is an attitude.",
  "Life is short — dine well.",
];

export default async function Page({ params }: { params: { slug: string } }) {
  const [dbDetail, dbComments, allCreators, t] = await Promise.all([
    getCreatorBySlug(params.slug),
    listCommentsByCreator(params.slug),
    listCreators(),
    getTranslations("creatorProfile"),
  ]);

  let creator: Creator;
  let baseBio: string;
  let comments = dbComments;
  let sgSource: SugarGirlEntry | null = null;
  if (dbDetail) {
    creator = dbDetail.creator; baseBio = dbDetail.bio;
  } else {
    const fromSg = loadFromSugarGirls(params.slug);
    if (!fromSg) notFound();
    creator = fromSg.creator; baseBio = fromSg.bio; sgSource = fromSg.sg; comments = [];
  }

  const off = offsetFromSlug(creator.slug);
  const cover  = pick(0, off)     ?? "/images/placeholder.png";
  const avatar = sgSource?.cover ?? (pick(1, off + 1) ?? "/images/placeholder.png");

  const stats        = deriveStats(creator.slug, creator.subs, creator.followers, creator.works);
  const feed         = makeFeed(creator.slug);
  const videos       = makeVideos(creator.slug);
  const gallery      = makeGallery(creator.slug);
  const services     = makeServices();
  const about        = deriveAbout(creator.slug, baseBio, creator.region, stats.joinedAt);
  const availability = deriveAvailability(creator.slug, stats.joinedAt, { online: sgSource ? sgSource.online : true });
  const trust        = deriveTrust(creator.slug);
  const travel       = deriveTravel(creator.slug, creator.region);
  const timeline     = deriveTimeline(creator.slug, creator.region);
  const extra        = deriveExtraStats(creator.slug, sgSource?.popularity);

  const age       = sgSource?.age       ?? 24 + (off % 6);
  const heightCm  = sgSource?.height    ?? 165 + (off % 12);
  const languages = sgSource?.languages ?? about.languages;
  const tags      = sgSource ? sgSource.categories.slice(0, 6) : about.interests.slice(0, 8);
  const profession = PROFESSIONS[off % PROFESSIONS.length];
  const zodiac     = ZODIACS[off % ZODIACS.length];
  const slogan     = SLOGANS[off % SLOGANS.length];

  const others = allCreators.filter((x) => x.slug !== creator.slug);
  const photoFor = (slug: string, off2: number) => {
    let h = 0;
    for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
    return pick(0, Math.abs(h) + off2) ?? "/images/placeholder.png";
  };
  const pickCreators = (n: number, skip = 0) =>
    others.slice(skip, skip + n).map((cr) => ({ creator: cr, photo: photoFor(cr.slug, 7) }));

  return (
    <div className="cr-page">
      {/* 1) HERO — 560px, dark video bg, 12-col grid (7 info + 5 glass action panel) */}
      <CreatorHero
        creator={creator}
        bio={about.bio}
        slogan={slogan}
        cover={cover}
        avatar={avatar}
        age={age}
        height={heightCm}
        languages={languages}
        profession={profession}
        zodiac={zodiac}
        tags={tags}
        online={sgSource ? sgSource.online : true}
        vip
      />

      <div className="cr-shell cr-body">
        {/* 2) QUICK STATS — 8 horizontal metric card */}
        <QuickStats
          stats={stats}
          availability={availability}
          rating={extra.rating}
          likes={extra.likes}
          reviewCount={Math.max(comments.length, 24)}
          gifts={extra.gifts}
        />

        {/* 3) ACTION BAR — Trust + mini Gift row */}
        <div className="cr-actionbar">
          <CreatorTrust flags={trust} />
        </div>

        {/* 4) TABS — sticky, 7 items */}
        <div className="cr-tabs-wrap">
          <div className="cr-shell">
            <CreatorTabs />
          </div>
        </div>

        {/* 5) BODY GRID — 主内容 (2fr) + Sidebar (360) */}
        <div className="cr-grid">
          <main className="cr-main">
            <section id="feed" className="cr-section">
              <h3 className="cr-section-h">{t("sections.feed")}</h3>
              <FeedList authorName={creator.name} authorAvatar={avatar} posts={feed} />
            </section>

            <section id="gallery" className="cr-section">
              <h3 className="cr-section-h">{t("sections.gallery")}</h3>
              <GalleryGrid items={gallery} />
            </section>

            <section id="videos" className="cr-section">
              <h3 className="cr-section-h">{t("sections.videos")}</h3>
              <VideoGrid videos={videos} />
            </section>

            <section id="services" className="cr-section">
              <h3 className="cr-section-h">{t("sections.services")}</h3>
              <ServiceCards services={services} />
            </section>

            <section id="gifts" className="cr-section">
              <h3 className="cr-section-h">{t("sections.gifts")}</h3>
              <CreatorGiftPanel />
            </section>

            <section id="reviews" className="cr-section">
              <h3 className="cr-section-h">{t("sections.reviews")}</h3>
              <ReviewList reviews={comments} />
              <div className="cr-review-form">
                <h4 className="cr-form-h">{t("reviews.writeNew")}</h4>
                <CommentForm slug={creator.slug} />
              </div>
            </section>

            <section id="about" className="cr-section">
              <h3 className="cr-section-h">{t("sections.about")}</h3>
              <AboutBlock about={about} />

              <div className="cr-sub-h">
                <h4>{t("sections.travel")}</h4>
              </div>
              <TravelPlan data={travel} />

              <div className="cr-sub-h">
                <h4>{t("sections.timeline")}</h4>
              </div>
              <CreatorTimeline events={timeline} />
            </section>
          </main>

          <RightSidebar
            creatorSlug={creator.slug}
            availability={availability}
            guesses={pickCreators(4, 0)}
            online={pickCreators(4, 4)}
            hot={pickCreators(4, 2)}
            videos={videos}
            recentMedia={gallery.slice(0, 4)}
          />
        </div>

        {/* 6) RECOMMENDATIONS — 底部 carousel */}
        <RelatedCreators
          sets={[
            { key: "guess",   items: pickCreators(10, 0) },
            { key: "similar", items: pickCreators(10, 2) },
            { key: "recent",  items: pickCreators(10, 4) },
            { key: "hot",     items: pickCreators(10, 1) },
          ]}
        />
      </div>

      {/* 7) Floating CTA — 右下,滚动 > 600 出现 */}
      <FloatingCTA />
      {/* 8) Mobile固定底部 CTA bar — 仅 <640 */}
      <MobileCTABar />
    </div>
  );
}
