"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { channels } from "@/lib/mock";
import { Pin, Chev, Spark } from "./icons";
import type { RegionGroup } from "@/lib/queries";

interface Props {
  regionGroups: RegionGroup[];
}

export default function Nav({ regionGroups }: Props) {
  const [open, setOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const locRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const sp = useSearchParams();
  const currentRegion = sp.get("region");
  const locLabel = currentRegion ?? "全部地区";

  // 点击外部 / Esc 关下拉
  useEffect(() => {
    if (!locOpen) return;
    const onDown = (e: MouseEvent) => {
      if (locRef.current && !locRef.current.contains(e.target as Node)) setLocOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLocOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [locOpen]);

  // 选城市:更新 ?region= 并跳到 /creators(无论从哪个页面点)
  const selectRegion = (city: string | null) => {
    setLocOpen(false);
    const params = new URLSearchParams();
    if (city) params.set("region", city);
    const qs = params.toString();
    router.push(`/creators${qs ? `?${qs}` : ""}`);
  };

  return (
    <header className="nav">
      <div className="nav-in">
        <div className="loc-wrap" ref={locRef}>
          <button
            className="loc"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={locOpen}
            onClick={() => setLocOpen((v) => !v)}
          >
            <Pin />{locLabel}<Chev />
          </button>
          {locOpen && (
            <div className="loc-pop" role="listbox">
              <div className="loc-all">
                <button
                  type="button"
                  className={!currentRegion ? "on" : ""}
                  onClick={() => selectRegion(null)}
                >
                  全部地区
                </button>
              </div>
              {regionGroups.map((g) => (
                <div key={g.key} className="loc-grp">
                  <div className="loc-grp-h">{g.label}</div>
                  {g.cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      role="option"
                      aria-selected={currentRegion === city}
                      className={currentRegion === city ? "on" : ""}
                      onClick={() => selectRegion(city)}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

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
