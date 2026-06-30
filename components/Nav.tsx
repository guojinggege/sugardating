"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { channels } from "@/lib/mock";
import { Spark } from "./icons";
import type { Channel } from "@/lib/types";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Nav() {
  const pathname = usePathname();
  const tCh = useTranslations("nav.channels");
  const tAS = useTranslations("nav.artServicesChildren");
  const tA = useTranslations("nav.actions");
  const tM = useTranslations("nav.mobile");

  const [open, setOpen] = useState(false);
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);

  // 当前激活的频道:基于路径前缀(/photography → photography)
  const activeSlug = pathname.split("/")[1] || "";

  return (
    <header className="nav">
      <div className="nav-in">
        <Link href="/" className="brand">
          <span className="gm"><Spark /></span>
          <span className="brand-name">Sugardating</span>
        </Link>
        <nav className="navlinks">
          {channels.map((c) => {
            const isActive = c.slug === activeSlug;
            const label = tCh(c.slug);
            if (c.children?.length) {
              return (
                <NavDropdownItem
                  key={c.slug}
                  channel={c}
                  label={label}
                  childLabel={(slug) => tAS(slug)}
                  active={isActive}
                />
              );
            }
            return (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className={"nav-link" + (isActive ? " on" : "")}
              >
                {c.flag === "live" && <span className="dl" />}
                {c.flag === "ai" && <span className="ai-tag">AI</span>}
                <span className="nav-text">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="navright">
          <Link href="/membership" className="nav-btn nav-btn-out nav-btn-mship">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2l2.4 6.5L21 11l-6.6 2.5L12 20l-2.4-6.5L3 11l6.6-2.5z" />
            </svg>
            {tA("membership")}
          </Link>
          <Link href="/login" className="nav-btn nav-btn-out">{tA("login")}</Link>
          <Link href="/register" className="nav-btn nav-btn-ink">{tA("register")}</Link>
          <LanguageSwitcher />
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
        <Link href="/register" onClick={() => setOpen(false)}>{tA("register")}</Link>
        <div className="mm-lang"><LanguageSwitcher /></div>
      </div>
    </header>
  );
}

function NavDropdownItem({
  channel,
  label,
  childLabel,
  active,
}: {
  channel: Channel;
  label: string;
  childLabel: (slug: string) => string;
  active: boolean;
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
        className={"nav-link nav-dd-trigger" + (open ? " open" : "") + (active ? " on" : "")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="nav-text">{label}</span>
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
