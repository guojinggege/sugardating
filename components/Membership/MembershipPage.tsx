"use client";
// Sugardating 会员页 · 3 级递进 · Basic / Paid (4 计划) / Verified
// 购买 / 充值 → 弹出「选择付款方式」纯展示弹窗 · 不创建订单 · 不调支付 API
import { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/Auth/AuthProvider";
import {
  MEMBERSHIP_PLANS, CREDIT_PACKAGES, COMPARISON_GROUPS, CREDIT_USAGE_GUIDE,
  BASIC_TIER, VERIFIED_TIER, DEFAULT_PLAN_ID, PAID_CREDIT_BONUS_PCT,
  PERIOD_SUFFIX, getPlanById,
  type MembershipPlan, type CreditPackage, type DisplayMembershipLevel,
  computeDisplayLevel,
} from "@/lib/membership-plans";
import PaymentMethodDisplayModal from "@/components/payments/PaymentMethodDisplayModal";

interface MembershipInfo {
  tier: "basic" | "paid";
  verificationStatus: "unverified" | "pending" | "verified";
  currentPlanId?: string;
  hasUsedIntro?: boolean;
  expiresAt?: string;
}

export default function MembershipPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(DEFAULT_PLAN_ID);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [membership, setMembership] = useState<MembershipInfo | null>(null);

  // 拉当前会员状态 · 影响首充体验是否可选 + 认证会员 CTA 状态
  useEffect(() => {
    if (!user) { setMembership(null); return; }
    let alive = true;
    fetch("/api/membership/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive || !d?.ok) return;
        const m = d.membership;
        setMembership({
          tier: m.tier === "paid" ? "paid" : "basic",
          verificationStatus: m.verificationStatus ?? "unverified",
          currentPlanId: m.currentPlanId,
          hasUsedIntro: !!m.hasUsedIntro,
          expiresAt: m.expiresAt,
        });
      })
      .catch(() => { /* silent */ });
    return () => { alive = false; };
  }, [user]);

  const displayLevel: DisplayMembershipLevel = user && membership
    ? computeDisplayLevel(membership.tier, membership.verificationStatus)
    : "basic";

  const selectedPlan = getPlanById(selectedPlanId) ?? MEMBERSHIP_PLANS[2];
  const canBuyIntro = !membership?.hasUsedIntro;

  // 若当前用户已用过 intro 且默认选中的是 intro → 切到季度
  useEffect(() => {
    if (!canBuyIntro && selectedPlanId === "paid_intro_7d") {
      setSelectedPlanId(DEFAULT_PLAN_ID);
    }
  }, [canBuyIntro, selectedPlanId]);

  // 「选择付款方式」纯展示弹窗 · 不创建订单
  const [payDisplay, setPayDisplay] = useState<{ open: boolean; productLine?: string; amountLine?: string }>({ open: false });

  function subscribe(plan: MembershipPlan) {
    if (!user) { router.push("/login?next=/membership"); return; }
    if (plan.isIntro && !canBuyIntro) {
      setToast({ tone: "err", text: "首充体验仅限每个账号购买一次" });
      setTimeout(() => setToast(null), 2600);
      return;
    }
    setPayDisplay({
      open: true,
      productLine: plan.displayName,
      amountLine: `${plan.currency}${plan.price.toFixed(2)} ${PERIOD_SUFFIX[plan.period]}`,
    });
  }

  function topup(pkg: CreditPackage) {
    if (!user) { router.push("/login?next=/membership"); return; }
    setPayDisplay({
      open: true,
      productLine: `${pkg.credits.toLocaleString("en-US")} Credits`,
      amountLine: `${pkg.currency} ${pkg.price}`,
    });
  }

  function handleVerifyClick() {
    if (!user) { router.push("/login?next=/membership"); return; }
    if (membership?.tier !== "paid" && membership?.verificationStatus !== "verified") {
      setToast({ tone: "err", text: "请先开通付费会员,再完成身份认证升级为认证会员。" });
      setTimeout(() => setToast(null), 3600);
      return;
    }
    if (membership?.tier !== "paid" && membership?.verificationStatus === "verified") {
      setToast({ tone: "err", text: "你的身份认证已完成。开通付费会员后即可升级为认证会员。" });
      setTimeout(() => setToast(null), 3600);
      return;
    }
    // 已付费 + 未认证 → 进入账号安全 · Demo 环境允许一键 mock
    router.push("/me?section=security#verify");
  }

  async function demoVerify() {
    if (!user) return;
    setProcessing(true);
    try {
      const r = await fetch("/api/membership/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "verified" }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.message || "认证失败");
      setMembership((prev) => prev ? { ...prev, verificationStatus: "verified" } : prev);
      setToast({ tone: "ok", text: "身份认证已完成 (Demo)" });
    } catch (e) {
      setToast({ tone: "err", text: e instanceof Error ? e.message : "认证失败" });
    } finally {
      setProcessing(false);
      setTimeout(() => setToast(null), 2600);
    }
  }

  // 付费卡片内可选的 4 个价格
  const paidPlans = useMemo(() =>
    MEMBERSHIP_PLANS.filter((p) => !p.isIntro || canBuyIntro),
  [canBuyIntro]);

  return (
    <div className="mp">
      {/* ═══ Hero ═══ */}
      <section className="mp-hero">
        <div className="mp-hero-in">
          <div className="mp-hero-eyebrow">
            <span className="mp-hero-18">18+</span>
            Membership · Basic / Paid / Verified
          </div>
          <h1 className="mp-hero-h1">
            解锁更自由的<em>私密聊天</em>
          </h1>
          <p className="mp-hero-lead">
            升级付费会员,解除与平台服务者的聊天次数和人数限制,
            使用多语言翻译、已读状态、匿名浏览与更高效的筛选工具。
            通过身份认证升级为认证会员,获得平台信任标识。
          </p>
          <div className="mp-hero-badges">
            <span>🔞 18+ Only</span>
            <span>💬 Private Chat</span>
            <span>🪪 Verified Profiles</span>
            <span>🪙 Credits Compatible</span>
          </div>
          <div className="mp-hero-cta">
            <a href="#plans" className="mp-btn mp-btn--gold">开通付费会员</a>
            <a href="#credits" className="mp-btn mp-btn--ghost">了解 Credits</a>
          </div>
        </div>
      </section>

      {/* ═══ Tier cards (3 递进) ═══ */}
      <section id="plans" className="mp-plans">
        <div className="mp-shell">
          <div className="mp-plans-head">
            <div className="mp-eyebrow">Membership · Basic / Paid / Verified</div>
            <h2>三级递进 · 从<em>浏览</em>到<em>认证</em></h2>
            <p>付费会员在基础会员之上解除聊天限制;认证会员在付费之上叠加平台身份认证。</p>
          </div>

          <div className="mp-cards">
            {/* Basic */}
            <BasicCard displayLevel={displayLevel} loggedIn={!!user} />

            {/* Paid */}
            <PaidCard
              plans={paidPlans}
              selectedPlanId={selectedPlanId}
              onSelectPlan={setSelectedPlanId}
              selectedPlan={selectedPlan}
              currentPlanId={membership?.currentPlanId}
              displayLevel={displayLevel}
              onSubscribe={subscribe}
              canBuyIntro={canBuyIntro}
            />

            {/* Verified */}
            <VerifiedCard
              displayLevel={displayLevel}
              onVerifyClick={handleVerifyClick}
              onDemoVerify={demoVerify}
              membershipTier={membership?.tier}
              verificationStatus={membership?.verificationStatus}
              processing={processing}
            />
          </div>
        </div>
      </section>

      {/* ═══ Comparison table ═══ */}
      <section className="mp-compare">
        <div className="mp-shell">
          <div className="mp-compare-head">
            <div className="mp-eyebrow">Compare · 基础 / 付费 / 认证</div>
            <h2>完整权益对比</h2>
          </div>
          <div className="mp-compare-wrap">
            <table className="mp-compare-tab">
              <thead>
                <tr>
                  <th />
                  <th className="mp-th-basic">基础会员</th>
                  <th className="mp-th-paid">付费会员</th>
                  <th className="mp-th-verified">认证会员</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_GROUPS.map((group) => (
                  <Fragment key={group.title}>
                    <tr className="mp-tr-group">
                      <td colSpan={4}>{group.title}</td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.label}>
                        <td className="mp-td-label">{row.label}</td>
                        <td>{cellRender(row.basic)}</td>
                        <td className="mp-td-paid">{cellRender(row.paid)}</td>
                        <td className="mp-td-verified">{cellRender(row.verified)}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ Credits top-up (保留 · 付费会员点充权益) ═══ */}
      <section id="credits" className="mp-credits">
        <div className="mp-shell">
          <div className="mp-credits-head">
            <div className="mp-eyebrow">Credits · 内容解锁与表达兴趣</div>
            <h2>Credits 用于<em>内容解锁与礼物</em></h2>
            <p>
              会员负责聊天效率,Credits 用于解锁私密照片、视频、礼物、
              优先互动与视频确认。付费会员每笔充值 +{PAID_CREDIT_BONUS_PCT}% 付费会员点充权益。
            </p>
          </div>
          <div className="mp-credits-grid">
            {CREDIT_PACKAGES.map((pkg) => (
              <CreditCard key={pkg.id} pkg={pkg} onBuy={topup} />
            ))}
          </div>
          <div className="mp-credits-guide">
            <div className="mp-credits-guide-h">Credits 消费参考</div>
            <div className="mp-credits-guide-grid">
              {CREDIT_USAGE_GUIDE.map((g) => (
                <div key={g.label}>
                  <b>{g.range}</b>
                  <span>{g.label}</span>
                </div>
              ))}
            </div>
            <p className="mp-credits-fine">
              以上为参考区间,实际消费由具体内容与 creator 设置决定。
            </p>
          </div>
        </div>
      </section>

      {/* ═══ How it works ═══ */}
      <section className="mp-how">
        <div className="mp-shell">
          <div className="mp-how-head">
            <div className="mp-eyebrow-dark">How It Works</div>
            <h2>三步 · 从<em>浏览</em>到<em>真实连接</em></h2>
          </div>
          <ol className="mp-how-steps">
            <li>
              <div className="mp-how-n">01</div>
              <h4>先开通付费会员</h4>
              <p>解除聊天次数与人数限制,联系更多已认证 profiles。</p>
            </li>
            <li>
              <div className="mp-how-n">02</div>
              <h4>用 Credits 深入了解</h4>
              <p>解锁私密照片、视频、礼物,请求视频确认,提升优先展示。</p>
            </li>
            <li>
              <div className="mp-how-n">03</div>
              <h4>完成身份认证</h4>
              <p>通过平台 KYC 后自动升级为认证会员,获得信任 Badge。</p>
            </li>
          </ol>
        </div>
      </section>

      {/* ═══ Safety ═══ */}
      <section className="mp-safety">
        <div className="mp-shell">
          <div className="mp-safety-eyebrow">Fair Use · Safety · Trust</div>
          <h2>高端社区<em>需要边界</em></h2>
          <p>
            付费会员提供更高沟通额度,但平台会限制骚扰、群发、辱骂、
            诱导站外付款、诈骗和违反规则的行为。异常行为可能导致聊天限制、
            账号审核或封禁。
          </p>
          <div className="mp-safety-badges">
            <span>🛡️ 保护用户</span>
            <span>🪪 保护服务者</span>
            <span>✨ 保护平台质量</span>
            <span>🚫 反骚扰机制</span>
            <span>🔒 隐私优先</span>
            <span>🤝 边界优先</span>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="mp-faq">
        <div className="mp-shell">
          <div className="mp-faq-head">
            <div className="mp-eyebrow">FAQ</div>
            <h2>关于会员</h2>
          </div>
          <div className="mp-faq-list">
            {FAQS.map((f, i) => (
              <details key={i} className="mp-faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 「选择付款方式」纯展示弹窗 · 无 API 调用 */}
      <PaymentMethodDisplayModal
        open={payDisplay.open}
        onClose={() => setPayDisplay({ open: false })}
        productLine={payDisplay.productLine}
        amountLine={payDisplay.amountLine}
      />

      {/* Toast */}
      {toast && <div className={"mp-toast " + toast.tone}>{toast.text}</div>}

      {/* Sticky bottom CTA (mobile) */}
      <div className="mp-sticky">
        <a href="#plans" className="mp-sticky-btn">开通付费会员 →</a>
      </div>

      <style>{sharedStyles}</style>
    </div>
  );
}

// ══════════════════════════════════════
// 基础会员卡
// ══════════════════════════════════════

function BasicCard({ displayLevel, loggedIn }: { displayLevel: DisplayMembershipLevel; loggedIn: boolean }) {
  const isCurrent = displayLevel === "basic";
  return (
    <div className="pc pc--basic">
      {isCurrent && <div className="pc-current-tag">当前身份</div>}
      <div className="pc-h">
        <div className="pc-name">基础会员</div>
        <div className="pc-en">Basic Member</div>
      </div>
      <div className="pc-price"><b>免费</b></div>
      <div className="pc-desc">适合先浏览和体验平台 · 保留当前所有免费用户规则</div>
      <ul className="pc-features">
        {BASIC_TIER.features.map((f, i) => <li key={i}><span className="pc-tick">·</span>{f}</li>)}
      </ul>
      {!loggedIn ? (
        <Link href="/register" className="pc-cta pc-cta--ghost">免费注册</Link>
      ) : (
        <div className="pc-fine">你正在使用基础会员的默认权益</div>
      )}
      <style>{cardStyles}</style>
    </div>
  );
}

// ══════════════════════════════════════
// 付费会员卡 · 主推 · 内含 4 计划选择
// ══════════════════════════════════════

function PaidCard({
  plans, selectedPlanId, onSelectPlan, selectedPlan, currentPlanId,
  displayLevel, onSubscribe, canBuyIntro,
}: {
  plans: MembershipPlan[];
  selectedPlanId: string;
  onSelectPlan: (id: string) => void;
  selectedPlan: MembershipPlan;
  currentPlanId?: string;
  displayLevel: DisplayMembershipLevel;
  onSubscribe: (p: MembershipPlan) => void;
  canBuyIntro: boolean;
}) {
  const isCurrent = displayLevel === "paid" || displayLevel === "verified";
  return (
    <div className="pc pc--paid">
      <div className="pc-badge">最推荐</div>
      {isCurrent && <div className="pc-current-tag">当前身份</div>}
      <div className="pc-h">
        <div className="pc-name">付费会员</div>
        <div className="pc-en">Paid Member</div>
      </div>
      <div className="pc-desc">
        解除与平台服务者的聊天对象人数与消息次数限制 · 自动翻译、已读状态、匿名浏览与高级筛选。
      </div>

      <div className="pc-plans">
        {plans.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectPlan(p.id)}
            className={"pp" + (selectedPlanId === p.id ? " is-active" : "")}
            disabled={p.isIntro && !canBuyIntro}
          >
            {p.badge && <span className="pp-badge">{p.badge}</span>}
            <div className="pp-name">
              {p.period === "intro7d" ? "7 天体验" :
               p.period === "monthly" ? "月度" :
               p.period === "quarterly" ? "季度" : "年度"}
            </div>
            <div className="pp-price">
              <span>{p.currency}</span>
              <b>{p.price.toFixed(2)}</b>
              <em>{PERIOD_SUFFIX[p.period]}</em>
            </div>
            <div className="pp-eq">
              {p.period === "intro7d"
                ? <>仅限首充 · 不自动续费</>
                : p.period === "monthly"
                ? <>月度订阅</>
                : <>约 {p.currency}{p.monthlyEquivalent.toFixed(2)} / 月{p.savings ? ` · 省 ${p.currency}${p.savings.toFixed(2)}` : ""}</>
              }
            </div>
            {currentPlanId === p.id && <div className="pp-current">当前套餐</div>}
          </button>
        ))}
      </div>

      <div className="pc-selected">
        <div className="pc-selected-name">已选:<b>{selectedPlan.displayName}</b></div>
        <div className="pc-selected-price">
          {selectedPlan.currency}{selectedPlan.price.toFixed(2)} {PERIOD_SUFFIX[selectedPlan.period]}
          {selectedPlan.savings ? <em> · 相较逐月省 {selectedPlan.currency}{selectedPlan.savings.toFixed(2)}</em> : null}
        </div>
      </div>

      <ul className="pc-features">
        {selectedPlan.features.slice(0, 6).map((f, i) => (
          <li key={i}><span className="pc-tick">✓</span>{f}</li>
        ))}
      </ul>

      <button type="button" onClick={() => onSubscribe(selectedPlan)} className="pc-cta pc-cta--gold">
        {selectedPlan.buttonText}
      </button>
      <div className="pc-fine">Demo Mode · 无真实扣款 · 支持随时取消</div>

      <style>{cardStyles}</style>
    </div>
  );
}

