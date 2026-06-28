import { notFound } from "next/navigation";
import Placeholder from "@/components/Placeholder";
import WorkTile from "@/components/WorkTile";
import { Tick } from "@/components/icons";
import { getCreatorBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { slug: string } }) {
  const detail = await getCreatorBySlug(params.slug);
  if (!detail) notFound();
  const { creator: c, bio, works, tiers } = detail;
  const imageWorks = works.filter((w) => w.type === "image");
  const videoWorks = works.filter((w) => w.type === "video");
  const subscriberWorks = 0; // seed 当前全是 public

  return (
    <div className="container">
      <div className="pf-cover"><Placeholder label="封面图 占位" fill /></div>
      <div className="pf-head">
        <div className="pf-ava"><Placeholder label="头像" fill /></div>
        <div className="pf-id">
          <div className="nm">{c.name} <Tick /></div>
          <div className="meta"><span>{c.region}</span><span>{c.category} · {c.specialty}</span><span>中文 / English</span></div>
        </div>
        <div className="pf-act"><button className="btn btn-out">＋ 关注</button><button className="btn btn-ink">订阅 {c.price}/月</button></div>
      </div>
      <p className="pf-bio">{bio}</p>
      <div className="pf-stats">
        <div><b>{c.subs}</b><span>订阅者</span></div>
        <div><b>{c.followers}</b><span>关注</span></div>
        <div><b>{c.works}</b><span>作品</span></div>
      </div>

      <div className="tabs">
        <div className="tab on">公开作品</div>
        <div className="tab">订阅内容 · {subscriberWorks}</div>
        <div className="tab">订阅档位</div>
      </div>

      <div className="work-sub">
        <h3>图片作品</h3>
        <span className="c">{imageWorks.length} 件</span>
      </div>
      {imageWorks.length === 0 ? (
        <div className="work-empty">暂无图片作品</div>
      ) : (
        <div className="feed">
          {imageWorks.map((w) => <WorkTile key={w.id} w={w} />)}
        </div>
      )}

      <div className="work-sub">
        <h3>视频作品</h3>
        <span className="c">{videoWorks.length} 件</span>
      </div>
      {videoWorks.length === 0 ? (
        <div className="work-empty">暂无视频作品</div>
      ) : (
        <div className="feed">
          {videoWorks.map((w) => <WorkTile key={w.id} w={w} video />)}
        </div>
      )}

      <div className="tiers">
        {tiers.map((t) => {
          const isElite = t.name === "elite";
          const btnClass = t.name === "basic" ? "btn btn-out" : "btn btn-ink";
          return (
            <div key={t.name} className={isElite ? "tier elite" : "tier"}>
              <div className="tn">{t.label}</div>
              <div className="tp">{t.price}<small>/月</small></div>
              <ul>{t.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
              <button className={btnClass} style={{ justifyContent: "center" }}>选择</button>
            </div>
          );
        })}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}
