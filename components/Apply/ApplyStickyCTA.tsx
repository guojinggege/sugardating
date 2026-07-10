"use client";
// Sticky CTA — 滚动 > 500px 出现 · 直接跳 /apply/start 分步向导
// (向导内部 handle auth · 未登录会跳 /login?next=/apply/start)
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ApplyStickyCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={"ap-scta" + (visible ? " on" : "")}>
      <Link href="/apply/start" className="ap-btn-primary">申请入驻</Link>
      <a href="#shoot-support" className="ap-btn-ghost" style={{ background: "#fff", color: "var(--ink)", border: "1px solid var(--line)" }}>
        了解拍摄支持
      </a>
    </div>
  );
}
