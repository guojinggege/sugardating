"use client";
// FilterDropdown — 通用 label-on-top 大尺寸下拉
// 高度 68px / radius 18px / 白色卡 / 黑字 / 顶部 label,下拉箭头 + 展开动画
// children 是渲染函数:接收 close() 让 popover 内 item 点击后能关掉
import { useEffect, useRef, useState } from "react";

interface Props {
  label: string;
  /** 已选显示值 (空时显示 placeholder) */
  display: string;
  placeholder?: string;
  /** 当前是否处于非默认状态(影响 trigger 视觉) */
  active?: boolean;
  /** Popover 对齐方向 */
  align?: "left" | "right" | "stretch";
  /** Popover 最大宽度 (px),默认根据 align 决定 */
  panelClassName?: string;
  children: (close: () => void) => React.ReactNode;
}

export default function FilterDropdown({
  label, display, placeholder, active = false,
  align = "left", panelClassName = "", children,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const panelPos =
    align === "right" ? "right-0" :
    align === "stretch" ? "left-0 right-0" :
    "left-0";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-[68px] w-full items-center justify-between gap-3 rounded-[18px] border bg-white px-5 text-left transition focus:outline-none focus:ring-2 focus:ring-gold/30 ${
          open
            ? "border-gold/70 shadow-[0_8px_30px_-12px_rgba(184,167,137,0.45)]"
            : active
            ? "border-gold/50 hover:border-gold"
            : "border-white/10 hover:border-gold/40 hover:shadow-[0_6px_24px_-12px_rgba(0,0,0,0.35)]"
        }`}
      >
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-zinc-500">{label}</span>
          <span className={`truncate text-[15px] font-semibold leading-tight ${
            display ? "text-zinc-900" : "text-zinc-400"
          }`}>
            {display || placeholder || "—"}
          </span>
        </span>
        <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 fill-none stroke-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} strokeWidth={2.2}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          className={`absolute z-50 mt-2 min-w-[260px] rounded-[18px] border border-zinc-200 bg-white p-2 shadow-2xl ${panelPos} ${panelClassName}`}
          style={{ animation: "fd-in 0.18s ease-out" }}
          role="listbox"
        >
          {children(() => setOpen(false))}
        </div>
      )}
      <style jsx>{`
        @keyframes fd-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

/** Popover 内通用 item */
export function FilterOption({
  active, onSelect, children,
}: {
  active: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      role="option"
      aria-selected={active}
      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium transition ${
        active
          ? "bg-zinc-900 text-white"
          : "text-zinc-800 hover:bg-zinc-100"
      }`}
    >
      <span className="truncate">{children}</span>
      {active && (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current" strokeWidth={2.4}>
          <path d="M5 12l4 4 10-10" />
        </svg>
      )}
    </button>
  );
}

/** Popover 内分节标题 */
export function FilterSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
      {children}
    </div>
  );
}
