// Mobile Creator Detail — 单列完整版
// 结构: Hero → CTA sticky → Stats → Tabs → 简介 / 基础资料 / 生活方式 / 兴趣 / 照片 / 视频 / 服务 / 礼物 / 评价 / 相似
import { notFound } from "next/navigation";
import { pick } from "@/lib/images";
import { getCreatorBySlug, listCreators } from "@/lib/queries";
import { sugarGirls } from "@/lib/sugarGirlMock";
import type { SugarGirlEntry } from "@/lib/sugarGirlMock";
import type { Creator, Tier } from "@/lib/types";
import {
  makeFeed, makeVideos, makeGallery, makeServices,
  deriveAbout, deriveStats, deriveAvailability, deriveGiftLeaderboard,
} from "@/lib/creatorProfileMock";
import MobileCreatorDetail from "@/components/Mobile/MobileCreatorDetail";

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

export default async function Page({ params }: { params: { slug: string } }) {
  const [dbDetail, allCreators] = await Promise.all([getCreatorBySlug(params.slug), listCreators()]);
  let creator: Creator;
  let baseBio: string;
  let sgSource: SugarGirlEntry | null = null;
  if (dbDetail) { creator = dbDetail.creator; baseBio = dbDetail.bio; }
  else {
    const fromSg = loadFromSugarGirls(params.slug);
    if (!fromSg) notFound();
    creator = fromSg.creator; baseBio = fromSg.bio; sgSource = fromSg.sg;
  }

  const off = offsetFromSlug(creator.slug);
  const cover  = sgSource?.cover ?? pick(0, off) ?? "/images/placeholder.png";
  const stats  = deriveStats(creator.slug, creator.subs, creator.followers, creator.works);
  const about  = deriveAbout(creator.slug, baseBio, creator.region, stats.joinedAt);
  const availability = deriveAvailability(creator.slug, stats.joinedAt, { online: sgSource ? sgSource.online : true });
  const feed = makeFeed(creator.slug).slice(0, 5);
  const videos = makeVideos(creator.slug);
  const gallery = makeGallery(creator.slug);
  const services = makeServices();
  const giftBoard = deriveGiftLeaderboard(creator.slug);
  const age = sgSource?.age ?? 24 + (off % 6);
  const heightCm = sgSource?.height ?? 165 + (off % 12);
  const otherCreators = allCreators.filter((x) => x.slug !== creator.slug).slice(0, 6);
  const others = otherCreators.map((cr) => ({
    creator: cr,
    photo: pick(1, offsetFromSlug(cr.slug) + 7) ?? "/images/placeholder.png",
  }));

  return (
    <MobileCreatorDetail
      creator={creator}
      cover={cover}
      age={age}
      heightCm={heightCm}
      about={about}
      availability={availability}
      feed={feed}
      videos={videos}
      gallery={gallery}
      services={services}
      giftBoard={giftBoard}
      others={others}
    />
  );
}
