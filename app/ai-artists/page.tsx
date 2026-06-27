import ChannelListing from "@/components/ChannelListing";
import { listCreatorsByCategory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await listCreatorsByCategory("ai-artists");
  return (
    <div className="container">
      <div className="chero">
        <div className="ey">AI 频道</div>
        <h1>AI 艺术家</h1>
        <p>用自然语言描述你想找的风格，发现 AI 辅助创作的作者。（智能搜索为后续功能）</p>
      </div>
      <div className="fbar" style={{ paddingTop: 0 }}>
        <div className="fdrop" style={{ flex: 1, maxWidth: 520, color: "var(--muted)" }}>例如：“偏冷调、胶片质感的风光风格…”</div>
        <button className="btn btn-ink">智能搜索</button>
      </div>
      <ChannelListing eyebrow="" title="" desc="" items={items} chips={["全部", "AI风光", "AI人像", "AI插画"]} />
    </div>
  );
}
