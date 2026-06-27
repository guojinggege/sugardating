import ChannelListing from "@/components/ChannelListing";
import { listCreatorsByCategory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await listCreatorsByCategory("photography");
  return <ChannelListing eyebrow="频道" title="摄影" desc="风光、人文、纪实、街拍——发现各地华语与亚裔摄影创作者。"
    items={items} chips={["全部", "风光", "人文", "纪实", "街拍"]} />;
}
