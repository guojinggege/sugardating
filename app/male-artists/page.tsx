import PageBgDark from "@/components/Feed/PageBgDark";
import SugarGirlHero from "@/components/SugarGirl/SugarGirlHero";
import SugarGirlGrid from "@/components/SugarGirl/SugarGirlGrid";
import { sugarGirls } from "@/lib/sugarGirlMock";
import { pick } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SugarGirl · Sugardating",
  description: "精选创作者目录 — 国家、城市、兴趣可筛选,按你的节奏发现。",
};

export default function Page() {
  const heroBg = pick(0, 6) ?? "/images/placeholder.png";
  return (
    <>
      <PageBgDark />
      <main className="min-h-screen bg-feed-bg font-ui text-feed-ink">
        <SugarGirlHero bg={heroBg} totalCount={sugarGirls.length} />
        <SugarGirlGrid entries={sugarGirls} />
        <div className="h-20" />
      </main>
    </>
  );
}
