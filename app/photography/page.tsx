import ChannelListing from "@/components/ChannelListing";
import { listCreatorsByCategory } from "@/lib/queries";
import { photos } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await listCreatorsByCategory("photography");
  return <ChannelListing eyebrow="频道" title="动态推荐" desc="基于你的兴趣每天发现新内容与新创作者。"
    items={items} chips={["全部", "新作", "高分", "热议", "近期更新"]} photos={photos} />;
}
