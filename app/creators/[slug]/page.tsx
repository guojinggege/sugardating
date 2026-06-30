import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { pick } from "@/lib/images";
import { getCreatorBySlug, listCommentsByCreator, listCreators } from "@/lib/queries";
import {
  makeFeed, makeVideos, makeGallery, makeServices,
  deriveStats, deriveAbout,
} from "@/lib/creatorProfileMock";

import CreatorHero from "@/components/Creator/CreatorHero";
import CreatorStats from "@/components/Creator/CreatorStats";
import CreatorTabs from "@/components/Creator/CreatorTabs";
import FeedList from "@/components/Creator/FeedList";
import VideoGrid from "@/components/Creator/VideoGrid";
import GalleryGrid from "@/components/Creator/GalleryGrid";
import ServiceCards from "@/components/Creator/ServiceCards";
import ReviewList from "@/components/Creator/ReviewList";
import AboutBlock from "@/components/Creator/AboutBlock";
import RightSidebar from "@/components/Creator/RightSidebar";
import RelatedCreators from "@/components/Creator/RelatedCreators";
import CommentForm from "./CommentForm";

export const dynamic = "force-dynamic";

// 从 slug 派生稳定 offset
function offsetFromSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const detail = await getCreatorBySlug(params.slug);
  if (!detail) return { title: "Creator · Sugardating" };
  return {
    title: `${detail.creator.name} · Sugardating`,
    description: detail.bio || `${detail.creator.name} on Sugardating`,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const [detail, comments, allCreators, t] = await Promise.all([
    getCreatorBySlug(params.slug),
    listCommentsByCreator(params.slug),
    listCreators(),
    getTranslations("creatorProfile"),
  ]);
  if (!detail) notFound();
  const { creator: c, bio } = detail;

  const off = offsetFromSlug(c.slug);
  const cover  = pick(0, off)     ?? "/images/placeholder.png";
  const avatar = pick(1, off + 1) ?? "/images/placeholder.png";

  // 派生数据 (deterministic)
  const stats    = deriveStats(c.slug, c.subs, c.followers, c.works);
  const feed     = makeFeed(c.slug);
  const videos   = makeVideos(c.slug);
  const gallery  = makeGallery(c.slug);
  const services = makeServices();
  const about    = deriveAbout(c.slug, bio, c.region, stats.joinedAt);
  const tags     = about.interests.slice(0, 6);

  // 右侧 sidebar + 底部 related 用 — 排除当前 creator
  const others = allCreators.filter((x) => x.slug !== c.slug);
  const photoFor = (slug: string, off2: number) => {
    let h = 0;
    for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
    return pick(0, Math.abs(h) + off2) ?? "/images/placeholder.png";
  };
  const pickCreators = (n: number, skip = 0) =>
    others.slice(skip, skip + n).map((cr) => ({
      creator: cr,
      photo: photoFor(cr.slug, 7),
    }));

  return (
    <div className="cr-page">
      {/* 1. Hero (cover + avatar + info + 6 actions) */}
      <CreatorHero
        creator={c}
        bio={about.bio}
        cover={cover}
        avatar={avatar}
        age={24 + (off % 6)}
        languages={about.languages}
        tags={tags}
        online
      />

      <div className="container cr-container">
        {/* 2. Stats strip */}
        <CreatorStats data={stats} />

        {/* 3. Sticky Tabs */}
        <div className="cr-tabs-wrap">
          <CreatorTabs />
        </div>

        {/* 4. 2-col content */}
        <div className="cr-body">
          <div className="cr-main">
            <section id="feed" className="cr-section">
              <h3 className="cr-section-h">{t("sections.feed")}</h3>
              <FeedList authorName={c.name} authorAvatar={avatar} posts={feed} />
            </section>

            <section id="videos" className="cr-section">
              <h3 className="cr-section-h">{t("sections.videos")}</h3>
              <VideoGrid videos={videos} />
            </section>

            <section id="gallery" className="cr-section">
              <h3 className="cr-section-h">{t("sections.gallery")}</h3>
              <GalleryGrid items={gallery} />
            </section>

            <section id="services" className="cr-section">
              <h3 className="cr-section-h">{t("sections.services")}</h3>
              <ServiceCards services={services} />
            </section>

            <section id="reviews" className="cr-section">
              <h3 className="cr-section-h">{t("sections.reviews")}</h3>
              <ReviewList reviews={comments} />
              <div className="cr-review-form">
                <h4 className="cr-form-h">{t("reviews.writeNew")}</h4>
                <CommentForm slug={c.slug} />
              </div>
            </section>

            <section id="about" className="cr-section">
              <h3 className="cr-section-h">{t("sections.about")}</h3>
              <AboutBlock about={about} />
            </section>
          </div>

          {/* Right sticky sidebar */}
          <RightSidebar
            creatorSlug={c.slug}
            guesses={pickCreators(4, 0)}
            online={pickCreators(4, 4)}
            hot={pickCreators(4, 2)}
            recent={pickCreators(4, 6)}
          />
        </div>

        {/* 5. Bottom related carousel */}
        <RelatedCreators
          sets={[
            { key: "guess",   items: pickCreators(10, 0) },
            { key: "similar", items: pickCreators(10, 2) },
            { key: "recent",  items: pickCreators(10, 4) },
            { key: "hot",     items: pickCreators(10, 1) },
          ]}
        />

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
