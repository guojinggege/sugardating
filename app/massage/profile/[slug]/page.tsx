// /massage/profile/[slug] — 按摩服务者详情页
// 完全复用 Creator Detail 组件体系:CreatorFold / QuickStats / About / Tabs / Gallery / Video / Services / Sidebar / CTA
// 唯一差异:数据源换成 MassageProvider,通过 providerToCreator adapter 适配
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  providers, getProvider, providerToCreator,
} from "@/lib/massage-data";
import { SERVICE_STYLE_LABEL, type ServiceStyle } from "@/lib/massage-labels";
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
  return providers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = getProvider(params.slug);
  if (!p) return { title: "Provider · Sugardating" };
  return {
    title: `${p.displayName} · ${p.cityLabel}${p.areaLabel ? " · " + p.areaLabel : ""} · Sensual Massage · Sugardating`,
    description: p.bio.slice(0, 160),
  };
}

export default async function MassageProfilePage({ params }: { params: { slug: string } }) {
  const provider = getProvider(params.slug);
  if (!provider) notFound();

  const t = await getTranslations("creatorProfile");
  const creator = providerToCreator(provider);
  const cover = provider.coverImage;
  const avatar = provider.avatar || cover;

  const stats = deriveStats(creator.slug, creator.subs, creator.followers, creator.works);
  const feed = makeFeed(creator.slug);
  const videos = makeVideos(creator.slug);
  const gallery = makeGallery(creator.slug);
  const services = makeServices();
  const about = deriveAbout(creator.slug, provider.bio, creator.region, stats.joinedAt);
  const availability = deriveAvailability(creator.slug, stats.joinedAt, { online: provider.availability.online });
  const extra = deriveExtraStats(creator.slug, provider.followers / 1000);
  const giftBoard = deriveGiftLeaderboard(creator.slug);

  const profession = provider.serviceStyles.slice(0, 2).map((s: ServiceStyle) => SERVICE_STYLE_LABEL[s].en).join(" · ") || "Wellness Companion";
  const slogan = provider.bio.split("\n")[0].slice(0, 120);

  return (
    <div className="cr-page">
      <CreatorFold
        creator={creator}
        cover={cover}
        avatar={avatar}
        age={provider.age}
        languages={provider.languages}
        profession={profession}
        joinedAt={stats.joinedAt}
        intro={slogan}
        online={provider.availability.online}
        vip={!!provider.vip}
        videoSrc={HERO_VIDEO_SRC}
      />

      <div className="cr-shell cr-body">
        <QuickStats
          stats={stats}
          availability={availability}
          rating={provider.rating}
          likes={extra.likes}
          reviewCount={provider.reviewCount}
          gifts={provider.gifts}
        />

        <section className="mt-8 md:mt-10">
          <CreatorAbout
            creator={creator}
            avatar={avatar}
            about={about}
            age={provider.age}
            height={168}
            profession={profession}
            slogan={slogan}
            online={provider.availability.online}
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
              <ReviewList reviews={[]} overallRating={provider.rating} />
            </section>
          </main>

          <RightSidebar
            creator={creator}
            imageSrc={cover}
            age={provider.age}
            city={provider.cityLabel}
            availability={availability}
            giftBoard={giftBoard}
            similar={[]}
            timezone="GMT"
            nextAvailable={provider.availability.online ? "Now" : provider.availability.availableToday ? "Today" : "This week"}
          />
        </div>
      </div>

      <FloatingCTA creatorSlug={creator.slug} creatorName={creator.name} creatorAvatar={avatar} />
      <MobileCTABar creatorSlug={creator.slug} creatorName={creator.name} creatorAvatar={avatar} />
    </div>
  );
}
