import Link from "next/link";
import { Spark } from "./icons";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="container foot-in">
        <div>
          <div className="fbrand"><span className="gm"><Spark /></span>Sugardating</div>
          <p className="about">华语与亚裔创作者的发现与订阅平台。覆盖新加坡、香港、台北、吉隆坡、首尔、曼谷、伦敦、悉尼。</p>
        </div>
        <div><h5>浏览</h5><ul><li><Link href="/photography">动态推荐</Link></li><li><Link href="/video">视频专区</Link></li><li><Link href="/art-services">专属服务</Link></li><li><Link href="/male-artists">SugarGirl</Link></li><li><Link href="/ai-artists">AI艺术家</Link></li></ul></div>
        <div><h5>平台</h5><ul><li><Link href="/live">直播平台</Link></li><li><Link href="/community">社区</Link></li><li><Link href="/rankings">排行榜</Link></li><li><Link href="/studio">创作者中心</Link></li></ul></div>
        <div><h5>关于</h5><ul><li><Link href="#">帮助中心</Link></li><li><Link href="#">社区准则</Link></li><li><Link href="#">条款</Link></li><li><Link href="#">隐私</Link></li></ul></div>
      </div>
      <div className="container foot-b"><span>© 2026 Sugardating. 保留所有权利.</span><span>简体中文 · 繁體 · English</span></div>
    </footer>
  );
}
