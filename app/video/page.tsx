import ChannelListing from "@/components/ChannelListing";
import { listCreatorsByCategory } from "@/lib/queries";
import { photos } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await listCreatorsByCategory("video");
  return <ChannelListing eyebrow="频道" title="视频" desc="短片、Vlog、延时、纪录——视频创作者的发现与订阅。"
    items={items} chips={["全部", "短片", "Vlog", "延时", "纪录"]} photos={photos} />;
}
