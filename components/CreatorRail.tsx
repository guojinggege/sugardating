"use client";
import { useEffect, useRef } from "react";
import CreatorCard from "./CreatorCard";
import type { Creator } from "@/lib/types";

// 横向滑廊:鼠标拖拽 + 滚轮转横向滚动,移动距离>6px 时吞掉后续 click
// pointermove 用 rAF 节流避免高频写 scrollLeft 导致掉帧
export default function CreatorRail({ items, photos = [] }: { items: Creator[]; photos?: string[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Wheel -> horizontal
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 2) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });

    // Pointer drag
    let isDown = false;
    let startX = 0;
    let startLeft = 0;
    let moved = 0;
    let pendingX = 0;
    let raf = 0;

    const apply = () => {
      const dx = pendingX - startX;
      moved = Math.abs(dx);
      el.scrollLeft = startLeft - dx;
      raf = 0;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // 触屏交给原生
      isDown = true;
      startX = e.pageX;
      startLeft = el.scrollLeft;
      moved = 0;
      el.classList.add("dragging");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      pendingX = e.pageX;
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };

    const onPointerUp = () => {
      if (!isDown) return;
      isDown = false;
      el.classList.remove("dragging");
    };

    const onClickCapture = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="crail">
      {items.map((c, i) => (
        <CreatorCard
          key={c.slug}
          c={c}
          photoSrc={photos.length > 0 ? photos[i % photos.length] : undefined}
        />
      ))}
    </div>
  );
}
