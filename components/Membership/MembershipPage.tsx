"use client";
// Sugardating 会员页 · VIP / SVIP × 3 周期 · Credits 4 套餐 · 完整对比 · FAQ
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/AuthProvider";
import {
  MEMBERSHIP_PLANS, CREDIT_PACKAGES, COMPARISON_ROWS, CREDIT_USAGE_GUIDE, FREE_TIER,
  PERIOD_LABEL, PERIOD_LABEL_EN, PERIOD_SUFFIX,
  getPlan, listPlansByTier,
  type BillingPeriod, type MembershipPlan, type CreditPackage,
} from "@/lib/membership-plans";

type Confirm =
  | { kind: "plan"; plan: MembershipPlan }
  | { kind: "credits"; pkg: CreditPackage };

export default function MembershipPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const [period, setPeriod] = useState<BillingPeriod>("quarterly");
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const vipPlan = getPlan("vip", period);
  const svipPlan = getPlan("svip", period);

  function subscribe(plan: MembershipPlan) {
    if (!user) {
      router.push("/login?next=/membership");
      return;
    }
    setConfirm({ kind: "plan", plan });
  }

  function topup(pkg: CreditPackage) {
    if (!user) {
      router.push("/login?next=/membership");
      return;
    }
    setConfirm({ kind: "credits", pkg });
  }

  async function doConfirm() {
    if (!confirm) return;
    setProcessing(true);
    try {
      if (confirm.kind === "plan") {
        const r = await fetch("/api/membership/subscribe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ tier: confirm.plan.tier, period: confirm.plan.period }),
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d?.ok) throw new Error(d?.message || "开通失败");
        setToast({ tone: "ok", text: `${confirm.plan.tier.toUpperCase()} · ${PERIOD_LABEL[confirm.plan.period]} 开通成功 (Demo)` });
      } else {
        const r = await fetch("/api/wallet/top-up", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ coins: confirm.pkg.credits }),
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d?.ok) throw new Error(d?.message || "充值失败");
        setToast({ tone: "ok", text: `充值成功 · +${confirm.pkg.credits} Credits (Demo)` });
      }
      setConfirm(null);
    } catch (e) {
      setToast({ tone: "err", text: e instanceof Error ? e.message : "操作失败" });
    } finally {
      setProcessing(false);
      setTimeout(() => setToast(null), 3200);
    }
  }

  return (
    <div className="mp">
      {/* ═══ Hero ═══ */}
      <section className="mp-hero">
        <div className="mp-hero-in">
          <div className="mp-hero-eyebrow">
            <span className="mp-hero-18">18+</span>
            Membership · VIP &amp; SVIP
          </div>
          <h1 className="mp-hero-h1">
            解锁更自由的<em>私密聊天</em>
          </h1>
          <p className="mp-hero-lead">
            升级 VIP 或 SVIP,解除与平台服务者的聊天次数和人数限制,
            使用多语言翻译、已读状态、匿名浏览与更高效的筛选工具,
            减少无效沟通。
          </p>
          <div className="mp-hero-badges">
            <span>🔞 18+ Only</span>
            <span>💬 Private Chat</span>
            <span>🪪 Verified Profiles</span>
            <span>🪙 Credits Compatible</span>
          </div>
          <div className="mp-hero-cta">
            <a href="#plans" className="mp-btn mp-btn--gold">升级 VIP</a>
            <a href="#plans" className="mp-btn mp-btn--ghost">查看 SVIP</a>
            <a href="#credits" className="mp-btn mp-btn--ghost">了解 Credits</a>
          </div>
        </div>
      </section>

      {/* ═══ Billing toggle + Pricing cards ═══ */}
      <section id="plans" className="mp-plans">
        <div className="mp-shell">
          <div className="mp-toggle">
            <div className="mp-toggle-group">
              {(["monthly", "quarterly", "yearly"] as BillingPeriod[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={"mp-toggle-btn" + (period === p ? " is-active" : "")}
                >
                  {PERIOD_LABEL[p]}
                  <span>{PERIOD_LABEL_EN[p]}</span>
                  {p === "quarterly" && <em>Recommended</em>}
                  {p === "yearly" && <em>Best Value</em>}
                </button>
              ))}
            </div>
          </div>

          <div className="mp-cards">
            {/* VIP card */}
            <PlanCard plan={vipPlan} onSubscribe={subscribe} />
            {/* SVIP card */}
            <PlanCard plan={svipPlan} onSubscribe={subscribe} highlight />
          </div>
        </div>
      </section>

      {/* ═══ Chat limit explanation ═══ */}
      <section className="mp-explain">
        <div className="mp-shell">
          <div className="mp-explain-in">
            <div className="mp-explain-eyebrow">Why · Chat Limits</div>
            <h2>为什么<em>聊天需要会员</em>?</h2>
            <p>
              Sugardating 希望减少无效骚扰、低质量群发和不尊重边界的沟通。
              免费用户可以浏览和试聊,但如果你想持续接触更多已认证 profiles、
              跨语言沟通并提高筛选效率,VIP / SVIP 会更适合你。
            </p>
            <ul className="mp-explain-ul">
              <li>保护服务者免受低质量骚扰</li>
              <li>让认真用户获得更高信噪比</li>
              <li>让消息更容易被看见</li>
              <li>保持社区高端质量</li>
              <li>避免无限免费群发破坏体验</li>
            </ul>
            <p className="mp-explain-fine">
              价格不是单纯收费,而是过滤 · 门槛让平台留下真正认真的用户与服务者。
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Comparison table ═══ */}
      <section className="mp-compare">
        <div className="mp-shell">
          <div className="mp-compare-head">
            <div className="mp-compare-eyebrow">Compare · Free / VIP / SVIP</div>
            <h2>完整权益对比</h2>
          </div>
          <div className="mp-compare-wrap">
            <table className="mp-compare-tab">
              <thead>
                <tr>
                  <th />
                  <th className="mp-th-free">Free</th>
                  <th className="mp-th-vip">VIP</th>
                  <th className="mp-th-svip">SVIP</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="mp-td-label">{row.label}</td>
                    <td>{cellRender(row.free)}</td>
                    <td>{cellRender(row.vip)}</td>
                    <td className="mp-td-svip">{cellRender(row.svip)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ Credits top-up ═══ */}
      <section id="credits" className="mp-credits">
        <div className="mp-shell">
          <div className="mp-credits-head">
            <div className="mp-credits-eyebrow">Credits · 内容解锁与表达兴趣</div>
            <h2>Credits 用于<em>内容解锁与礼物</em></h2>
            <p>
              会员负责聊天效率,Credits 用于解锁私密照片、视频、礼物、
              优先互动与视频确认。VIP 每笔充值 +10% bonus · SVIP +20%。
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
            <div className="mp-how-eyebrow">How It Works</div>
            <h2>三步 · 从<em>浏览</em>到<em>真实连接</em></h2>
          </div>
          <ol className="mp-how-steps">
            <li>
              <div className="mp-how-n">01</div>
              <h4>先升级会员</h4>
              <p>解除聊天次数与人数限制,联系更多已认证 profiles。</p>
            </li>
            <li>
              <div className="mp-how-n">02</div>
              <h4>再用 Credits 深入了解</h4>
              <p>解锁私密照片、视频、礼物,请求视频确认,提升优先展示。</p>
            </li>
            <li>
              <div className="mp-how-n">03</div>
              <h4>最后决定是否预约或定制</h4>
              <p>通过聊天、视频与站内工具确认边界、时间与风格。</p>
            </li>
          </ol>
        </div>
      </section>

      {/* ═══ Safety / Fair use ═══ */}
      <section className="mp-safety">
        <div className="mp-shell">
          <div className="mp-safety-eyebrow">Fair Use · Safety · Trust</div>
          <h2>高端社区<em>需要边界</em></h2>
          <p>
            VIP / SVIP 提供更高沟通额度,但平台会限制骚扰、群发、辱骂、
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
            <div className="mp-faq-eyebrow">FAQ</div>
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

      {/* Confirm modal */}
      {confirm && (
        <ConfirmModal
          confirm={confirm}
          processing={processing}
          onConfirm={doConfirm}
          onClose={() => setConfirm(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={"mp-toast " + toast.tone}>{toast.text}</div>
      )}

      {/* Sticky bottom CTA (mobile) */}
      <div className="mp-sticky">
        <a href="#plans" className="mp-sticky-btn">升级会员 →</a>
      </div>

      <style>{`
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

        .mp-plans{padding:56px 0}
        .mp-toggle{display:flex;justify-content:center;margin-bottom:32px}
        .mp-toggle-group{display:inline-flex;background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:4px;gap:2px}
        .mp-toggle-btn{position:relative;padding:12px 22px;border:0;background:transparent;color:#374151;font:inherit;font-size:13.5px;font-weight:700;cursor:pointer;border-radius:10px;display:flex;flex-direction:column;align-items:center;gap:2px;transition:background .12s,color .12s;min-width:110px}
        .mp-toggle-btn span{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:currentColor;opacity:.55;font-weight:600}
        .mp-toggle-btn em{position:absolute;top:-8px;right:-6px;padding:2px 8px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-radius:99px;font-style:normal}
        .mp-toggle-btn.is-active{background:#111;color:#EEDDB8}

        .mp-cards{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:960px;margin:0 auto}

        .mp-explain{background:#fff;padding:72px 0;border-top:1px solid #E5E7EB;border-bottom:1px solid #E5E7EB}
        .mp-explain-in{max-width:780px;margin:0 auto;text-align:center}
        .mp-explain-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .mp-explain-in h2{font-family:'Cormorant Garamond',ui-serif;font-size:36px;font-weight:500;line-height:1.2;color:#111;margin:0 0 16px}
        .mp-explain-in h2 em{font-style:italic;color:#B8A789}
        .mp-explain-in p{font-size:15.5px;line-height:1.8;color:#3d3d42;margin:0 0 20px}
        .mp-explain-ul{list-style:none;margin:0 0 20px;padding:0;display:grid;grid-template-columns:repeat(2,1fr);gap:10px;text-align:left}
        .mp-explain-ul li{padding-left:18px;position:relative;font-size:14px;color:#374151;line-height:1.7}
        .mp-explain-ul li:before{content:"";position:absolute;left:0;top:11px;width:8px;height:1px;background:#B8A789}
        .mp-explain-fine{font-size:12.5px;color:#8a8a92;font-style:italic;margin:0}

        .mp-compare{padding:72px 0}
        .mp-compare-head{text-align:center;margin-bottom:32px}
        .mp-compare-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .mp-compare-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:34px;font-style:italic;font-weight:500;color:#111;margin:0;letter-spacing:-0.01em}
        .mp-compare-wrap{background:#fff;border:1px solid #E5E7EB;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px -30px rgba(15,23,42,.12)}
        .mp-compare-tab{width:100%;border-collapse:collapse;font-size:13.5px}
        .mp-compare-tab thead th{padding:14px 12px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280;font-weight:700;background:#FAFAF8;border-bottom:1px solid #E5E7EB;text-align:center}
        .mp-th-free{width:20%}
        .mp-th-vip{width:20%;color:#B8A789 !important}
        .mp-th-svip{width:20%;color:#EEDDB8 !important;background:linear-gradient(180deg,#161618,#0F0F11) !important}
        .mp-compare-tab tbody td{padding:12px;border-bottom:1px solid #F3F4F6;text-align:center;color:#111;font-weight:500}
        .mp-compare-tab tbody tr:last-child td{border-bottom:0}
        .mp-compare-tab tbody tr:hover td{background:#FBFAF7}
        .mp-td-label{text-align:left !important;font-weight:600 !important;color:#374151;padding-left:20px !important}
        .mp-td-svip{background:linear-gradient(180deg,rgba(238,221,184,.06),rgba(184,167,137,.02))}
        .mp-tick{color:#16A34A;font-weight:800}
        .mp-cross{color:#D1D5DB;font-weight:800}

        .mp-credits{background:#fff;padding:72px 0;border-top:1px solid #E5E7EB}
        .mp-credits-head{text-align:center;max-width:64ch;margin:0 auto 36px}
        .mp-credits-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
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

        .mp-how{background:#0F0F11;color:#EEDDB8;padding:72px 0}
        .mp-how-head{text-align:center;margin-bottom:36px}
        .mp-how-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .mp-how-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:34px;font-weight:500;line-height:1.2;color:#fff;margin:0;letter-spacing:-0.01em}
        .mp-how-head h2 em{font-style:italic;color:#B8A789}
        .mp-how-steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .mp-how-steps li{padding:24px 22px;background:rgba(255,255,255,.05);border:1px solid rgba(238,221,184,.14);border-radius:16px}
        .mp-how-n{font-family:'Cormorant Garamond',ui-serif;font-size:36px;font-style:italic;color:#B8A789;font-weight:600;line-height:1;margin-bottom:12px}
        .mp-how-steps h4{font-size:15px;color:#fff;font-weight:700;margin:0 0 6px}
        .mp-how-steps p{font-size:13.5px;line-height:1.7;color:rgba(238,221,184,.75);margin:0}

        .mp-safety{background:#FBFAF7;padding:64px 0}
        .mp-safety h2{font-family:'Cormorant Garamond',ui-serif;font-size:32px;font-weight:500;line-height:1.2;color:#111;margin:0 0 12px;text-align:center}
        .mp-safety h2 em{font-style:italic;color:#B8A789}
        .mp-safety-eyebrow{text-align:center;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .mp-safety p{font-size:14.5px;line-height:1.75;color:#3d3d42;margin:0 0 20px;max-width:60ch;margin-left:auto;margin-right:auto;text-align:center}
        .mp-safety-badges{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
        .mp-safety-badges span{padding:6px 14px;background:#fff;border:1px solid #EEE9DC;border-radius:99px;font-size:12.5px;color:#374151;font-weight:600}

        .mp-faq{background:#fff;padding:72px 0}
        .mp-faq-head{text-align:center;margin-bottom:28px}
        .mp-faq-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:12px}
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

        .mp-toast{position:fixed;bottom:96px;left:50%;transform:translateX(-50%);padding:12px 20px;background:#111;color:#EEDDB8;border-radius:12px;font-size:13.5px;font-weight:600;z-index:100;box-shadow:0 20px 40px -16px rgba(0,0,0,.5);animation:mp-toast-in .24s}
        .mp-toast.err{background:#B91C1C;color:#fff}
        @keyframes mp-toast-in{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}

        .mp-sticky{display:none;position:fixed;left:12px;right:12px;bottom:calc(72px + env(safe-area-inset-bottom,0px));z-index:50}
        .mp-sticky-btn{display:flex;align-items:center;justify-content:center;padding:14px 18px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;border-radius:14px;font-weight:800;font-size:14px;text-decoration:none;box-shadow:0 12px 32px -12px rgba(0,0,0,.45)}

        @media (max-width:900px){
          .mp-hero-h1{font-size:36px}
          .mp-hero-lead{font-size:15.5px}
          .mp-cards{grid-template-columns:1fr}
          .mp-credits-grid{grid-template-columns:repeat(2,1fr)}
          .mp-how-steps{grid-template-columns:1fr}
          .mp-explain-ul{grid-template-columns:1fr}
          .mp-compare-wrap{overflow-x:auto}
          .mp-compare-tab{min-width:640px}
          .mp-credits-guide-grid{grid-template-columns:repeat(2,1fr)}
          .mp-credits-guide-grid > div:nth-child(3){border-top:1px solid #EEE9DC !important}
          .mp-sticky{display:block}
        }
        @media (max-width:640px){
          .mp-toggle-btn{min-width:auto;flex:1;padding:10px 12px;font-size:12.5px}
          .mp-toggle-btn span{display:none}
          .mp-credits-guide-grid{grid-template-columns:1fr}
          .mp-credits-guide-grid > div{border-top:1px solid #EEE9DC !important}
          .mp-credits-guide-grid > div:first-child{border-top:0 !important}
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════
// Plan Card
// ══════════════════════════════════════

function PlanCard({ plan, onSubscribe, highlight }: { plan: MembershipPlan; onSubscribe: (p: MembershipPlan) => void; highlight?: boolean }) {
  return (
    <div className={"pc " + (highlight ? "pc--svip" : "pc--vip")}>
      {plan.badge && <div className="pc-badge">{plan.badge}</div>}
      <div className="pc-h">
        <div className="pc-tier">{plan.tier.toUpperCase()}</div>
        <p className="pc-sub">
          {plan.tier === "vip" ? "解除日常聊天限制,认真筛选与持续沟通。" : "最高沟通效率,高频用户 / 商务旅客 / 高端定制需求。"}
        </p>
      </div>
      <div className="pc-price">
        <span className="pc-cur">{plan.currency}</span>
        <b>{plan.price.toLocaleString("en-US")}</b>
        <span className="pc-suffix">{PERIOD_SUFFIX[plan.period]}</span>
      </div>
      <div className="pc-eq">
        折合 <b>{plan.currency} {plan.monthlyEquivalent.toFixed(plan.monthlyEquivalent % 1 ? 1 : 0)}</b> / 月
        {plan.savings && <span className="pc-save">省 {plan.currency} {plan.savings}</span>}
      </div>
      <ul className="pc-features">
        {plan.features.slice(0, plan.tier === "svip" ? 7 : 6).map((f, i) => (
          <li key={i}><span className="pc-tick">✓</span>{f}</li>
        ))}
      </ul>
      <button type="button" onClick={() => onSubscribe(plan)} className="pc-cta">
        {plan.tier === "vip" ? "开通 VIP" : "开通 SVIP"} →
      </button>
      <div className="pc-fine">Demo Mode · 无真实扣款 · 支持随时取消</div>
      <style jsx>{`
        .pc{position:relative;background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:32px 30px;display:flex;flex-direction:column;gap:14px;transition:transform .16s,box-shadow .16s,border-color .16s}
        .pc:hover{transform:translateY(-3px);box-shadow:0 30px 60px -30px rgba(15,23,42,.18)}
        .pc--svip{background:linear-gradient(180deg,#161618,#0F0F11);border-color:#B8A789;color:#EEDDB8;box-shadow:0 20px 50px -20px rgba(184,167,137,.4)}
        .pc--svip:hover{box-shadow:0 30px 60px -20px rgba(184,167,137,.55)}
        .pc-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);padding:4px 12px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-radius:99px;white-space:nowrap}
        .pc-h{border-bottom:1px solid rgba(0,0,0,.08);padding-bottom:14px}
        .pc--svip .pc-h{border-bottom-color:rgba(238,221,184,.14)}
        .pc-tier{font-family:'Cormorant Garamond',ui-serif;font-size:30px;font-style:italic;font-weight:600;color:#111;letter-spacing:-0.01em}
        .pc--svip .pc-tier{color:#EEDDB8}
        .pc-sub{font-size:13px;line-height:1.6;color:#6B7280;margin:4px 0 0}
        .pc--svip .pc-sub{color:rgba(238,221,184,.65)}
        .pc-price{display:flex;align-items:baseline;gap:4px}
        .pc-cur{font-size:14px;color:#6B7280;font-weight:600}
        .pc--svip .pc-cur{color:rgba(238,221,184,.55)}
        .pc-price b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:52px;font-weight:600;color:#111;line-height:1;letter-spacing:-0.02em;font-variant-numeric:tabular-nums}
        .pc--svip .pc-price b{color:#EEDDB8}
        .pc-suffix{font-size:13px;color:#6B7280;font-weight:500;margin-left:4px}
        .pc--svip .pc-suffix{color:rgba(238,221,184,.55)}
        .pc-eq{font-size:12px;color:#6B7280;display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:-8px}
        .pc--svip .pc-eq{color:rgba(238,221,184,.55)}
        .pc-eq b{color:#111;font-weight:700;font-family:ui-monospace,monospace}
        .pc--svip .pc-eq b{color:#EEDDB8}
        .pc-save{background:#DCFCE7;color:#166534;padding:2px 8px;border-radius:99px;font-size:10.5px;font-weight:700}
        .pc--svip .pc-save{background:rgba(238,221,184,.18);color:#EEDDB8}
        .pc-features{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;flex:1}
        .pc-features li{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;line-height:1.55;color:#374151}
        .pc--svip .pc-features li{color:rgba(238,221,184,.85)}
        .pc-tick{flex-shrink:0;color:#16A34A;font-weight:800;font-size:14px;line-height:1.4}
        .pc--svip .pc-tick{color:#EEDDB8}
        .pc-cta{padding:14px;border-radius:14px;border:0;font:inherit;font-size:14px;font-weight:700;cursor:pointer;transition:transform .12s;text-align:center;background:#111;color:#fff}
        .pc:hover .pc-cta{transform:translateY(-1px)}
        .pc--svip .pc-cta{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}
        .pc-fine{font-size:11px;color:#9CA3AF;text-align:center;letter-spacing:.02em}
        .pc--svip .pc-fine{color:rgba(238,221,184,.45)}
      `}</style>
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
        <span>VIP +10%</span>
        <span>SVIP +20%</span>
      </div>
      <button type="button" onClick={() => onBuy(pkg)} className="cc-cta">充值 {pkg.credits} Credits</button>
      <style jsx>{`
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
      `}</style>
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
// Confirm Modal
// ══════════════════════════════════════

function ConfirmModal({ confirm, processing, onConfirm, onClose }: {
  confirm: Confirm;
  processing: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const isPlan = confirm.kind === "plan";
  return (
    <div className="cm-bd" onClick={onClose}>
      <div className="cm" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="cm-x" onClick={onClose} aria-label="关闭">×</button>
        <div className="cm-eyebrow">{isPlan ? "订阅确认" : "充值确认"}</div>
        <h3>{isPlan
          ? `${confirm.plan.tier.toUpperCase()} · ${PERIOD_LABEL[confirm.plan.period]}`
          : `${confirm.pkg.credits} Credits · ${confirm.pkg.currency} ${confirm.pkg.price}`}</h3>
        {isPlan ? (
          <>
            <div className="cm-price">
              {confirm.plan.currency} <b>{confirm.plan.price}</b>
              <span>{PERIOD_SUFFIX[confirm.plan.period]}</span>
            </div>
            <ul className="cm-list">
              {confirm.plan.features.slice(0, 4).map((f, i) => <li key={i}>✓ {f}</li>)}
            </ul>
            <div className="cm-note">
              首笔即赠 {confirm.plan.includedCredits} Credits · 后续每周期到账
            </div>
          </>
        ) : (
          <>
            <div className="cm-price">
              {confirm.pkg.currency} <b>{confirm.pkg.price}</b>
              <span>· ≈ {confirm.pkg.currency} {confirm.pkg.pricePerCredit.toFixed(2)} / credit</span>
            </div>
            <p className="cm-desc">{confirm.pkg.suitFor}</p>
            <div className="cm-note">
              VIP 用户额外 +10% · SVIP 额外 +20% · 到账立即生效
            </div>
          </>
        )}
        <div className="cm-fine">
          当前为 Demo 模式 · 不会真实扣款 · 未来接入 Stripe 支付
        </div>
        <div className="cm-actions">
          <button type="button" onClick={onClose} disabled={processing} className="cm-btn cm-btn--ghost">取消</button>
          <button type="button" onClick={onConfirm} disabled={processing} className="cm-btn cm-btn--gold">
            {processing ? "处理中…" : isPlan ? "确认开通" : "确认充值"}
          </button>
        </div>
      </div>
      <style jsx>{`
        .cm-bd{position:fixed;inset:0;background:rgba(10,10,12,.72);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;animation:mp-fade .18s}
        .cm{position:relative;width:100%;max-width:460px;background:#fff;border-radius:20px;padding:32px;box-shadow:0 30px 80px rgba(0,0,0,.4);animation:mp-rise .22s cubic-bezier(.2,.9,.3,1.2)}
        .cm-x{position:absolute;top:14px;right:18px;background:none;border:0;font-size:26px;color:#6B7280;cursor:pointer;line-height:1;padding:0 6px}
        .cm-eyebrow{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:8px}
        .cm h3{font-family:'Cormorant Garamond',ui-serif;font-size:26px;font-style:italic;font-weight:600;color:#111;margin:0 0 14px}
        .cm-price{display:flex;align-items:baseline;gap:6px;padding:14px 16px;background:#FBFAF7;border-radius:12px;font-size:14px;color:#6B7280;margin-bottom:14px}
        .cm-price b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:32px;color:#B8A789;font-weight:600;letter-spacing:-0.01em;font-variant-numeric:tabular-nums}
        .cm-price span{font-size:12.5px;color:#6B7280}
        .cm-list{list-style:none;margin:0 0 14px;padding:0;font-size:13.5px;color:#374151}
        .cm-list li{padding:4px 0;line-height:1.6}
        .cm-desc{font-size:13.5px;color:#3d3d42;margin:0 0 14px;line-height:1.7}
        .cm-note{padding:10px 14px;background:#FEF3C7;color:#7C5A05;border-radius:8px;font-size:12px;margin-bottom:8px}
        .cm-fine{font-size:11px;color:#9CA3AF;font-style:italic;margin:0 0 22px}
        .cm-actions{display:flex;gap:10px}
        .cm-btn{flex:1;padding:12px;border-radius:12px;border:0;font:inherit;font-weight:700;font-size:13.5px;cursor:pointer;transition:opacity .12s}
        .cm-btn:disabled{opacity:.5;cursor:not-allowed}
        .cm-btn--ghost{background:#F3F4F6;color:#111}
        .cm-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}
        @keyframes mp-fade{from{opacity:0}to{opacity:1}}
        @keyframes mp-rise{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════
// FAQ data
// ══════════════════════════════════════

const FAQS = [
  { q: "VIP 和 SVIP 最大区别是什么?", a: "SVIP 拥有更高的新聊天对象额度 (200 vs 60)、翻译不限量、消息在 inbox 优先展示、视频确认优先、每月 5 次平台人工推荐、Credits 充值 +20% bonus。VIP 已足够解除日常聊天限制,SVIP 面向高频与高端用户。" },
  { q: "开通会员后,所有照片视频都免费吗?", a: "不是。会员主要解除聊天限制并提升沟通效率。部分私密照片和视频仍需要 Credits 解锁。会员每月赠送 Credits (VIP 80 · SVIP 220),可用于解锁 · 送礼 · 优先互动。" },
  { q: "Credits 是什么?", a: "Credits 是站内点数,用于解锁私密内容、送虚拟礼物、提升消息优先级、请求视频确认等。可通过点充获得,也通过 VIP/SVIP 会员每月赠送。" },
  { q: "免费用户可以聊天吗?", a: "可以试聊。免费用户每天可发起 1 个新聊天对象,发送最多 5 条消息。适合先浏览和体验,但持续使用建议升级 VIP。" },
  { q: "会员会自动续费吗?", a: "当前为 Demo 模式,不会真实扣款也不会真实续费。未来接入 Stripe 支付后,续费规则会在结账页明确显示,可随时取消。" },
  { q: "可以取消会员吗?", a: "可以。取消后会员权益在当前周期结束后失效,期间仍可正常使用。剩余的 Credits 不受影响。" },
  { q: "SVIP 是否保证回复?", a: "不保证。SVIP 提升沟通效率和展示优先级,但回复取决于对方意愿和匹配程度。平台不做任何回复或匹配结果承诺。" },
  { q: "为什么要限制聊天人数?", a: "为了减少骚扰和低质量群发,让认真用户和服务者都获得更好的体验。合理的沟通上限保护双方,避免无差别群发破坏社区质量。" },
];
