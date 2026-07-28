// 互动社区顶部导航 · 已下线大图 hero · 只保留 博客/瓜田/问答 3-tab 切换
// 命名保留 "WhisperSquareHero" 供多处 import 兼容
import CommunityModeSwitcher from "./CommunityModeSwitcher";

export default function WhisperSquareHero() {
  return (
    <nav className="csw" aria-label="互动社区导航">
      <div className="csw-in">
        <CommunityModeSwitcher />
      </div>
      <style>{`
        .csw{background:#fff;border-bottom:1px solid #E9E3DA}
        .csw-in{max-width:1380px;margin:0 auto;padding:14px 24px;display:flex;justify-content:center}
        @media(max-width:640px){
          .csw-in{padding:12px 12px;justify-content:flex-start;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
          .csw-in::-webkit-scrollbar{display:none}
        }
      `}</style>
    </nav>
  );
}
