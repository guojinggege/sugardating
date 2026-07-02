// Mobile Me / Profile — 未登录 CTA · 已登录 profile menu
"use client";
import Link from "next/link";
import { useAuth } from "@/components/Auth/AuthProvider";

const MENU_ITEMS = [
  { href: "/m/creators",   icon: "💫", label: "浏览 Sugargirl",  meta: "" },
  { href: "/m/photography", icon: "✨", label: "动态推荐",       meta: "" },
  { href: "/m/membership", icon: "👑", label: "开通会员",       meta: "解锁 VIP" },
  { href: "#",              icon: "🎁", label: "我的礼物",       meta: "" },
  { href: "#",              icon: "💬", label: "消息",           meta: "" },
  { href: "#",              icon: "❤️", label: "我的收藏",       meta: "" },
  { href: "#",              icon: "⚙️", label: "设置",           meta: "" },
];

export default function Page() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--page)] grid place-items-center text-[36px] mb-5">👤</div>
        <h1 className="text-[22px] font-extrabold text-[var(--ink)] tracking-tight m-0">登录以继续</h1>
        <p className="text-[13px] text-[var(--muted)] mt-2 max-w-[240px] leading-[1.6]">
          登录后可查看关注列表、礼物记录、订阅内容
        </p>
        <div className="w-full max-w-[280px] mt-6 flex flex-col gap-2">
          <Link
            href="/m/login"
            className="h-12 rounded-full bg-[var(--ink)] text-white text-[14px] font-bold grid place-items-center hover:bg-black transition"
          >
            登录
          </Link>
          <Link
            href="/m/register"
            className="h-12 rounded-full bg-white text-[var(--ink)] border border-[var(--line)] text-[14px] font-semibold grid place-items-center hover:border-[var(--ink)] transition"
          >
            创建账号
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Profile header */}
      <section className="px-5 pt-6 pb-5 flex items-center gap-4 border-b" style={{ borderColor: "var(--line)" }}>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#EC4C86] grid place-items-center text-white text-[24px] font-black flex-shrink-0">
          {user.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[18px] font-extrabold text-[var(--ink)] truncate m-0">{user.name}</h1>
          <div className="text-[12px] text-[var(--muted)] truncate mt-0.5">@{user.id}</div>
          <button
            type="button"
            className="mt-2 text-[11.5px] font-bold text-[var(--accent)] hover:opacity-80"
          >
            编辑资料
          </button>
        </div>
      </section>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 px-5 py-4 border-b text-center" style={{ borderColor: "var(--line)" }}>
        <div>
          <div className="text-[16px] font-bold text-[var(--ink)] tabular-nums">12</div>
          <div className="text-[11px] text-[var(--muted)]">关注</div>
        </div>
        <div>
          <div className="text-[16px] font-bold text-[var(--ink)] tabular-nums">3</div>
          <div className="text-[11px] text-[var(--muted)]">收藏</div>
        </div>
        <div>
          <div className="text-[16px] font-bold text-[var(--ink)] tabular-nums">¥ 0</div>
          <div className="text-[11px] text-[var(--muted)]">余额</div>
        </div>
      </div>

      {/* Menu */}
      <ul className="flex flex-col">
        {MENU_ITEMS.map((it) => (
          <li key={it.label}>
            <Link
              href={it.href}
              className="flex items-center gap-3 px-5 py-3.5 border-b hover:bg-[var(--page)] transition"
              style={{ borderColor: "var(--line)" }}
            >
              <span className="text-[20px]" aria-hidden>{it.icon}</span>
              <span className="flex-1 text-[14px] font-semibold text-[var(--ink)]">{it.label}</span>
              {it.meta && <span className="text-[11px] text-[var(--accent)] font-bold">{it.meta}</span>}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[var(--muted)]" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <div className="px-5 py-6">
        <button
          type="button"
          onClick={logout}
          className="w-full h-12 rounded-full bg-white border border-[var(--line)] text-[14px] font-semibold text-[var(--muted)] hover:text-[var(--live)] hover:border-[var(--live)] transition"
        >
          退出登录
        </button>
      </div>
    </div>
  );
}
