// 首页 FAQ — 用原生 <details>/<summary> 实现 accordion
// 不需要 client 组件,免一份 JS,可访问性好

export interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "What is Sugardating?",
    a: "Sugardating is an international social platform connecting verified Sugargirls from across Asia with members worldwide through meaningful conversations, travel companionship and premium social experiences.",
  },
  {
    q: "How are Sugargirls verified?",
    a: "Every Sugargirl completes an identity verification process. We confirm real photos, government ID and an active phone number before any profile goes live.",
  },
  {
    q: "Is the platform free to join?",
    a: "Yes — creating an account is free. Premium features such as advanced filters, unlimited messages and verified badges require a membership.",
  },
  {
    q: "How does privacy work?",
    a: "Messages are end-to-end encrypted. You control who sees your profile, photos and online status. One-tap incognito mode hides your activity entirely.",
  },
  {
    q: "Can I cancel my membership anytime?",
    a: "Yes. You can cancel in your account settings at any time. Your profile remains active under the free tier afterwards.",
  },
  {
    q: "How do I start a conversation?",
    a: "Browse Sugargirl profiles, review their interests and availability, then send a message. Voice notes and video chat are also supported.",
  },
];

export default function FAQ() {
  return (
    <div className="faq">
      {FAQS.map((f, i) => (
        <details key={f.q} className="faq-item" name="home-faq" open={i === 0}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
