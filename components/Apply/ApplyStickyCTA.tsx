"use client";
// 页面 Sticky CTA — 滚动 > 500px 出现,点击 scrollTo #apply-form
import { useEffect, useState } from "react";

export default function ApplyStickyCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById("apply-form");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 40;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className={"ap-scta" + (visible ? " on" : "")}>
      <button type="button" onClick={scrollToForm} className="ap-btn-primary">
        申请入驻
      </button>
      <a href="#shoot-support" className="ap-btn-ghost" style={{ background: "#fff", color: "var(--ink)", border: "1px solid var(--line)" }}>
        了解拍摄支持
      </a>
    </div>
  );
}
