// Mobile Membership — 单列价格卡片
import Link from "next/link";
import { listMembershipPlans, MembershipTier } from "@/lib/queries";

export const dynamic = "force-dynamic";

const TIER_LABEL: Record<MembershipTier, string> = {
  basic:   "基础",
  premium: "高级",
  elite:   "尊享",
};
const TIER_COLOR: Record<MembershipTier, string> = {
  basic:   "#F1F5F9",
  premium: "#F7F3EA",
  elite:   "#F8F5FF",
};
const TIER_ACCENT: Record<MembershipTier, string> = {
  basic:   "#64748B",
  premium: "#B8A789",
  elite:   "#7C5CFF",
};

export default async function Page() {
  const plans = await listMembershipPlans("month").catch(() => []);

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-5 pt-6 text-center">
        <span className="text-[11px] font-bold uppercase tracking-[.16em] text-[var(--accent)]">Sugardating Membership</span>
        <h1 className="text-[26px] font-extrabold text-[var(--ink)] tracking-tight mt-2 leading-tight">
          解锁高级 Creator 体验
        </h1>
        <p className="text-[13px] text-[var(--muted)] mt-3 leading-[1.6] max-w-[300px] mx-auto">
          VIP 内容 · 无广告 · 优先客服 · 匿名浏览
        </p>
      </div>

      {/* Period toggle (visual only) */}
      <div className="flex gap-1 mx-5 mt-6 p-1 rounded-full bg-[var(--page)] border border-[var(--line)]">
        {["月付", "季付", "年付"].map((p, i) => (
          <button
            key={p}
            type="button"
            className={`flex-1 h-9 rounded-full text-[12.5px] font-bold ${i === 0 ? "bg-white text-[var(--ink)] shadow-sm" : "text-[var(--muted)]"}`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Plans */}
      {plans.length > 0 ? (
        <ul className="flex flex-col gap-4 px-5 mt-6">
          {plans.map((p) => (
            <li
              key={p.id}
              className="relative rounded-2xl p-5 border-2 overflow-hidden"
              style={{
                background: TIER_COLOR[p.tier],
                borderColor: p.bestValue ? TIER_ACCENT[p.tier] : "transparent",
              }}
            >
              {p.bestValue && (
                <span
                  className="absolute top-4 right-4 text-[10.5px] font-bold text-white px-2 py-0.5 rounded-full"
                  style={{ background: TIER_ACCENT[p.tier] }}
                >
                  最推荐
                </span>
              )}
              <div className="text-[12.5px] font-bold uppercase tracking-[.14em]" style={{ color: TIER_ACCENT[p.tier] }}>
                {TIER_LABEL[p.tier]}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[32px] font-extrabold text-[var(--ink)] tabular-nums">
                  ¥{(p.price / 100).toFixed(0)}
                </span>
                <span className="text-[12.5px] text-[var(--muted)]">/月</span>
              </div>
              {p.savingsPct > 0 && (
                <div className="text-[11.5px] text-[#16a34a] font-semibold mt-1">节省 {p.savingsPct}%</div>
              )}
              <ul className="flex flex-col gap-2 mt-4 mb-5">
                {p.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--ink)] leading-[1.5]">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current flex-shrink-0 mt-0.5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ color: TIER_ACCENT[p.tier] }}>
                      <path d="M5 12l4 4 10-10" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="w-full h-11 rounded-full text-white text-[14px] font-bold transition hover:opacity-90"
                style={{ background: TIER_ACCENT[p.tier] }}
              >
                立即开通
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-5 mt-6">
          <div className="rounded-2xl bg-[var(--page)] p-8 text-center border border-[var(--line)]">
            <p className="text-[13px] text-[var(--muted)]">套餐加载中...</p>
          </div>
        </div>
      )}

      {/* FAQ / trust */}
      <div className="px-5 mt-6 text-center">
        <p className="text-[11.5px] text-[var(--muted)] leading-[1.6]">
          支持支付宝 / 微信 / Apple Pay · 随时取消 · 隐私安全
        </p>
      </div>
    </div>
  );
}
