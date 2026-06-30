import PageBgDark from "@/components/Feed/PageBgDark";
import VideoHero from "@/components/Video/VideoHero";
import VideoGrid from "@/components/Video/VideoGrid";
import { videos } from "@/lib/videoMock";
import { pick } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "视频专区 · Sugardating",
  description: "Vlog、短篇、教程、旅行 — 来自创作者的镜头记录,按你的兴趣发现。",
};

export default function Page() {
  const heroBg = pick(0, 8) ?? "/images/placeholder.png";
  return (
    <>
      <PageBgDark />
      <main className="min-h-screen bg-feed-bg font-ui text-feed-ink">
        <VideoHero bg={heroBg} />
        <VideoGrid entries={videos} />
        <div className="h-16" />
      </main>
    </>
  );
}
