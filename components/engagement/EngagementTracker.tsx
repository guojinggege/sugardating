"use client";
// 挂在 layout · 客户端每 30s 上报 30s (仅 visible + focus)
// SSR 时不启用 · 未登录直接静默
import { useEffect } from "react";

const TICK_SECONDS = 30;

export default function EngagementTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let lastTick = Date.now();
    let alive = true;

    const send = async (seconds: number) => {
      if (seconds <= 0) return;
      try {
        await fetch("/api/engagement/heartbeat", {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ seconds }),
          keepalive: true,
        });
      } catch { /* silent */ }
    };

    const iv = setInterval(() => {
      if (!alive) return;
      if (document.visibilityState !== "visible" || !document.hasFocus()) {
        lastTick = Date.now();
        return;
      }
      const now = Date.now();
      const delta = Math.min(TICK_SECONDS, Math.floor((now - lastTick) / 1000));
      lastTick = now;
      send(delta);
    }, TICK_SECONDS * 1000);

    // Flush on page hide
    const onHide = () => {
      const delta = Math.floor((Date.now() - lastTick) / 1000);
      lastTick = Date.now();
      if (delta > 0 && delta < 120) send(delta);
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") onHide();
    });

    return () => { alive = false; clearInterval(iv); window.removeEventListener("pagehide", onHide); };
  }, []);

  return null;
}
