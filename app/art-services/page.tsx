import ChannelListing from "@/components/ChannelListing";
import { listCreatorsByCategory } from "@/lib/queries";
import { photos } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await listCreatorsByCategory("art-services");
  return <ChannelListing eyebrow="频道" title="专属服务" desc="约拍、咨询、定制——可委托的私享合作。"
    items={items} chips={["全部", "约拍", "咨询", "定制", "礼遇"]} photos={photos} />;
}
