import ChannelListing from "@/components/ChannelListing";
import { listCreatorsByCategory } from "@/lib/queries";
import { photos } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "在线伴侣 · Sugardating",
  description: "精选在线伴侣 — 文字、语音、视频自由切换,按你的节奏发现。",
};

export default async function Page() {
  const items = await listCreatorsByCategory("ai-artists");
  return (
    <div className="container">
      <div className="chero">
        <div className="ey">在线频道</div>
        <h1>在线伴侣</h1>
        <p>挑选随时在线的伴侣 — 兴趣、语言、节奏匹配,文字 / 语音 / 视频自由切换。（智能搜索为后续功能）</p>
      </div>
      <div className="fbar" style={{ paddingTop: 0 }}>
        <div className="fdrop" style={{ flex: 1, maxWidth: 520, color: "var(--muted)" }}>例如：&ldquo;懂红酒、能聊电影、双语、晚间在线…&rdquo;</div>
        <button className="btn btn-ink">智能搜索</button>
      </div>
      <ChannelListing eyebrow="" title="" desc="" items={items} chips={["全部", "在线", "新人", "热门", "高匹配"]} photos={photos} />
    </div>
  );
}
