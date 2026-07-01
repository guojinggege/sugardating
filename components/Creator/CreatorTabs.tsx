"use client";
// 6 tabs: 动态 / 视频 / 相册 / 服务 / 评价 / 关于 Ta
// 点击 → scroll 到对应 section;IntersectionObserver 自动高亮当前 section 对应 tab
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const TABS = [
  { id: "feed",     key: "feed" },
  { id: "gallery",  key: "photos" },
  { id: "videos",   key: "videos" },
  { id: "services", key: "services" },
  { id: "gifts",    key: "gifts" },
  { id: "reviews",  key: "reviews" },
  { id: "about",    key: "about" },
] as const;

export default function CreatorTabs() {
  const t = useTranslations("creatorProfile.tabs");
  const [active, setActive] = useState<string>("feed");

  useEffect(() => {
    const sections = TABS
      .map((tab) => document.getElementById(tab.id))
      .filter((el): el is HTMLElement => !!el);

    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // 选当前最靠近顶部的 section (距 viewport top 最小,且 >= 0 优先)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: [0, 0.3, 0.6, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const click = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: "smooth" });
    setActive(id);
  };

  return (
    <nav className="cr-tabs" aria-label={t("ariaLabel")}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => click(tab.id)}
          className={"cr-tab" + (active === tab.id ? " on" : "")}
          aria-current={active === tab.id ? "page" : undefined}
        >
          {t(tab.key)}
        </button>
      ))}
    </nav>
  );
}