// ══════════════════════════════════════
// 认证会员卡
// ══════════════════════════════════════

function VerifiedCard({
  displayLevel, onVerifyClick, onDemoVerify, membershipTier, verificationStatus, processing,
}: {
  displayLevel: DisplayMembershipLevel;
  onVerifyClick: () => void;
  onDemoVerify: () => void;
  membershipTier?: "basic" | "paid";
  verificationStatus?: "unverified" | "pending" | "verified";
  processing: boolean;
}) {
  const isCurrent = displayLevel === "verified";
  const isPaidUnverified = membershipTier === "paid" && verificationStatus !== "verified";
  return (
    <div className="pc pc--verified">
      {isCurrent && <div className="pc-current-tag pc-current-tag--gold">当前身份</div>}
      <div className="pc-h">
        <div className="pc-name">认证会员</div>
        <div className="pc-en">Verified Member</div>
      </div>
      <div className="pc-price"><b>付费会员 + 身份认证</b></div>
      <div className="pc-desc">
        无独立价格 · 完成付费会员开通后,通过平台身份认证即可升级。
      </div>
      <ul className="pc-features">
        {VERIFIED_TIER.extras.map((f, i) => <li key={i}><span className="pc-tick">✓</span>{f}</li>)}
      </ul>

      {isCurrent ? (
        <div className="pc-verified-ok">
          <b>✓ 你已是认证会员</b>
          <span>付费权益 + 身份认证均已生效</span>
        </div>
      ) : verificationStatus === "verified" ? (
        <div className="pc-note">
          <b>身份认证已完成</b>
          <span>开通付费会员后即可升级为认证会员。</span>
        </div>
      ) : isPaidUnverified ? (
        <>
          <Link href="/me" onClick={(e) => { e.preventDefault(); onVerifyClick(); }} className="pc-cta pc-cta--ghost">
            前往账号安全 · 完成身份认证
          </Link>
          <button type="button" onClick={onDemoVerify} disabled={processing} className="pc-cta pc-cta--demo">
            {processing ? "认证中…" : "一键 Demo 认证"}
          </button>
        </>
      ) : (
        <>
          <button type="button" onClick={onVerifyClick} className="pc-cta pc-cta--ghost">完成身份认证</button>
          <div className="pc-fine">请先开通付费会员,再完成身份认证升级为认证会员。</div>
        </>
      )}

      <style>{cardStyles}</style>
    </div>
  );
}

