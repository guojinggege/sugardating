import ChannelListing from "@/components/ChannelListing";
import { listCreatorsByCategory } from "@/lib/queries";
import { photos } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await listCreatorsByCategory("art-services");
  return <ChannelListing eyebrow="频道" title="艺术服务" desc="约拍、后期、设计、插画等可委托的创作服务。"
    items={items} chips={["全部", "约拍", "后期", "设计", "插画"]} photos={photos} />;
}
