"use client";
// Mobile bottom sticky CTA
import { useEffect, useState } from "react";

export default function StickyCustomServiceCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      const y = window.scrollY;
      const hero = 400;
      const beforeFooter = document.documentElement.scrollHeight - window.innerHeight - 400;
      setVisible(y > hero && y < beforeFooter);
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className={"cs-sticky" + (visible ? " is-visible" : "")}>
      <a href="#request" className="cs-sticky-btn">提交定制需求 →</a>
      <style jsx>{`
        .cs-sticky{position:fixed;left:12px;right:12px;bottom:calc(72px + env(safe-area-inset-bottom,0px));z-index:80;opacity:0;transform:translateY(20px);pointer-events:none;transition:opacity .24s,transform .24s;display:none}
        .cs-sticky.is-visible{opacity:1;transform:translateY(0);pointer-events:auto}
        .cs-sticky-btn{display:flex;align-items:center;justify-content:center;padding:14px 18px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;border-radius:14px;font-weight:800;font-size:14px;text-decoration:none;box-shadow:0 12px 32px -12px rgba(0,0,0,.45)}
        @media (max-width:900px){.cs-sticky{display:block}}
      `}</style>
    </div>
  );
}