// ══════════════════════════════════════
// Credit Card
// ══════════════════════════════════════

function CreditCard({ pkg, onBuy }: { pkg: CreditPackage; onBuy: (p: CreditPackage) => void }) {
  return (
    <div className={"cc" + (pkg.badge === "最受欢迎" ? " cc--pop" : "") + (pkg.badge === "最佳价值" ? " cc--best" : "")}>
      {pkg.badge && <div className="cc-badge">{pkg.badge}</div>}
      <div className="cc-credits">
        <b>{pkg.credits.toLocaleString("en-US")}</b>
        <span>Credits</span>
      </div>
      <div className="cc-price">
        <span>{pkg.currency}</span> {pkg.price}
      </div>
      <div className="cc-unit">≈ {pkg.currency} {pkg.pricePerCredit.toFixed(2)} / credit</div>
      <p className="cc-suit">{pkg.suitFor}</p>
      <div className="cc-bonus">
        <span>付费会员 +{PAID_CREDIT_BONUS_PCT}%</span>
      </div>
      <button type="button" onClick={() => onBuy(pkg)} className="cc-cta">充值 {pkg.credits} Credits</button>
      <style>{creditStyles}</style>
    </div>
  );
}

// ══════════════════════════════════════
// Cell render helper
// ══════════════════════════════════════

