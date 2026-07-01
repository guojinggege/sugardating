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
import MobileCTABar from "@/components/Creator/MobileCTABar";
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

// SugarGirl fallback:如果 slug 不在 Creator DB,尝试从 sugarGirls mock 找
// 返回 shape 兼容 CreatorDetail (仅少了 tiers/works,主页不用)
function loadFromSugarGirls(slug: string): { creator: Creator; bio: string; sg: SugarGirlEntry } | null {
  const sg = sugarGirls.find((x) => x.id === slug);
  if (!sg) return null;
  return {
    creator: {
      slug: sg.id,
      name: sg.name,
      category: "SugarGirl",
      specialty: sg.intro,
      region: `${sg.country} · ${sg.city}`,
      price: "—",
      tier: "elite" as Tier,
      subs: "—",
      followers: fmtNum(Math.round(sg.popularity * 3)),
      works: String(sg.categories.length),
    },
    bio: sg.bio,
    sg,
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const detail = await getCreatorBySlug(params.slug);
  if (detail) {
    return {
      title: `${detail.creator.name} · Sugardating`,
      description: detail.bio || `${detail.creator.name} on Sugardating`,
    };
  }
  const fromSg = loadFromSugarGirls(params.slug);
  if (fromSg) {
    return {
      title: `${fromSg.creator.name} · Sugardating`,
      description: fromSg.bio,
    };
  }
  return { title: "Creator · Sugardating" };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const [dbDetail, dbComments, allCreators, t] = await Promise.all([
    getCreatorBySlug(params.slug),
    listCommentsByCreator(params.slug),
    listCreators(),
    getTranslations("creatorProfile"),
  ]);

  // 数据源:优先 DB,fallback 到 sugarGirls mock
  let creator: Creator;
  let baseBio: string;
  let comments = dbComments;
  let sgSource: SugarGirlEntry | null = null;

  if (dbDetail) {
    creator = dbDetail.creator;
    baseBio = dbDetail.bio;
  } else {
    const fromSg = loadFromSugarGirls(params.slug);
    if (!fromSg) notFound();
    creator = fromSg.creator;
    baseBio = fromSg.bio;
    sgSource = fromSg.sg;
    comments = [];   // sugargirls 没有 DB comment
  }

  const off = offsetFromSlug(creator.slug);
  const cover  = pick(0, off)     ?? "/images/placeholder.png";
  // sugargirl 有真封面就用它当 avatar;否则 pick 一张
  const avatar = sgSource?.cover ?? (pick(1, off + 1) ?? "/images/placeholder.png");

  // 派生数据 (deterministic from slug)
  const stats    = deriveStats(creator.slug, creator.subs, creator.followers, creator.works);
  const feed     = makeFeed(creator.slug);
  const videos   = makeVideos(creator.slug);
  const gallery  = makeGallery(creator.slug);
  const services = makeServices();
  const about    = deriveAbout(creator.slug, baseBio, creator.region, stats.joinedAt);
  const availability = deriveAvailability(creator.slug, stats.joinedAt, {
    online: sgSource ? sgSource.online : true,
  });

  // sugargirls fallback:用真实数据覆盖派生的部分
  const age       = sgSource?.age       ?? 24 + (off % 6);
  const languages = sgSource?.languages ?? about.languages;
  const tags      = sgSource
    ? sgSource.categories.slice(0, 6)
    : about.interests.slice(0, 6);

  // 排除当前 creator,取其它人
  const others = allCreators.filter((x) => x.slug !== creator.slug);
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
      <CreatorHero
        creator={creator}
        bio={about.bio}
        cover={cover}
        avatar={avatar}
        age={age}
        languages={languages}
        tags={tags}
        online={sgSource ? sgSource.online : true}
      />

      <div className="container cr-container">
        <CreatorStats data={stats} />

        <div className="cr-tabs-wrap">
          <CreatorTabs />
        </div>

        <div className="cr-body">
          <div className="cr-main">
            <section id="feed" className="cr-section">
              <h3 className="cr-section-h">{t("sections.feed")}</h3>
              <FeedList authorName={creator.name} authorAvatar={avatar} posts={feed} />
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
                <CommentForm slug={creator.slug} />
              </div>
            </section>

            <section id="about" className="cr-section">
              <h3 className="cr-section-h">{t("sections.about")}</h3>
              <AboutBlock about={about} />
            </section>
          </div>

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

      {/* 移动端固定底部 CTA bar (仅 <640 显示) */}
      <MobileCTABar />
    </div>
  );
}
