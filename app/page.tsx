import HeroCarousel from "@/components/HeroCarousel";
import SectionHeader from "@/components/SectionHeader";
import CreatorGrid from "@/components/CreatorGrid";
import LiveCard from "@/components/LiveCard";
import WorkTile from "@/components/WorkTile";
import { creators, works, liveNow } from "@/lib/mock";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <div className="container">
        <section className="sec">
          <SectionHeader title="正在直播" live count="12 位创作者直播中" moreHref="/live" moreText="直播平台" />
          <div className="live-row">{liveNow.map((l) => <LiveCard key={l.slug} l={l} />)}</div>
        </section>

        <section className="sec">
          <SectionHeader title="发现创作者" count="438 位 · 香港" moreHref="/creators" />
          <CreatorGrid items={creators} />
        </section>

        <section className="sec">
          <SectionHeader title="热门作品" moreHref="/creators" moreText="更多" />
          <div className="feed">{works.map((w) => <WorkTile key={w.id} w={w} />)}</div>
        </section>

        <div className="cta">
          <div><h2>把你的作品，变成可持续的收入</h2><p>开放主页、设置订阅、开直播，与支持者直接连接。</p></div>
          <div className="acts"><button className="btn btn-w">免费开通主页</button><button className="btn btn-g">创作者权益</button></div>
        </div>
        <div style={{ height: 40 }} />
      </div>
    </>
  );
}
