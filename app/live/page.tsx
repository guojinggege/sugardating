import LiveCard from "@/components/LiveCard";
import { liveNow } from "@/lib/mock";
export default function Page() {
  const all = [...liveNow, ...liveNow];
  return (
    <div className="container">
      <div className="chero"><div className="ey">直播平台</div><h1>正在直播</h1><p>创作者的实时直播频道。（进入直播间为后续功能）</p></div>
      <div style={{ height: 12 }} />
      <div className="grid">{all.map((l, i) => <LiveCard key={i} l={l} />)}</div>
      <div style={{ height: 40 }} />
    </div>
  );
}
