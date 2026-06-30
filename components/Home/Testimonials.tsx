// 首页用户评价 — 横向滚动,scroll-snap
// 内容是占位文案,后续接真实用户评价时换 prop 即可

export interface TestimonialItem {
  name: string;
  location: string;
  quote: string;
  rating: number;        // 1-5
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "James",
    location: "London, UK",
    quote: "Sugardating helped me meet thoughtful, verified people I'd never have found otherwise. The video chat made the first conversation feel genuine.",
    rating: 5,
  },
  {
    name: "Sofia",
    location: "Singapore",
    quote: "What I appreciate most is the privacy controls and verification process. I feel safe and in control of who sees my profile.",
    rating: 5,
  },
  {
    name: "Daniel",
    location: "Berlin, DE",
    quote: "Planned a trip to Bangkok through the travel feature — elegant from start to finish.",
    rating: 5,
  },
  {
    name: "Yuna",
    location: "Tokyo, JP",
    quote: "I joined as a Sugargirl six months ago and built meaningful connections with members across three continents.",
    rating: 5,
  },
  {
    name: "Marcus",
    location: "New York, US",
    quote: "Premium quality from day one. The community is the best I've experienced.",
    rating: 5,
  },
  {
    name: "Eva",
    location: "Paris, FR",
    quote: "Conversations feel intentional, not transactional. That's rare on platforms like this.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <div className="testi-rail">
      {TESTIMONIALS.map((t) => (
        <Card key={t.name + t.location} t={t} />
      ))}
    </div>
  );
}

function Card({ t }: { t: TestimonialItem }) {
  return (
    <article className="testi-card">
      <div className="testi-stars" aria-label={`${t.rating}/5`}>
        {"★".repeat(t.rating)}
      </div>
      <p className="testi-quote">&ldquo;{t.quote}&rdquo;</p>
      <div className="testi-meta">
        <div className="testi-avatar" aria-hidden>{t.name.charAt(0)}</div>
        <div>
          <div className="testi-name">{t.name}</div>
          <div className="testi-loc">{t.location}</div>
        </div>
      </div>
    </article>
  );
}