function cellRender(v: string | boolean): React.ReactNode {
  if (v === true) return <span className="mp-tick">✓</span>;
  if (v === false) return <span className="mp-cross">—</span>;
  return v;
}

// ══════════════════════════════════════
// FAQ
// ══════════════════════════════════════

const FAQS = [
  { q: "会员一共有几个身份?", a: "三个:基础会员(免费)、付费会员(购买后解除聊天限制)、认证会员(付费会员 + 完成身份认证)。认证会员不是独立收费,只是付费会员通过 KYC 后的信任升级。" },
  { q: "首充体验 7 天 £9.99 有什么限制?", a: "每个账号只能购买一次。已经购买过任何付费套餐或已用过首充的账号不能再购买。7 天到期后不自动续费,会恢复基础会员,除非你主动购买月度/季度/年度。" },
  { q: "季度和年度分别更划算多少?", a: "月度 £29.99 × 3 = £89.97,季度 £69.99 相当于省 £19.98,月均 £23.33。月度 £29.99 × 12 = £359.88,年度 £259.99 相当于省 £99.89,月均 £21.67。" },
  { q: "开通付费会员后,所有照片视频都免费吗?", a: "不是。付费会员解除聊天限制并提升沟通效率,部分私密照片和视频仍需 Credits 解锁。Credits 与会员是两套系统。" },
  { q: "什么是认证会员?", a: "认证会员 = 有效付费会员 + 通过平台身份认证(KYC)。认证本身免费,不单独收费。基础会员也可以提前完成认证,但只有开通付费会员后才显示为认证会员身份。" },
  { q: "会员到期后会怎样?", a: "自动降级到基础会员。已完成的身份认证不会清除,仍可显示「身份已认证」。重新开通付费会员后会自动恢复为认证会员身份。" },
  { q: "免费用户可以聊天吗?", a: "可以试聊。基础会员保留当前所有免费用户规则,适合先浏览和体验。持续沟通建议升级付费会员。" },
  { q: "会员会自动续费吗?", a: "当前为 Demo 模式,不会真实扣款也不会真实续费。首充体验默认不自动续费。月度/季度/年度未来接入 Stripe 支付后会开启,可随时取消。" },
  { q: "可以取消会员吗?", a: "可以。取消后权益在当前周期结束后失效,期间仍可正常使用。剩余的 Credits 不受影响。" },
  { q: "为什么要限制聊天人数?", a: "为了减少骚扰和低质量群发,让认真用户和服务者都获得更好的体验。合理的沟通上限保护双方,避免无差别群发破坏社区质量。" },
];

