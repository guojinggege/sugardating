import Placeholder from "@/components/Placeholder";
import { posts } from "@/lib/mock";
export default function Page() {
  return (
    <div className="container">
      <div className="chero"><div className="ey">社区</div><h1>动态广场</h1><p>创作者与支持者的交流空间。（发帖、互动为后续功能）</p></div>
      <div style={{ height: 8 }} />
      <div className="posts">
        {posts.map((p) => (
          <article className="post" key={p.id}>
            <div className="ph-head"><div className="av"><Placeholder label="头像" fill /></div><div><b>{p.author}</b><br /><span>{p.time}</span></div></div>
            <p>{p.text}</p>
            {p.image && <div className="pimg"><Placeholder label="动态配图 占位" fill /></div>}
            <div className="acts"><span>♡ {p.likes}</span><span>💬 {p.comments}</span><span>↗ 分享</span></div>
          </article>
        ))}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}
