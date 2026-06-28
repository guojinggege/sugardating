import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import SectionHeader from "@/components/SectionHeader";
import LiveCard from "@/components/LiveCard";
import WorkTile from "@/components/WorkTile";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import Stat from "@/components/Stat";
import CreatorRail from "@/components/CreatorRail";
import { Arrow } from "@/components/icons";
import { works, liveNow } from "@/lib/mock";
import { listCreators } from "@/lib/queries";

export const dynamic = "force-dynamic";

const contentTypes = [
  { slug: "photography", title: "摄影",     desc: "风光、人文、纪实、街拍——发现镜头里的城市与山海。" },
  { slug: "video",       title: "视频",     desc: "短片、Vlog、延时——会动的故事与时间。" },
  { slug: "art-services",title: "艺术服务", desc: "约拍、修图、设计——可委托的创作合作。" },
  { slug: "ai-artists",  title: "AI 艺术家", desc: "AI 辅助下的新风格与新视角。" },
  { slug: "live",        title: "直播平台", desc: "看创作者实时拍摄、答疑、分享后期。" },
];

const stats = [
  { eye: "创作者", num: "2,840+", label: "正在拾光发布作品" },
  { eye: "地区",   num: "8",      label: "香港 / 新加坡 / 台北 / 首尔 …" },
  { eye: "门类",   num: "5",      label: "摄影 / 视频 / 服务 / AI / 直播" },
  { eye: "模式",   num: "订阅制", label: "支持你长期的创作" },
];

const whyItems = [
  {
    title: "直接连接支持者",
    desc: "粉丝订阅你的创作，收入直接、可持续。",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" /></svg>
    ),
  },
  {
    title: "属于你的主页",
    desc: "完整作品集、订阅档位、直播，一处经营。",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-6h4v6" /></svg>
    ),
  },
  {
    title: "被对的人发现",
    desc: "按门类、地区、风格被精准发现，不被算法埋没。",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
  },
];

export default async function Home() {
  const creators = await listCreators();

  return (
    <>
      <HomeHero />
      <div className="container">

        {/* 1. 我们是什么 */}
        <section className="sec about-sec">
          <Reveal>
            <div className="about">
              <span className="eye"><i />关于我们</span>
              <h2>华语与亚裔创作者的家</h2>
              <p>拾光是一个面向全球华语与亚裔创作者的发现与订阅平台。摄影、视频、艺术服务、AI 创作——在这里展示作品，与支持你的人直接连接。</p>
            </div>
          </Reveal>
        </section>

        {/* 2. 为什么加入 */}
        <section className="sec">
          <Reveal><SectionHeader title="为什么加入" count="平台对创作者的意义" /></Reveal>
          <div className="why">
            {whyItems.map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <div className="wy">
                  <div className="wy-ic">{w.icon}</div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 3. 按内容类型浏览 */}
        <section className="sec">
          <Reveal><SectionHeader title="按内容类型浏览" count="找到你感兴趣的方向" /></Reveal>
          <div className="ctype">
            {contentTypes.map((t, i) => (
              <Reveal key={t.slug} delay={i * 80}>
                <Link href={`/${t.slug}`} className="ct">
                  <Placeholder label={`${t.title}\n占位图`} fill />
                  <div className="gr" />
                  <div className="info">
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                    <span className="go">进入 <Arrow /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 4. 精选创作者(横向滑廊) */}
        <section className="sec">
          <Reveal><SectionHeader title="精选创作者" count={`${creators.length} 位 · 持续更新`} moreHref="/creators" moreText="全部创作者" /></Reveal>
          <Reveal>
            <CreatorRail items={creators} />
          </Reveal>
        </section>

        {/* 5. 热门作品 */}
        <section className="sec">
          <Reveal><SectionHeader title="热门作品" moreHref="/creators" moreText="更多" /></Reveal>
          <div className="feed">
            {works.map((w, i) => (
              <Reveal key={w.id} delay={i * 60}>
                <WorkTile w={w} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* 6. 平台数据 */}
        <section className="sec">
          <Reveal><SectionHeader title="平台数据" count="截至本月" /></Reveal>
          <Reveal>
            <div className="stats">
              {stats.map((s) => (
                <div key={s.eye} className="sv">
                  <span className="accent">{s.eye}</span>
                  <b><Stat value={s.num} /></b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* 7. 创作者入驻 banner */}
        <section className="sec">
          <Reveal>
            <div className="banner">
              <div className="bn-l">
                <span className="bn-eye"><i />创作者入驻</span>
                <h2>把你的作品，变成可持续的收入</h2>
                <p>开放主页、设置订阅、开直播，与支持者直接连接。几分钟上线，你的内容始终归你所有。</p>
                <div className="bn-acts">
                  <Link href="/register" className="btn btn-w">免费开通主页</Link>
                  <Link href="/studio" className="btn btn-g">创作者权益</Link>
                </div>
              </div>
              <div className="bn-r"><Placeholder label="创作者中心 占位" fill /></div>
            </div>
          </Reveal>
        </section>

        {/* 8. 直播(放叙事尾部,作为"现在就能看的"收口) */}
        <section className="sec">
          <Reveal><SectionHeader title="正在直播" live count="12 位创作者直播中" moreHref="/live" moreText="直播平台" /></Reveal>
          <Reveal>
            <div className="live-row">{liveNow.map((l) => <LiveCard key={l.slug} l={l} />)}</div>
          </Reveal>
        </section>

        <div style={{ height: 80 }} />
      </div>
    </>
  );
}