// ══════════════════════════════════════
// Styles
// ══════════════════════════════════════

const sharedStyles = `
  .mp{background:#FAFAF8;color:#111;font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui}
  .mp-shell{max-width:1200px;margin:0 auto;padding:0 24px}

  .mp-hero{background:radial-gradient(ellipse at 30% 0%,rgba(238,221,184,.24),transparent 60%),linear-gradient(180deg,#0F0F11 0%,#161618 100%);color:#EEDDB8;padding:88px 0 96px}
  .mp-hero-in{max-width:900px;margin:0 auto;padding:0 24px;text-align:center}
  .mp-hero-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:20px}
  .mp-hero-18{background:#EEDDB8;color:#1a1409;padding:3px 8px;border-radius:4px;letter-spacing:.02em}
  .mp-hero-h1{font-family:'Cormorant Garamond',ui-serif;font-size:52px;font-weight:600;line-height:1.15;color:#fff;margin:0 0 18px;letter-spacing:-0.015em}
  .mp-hero-h1 em{font-style:italic;color:transparent;background:linear-gradient(135deg,#EEDDB8 0%,#D4BF95 45%,#B8A789 100%);-webkit-background-clip:text;background-clip:text}
  .mp-hero-lead{font-size:17px;line-height:1.75;color:rgba(238,221,184,.85);margin:0 auto 22px;max-width:60ch}
  .mp-hero-badges{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;margin-bottom:32px;font-size:12px;color:rgba(255,255,255,.72)}
  .mp-hero-badges span{display:inline-flex;align-items:center;gap:6px;font-weight:500}
  .mp-hero-cta{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
  .mp-btn{display:inline-flex;align-items:center;justify-content:center;padding:14px 26px;border-radius:99px;font-size:14px;font-weight:700;text-decoration:none;transition:transform .12s,box-shadow .12s}
  .mp-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;box-shadow:0 16px 40px -16px rgba(238,221,184,.55)}
  .mp-btn--gold:hover{transform:translateY(-1px);box-shadow:0 20px 48px -14px rgba(238,221,184,.7)}
  .mp-btn--ghost{background:rgba(255,255,255,.06);border:1px solid rgba(238,221,184,.24);color:#EEDDB8;backdrop-filter:blur(6px)}
  .mp-btn--ghost:hover{background:rgba(255,255,255,.14);border-color:rgba(238,221,184,.5)}

  .mp-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
  .mp-eyebrow-dark{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}

  .mp-plans{padding:64px 0}
  .mp-plans-head{text-align:center;margin-bottom:36px;max-width:64ch;margin-left:auto;margin-right:auto}
  .mp-plans-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:36px;font-weight:500;line-height:1.2;color:#111;margin:0 0 12px;letter-spacing:-0.01em}
  .mp-plans-head h2 em{font-style:italic;color:#B8A789}
  .mp-plans-head p{font-size:14.5px;line-height:1.75;color:#5a5a62;margin:0}

  .mp-cards{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:16px;max-width:1140px;margin:0 auto;align-items:stretch}

  .mp-compare{padding:64px 0}
  .mp-compare-head{text-align:center;margin-bottom:32px}
  .mp-compare-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:34px;font-style:italic;font-weight:500;color:#111;margin:0;letter-spacing:-0.01em}
  .mp-compare-wrap{background:#fff;border:1px solid #E5E7EB;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px -30px rgba(15,23,42,.12)}
  .mp-compare-tab{width:100%;border-collapse:collapse;font-size:13.5px}
  .mp-compare-tab thead th{padding:14px 12px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280;font-weight:700;background:#FAFAF8;border-bottom:1px solid #E5E7EB;text-align:center}
  .mp-th-basic{width:22%}
  .mp-th-paid{width:22%;color:#B8A789 !important;background:linear-gradient(180deg,rgba(238,221,184,.14),rgba(184,167,137,.06)) !important}
  .mp-th-verified{width:22%;color:#EEDDB8 !important;background:linear-gradient(180deg,#161618,#0F0F11) !important}
  .mp-compare-tab tbody td{padding:12px;border-bottom:1px solid #F3F4F6;text-align:center;color:#111;font-weight:500}
  .mp-compare-tab tbody tr:last-child td{border-bottom:0}
  .mp-compare-tab tbody tr:hover td{background:#FBFAF7}
  .mp-tr-group td{background:#F7F5F0 !important;text-align:left !important;font-size:11px !important;letter-spacing:.14em !important;text-transform:uppercase !important;color:#B8A789 !important;font-weight:800 !important;padding:12px 20px !important}
  .mp-td-label{text-align:left !important;font-weight:600 !important;color:#374151;padding-left:20px !important}
  .mp-td-paid{background:linear-gradient(180deg,rgba(238,221,184,.06),transparent)}
  .mp-td-verified{background:linear-gradient(180deg,rgba(238,221,184,.06),rgba(184,167,137,.02))}
  .mp-tick{color:#16A34A;font-weight:800}
  .mp-cross{color:#D1D5DB;font-weight:800}

  .mp-credits{background:#fff;padding:64px 0;border-top:1px solid #E5E7EB}
  .mp-credits-head{text-align:center;max-width:64ch;margin:0 auto 36px}
  .mp-credits-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:34px;font-weight:500;line-height:1.2;color:#111;margin:0 0 12px;letter-spacing:-0.01em}
  .mp-credits-head h2 em{font-style:italic;color:#B8A789}
  .mp-credits-head p{font-size:15px;line-height:1.75;color:#3d3d42;margin:0}
  .mp-credits-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:36px}
  .mp-credits-guide{background:#FBFAF7;border:1px dashed #EEE9DC;border-radius:16px;padding:22px 26px}
  .mp-credits-guide-h{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:12px}
  .mp-credits-guide-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px 20px}
  .mp-credits-guide-grid > div{display:flex;flex-direction:column;gap:2px;padding:8px 0;border-top:1px solid #EEE9DC}
  .mp-credits-guide-grid > div:nth-child(1),.mp-credits-guide-grid > div:nth-child(2),.mp-credits-guide-grid > div:nth-child(3){border-top:0}
  .mp-credits-guide-grid b{font-family:ui-monospace,monospace;font-size:14px;color:#111;font-weight:700}
  .mp-credits-guide-grid span{font-size:12px;color:#6B7280}
  .mp-credits-fine{margin:14px 0 0;font-size:11.5px;color:#8a8a92;font-style:italic}

  .mp-how{background:#0F0F11;color:#EEDDB8;padding:64px 0}
  .mp-how-head{text-align:center;margin-bottom:36px}
  .mp-how-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:34px;font-weight:500;line-height:1.2;color:#fff;margin:0;letter-spacing:-0.01em}
  .mp-how-head h2 em{font-style:italic;color:#B8A789}
  .mp-how-steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  .mp-how-steps li{padding:24px 22px;background:rgba(255,255,255,.05);border:1px solid rgba(238,221,184,.14);border-radius:16px}
  .mp-how-n{font-family:'Cormorant Garamond',ui-serif;font-size:36px;font-style:italic;color:#B8A789;font-weight:600;line-height:1;margin-bottom:12px}
  .mp-how-steps h4{font-size:15px;color:#fff;font-weight:700;margin:0 0 6px}
  .mp-how-steps p{font-size:13.5px;line-height:1.7;color:rgba(238,221,184,.75);margin:0}

  .mp-safety{background:#FBFAF7;padding:56px 0}
  .mp-safety h2{font-family:'Cormorant Garamond',ui-serif;font-size:32px;font-weight:500;line-height:1.2;color:#111;margin:0 0 12px;text-align:center}
  .mp-safety h2 em{font-style:italic;color:#B8A789}
  .mp-safety-eyebrow{text-align:center;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
  .mp-safety p{font-size:14.5px;line-height:1.75;color:#3d3d42;margin:0 0 20px;max-width:60ch;margin-left:auto;margin-right:auto;text-align:center}
  .mp-safety-badges{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
  .mp-safety-badges span{padding:6px 14px;background:#fff;border:1px solid #EEE9DC;border-radius:99px;font-size:12.5px;color:#374151;font-weight:600}

  .mp-faq{background:#fff;padding:64px 0}
  .mp-faq-head{text-align:center;margin-bottom:28px}
  .mp-faq-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:32px;font-style:italic;font-weight:500;color:#111;margin:0}
  .mp-faq-list{max-width:820px;margin:0 auto;background:#FBFAF7;border:1px solid #EEE9DC;border-radius:20px;overflow:hidden}
  .mp-faq-item{border-bottom:1px solid #EEE9DC;padding:18px 24px}
  .mp-faq-item:last-child{border-bottom:0}
  .mp-faq-item[open]{background:#fff}
  .mp-faq-item summary{cursor:pointer;font-size:14.5px;font-weight:700;color:#111;list-style:none;padding-right:32px;position:relative}
  .mp-faq-item summary::-webkit-details-marker{display:none}
  .mp-faq-item summary::after{content:"+";position:absolute;right:0;top:-2px;font-size:22px;color:#B8A789;line-height:1;font-weight:400}
  .mp-faq-item[open] summary::after{content:"−"}
  .mp-faq-item p{margin:10px 0 0;font-size:13.5px;line-height:1.75;color:#3d3d42;max-width:70ch}

  .mp-toast{position:fixed;bottom:96px;left:50%;transform:translateX(-50%);padding:12px 20px;background:#111;color:#EEDDB8;border-radius:12px;font-size:13.5px;font-weight:600;z-index:100;box-shadow:0 20px 40px -16px rgba(0,0,0,.5)}
  .mp-toast.err{background:#B91C1C;color:#fff}

  .mp-sticky{display:none;position:fixed;left:12px;right:12px;bottom:calc(72px + env(safe-area-inset-bottom,0px));z-index:50}
  .mp-sticky-btn{display:flex;align-items:center;justify-content:center;padding:14px 18px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;border-radius:14px;font-weight:800;font-size:14px;text-decoration:none;box-shadow:0 12px 32px -12px rgba(0,0,0,.45)}

  @media (max-width:1024px){
    .mp-cards{grid-template-columns:1fr;max-width:520px}
    .mp-credits-grid{grid-template-columns:repeat(2,1fr)}
    .mp-how-steps{grid-template-columns:1fr}
    .mp-compare-wrap{overflow-x:auto}
    .mp-compare-tab{min-width:640px}
    .mp-credits-guide-grid{grid-template-columns:repeat(2,1fr)}
    .mp-credits-guide-grid > div:nth-child(3){border-top:1px solid #EEE9DC !important}
    .mp-sticky{display:block}
  }
  @media (max-width:640px){
    .mp-hero-h1{font-size:36px}
    .mp-hero-lead{font-size:15.5px}
    .mp-credits-guide-grid{grid-template-columns:1fr}
    .mp-credits-guide-grid > div{border-top:1px solid #EEE9DC !important}
    .mp-credits-guide-grid > div:first-child{border-top:0 !important}
  }
`;

