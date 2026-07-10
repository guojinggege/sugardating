// Sugardating Homepage — 13-section premium narrative
// PC 主入口 (mobile 走 middleware → /m/page.tsx, 相同组件集)
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
  title: "Sugardating | Premium Social Dating · Sugargirl · Sugarboy · Sensual Massage · Events",
  description: "18+ premium social dating platform. Browse verified Sugargirls, Sugarboys and wellness companions. Private in-app chat with 5-language translation, video introductions, Credits-unlockable media and custom event matching for yacht parties, cocktail nights and members' club evenings.",
};

export default function HomePage() {
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
