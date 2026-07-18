"use client";
// Mobile 浮动发布按钮 · 点击展开 story / question 两个选项
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CommunityFab() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {open && <div className="fab-veil" onClick={() => setOpen(false)} />}
      <div className={"fab-wrap" + (open ? " is-open" : "")}>
        {open && (
          <div className="fab-menu">
            <Link href="/community/compose/story" className="fab-item fab-item--story" onClick={() => setOpen(false)}>
              <span aria-hidden>❦</span>
              <div>
                <b>讲一个故事</b>
                <em>分享经历、心事、观察</em>
              </div>
            </Link>
            <Link href="/community/compose/question" className="fab-item fab-item--qa" onClick={() => setOpen(false)}>
              <span aria-hidden>?</span>
              <div>
                <b>提一个问题</b>
                <em>向社区寻求建议与回答</em>
              </div>
            </Link>
          </div>
        )}
        <button
          type="button"
          aria-label={open ? "关闭" : "发布"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="fab-btn"
        >
          <span className={"fab-ic" + (open ? " is-x" : "")}>+</span>
        </button>
      </div>

      <style>{`
        .fab-veil{position:fixed;inset:0;background:rgba(23,21,18,.24);z-index:38;animation:fabFade .12s ease}
        .fab-wrap{position:fixed;right:20px;bottom:calc(24px + env(safe-area-inset-bottom));z-index:40;display:flex;flex-direction:column;align-items:flex-end;gap:12px}
        .fab-menu{display:flex;flex-direction:column;gap:8px;animation:fabRise .18s ease}
        .fab-item{display:flex;align-items:center;gap:12px;padding:14px 18px 14px 14px;background:#fff;border:1px solid #E9E3DA;border-radius:16px;text-decoration:none;box-shadow:0 20px 36px -18px rgba(23,21,18,.28);min-width:240px}
        .fab-item span{width:38px;height:38px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;flex-shrink:0}
        .fab-item--story span{background:linear-gradient(135deg,#EDD5D8,#C4949B);color:#5b2f36}
        .fab-item--qa span{background:linear-gradient(135deg,#D6DEEB,#8C9EBF);color:#2B3B57}
        .fab-item b{display:block;font-size:14px;color:#171512;font-weight:700;letter-spacing:-0.005em}
        .fab-item em{display:block;font-size:12px;color:#77716A;font-style:normal;margin-top:2px}
        .fab-btn{width:60px;height:60px;border-radius:50%;background:#171512;color:#F5EEDD;border:0;font-size:26px;font-weight:400;cursor:pointer;box-shadow:0 20px 36px -14px rgba(23,21,18,.44);display:flex;align-items:center;justify-content:center}
        .fab-btn:active{transform:scale(.95)}
        .fab-ic{display:inline-block;transition:transform .2s}
        .fab-ic.is-x{transform:rotate(45deg)}
        @keyframes fabRise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fabFade{from{opacity:0}to{opacity:1}}
        @media (min-width:1025px){.fab-wrap,.fab-veil{display:none}}
      `}</style>
    </>
  );
}