const cardStyles = `
  .pc{position:relative;background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:26px 24px;display:flex;flex-direction:column;gap:12px;transition:transform .16s,box-shadow .16s,border-color .16s}
  .pc:hover{transform:translateY(-2px);box-shadow:0 24px 60px -30px rgba(15,23,42,.16)}
  .pc--basic{border-color:#E5E7EB}
  .pc--paid{background:linear-gradient(180deg,#FBFAF7,#fff);border:2px solid #B8A789;box-shadow:0 20px 50px -20px rgba(184,167,137,.35)}
  .pc--verified{background:linear-gradient(180deg,#161618,#0F0F11);border-color:#B8A789;color:#EEDDB8}
  .pc-current-tag{position:absolute;top:12px;right:12px;padding:3px 10px;background:#DCFCE7;color:#166534;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-radius:99px}
  .pc-current-tag--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}
  .pc-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);padding:4px 14px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;border-radius:99px;white-space:nowrap;box-shadow:0 6px 16px -6px rgba(184,167,137,.6)}
  .pc-h{border-bottom:1px solid rgba(0,0,0,.08);padding-bottom:12px}
  .pc--verified .pc-h{border-bottom-color:rgba(238,221,184,.14)}
  .pc-name{font-family:'Cormorant Garamond',ui-serif;font-size:28px;font-style:italic;font-weight:600;color:#111;letter-spacing:-0.008em;line-height:1.15}
  .pc--verified .pc-name{color:#EEDDB8}
  .pc-en{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-top:2px}
  .pc--verified .pc-en{color:rgba(238,221,184,.6)}
  .pc-price{display:flex;align-items:baseline;gap:4px;font-size:18px;color:#111;font-weight:700}
  .pc-price b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:32px;font-weight:600;color:#111}
  .pc--verified .pc-price,.pc--verified .pc-price b{color:#EEDDB8}
  .pc-desc{font-size:13px;line-height:1.65;color:#5a5a62;margin:0}
  .pc--verified .pc-desc{color:rgba(238,221,184,.65)}

  .pc-plans{display:flex;flex-direction:column;gap:6px;padding:6px;background:rgba(0,0,0,.03);border-radius:14px;margin:6px 0}
  .pp{position:relative;background:#fff;border:1px solid transparent;border-radius:10px;padding:12px 14px;font:inherit;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:2px;transition:border-color .12s,transform .12s}
  .pp:hover:not(:disabled){border-color:#B8A789;transform:translateY(-1px)}
  .pp.is-active{border-color:#111;background:#FBFAF7}
  .pp:disabled{opacity:.45;cursor:not-allowed}
  .pp-badge{position:absolute;top:-8px;right:12px;padding:1px 8px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;border-radius:99px}
  .pp-name{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6B7280;font-weight:700}
  .pp-price{display:flex;align-items:baseline;gap:2px}
  .pp-price span{font-size:12px;color:#6B7280;font-weight:600}
  .pp-price b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:22px;color:#111;font-weight:600;font-variant-numeric:tabular-nums}
  .pp-price em{font-size:11px;color:#6B7280;font-style:normal;font-weight:500;margin-left:2px}
  .pp-eq{font-size:11px;color:#8a8a92}
  .pp-current{position:absolute;top:8px;right:12px;padding:1px 8px;background:#DCFCE7;color:#166534;font-size:9.5px;font-weight:700;letter-spacing:.04em;border-radius:99px}

  .pc-selected{padding:10px 14px;background:rgba(238,221,184,.14);border:1px dashed rgba(184,167,137,.4);border-radius:10px}
  .pc-selected-name{font-size:12px;color:#5a5a62}
  .pc-selected-name b{color:#111;font-weight:800;margin-left:4px}
  .pc-selected-price{font-size:13px;color:#111;font-weight:700;font-family:ui-monospace,monospace;margin-top:2px}
  .pc-selected-price em{font-style:normal;color:#B8A789;font-weight:700}

  .pc-features{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;flex:1}
  .pc-features li{display:flex;gap:8px;align-items:flex-start;font-size:13px;line-height:1.55;color:#374151}
  .pc--verified .pc-features li{color:rgba(238,221,184,.85)}
  .pc-tick{flex-shrink:0;color:#16A34A;font-weight:800;font-size:14px;line-height:1.4}
  .pc--verified .pc-tick{color:#EEDDB8}

  .pc-cta{padding:12px 16px;border-radius:12px;border:0;font:inherit;font-size:13.5px;font-weight:800;cursor:pointer;transition:transform .12s;text-align:center;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;letter-spacing:-0.005em}
  .pc-cta:hover:not(:disabled){transform:translateY(-1px)}
  .pc-cta:disabled{opacity:.55;cursor:not-allowed}
  .pc-cta--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}
  .pc-cta--ghost{background:transparent;color:#111;border:1px solid #111}
  .pc--verified .pc-cta--ghost{color:#EEDDB8;border-color:#EEDDB8}
  .pc-cta--demo{background:rgba(238,221,184,.2);color:#EEDDB8;font-size:11.5px;font-weight:700;padding:8px 12px;letter-spacing:.02em}

  .pc-fine{font-size:11px;color:#9CA3AF;text-align:center;letter-spacing:.02em}
  .pc--verified .pc-fine{color:rgba(238,221,184,.45)}

  .pc-note,.pc-verified-ok{padding:12px 14px;background:rgba(238,221,184,.12);border:1px dashed rgba(184,167,137,.4);border-radius:10px;display:flex;flex-direction:column;gap:2px}
  .pc-verified-ok{background:rgba(66,133,107,.14);border-color:rgba(66,133,107,.4)}
  .pc-note b,.pc-verified-ok b{font-size:13px;color:#EEDDB8;font-weight:800}
  .pc-note span,.pc-verified-ok span{font-size:12px;color:rgba(238,221,184,.7)}
`;

