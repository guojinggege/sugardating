// 互动社区顶部导航条 · 精简版 · 3 段式 · 博客 / 帖子 / 动态
// 原 hero (私语广场大标题) 已下线 · 按新 spec 只保留清晰入口
import CommunityModeSwitcher from "./CommunityModeSwitcher";

export default function WhisperSquareHero() {
  return (
    <section className="cnav" aria-label="互动社区导航">
      <div className="cnav-shell">
        <div className="cnav-eye">Community</div>
        <div className="cnav-switch">
          <CommunityModeSwitcher />
        </div>
      </div>
      <style>{`
        .cnav{background:linear-gradient(180deg,#F7F4EF,#FBF7EF);border-bottom:1px solid #E9E3DA}
        .cnav-shell{max-width:1380px;margin:0 auto;padding:20px 32px;display:flex;flex-direction:column;align-items:center;gap:10px}
        .cnav-eye{font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#B8A789;font-weight:800}
        .cnav-switch{display:flex;justify-content:center}
        @media(max-width:640px){
          .cnav-shell{padding:16px 16px}
        }
      `}</style>
    </section>
  );
}
