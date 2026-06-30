import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import SectionHeader from "@/components/SectionHeader";
import Img from "@/components/Img";
import Reveal from "@/components/Reveal";
import Stat from "@/components/Stat";
import CreatorRail from "@/components/CreatorRail";
import { Arrow } from "@/components/icons";
import { listCreators } from "@/lib/queries";
import { photos, pick } from "@/lib/images";

export const dynamic = "force-dynamic";

// ─── Why Choose Sugardating ────────────────────────────────────────
const whyChoose: { title: string; desc: string; icon: React.ReactNode }[] = [
  {
    title: "International Community",
    desc: "Members from Europe, North America and Southeast Asia, connecting across time zones and languages.",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
  },
  {
    title: "Verified Real People",
    desc: "Every Sugargirl is identity-checked. No bots, no catfishes — just real people you can trust.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" />
        <path d="M9 12l2.2 2.2L15 10.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Multiple Ways to Connect",
    desc: "Chat, voice, video or in-person — choose the pace and depth that fits your style.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 11.5a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 11.5z" />
      </svg>
    ),
  },
  {
    title: "Privacy First",
    desc: "Encrypted messaging, granular visibility controls and one-tap incognito mode.",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    ),
  },
  {
    title: "Quality Matching",
    desc: "Recommendations tuned by interests, languages, lifestyle and location — not by noise.",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
  },
];

// ─── How It Works ──────────────────────────────────────────────────
const howItWorks = [
  { title: "Create Your Account",  desc: "Sign up free in under a minute. Set your interests and preferences." },
  { title: "Browse Sugargirls",    desc: "Explore verified profiles by country, city and interest." },
  { title: "Start the Conversation", desc: "Send a message, schedule a video chat, or plan a trip together." },
  { title: "Build Real Connections", desc: "Develop genuine relationships at your own pace, on your own terms." },
];

// ─── Popular Experiences ───────────────────────────────────────────
const experiences = [
  { href: "/art-services#dating",     title: "Dating",      desc: "Curated 1-on-1 introductions designed for genuine compatibility." },
  { href: "/art-services#travel",     title: "Travel",      desc: "Explore new cities with a local companion who knows the best spots." },
  { href: "/art-services#shoot",      title: "Photography", desc: "Collaborative shoots — fashion, lifestyle, art and beyond." },
  { href: "/art-services#video-chat", title: "Video Chat",  desc: "Real-time conversations across continents and time zones." },
];

// ─── Why Join Sugardating ──────────────────────────────────────────
const memberBenefits = [
  "Global access to verified Sugargirl profiles",
  "Identity-checked community — no bots, no catfishes",
  "Encrypted, private messaging",
  "Multiple formats — chat, video, travel and in-person",
];
const sugargirlBenefits = [
  "International exposure to premium members",
  "Diverse, high-quality conversations",
  "Full control over your profile and visibility",
  "Build lasting, meaningful connections",
];

// ─── Platform Highlights ───────────────────────────────────────────
const highlights = [
  { eye: "Members",    num: "48,200+", label: "Registered worldwide" },
  { eye: "Sugargirls", num: "1,860+",  label: "Identity-verified profiles" },
  { eye: "Countries",  num: "24",      label: "Across 4 continents" },
  { eye: "Daily",      num: "12,400+", label: "Connections every 24 hours" },
];

export default async function Home() {
  const creators = await listCreators();

  return (
    <>
      <HomeHero photos={photos} />
      <div className="container">

        {/* 1. Why Choose Sugardating */}
        <section className="sec">
          <Reveal>
            <SectionHeader title="Why Choose Sugardating" count="What sets us apart" />
          </Reveal>
          <div className="why">
            {whyChoose.map((w, i) => (
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

        {/* 2. How It Works */}
        <section className="sec">
          <Reveal>
            <SectionHeader title="How It Works" count="Get started in minutes" />
          </Reveal>
          <div className="steps">
            {howItWorks.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="step">
                  <div className="step-n">{String(i + 1).padStart(2, "0")}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 3. Featured Sugargirls */}
        <section className="sec">
          <Reveal>
            <SectionHeader
              title="Featured Sugargirls"
              count="Hand-picked this week"
              moreHref="/male-artists"
              moreText="View all"
            />
          </Reveal>
          <Reveal>
            <CreatorRail items={creators} photos={photos} />
          </Reveal>
        </section>

        {/* 4. Popular Experiences */}
        <section className="sec">
          <Reveal>
            <SectionHeader title="Popular Experiences" count="Ways to connect" />
          </Reveal>
          <div className="ctype">
            {experiences.map((t, i) => (
              <Reveal key={t.title} delay={i * 80}>
                <Link href={t.href} className="ct">
                  <Img src={pick(i, 5)!} alt={t.title} sizes="(max-width: 860px) 50vw, 25vw" />
                  <div className="gr" />
                  <div className="info">
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                    <span className="go">Learn more <Arrow /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 5. Why Join Sugardating */}
        <section className="sec">
          <Reveal>
            <SectionHeader title="Why Join Sugardating" count="For everyone in the community" />
          </Reveal>
          <div className="why-join">
            <Reveal>
              <div className="join-col">
                <div className="join-eye"><i />For Members</div>
                <h3>Discover, connect, explore.</h3>
                <ul>
                  {memberBenefits.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <Link href="/register" className="btn btn-ink join-cta">Join as a Member</Link>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="join-col join-col--gold">
                <div className="join-eye"><i />For Sugargirls</div>
                <h3>Get discovered, on your terms.</h3>
                <ul>
                  {sugargirlBenefits.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <Link href="/register" className="btn btn-ink join-cta">Apply as a Sugargirl</Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 6. Platform Highlights */}
        <section className="sec">
          <Reveal>
            <SectionHeader title="Platform Highlights" count="Trusted by a growing community" />
          </Reveal>
          <Reveal>
            <div className="stats">
              {highlights.map((s) => (
                <div key={s.eye} className="sv">
                  <span className="accent">{s.eye}</span>
                  <b><Stat value={s.num} /></b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* 7. Footer CTA */}
        <section className="sec">
          <Reveal>
            <div className="banner">
              <div className="bn-l">
                <span className="bn-eye"><i />Get Started</span>
                <h2>Start Your Journey Today</h2>
                <p>Join thousands of members building meaningful international connections on Sugardating. Verified profiles, encrypted chat, and a global community waiting to meet you.</p>
                <div className="bn-acts">
                  <Link href="/register" className="btn btn-w">Join Free</Link>
                  <Link href="/male-artists" className="btn btn-g">Explore Sugargirls</Link>
                </div>
              </div>
              <div className="bn-r">
                <Img src={pick(0, 7)!} alt="Sugardating community" sizes="(max-width: 860px) 100vw, 320px" />
              </div>
            </div>
          </Reveal>
        </section>

        <div style={{ height: 80 }} />
      </div>
    </>
  );
}
