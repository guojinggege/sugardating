"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { channels } from "@/lib/mock";
import { Pin, Chev, Spark } from "./icons";
import type { Channel } from "@/lib/types";
import type { RegionGroup } from "@/lib/queries";
import LanguageSwitcher from "./LanguageSwitcher";

interface Props {
  regionGroups: RegionGroup[];
}

export default function Nav({ regionGroups }: Props) {
  const tNav = useTranslations("nav");
  const tCh = useTranslations("nav.channels");
  const tAS = useTranslations("nav.artServicesChildren");
  const tGroups = useTranslations("nav.loc.groups");
  const tA = useTranslations("nav.actions");
  const tM = useTranslations("nav.mobile");

  const [open, setOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);
  const locRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const sp = useSearchParams();
  const currentRegion = sp.get("region");
  const locLabel = currentRegion ?? tNav("loc.allRegions");

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
                  {tNav("loc.allRegions")}
                </button>
              </div>
              {regionGroups.map((g) => (
                <div key={g.key} className="loc-grp">
                  <div className="loc-grp-h">{tGroups(g.key)}</div>
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

        <Link href="/" className="brand"><span className="gm"><Spark /></span>Sugardating</Link>
        <nav className="navlinks">
          {channels.map((c) => (
            c.children?.length ? (
              <NavDropdownItem
                key={c.slug}
                channel={c}
                label={tCh(c.slug)}
                childLabel={(slug) => tAS(slug)}
              />
            ) : (
              <Link key={c.slug} href={`/${c.slug}`}>
                {c.flag === "live" && <span className="dl" />}
                {c.flag === "ai" && <span className="ai-tag">AI</span>}
                {tCh(c.slug)}
              </Link>
            )
          ))}
        </nav>
        <div className="navright">
          <LanguageSwitcher />
          <button className="ic" aria-label={tA("search")}>
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
          </button>
          <Link href="/membership" className="btn btn-out btn-mship">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ marginRight: 4 }}>
              <path d="M12 2l2.4 6.5L21 11l-6.6 2.5L12 20l-2.4-6.5L3 11l6.6-2.5z" />
            </svg>
            {tA("membership")}
          </Link>
          <Link href="/login" className="btn btn-out">{tA("login")}</Link>
          <Link href="/register" className="btn btn-ink">{tA("register")}</Link>
          <button className="hamburger" aria-label={tA("menu")} onClick={() => setOpen((v) => !v)}>
            <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </div>
      <div className={open ? "mobile-menu open" : "mobile-menu"}>
        {channels.map((c) => (
          c.children?.length ? (
            <div key={c.slug} className="mm-group">
              <button
                type="button"
                className="mm-group-h"
                aria-expanded={expandedChannel === c.slug}
                onClick={() => setExpandedChannel((cur) => cur === c.slug ? null : c.slug)}
              >
                {tCh(c.slug)}
                <svg viewBox="0 0 24 24" className={"mm-chev" + (expandedChannel === c.slug ? " open" : "")} aria-hidden>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {expandedChannel === c.slug && (
                <div className="mm-children">
                  <Link href={`/${c.slug}`} onClick={() => setOpen(false)}>
                    {tM("allOf", { label: tCh(c.slug) })}
                  </Link>
                  {c.children.map((cc) => (
                    <Link
                      key={cc.slug}
                      href={`/${c.slug}#${cc.slug}`}
                      onClick={() => setOpen(false)}
                    >
                      {tAS(cc.slug)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link key={c.slug} href={`/${c.slug}`} onClick={() => setOpen(false)}>{tCh(c.slug)}</Link>
          )
        ))}
        <Link href="/membership" onClick={() => setOpen(false)}>{tA("membership")}</Link>
        <Link href="/login" onClick={() => setOpen(false)}>{tA("login")}</Link>
        <div className="mm-lang"><LanguageSwitcher /></div>
      </div>
    </header>
  );
}

function NavDropdownItem({
  channel,
  label,
  childLabel,
}: {
  channel: Channel;
  label: string;
  childLabel: (slug: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const onEnter = () => {
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null; }
    setOpen(true);
  };
  const onLeave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };
  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  return (
    <div
      className="nav-dd"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onLeave();
      }}
    >
      <Link
        href={`/${channel.slug}`}
        className={"nav-dd-trigger" + (open ? " open" : "")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
        <svg viewBox="0 0 24 24" className="nav-dd-chev" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Link>
      {open && channel.children && (
        <div className="nav-dd-pop" role="menu">
          {channel.children.map((cc) => (
            <Link
              key={cc.slug}
              role="menuitem"
              href={`/${channel.slug}#${cc.slug}`}
              onClick={() => setOpen(false)}
            >
              {childLabel(cc.slug)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
