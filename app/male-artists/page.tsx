import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PageBgDark from "@/components/Feed/PageBgDark";
import SugarGirlHero from "@/components/SugarGirl/SugarGirlHero";
import SugarGirlGrid from "@/components/SugarGirl/SugarGirlGrid";
import { sugarGirls } from "@/lib/sugarGirlMock";
import { pick } from "@/lib/images";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("sugarGirl.meta");
  return { title: t("title"), description: t("description") };
}

export default function Page() {
  const heroBg = pick(0, 6) ?? "/images/placeholder.png";
  return (
    <>
      <PageBgDark />
      <main className="min-h-screen bg-feed-bg font-ui text-feed-ink">
        <SugarGirlHero bg={heroBg} />
        <SugarGirlGrid entries={sugarGirls} />
        <div className="h-20" />
      </main>
    </>
  );
}
