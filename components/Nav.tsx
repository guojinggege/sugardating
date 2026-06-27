"use client";
import Link from "next/link";
import { useState } from "react";
import { channels } from "@/lib/mock";
import { Pin, Chev, Spark } from "./icons";

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <div className="nav-in">
        <button className="loc"><Pin />香港<Chev /></button>
        <Link href="/" className="brand"><span className="gm"><Spark /></span>拾光</Link>
        <nav className="navlinks">
          {channels.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`}>
              {c.flag === "live" && <span className="dl" />}
              {c.flag === "ai" && <span className="ai-tag">AI</span>}
              {c.label}
            </Link>
          ))}
        </nav>
        <div className="navright">
          <button className="ic" aria-label="搜索"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg></button>
          <Link href="/login" className="btn btn-out">登录</Link>
          <Link href="/register" className="btn btn-ink">成为创作者</Link>
          <button className="hamburger" aria-label="菜单" onClick={() => setOpen((v) => !v)}>
            <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </div>
      <div className={open ? "mobile-menu open" : "mobile-menu"}>
        {channels.map((c) => (<Link key={c.slug} href={`/${c.slug}`} onClick={() => setOpen(false)}>{c.label}</Link>))}
        <Link href="/login" onClick={() => setOpen(false)}>登录</Link>
      </div>
    </header>
  );
}
