// 三栏 shell · Desktop 220 + 1fr + 320 · Tablet 隐藏 left · Mobile 单列
import type { ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;              // 中间主内容
  right: ReactNode;                 // 右侧栏
  activePath?: string;              // 用于左侧高亮
}

interface NavItem { href: string; label: string; }

const NAV: NavItem[] = [
  { href: "/community/journal",     label: "博客" },
  { href: "/community/stories",     label: "帖子" },
  { href: "/community/feed",        label: "动态" },
];

const NAV_ME: NavItem[] = [
  { href: "/community/my/posts",    label: "我的发布" },
  { href: "/community/my/saved",    label: "我的收藏" },
];

export default function CommunityShell({ children, right, activePath }: Props) {
  return (
    <div className="cs">
      <div className="cs-shell">
        <div className="cs-grid">
          <aside className="cs-left" aria-label="Community sections">
            <div className="cs-nav-group">
              <div className="cs-nav-h">浏览</div>
              <ul>
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className={"cs-nav-a" + (activePath === n.href ? " is-active" : "")}>
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="cs-nav-group">
              <div className="cs-nav-h">我的</div>
              <ul>
                {NAV_ME.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="cs-nav-a cs-nav-a--soon">
                      {n.label}
                      <span className="cs-soon">Soon</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="cs-nav-group">
              <div className="cs-nav-h">深度内容</div>
              <ul>
                <li>
                  <Link href="/community/journal" className="cs-nav-a cs-nav-a--gold">
                    <span className="cs-gold-dot" aria-hidden />
                    Sugardating Journal
                  </Link>
                </li>
              </ul>
            </div>
            <div className="cs-foot">
              <Link href="/community/rules" className="cs-foot-a">社区规则</Link>
              <Link href="/community/safety" className="cs-foot-a">安全与隐私</Link>
            </div>
          </aside>

          <main className="cs-main">
            {children}
          </main>

          <aside className="cs-right" aria-label="Community sidebar">
            {right}
          </aside>
        </div>
      </div>

      <style>{`
        .cs{background:#F7F4EF;color:#171512;min-height:calc(100vh - 200px)}
        .cs-shell{max-width:1380px;margin:0 auto;padding:24px 32px 64px}
        .cs-grid{display:grid;grid-template-columns:220px minmax(0,1fr) 320px;gap:28px;align-items:flex-start}
        .cs-left,.cs-right{position:sticky;top:130px}
        .cs-left{display:flex;flex-direction:column;gap:22px}
        .cs-nav-group ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
        .cs-nav-h{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#a19a91;font-weight:700;margin-bottom:8px}
        .cs-nav-a{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;font-size:13.5px;color:#3d3a35;text-decoration:none;border-radius:10px;font-weight:500;transition:background .12s,color .12s}
        .cs-nav-a:hover{background:rgba(233,227,218,.5);color:#171512}
        .cs-nav-a.is-active{background:#171512;color:#F5EEDD;font-weight:600}
        .cs-nav-a--soon{color:#a19a91}
        .cs-nav-a--gold{background:linear-gradient(135deg,rgba(238,221,184,.5),rgba(197,165,106,.18));color:#171512;font-weight:700;gap:8px}
        .cs-nav-a--gold:hover{background:linear-gradient(135deg,rgba(238,221,184,.7),rgba(197,165,106,.3))}
        .cs-gold-dot{width:8px;height:8px;background:linear-gradient(135deg,#EEDDB8,#C5A56A);border-radius:50%;flex-shrink:0}
        .cs-soon{font-size:9.5px;letter-spacing:.06em;color:#a19a91;text-transform:uppercase;font-weight:700;background:#F7F4EF;padding:2px 6px;border-radius:4px}
        .cs-foot{display:flex;flex-direction:column;gap:6px;padding-top:14px;border-top:1px solid #E9E3DA}
        .cs-foot-a{font-size:12px;color:#77716A;text-decoration:none}
        .cs-foot-a:hover{color:#171512}

        .cs-main{display:flex;flex-direction:column;gap:20px;min-width:0}

        .cs-right{display:flex;flex-direction:column;gap:16px;max-height:calc(100vh - 150px);overflow-y:auto;scrollbar-width:thin}

        @media (max-width:1279px){
          .cs-grid{grid-template-columns:minmax(0,1fr) 320px}
          .cs-left{display:none}
        }
        @media (max-width:1024px){
          .cs-grid{grid-template-columns:1fr}
          .cs-right{position:static;max-height:none;overflow:visible}
        }
        @media (max-width:640px){
          .cs-shell{padding:16px 16px 40px}
          .cs-main{gap:14px}
        }
      `}</style>
    </div>
  );
}
