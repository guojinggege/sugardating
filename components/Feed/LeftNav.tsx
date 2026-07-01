// Left rail navigation (X/Threads/Instagram style)
// 9 nav items:Discover / Following / Photos / Videos / Nearby / VIP / Messages / Bookmarks / Settings
"use client";
import Link from "next/link";

interface NavItem { k: string; label: string; href: string; icon: React.ReactNode }

const IC = {
  discover:  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M15 9l-3 6-6 3 3-6z" /></svg>,
  following: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  photos:    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5-11 11" /></svg>,
  videos:    <svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></svg>,
  nearby:    <svg viewBox="0 0 24 24"><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>,
  vip:       <svg viewBox="0 0 24 24"><path d="M2 9l4 4 6-8 6 8 4-4v10H2z" /></svg>,
  messages:  <svg viewBox="0 0 24 24"><path d="M21 11.5a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 11.5z" /></svg>,
  bookmarks: <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
  settings:  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9.4a1.7 1.7 0 0 0 1.03-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9.4a1.7 1.7 0 0 0 1.55 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1.03z" /></svg>,
};

const NAV: NavItem[] = [
  { k: "discover",  label: "Discover",  href: "/photography",  icon: IC.discover },
  { k: "following", label: "关注",       href: "#following",     icon: IC.following },
  { k: "photos",    label: "照片",       href: "#photos",        icon: IC.photos },
  { k: "videos",    label: "视频",       href: "/video",         icon: IC.videos },
  { k: "nearby",    label: "附近",       href: "#nearby",        icon: IC.nearby },
  { k: "vip",       label: "VIP",       href: "/membership",    icon: IC.vip },
  { k: "messages",  label: "消息",       href: "#messages",      icon: IC.messages },
  { k: "bookmarks", label: "收藏",       href: "#bookmarks",     icon: IC.bookmarks },
  { k: "settings",  label: "设置",       href: "#settings",      icon: IC.settings },
];

export default function LeftNav() {
  return (
    <nav className="flex flex-col gap-1 p-2" aria-label="Discover navigation">
      {NAV.map((n) => (
        <Link
          key={n.k}
          href={n.href}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-feed-mute hover:text-feed-ink hover:bg-feed-elevated transition-colors"
        >
          <span className="grid place-items-center w-6 h-6 [&_svg]:w-5 [&_svg]:h-5 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.7]">
            {n.icon}
          </span>
          {n.label}
        </Link>
      ))}
    </nav>
  );
}
