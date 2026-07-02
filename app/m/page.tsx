// Mobile Home /m — 简洁移动端首页
// Hero + Featured Creators 横滑 + Categories + Footer 提示
import Link from "next/link";
import Image from "next/image";
import { listCreators } from "@/lib/queries";
import { sugarGirls } from "@/lib/sugarGirlMock";
import { pick } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [creators] = await Promise.all([listCreators().catch(() => [])]);
  const featured = sugarGirls.filter((s) => s.featured).slice(0, 8);
  const displayCreators = creators.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[420px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={pick(0, 0) ?? "/images/placeholder.png"}
            alt=""
            fill sizes="100vw" priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        </div>
        <div className="relative h-full flex flex-col justify-end px-5 pb-8 text-white">
          <span className="text-[11px] font-bold uppercase tracking-[.16em] text-white/70 mb-3">Premium Creator Platform</span>
          <h1 className="text-[32px] font-extrabold leading-[1.1] tracking-tight mb-3">
            寻找与你节奏一致的她
          </h1>
          <p className="text-[14px] text-white/85 leading-[1.6] mb-5 max-w-[300px]">
            精选亚裔创作者 · 授权认证 · 高级生活方式社区
          </p>
          <div className="flex gap-2">
            <Link
              href="/m/creators"
              className="flex-1 h-12 rounded-full bg-white text-[var(--ink)] text-[14px] font-bold grid place-items-center"
            >
              开始探索
            </Link>
            <Link
              href="/m/login"
              className="flex-1 h-12 rounded-full bg-white/15 backdrop-blur-md text-white text-[14px] font-semibold grid place-items-center border border-white/25"
            >
              登录
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Sugargirls — horizontal scroll */}
      <section className="mt-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-[16px] font-bold text-[var(--ink)]">精选 Sugargirl</h2>
          <Link href="/m/creators" className="text-[12px] text-[var(--muted)] font-semibold">查看全部</Link>
        </div>
        <div className="flex gap-3 px-5 overflow-x-auto scrollbar-hide pb-2">
          {featured.map((sg) => (
            <Link
              key={sg.id}
              href={`/m/creators/${sg.id}`}
              className="flex-shrink-0 w-[140px]"
            >
              <div className="relative w-[140px] h-[180px] rounded-2xl overflow-hidden bg-[#F3F4F6] shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                <Image src={sg.cover} alt={sg.name} fill sizes="140px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {sg.online && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500/90 text-white text-[9.5px] font-bold rounded-full px-1.5 py-0.5">
                    <span className="w-1 h-1 bg-white rounded-full" />
                    Online
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
                  <div className="text-[13px] font-bold truncate">{sg.name}</div>
                  <div className="text-[10.5px] text-white/85 truncate">{sg.city} · {sg.age}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-8">
        <h2 className="text-[16px] font-bold text-[var(--ink)] px-5 mb-3">探索频道</h2>
        <div className="grid grid-cols-2 gap-3 px-5">
          {[
            { href: "/m/photography", label: "动态推荐", emoji: "✨", bg: "#F7F3EA" },
            { href: "/m/creators",    label: "Sugargirl", emoji: "💫", bg: "#F8F5FF" },
            { href: "/m/community",   label: "互动社区",   emoji: "💬", bg: "#F3F8F6" },
            { href: "/m/membership",  label: "开通会员",   emoji: "👑", bg: "#F8FAFC" },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="h-24 rounded-2xl border border-[var(--line)] p-4 flex flex-col justify-between transition hover:-translate-y-0.5"
              style={{ background: c.bg }}
            >
              <span className="text-[24px] leading-none" aria-hidden>{c.emoji}</span>
              <span className="text-[14px] font-bold text-[var(--ink)]">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently added creators — vertical list */}
      {displayCreators.length > 0 && (
        <section className="mt-8">
          <h2 className="text-[16px] font-bold text-[var(--ink)] px-5 mb-3">最新加入</h2>
          <ul className="flex flex-col gap-1 px-5">
            {displayCreators.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/m/creators/${c.slug}`}
                  className="flex items-center gap-3 py-3 border-b border-[var(--line)]"
                >
                  <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[var(--page)] ring-1 ring-[var(--line)] flex-shrink-0">
                    <Image src={pick(1, c.slug.length) ?? "/images/placeholder.png"} alt={c.name} fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-[var(--ink)] truncate">{c.name}</div>
                    <div className="text-[11.5px] text-[var(--muted)] truncate">{c.region} · {c.category}</div>
                  </div>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[var(--muted)]" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer link — 切回桌面 */}
      <div className="mt-8 px-5 py-6 text-center border-t border-[var(--line)]">
        <Link href="/" className="text-[12.5px] text-[var(--muted)] hover:text-[var(--ink)] transition">
          切换到桌面版 →
        </Link>
      </div>
    </div>
  );
}
