// /sugarboy/[slug] — Sugarboy 详情页
// 结构完全复用 Creator Detail 组件体系;数据源换成 sugarBoys mock,主图/头像用男性图
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Creator, Tier } from "@/lib/types";
import type { SugarGirlEntry } from "@/lib/sugarGirlMock";
import { sugarBoys } from "@/lib/sugarBoyMock";
import {
  makeFeed, makeVideos, makeGallery, makeServices,
  deriveStats, deriveAbout, deriveAvailability,
  deriveExtraStats, deriveGiftLeaderboard,
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
import MobileCTABar from "@/components/Creator/MobileCTABar";
import FloatingCTA from "@/components/Creator/FloatingCTA";

export const dynamic = "force-dynamic";
const HERO_VIDEO_SRC = "/videos/hero.mp4";

export function generateStaticParams() {
  return sugarBoys.map((sb) => ({ slug: sb.id }));
}

function fmtNum(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  return n.toLocaleString("en-US");
}

function toCreator(sb: SugarGirlEntry): Creator {
  return {
    slug: sb.id,
    name: sb.name,
    category: "Sugarboy",
    specialty: sb.intro,
    region: `${sb.country} · ${sb.city}`,
    price: "—",
    tier: "elite" as Tier,
    subs: "—",
    followers: fmtNum(Math.round(sb.popularity * 3)),
    works: String(sb.categories.length),
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const sb = sugarBoys.find((x) => x.id === params.slug);
  if (!sb) return { title: "Sugarboy · Sugardating" };
  return {
    title: `${sb.name} · Sugarboy · Sugardating`,
    description: sb.bio,
  };
}

export default async function SugarboyDetailPage({ params }: { params: { slug: string } }) {
  const sb = sugarBoys.find((x) => x.id === params.slug);
  if (!sb) notFound();
  const t = await getTranslations("creatorProfile");

  const creator = toCreator(sb);
  const cover = sb.cover;
  const avatar = sb.cover;

  const stats = deriveStats(creator.slug, creator.subs, creator.followers, creator.works);
  const feed = makeFeed(creator.slug);
  const videos = makeVideos(creator.slug);
  const gallery = makeGallery(creator.slug);
  const services = makeServices();
  const about = deriveAbout(creator.slug, sb.bio, creator.region, stats.joinedAt);
  const availability = deriveAvailability(creator.slug, stats.joinedAt, { online: sb.online });
  const extra = deriveExtraStats(creator.slug, sb.popularity);
  const giftBoard = deriveGiftLeaderboard(creator.slug);

  const profession = sb.intro.split(/[·•]/)[0]?.trim() || "Companion";
  const slogan = sb.intro;

  return (
    <div className="cr-page">
      <CreatorFold
        creator={creator}
        cover={cover}
        avatar={avatar}
        age={sb.age}
        languages={sb.languages}
        profession={profession}
        joinedAt={stats.joinedAt}
        intro={slogan}
        online={sb.online}
        vip={sb.tags.includes("VIP")}
        videoSrc={HERO_VIDEO_SRC}
        creatorType="sugarboy"
      />

      <div className="cr-shell cr-body">
        <QuickStats
          stats={stats}
          availability={availability}
          rating={sb.rating}
          likes={extra.likes}
          reviewCount={24}
          gifts={extra.gifts}
        />

        <section className="mt-8 md:mt-10">
          <CreatorAbout
            creator={creator}
            avatar={avatar}
            about={about}
            age={sb.age}
            height={sb.height}
            profession={profession}
            slogan={slogan}
            online={sb.online}
          />
        </section>

        <div className="cr-tabs-wrap mt-6 md:mt-8">
          <div className="cr-shell">
            <CreatorTabs />
          </div>
        </div>

        <div className="cr-grid">
          <main className="cr-main">
            <section id="feed" className="cr-section" aria-label={t("sections.feed")}>
              <FeedList authorName={creator.name} authorAvatar={avatar} authorSlug={creator.slug} posts={feed} />
            </section>
            <section id="gallery" className="cr-section" aria-label={t("sections.gallery")}>
              <GalleryGrid items={gallery} creatorSlug={creator.slug} creatorName={creator.name} />
            </section>
            <section id="videos" className="cr-section" aria-label={t("sections.videos")}>
              <VideoGrid videos={videos} creatorSlug={creator.slug} creatorName={creator.name} />
            </section>
            <section id="services" className="cr-section" aria-label={t("sections.services")}>
              <ServiceCards services={services} creatorSlug={creator.slug} creatorName={creator.name} creatorAvatar={avatar} />
            </section>
            <section id="gifts" className="cr-section" aria-label={t("sections.gifts")}>
              <CreatorGiftPanel />
            </section>
            <section id="reviews" className="cr-section" aria-label={t("sections.reviews")}>
              <ReviewList reviews={[]} overallRating={sb.rating} />
            </section>
          </main>

          <RightSidebar
            creator={creator}
            imageSrc={cover}
            age={sb.age}
            city={sb.city}
            availability={availability}
            giftBoard={giftBoard}
            similar={[]}
            timezone="GMT"
            nextAvailable={sb.online ? "Now" : "Tonight"}
          />
        </div>
      </div>

      <FloatingCTA creatorSlug={creator.slug} creatorName={creator.name} creatorAvatar={avatar} />
      <MobileCTABar creatorSlug={creator.slug} creatorName={creator.name} creatorAvatar={avatar} />
    </div>
  );
}