const creditStyles = `
  .cc{position:relative;background:#FBFAF7;border:1px solid #EEE9DC;border-radius:16px;padding:22px 20px;display:flex;flex-direction:column;gap:10px;transition:transform .12s,border-color .12s}
  .cc:hover{transform:translateY(-2px);border-color:#B8A789}
  .cc--pop{background:#fff;border-color:#B8A789}
  .cc--best{background:linear-gradient(180deg,#161618,#0F0F11);border-color:#EEDDB8;color:#EEDDB8}
  .cc-badge{position:absolute;top:-10px;right:16px;padding:3px 10px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-radius:99px}
  .cc-credits{display:flex;align-items:baseline;gap:6px}
  .cc-credits b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:36px;font-weight:600;color:#111;line-height:1;letter-spacing:-0.02em;font-variant-numeric:tabular-nums}
  .cc--best .cc-credits b{color:#EEDDB8}
  .cc-credits span{font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:#6B7280;font-weight:600}
  .cc--best .cc-credits span{color:rgba(238,221,184,.55)}
  .cc-price{font-size:22px;color:#B8A789;font-weight:700;letter-spacing:-0.01em}
  .cc-price span{font-size:12px;color:#6B7280;font-weight:600;margin-right:2px}
  .cc--best .cc-price{color:#EEDDB8}
  .cc-unit{font-size:11px;color:#6B7280;font-family:ui-monospace,monospace}
  .cc--best .cc-unit{color:rgba(238,221,184,.55)}
  .cc-suit{font-size:12px;line-height:1.55;color:#5a5a62;margin:0;flex:1}
  .cc--best .cc-suit{color:rgba(238,221,184,.7)}
  .cc-bonus{display:flex;gap:4px}
  .cc-bonus span{padding:2px 8px;background:#fff;border:1px solid #E5E7EB;border-radius:99px;font-size:10px;font-weight:700;color:#B8A789}
  .cc--best .cc-bonus span{background:rgba(238,221,184,.1);border-color:rgba(238,221,184,.2);color:#EEDDB8}
  .cc-cta{padding:10px;border-radius:10px;border:0;background:#111;color:#fff;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;text-align:center;transition:opacity .12s}
  .cc-cta:hover{opacity:.9}
  .cc--best .cc-cta{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}
`;
