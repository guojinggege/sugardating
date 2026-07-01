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
  deriveTrust, deriveExtraStats,
  deriveTopFans, deriveGiftLeaderboard,
} from "@/lib/creatorProfileMock";

import CreatorFold from "@/components/Creator/CreatorFold";
import QuickStats from "@/components/Creator/QuickStats";
import CreatorAbout from "@/components/Creator/CreatorAbout";
import CreatorTabs from "@/components/Creator/CreatorTabs";
import CreatorGiftPanel from "@/components/Creator/CreatorGiftPanel";
import FeedList from "@/components/Creator/FeedList";
import VideoGrid from "@/components/Creator/VideoGrid";
import GalleryGrid from "@/components/Creator/GalleryGrid";
import ServiceCards from "@/components/Creator/ServiceCards";
import ReviewList from "@/components/Creator/ReviewList";
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
const SLOGANS = [
  "Let's make every moment unforgettable.",
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
  const extra        = deriveExtraStats(creator.slug, sgSource?.popularity);
  const topFans      = deriveTopFans(creator.slug);
  const giftBoard    = deriveGiftLeaderboard(creator.slug);

  const age         = sgSource?.age ?? 24 + (off % 6);
  const heightCm    = sgSource?.height ?? 165 + (off % 12);
  const languages   = sgSource?.languages ?? about.languages;
  const profession  = PROFESSIONS[off % PROFESSIONS.length];
  const slogan      = SLOGANS[off % SLOGANS.length];

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
      {/* 1) Hero + Profile Header 融合 Fold — Instagram/Twitter/Threads 风格 avatar 跨 banner */}
      <CreatorFold
        creator={creator}
        cover={cover}
        avatar={avatar}
        age={age}
        languages={languages}
        profession={profession}
        joinedAt={stats.joinedAt}
        intro={slogan}
        online={sgSource ? sgSource.online : true}
        vip
      />

      <div className="cr-shell cr-body">
        {/* 3) Quick Stats — Instagram-style horizontal 8 metric */}
        <QuickStats
          stats={stats}
          availability={availability}
          rating={extra.rating}
          likes={extra.likes}
          reviewCount={Math.max(comments.length, 24)}
          gifts={extra.gifts}
        />

        {/* 4) About Card — Sugargirl V3:动态标题 + 内嵌 Verification + CTA row */}
        <section className="mt-6 md:mt-8">
          <CreatorAbout
            creator={creator}
            avatar={avatar}
            about={about}
            availability={availability}
            age={age}
            height={heightCm}
            profession={profession}
            slogan={slogan}
            trust={trust}
            timezone="GMT+8"
            nextAvailable={availability.isOnline ? "Now" : "Tonight"}
            online={sgSource ? sgSource.online : true}
          />
        </section>

        {/* 5) Sticky Tabs */}
        <div className="cr-tabs-wrap mt-6 md:mt-8">
          <div className="cr-shell">
            <CreatorTabs />
          </div>
        </div>

        {/* 7) Body Grid — Feed 主 + Sidebar 右
             Section h3 titles 移除 (spec §1:与 Tabs 重复);aria-label 保留 a11y */}
        <div className="cr-grid">
          <main className="cr-main">
            <section id="feed" className="cr-section" aria-label={t("sections.feed")}>
              <FeedList authorName={creator.name} authorAvatar={avatar} authorSlug={creator.slug} posts={feed} />
            </section>

            <section id="gallery" className="cr-section" aria-label={t("sections.gallery")}>
              <GalleryGrid items={gallery} />
            </section>

            <section id="videos" className="cr-section" aria-label={t("sections.videos")}>
              <VideoGrid videos={videos} />
            </section>

            <section id="services" className="cr-section" aria-label={t("sections.services")}>
              <ServiceCards services={services} />
            </section>

            <section id="gifts" className="cr-section" aria-label={t("sections.gifts")}>
              <CreatorGiftPanel />
            </section>

            <section id="reviews" className="cr-section" aria-label={t("sections.reviews")}>
              <ReviewList reviews={comments} overallRating={extra.rating} />
              <div className="cr-review-form">
                <h4 className="cr-form-h">{t("reviews.writeNew")}</h4>
                <CommentForm slug={creator.slug} />
              </div>
            </section>

            {/* 关于 Ta tab 已删除 (spec §一) — Creator 简介已在 Tabs 上方 About Card 完整展示 */}
          </main>

          <RightSidebar
            online={pickCreators(4, 4)}
            recommended={pickCreators(4, 0)}
            topFans={topFans}
            giftBoard={giftBoard}
          />
        </div>

        {/* 8) Recommendations — 底部 carousel */}
        <RelatedCreators
          sets={[
            { key: "guess",   items: pickCreators(10, 0) },
            { key: "similar", items: pickCreators(10, 2) },
            { key: "recent",  items: pickCreators(10, 4) },
            { key: "hot",     items: pickCreators(10, 1) },
          ]}
        />
      </div>

      {/* 9) Floating CTA + Mobile CTA Bar */}
      <FloatingCTA />
      <MobileCTABar />
    </div>
  );
}
