import Link from "next/link";
import { listMembershipPlans, MembershipPeriod, MembershipTier } from "@/lib/queries";
import SubscribeButton from "./SubscribeButton";

export const dynamic = "force-dynamic";

const PERIOD_LABEL: Record<MembershipPeriod, string> = {
  week:    "周",
  month:   "月",
  quarter: "季度",
  year:    "年度",
};

const PERIOD_SUFFIX: Record<MembershipPeriod, string> = {
  week: "/周",
  month: "/月",
  quarter: "/季",
  year: "/年",
};

const TIER_LABEL: Record<MembershipTier, string> = {
  basic:   "基础",
  premium: "高级",
  elite:   "尊享",
};

const TIER_DESC: Record<MembershipTier, string> = {
  basic:   "去广告 + 会员价的入门门槛",
  premium: "提前看新作、原图下载、活动优先",
  elite:   "独家合集 + 无水印批量 + 线下优先",
};

const PERIODS: MembershipPeriod[] = ["week", "month", "quarter", "year"];

// cents → "S$80" 整数显示; 小于 1 元时显示分
function fmt(cents: number): string {
  if (cents % 100 === 0) return `S$${cents / 100}`;
  return `S$${(cents / 100).toFixed(2)}`;
}

export default async function Page({ searchParams }: { searchParams: { period?: string } }) {
  const raw = (searchParams.period ?? "month") as MembershipPeriod;
  const period: MembershipPeriod = PERIODS.includes(raw) ? raw : "month";
  const plans = await listMembershipPlans(period);

  return (
    <div className="container mship">
      <div className="mship-hero">
        <span className="mship-eye"><i />拾光会员</span>
        <h1>选一个适合你的节奏</h1>
        <p>会员服务为内容与体验加成 — 提前看新作、原图下载、独家合集、订阅折扣与活动优先;不接私聊不接特权。</p>
      </div>

      <div className="period-tabs" role="tablist" aria-label="选择周期">
        {PERIODS.map((p) => {
          const on = p === period;
          return (
            <Link
              key={p}
              href={`/membership?period=${p}`}
              role="tab"
              aria-selected={on}
              className={on ? "period-tab on" : "period-tab"}
            >
              {PERIOD_LABEL[p]}
              {p === "year" && <span className="period-tag">最划算</span>}
            </Link>
          );
        })}
      </div>

      <div className="mship-grid">
        {plans.map((p) => {
          const featured = p.tier === "premium";
          return (
            <div key={p.id} className={"mship-card" + (featured ? " featured" : "")}>
              {featured && <div className="mship-card-tag">推荐</div>}
              <div className="mship-card-h">
                <h3>{TIER_LABEL[p.tier]}</h3>
                <p>{TIER_DESC[p.tier]}</p>
              </div>
              <div className="mship-card-price">
                <b>{fmt(p.price)}</b>
                <small>{PERIOD_SUFFIX[p.period]}</small>
              </div>
              {p.savingsPct > 0 && (
                <div className="mship-card-save">较按周续费省 {p.savingsPct}%</div>
              )}
              <ul className="mship-benefits">
                {p.benefits.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <SubscribeButton
                planId={p.id}
                label={featured ? `选 ${TIER_LABEL[p.tier]}` : `开通 ${TIER_LABEL[p.tier]}`}
                className={featured ? "btn btn-ink" : "btn btn-out"}
              />
            </div>
          );
        })}
      </div>

      <p className="mship-note">
        当前为开通流程的占位 — 点击会在 DB 留一条 Membership 记录,真实支付(Stripe)下一步接入。
        现有创作者订阅档位与会员是两套体系,可同时开通。
      </p>
      <div style={{ height: 60 }} />
    </div>
  );
}
