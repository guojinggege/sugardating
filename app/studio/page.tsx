export default function Page() {
  return (
    <div className="container">
      <div className="chero" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div><div className="ey">创作者中心</div><h1>概览</h1></div>
        <button className="btn btn-ink">＋ 发布作品</button>
      </div>
      <div className="kpi">
        <div className="kcard"><div className="kl">本月收入</div><div className="kv">S$3,420</div></div>
        <div className="kcard"><div className="kl">订阅者</div><div className="kv">1,240</div></div>
        <div className="kcard"><div className="kl">作品浏览</div><div className="kv">9.8万</div></div>
        <div className="kcard"><div className="kl">退订率</div><div className="kv">2.1%</div></div>
      </div>
      <div className="panel">
        <h3>发布新作品</h3>
        <div className="s">支持图集、视频、图文动态。可设为公开或订阅专属。（上传为后续功能。）</div>
        <div className="uprow">拖入文件，或点击上传 · 标注占位</div>
      </div>
      <div className="panel">
        <h3>订阅档位</h3>
        <div className="s">设置 1–3 档，对应不同的专属内容与权益。</div>
        <div className="tiers" style={{ padding: 0 }}>
          <div className="tier"><div className="tn">入门</div><div className="tp">S$6<small>/月</small></div></div>
          <div className="tier"><div className="tn">进阶</div><div className="tp">S$15<small>/月</small></div></div>
          <div className="tier elite"><div className="tn">Elite</div><div className="tp">S$48<small>/月</small></div></div>
        </div>
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}
