// Mobile Home /m — 与 PC 首页共享同一套 HomeV2 组件 (所有组件已响应式适配)
// middleware 检测 mobile UA 后路由到此;组件内部自动切换 mobile 布局
import type { Metadata } from "next";
import HomeHero from "@/components/HomeV2/HomeHero";
import TrustStrip from "@/components/HomeV2/TrustStrip";
import ChannelMatrix from "@/components/HomeV2/ChannelMatrix";
import HowItWorks from "@/components/HomeV2/HowItWorks";
import FeaturedProfiles from "@/components/HomeV2/FeaturedProfiles";
import EventScenarios from "@/components/HomeV2/EventScenarios";
import ChatShowcase from "@/components/HomeV2/ChatShowcase";
import CreditsSection from "@/components/HomeV2/CreditsSection";
import SafetyGrid from "@/components/HomeV2/SafetyGrid";
import JournalStrip from "@/components/HomeV2/JournalStrip";
import PremiumSection from "@/components/HomeV2/PremiumSection";
import HomeFAQ from "@/components/HomeV2/HomeFAQ";
import FinalCTA from "@/components/HomeV2/FinalCTA";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sugardating | Premium Social Dating",
  description: "18+ premium social dating. Verified Sugargirls, Sugarboys, wellness companions. Private chat, video, Credits and custom events.",
};

export default function MobileHomePage() {
  return (
    <div className="hv-root">
      <HomeHero />
      <TrustStrip />
      <ChannelMatrix />
      <HowItWorks />
      <FeaturedProfiles />
      <EventScenarios />
      <ChatShowcase />
      <CreditsSection />
      <SafetyGrid />
      <JournalStrip />
      <PremiumSection />
      <HomeFAQ />
      <FinalCTA />
      <style>{`
        .hv-root{background:#F4F4F5;overflow-x:hidden}
        .hv-root section{overflow:hidden}
      `}</style>
    </div>
  );
}
