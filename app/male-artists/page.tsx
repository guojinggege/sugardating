import ChannelListing from "@/components/ChannelListing";
import { listCreatorsByCategory } from "@/lib/queries";
import { photos } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await listCreatorsByCategory("male-artists");
  return <ChannelListing eyebrow="频道" title="SugarGirl" desc="精选女性创作者频道。"
    items={items} chips={["全部", "动态推荐", "视频专区", "专属服务"]} photos={photos} />;
}
