// /sugarboy — 频道首页 (结构复用 SugarGirlGrid,basePath 指向 /sugarboy)
import type { Metadata } from "next";
import PageBgDark from "@/components/Feed/PageBgDark";
import SugarBoyHero from "@/components/SugarBoy/SugarBoyHero";
import SugarGirlGrid from "@/components/SugarGirl/SugarGirlGrid";
import { sugarBoys } from "@/lib/sugarBoyMock";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sugarboy | Sugardating 高端男性陪伴频道",
  description: "浏览已认证的 Sugarboys — 按城市、语言、在线状态、视频资料与服务类型筛选。开启私密聊天、视频沟通、预约陪伴与高端活动定制体验。",
};

export default function SugarboyDirectoryPage() {
  // 用第一个 sugarboy 的封面作 hero 背景 (男性图,不用女性图)
  const heroBg = sugarBoys[0]?.cover ?? "/sugarboy/profile_photo.avif";
  return (
    <>
      <PageBgDark />
      <main className="min-h-screen bg-feed-bg font-ui text-feed-ink">
        <SugarBoyHero bg={heroBg} />
        <SugarGirlGrid entries={sugarBoys} basePath="/sugarboy" />
        <div className="h-20" />
      </main>
    </>
  );
}
