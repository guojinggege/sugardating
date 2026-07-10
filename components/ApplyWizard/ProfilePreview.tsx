"use client";
// 主页预览侧栏 · 实时反映当前草稿状态
import type { ApplyWizardDraft } from "@/lib/apply-wizard";
import { STEPS, completionPercent, computeAge } from "@/lib/apply-wizard";

export default function ProfilePreview({ draft }: { draft: ApplyWizardDraft }) {
  const age = computeAge(draft.birthDate) ?? undefined;
  const pct = completionPercent(draft);
  const publicPhotos = draft.photos.length;
  const publicVideos = draft.videos.length;
  const activeServices = Object.values(draft.services).filter((s) => s.enabled).length;

  return (
    <aside className="pp" aria-label="Sugargirl 主页预览">
      <div className="pp-h">
        <div className="pp-eyebrow">Preview</div>
        <h4>主页预览</h4>
        <p>这些内容将展示在你的 sugargirl 主页上</p>
      </div>

      {/* Progress */}
      <div className="pp-prog">
        <div className="pp-prog-row">
          <span>完成度</span>
          <b>{pct}%</b>
        </div>
        <div className="pp-bar">
          <div className="pp-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="pp-prog-list">
          {STEPS.map((s) => (
            <span key={s.key} className={"pp-prog-dot " + (s.isComplete(draft) ? "is-done" : "")}>
              {s.isComplete(draft) ? "✓" : s.index}
            </span>
          ))}
        </div>
      </div>

      {/* Mini profile card */}
      <div className="pp-card">
        <div className="pp-avatar">
          {draft.avatar
            ? <img src={draft.avatar} alt="" />
            : <span>{draft.displayName?.[0]?.toUpperCase() || "?"}</span>}
        </div>
        <div className="pp-name">
          {draft.displayName || "你的昵称"}
          {age !== undefined && <span> · {age}</span>}
        </div>
        <div className="pp-handle">
          @{draft.username || "username"}
        </div>
        <div className="pp-meta">
          {[draft.city, draft.country].filter(Boolean).join(" · ") || "城市待填写"}
        </div>
        {draft.languages.length > 0 && (
          <div className="pp-lang">{draft.languages.join(" · ")}</div>
        )}
        {draft.slogan && <div className="pp-slogan">&ldquo;{draft.slogan}&rdquo;</div>}
      </div>

      {/* Stats grid */}
      <div className="pp-stats">
        <div><b>{publicPhotos}</b><span>照片</span></div>
        <div><b>{publicVideos}</b><span>视频</span></div>
        <div><b>{activeServices}</b><span>服务</span></div>
        <div><b>{draft.interests.length}</b><span>兴趣</span></div>
      </div>

      {draft.profileTags.length > 0 && (
        <div className="pp-tags">
          {draft.profileTags.slice(0, 6).map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}

      <style jsx>{`
        .pp{background:#fff;border:1px solid var(--line);border-radius:20px;padding:22px 22px 24px;display:flex;flex-direction:column;gap:18px;position:sticky;top:88px}
        .pp-h{border-bottom:1px solid var(--line);padding-bottom:14px}
        .pp-eyebrow{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:6px}
        .pp-h h4{font-size:15px;font-weight:700;color:#161618;margin:0 0 4px;letter-spacing:-0.005em}
        .pp-h p{font-size:11.5px;line-height:1.5;color:#8a8a92;margin:0}
        .pp-prog{display:flex;flex-direction:column;gap:8px}
        .pp-prog-row{display:flex;justify-content:space-between;align-items:baseline;font-size:11.5px;color:#5a5a62}
        .pp-prog-row b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:24px;color:#B8A789;letter-spacing:-0.01em}
        .pp-bar{height:6px;background:#F4F4F5;border-radius:99px;overflow:hidden}
        .pp-bar-fill{height:100%;background:linear-gradient(90deg,#EEDDB8,#B8A789);border-radius:99px;transition:width .4s cubic-bezier(.2,.9,.3,1.1)}
        .pp-prog-list{display:flex;gap:4px;justify-content:space-between;margin-top:4px}
        .pp-prog-dot{flex:1;text-align:center;font-size:10px;font-weight:700;padding:5px 0;border-radius:6px;background:#F4F4F5;color:#8a8a92}
        .pp-prog-dot.is-done{background:#161618;color:#EEDDB8}
        .pp-card{padding:18px 16px;background:linear-gradient(180deg,#FBFAF7,#F4F4F5);border-radius:14px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px}
        .pp-avatar{width:72px;height:72px;border-radius:50%;overflow:hidden;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;margin-bottom:6px;box-shadow:0 8px 20px -12px rgba(0,0,0,.25)}
        .pp-avatar img{width:100%;height:100%;object-fit:cover}
        .pp-name{font-size:16px;font-weight:700;color:#161618;letter-spacing:-0.005em}
        .pp-name span{color:#8a8a92;font-weight:500}
        .pp-handle{font-size:12px;color:#B8A789;font-weight:600}
        .pp-meta{font-size:12px;color:#5a5a62}
        .pp-lang{font-size:11.5px;color:#8a8a92;font-weight:500}
        .pp-slogan{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:14px;color:#3d3d42;line-height:1.5;margin-top:6px;padding:6px 12px;border-top:1px dashed rgba(184,167,137,.3)}
        .pp-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
        .pp-stats > div{padding:10px 6px;background:#F4F4F5;border-radius:10px;text-align:center;display:flex;flex-direction:column;gap:2px}
        .pp-stats b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:20px;color:#161618;font-weight:600;line-height:1}
        .pp-stats span{font-size:10.5px;color:#8a8a92;font-weight:600}
        .pp-tags{display:flex;flex-wrap:wrap;gap:4px}
        .pp-tags span{padding:3px 9px;background:#F4F4F5;border-radius:99px;font-size:11px;color:#3d3d42;font-weight:500}
        @media (max-width:1024px){.pp{position:static}}
      `}</style>
    </aside>
  );
}
