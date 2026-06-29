"use client";
import { useEffect } from "react";

// 仅在该页挂载时给 <body> 加 .page-dark,触发 globals.css 里的深色 nav / footer 覆盖
// 卸载时清理 — 离开页面其它路由不会被染深色
export default function PageBgDark() {
  useEffect(() => {
    document.body.classList.add("page-dark");
    return () => document.body.classList.remove("page-dark");
  }, []);
  return null;
}
