"use client";
import { useEffect, useRef, useState } from "react";

// 接收形如 "2,840+" / "8" / "订阅制" 的字符串
// 能解析出前导数字的从 0 滚到目标,其余作为静态文本
export default function Stat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState<string>(value);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const match = value.match(/^([\d,]+)(.*)$/);
    if (!match) return; // 纯文本,不动画
    const target = parseInt(match[1].replace(/,/g, ""), 10);
    const suffix = match[2];
    if (Number.isNaN(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let cancelled = false;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.disconnect();
          const duration = 1400;
          const start = performance.now();
          const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
          setDisplay("0" + suffix);
          const tick = (now: number) => {
            if (cancelled) return;
            const t = Math.min(1, (now - start) / duration);
            const v = Math.round(target * easeOut(t));
            setDisplay(v.toLocaleString("en-US") + suffix);
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          break;
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
