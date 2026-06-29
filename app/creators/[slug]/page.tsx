import { notFound } from "next/navigation";
import Img from "@/components/Img";
import Placeholder from "@/components/Placeholder";
import WorkTile from "@/components/WorkTile";
import { Tick } from "@/components/icons";
import { getCreatorBySlug, listCommentsByCreator } from "@/lib/queries";
import { pick } from "@/lib/images";
import TipButton from "./TipButton";
import CommentForm from "./CommentForm";

function timeAgo(d: Date): string {
  const diff = Date.now() - d.getTime();
  const min = 60_000, hour = 60 * min, day = 24 * hour;
  if (diff < min) return "刚刚";
  if (diff < hour) return `${Math.floor(diff / min)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`;
  return d.toLocaleDateString("zh-CN");
}

export const dynamic = "force-dynamic";

// 从 slug 派生稳定 offset,确保同一创作者每次访问的封面/头像/作品图都不变
function offsetFromSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default async function Page({ params }: { params: { slug: string } }) {
  const [detail, comments] = await Promise.all([
    getCreatorBySlug(params.slug),
    listCommentsByCreator(params.slug),
  ]);
  if (!detail) notFound();
  const { creator: c, bio, works, tiers } = detail;
  const imageWorks = works.filter((w) => w.type === "image");
  const videoWorks = works.filter((w) => w.type === "video");
  const subscriberWorks = 0; // seed 当前全是 public
  const off = offsetFromSlug(c.slug);
  const cover  = pick(0, off);
  const avatar = pick(1, off);

  return (
    <div className="container">
      <div className="pf-cover">
        {cover
          ? <Img src={cover} alt={`${c.name} 封面`} sizes="100vw" priority />
          : <Placeholder label="封面图 占位" fill />}
      </div>
      <div className="pf-head">
        <div className="pf-ava">
          {avatar
            ? <Img src={avatar} alt={`${c.name} 头像`} sizes="120px" />
            : <Placeholder label="头像" fill />}
        </div>
        <div className="pf-id">
          <div className="nm">{c.name} <Tick /></div>
          <div className="meta"><span>{c.region}</span><span>{c.category} · {c.specialty}</span><span>中文 / English</span></div>
        </div>
        <div className="pf-act">
          <button className="btn btn-out">＋ 关注</button>
          <TipButton slug={c.slug} />
          <button className="btn btn-ink">订阅 {c.price}/月</button>
        </div>
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
          {imageWorks.map((w, i) => <WorkTile key={w.id} w={w} photoSrc={pick(i, off + 2)} />)}
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
          {videoWorks.map((w, i) => <WorkTile key={w.id} w={w} video photoSrc={pick(i, off + 6)} />)}
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
      <section className="cmts">
        <div className="work-sub">
          <h3>评论</h3>
          <span className="c">{comments.length} 条</span>
        </div>
        {comments.length === 0 ? (
          <div className="work-empty">还没有评论,来说第一句吧。</div>
        ) : (
          <ul className="cmt-list">
            {comments.map((cm) => (
              <li key={cm.id} className="cmt">
                <div className="cmt-h">
                  <b>{cm.authorName}</b>
                  <span>{timeAgo(cm.createdAt)}</span>
                </div>
                <p>{cm.content}</p>
              </li>
            ))}
          </ul>
        )}
        <CommentForm slug={c.slug} />
      </section>

      <div style={{ height: 40 }} />
    </div>
  );
}
