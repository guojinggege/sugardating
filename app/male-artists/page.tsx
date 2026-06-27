import ChannelListing from "@/components/ChannelListing";
import { listCreatorsByCategory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await listCreatorsByCategory("male-artists");
  return <ChannelListing eyebrow="频道" title="男艺术家" desc="按创作者浏览的频道入口。"
    items={items} chips={["全部", "摄影", "视频", "艺术服务"]} />;
}
