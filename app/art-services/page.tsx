import PageBgDark from "@/components/Feed/PageBgDark";
import ServiceHero from "@/components/Service/ServiceHero";
import ServiceSection from "@/components/Service/ServiceSection";
import { pick } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "定制服务 · Sugardating",
  description: "约会、旅游、拍摄、视频聊天 — 4 类礼宾级定制服务,由专属顾问按你的节奏与品味量身规划。",
};

// 4 个服务模块的展示数据 — 每段标题/简介/4 张图
const SECTIONS = [
  {
    id: "dating",
    eyebrow: "Dating",
    title: "约会 · 私人顾问安排",
    intro: "兴趣匹配、地点推荐、初次见面到长期陪伴 — 一切由专属顾问规划,不再有尴尬的搭话与无效的开场。",
    imageOffset: 1,
  },
  {
    id: "travel",
    eyebrow: "Travel",
    title: "旅游 · 本地达人陪伴",
    intro: "城市深度路线、餐厅与酒店预订、本地文化导览 — 无论是周末短旅行还是长假定制,告别陌生与不安。",
    imageOffset: 5,
  },
  {
    id: "shoot",
    eyebrow: "Photography",
    title: "拍摄 · 为你定制的镜头表达",
    intro: "风格沟通、现场调度、精修交付一站式 — 城市街拍、人像写真、Boudoir、艺术合作,每一帧都为你而设。",
    imageOffset: 8,
  },
  {
    id: "video-chat",
    eyebrow: "Video Chat",
    title: "视频聊天 · 1v1 深度对话",
    intro: "灵感交流、生活咨询、创作复盘、品味讨论 — 约定时间,1 对 1 的纯粹对话,有效且不被打扰。",
    imageOffset: 3,
  },
];

export default function Page() {
  const heroBg = pick(0, 10) ?? "/images/placeholder.png";
  return (
    <>
      <PageBgDark />
      <main className="min-h-screen bg-feed-bg font-ui text-feed-ink">
        <ServiceHero bg={heroBg} ctaHref="/membership" />

        {SECTIONS.map((s, idx) => {
          const images = [
            pick(0, s.imageOffset)!,
            pick(1, s.imageOffset)!,
            pick(2, s.imageOffset)!,
            pick(3, s.imageOffset)!,
          ];
          return (
            <div key={s.id} className={idx % 2 === 1 ? "bg-feed-surface/40" : ""}>
              <ServiceSection
                id={s.id}
                eyebrow={s.eyebrow}
                title={s.title}
                intro={s.intro}
                images={images}
                ctaHref="/membership"
              />
            </div>
          );
        })}

        {/* footer 间距 */}
        <div className="h-20" />
      </main>
    </>
  );
}
