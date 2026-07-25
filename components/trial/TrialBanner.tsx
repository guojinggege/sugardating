"use client";
// 通用 · 会员页顶部展示 · 4 状态:
//  1. 进度中 (显示 5min · 5 follows 进度条)
//  2. 已解锁 (显示 offer CTA · 打开 modal)
//  3. active (倒数 24h · 底部取消)
//  4. cancelled / expired / converted / ineligible → 隐藏
import { useEffect, useState } from "react";
import type { EligibilitySnapshot, TrialRecord } from "@/lib/trial-offer/types";
import TrialOfferModal from "./TrialOfferModal";

interface Fetched {
  ok: boolean;
  snapshot: EligibilitySnapshot;
  trial: TrialRecord | null;
  secondsLeft: number;
  demoMode: boolean;
}

function pct(n: number, d: number): number { return Math.min(100, Math.round((n / d) * 100)); }
function fmtDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function TrialBanner() {
  const [data, setData] = useState<Fetched | null>(null);
  const [showOffer, setShowOffer] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [cancelBusy, setCancelBusy] = useState(false);

  async function refresh() {
    const r = await fetch("/api/trial/eligibility", { credentials: "include" });
    if (!r.ok) { setData(null); return; }
    const d = await r.json();
    if (d?.ok) setData(d as Fetched);
  }
  useEffect(() => { refresh(); }, []);
  // Countdown tick
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  if (!data) return null;
  const { snapshot, trial, demoMode } = data;

  // 已使用过首充 / trial 已 converted-expired-cancelled → 隐藏
  if (snapshot.hasUsedIntro7d && (!trial || trial.status !== "active")) return null;
  if (snapshot.isCurrentlyPaid && (!trial || trial.status !== "active")) return null;

  // Active 状态 · 倒数 · demo mode 显示 "测试模式 · 不会扣款"
  if (trial && trial.status === "active" && trial.endsAt) {
    const secondsLeft = Math.max(0, Math.floor((new Date(trial.endsAt).getTime() - now) / 1000));
    return (
      <div className="tb tb--active">
        <div className="tb-h">
          <div className="tb-eye">{demoMode ? "Demo · 24h Trial" : "Active · £0 Trial"}</div>
          <b>24 小时体验中 · 全部付费会员权益已生效</b>
        </div>
        <div className="tb-count">
          <span>剩余</span>
          <b>{fmtDuration(secondsLeft)}</b>
        </div>
        <p className="tb-info">
          {demoMode ? (
            <>
              <b>测试模式 · 不会扣款</b> · 到期后自动恢复基础会员 · 正式接入周期支付后才会按 £29.99/月 续订
            </>
          ) : (
            <>
              到期后自动转 <b>付费会员 · 月度 £29.99</b> · 在到期前可随时取消,不会扣款
            </>
          )}
          {trial.consent && <> · 已授权支付方式:<em>{trial.consent.paymentMethodDescriptor}</em></>}
        </p>
        <button
          type="button"
          onClick={async () => {
            if (cancelBusy) return;
            if (!confirm(demoMode ? "结束当前测试体验? 付费会员权益会立即失效。" : "取消 24h 体验? 付费会员权益会立即失效,但不会产生任何扣款。")) return;
            setCancelBusy(true);
            try {
              const r = await fetch("/api/trial/cancel", { method: "POST", credentials: "include" });
              const d = await r.json();
              if (d?.ok) refresh();
            } finally { setCancelBusy(false); }
          }}
          className="tb-cancel"
        >{cancelBusy ? "取消中…" : (demoMode ? "结束测试体验" : "取消体验 · 避免自动续费")}</button>
        <style>{bannerStyles}</style>
      </div>
    );
  }

  // Production 卡在 payment_mandate_required · 展示提示并允许再次点开 modal
  if (trial && trial.status === "payment_mandate_required") {
    return (
      <>
        <div className="tb tb--mandate">
          <div className="tb-h">
            <div className="tb-eye">Intro Offer · Awaiting Payment</div>
            <b>自动续费付款授权尚未开放,体验暂未开始</b>
          </div>
          <p className="tb-info">
            我们正在与英国合规支付商完成周期付款授权对接 · 完成后你的 24 小时体验会自动开始 ·
            你不需要重复领取。
          </p>
          <button type="button" onClick={() => setShowOffer(true)} className="tb-cta">查看优惠说明</button>
          <style>{bannerStyles}</style>
        </div>
        <TrialOfferModal
          open={showOffer}
          onClose={() => setShowOffer(false)}
          onActivated={() => { setShowOffer(false); refresh(); }}
          demoMode={demoMode}
        />
      </>
    );
  }

  // Ineligible 情况:如果已经使用过 24h · 直接隐藏
  if (snapshot.hasUsedTrial24h) return null;

  // 进度中或已解锁
  const engProgress = pct(snapshot.engagementSeconds, snapshot.requiredSeconds);
  const followProgress = pct(snapshot.followCount, snapshot.requiredFollows);

  return (
    <>
      <div className={"tb " + (snapshot.eligible ? "tb--unlocked" : "tb--progress")}>
        <div className="tb-h">
          <div className="tb-eye">Intro Offer · £0</div>
          <b>{snapshot.eligible ? "解锁 24 小时 £0 付费会员体验" : "累计浏览与关注达到即可解锁 24h £0 体验"}</b>
        </div>

        <ul className="tb-req">
          <li>
            <div className="tb-req-h">
              <span>浏览时长 · 累计 5 分钟</span>
              <b>{Math.floor(snapshot.engagementSeconds / 60)}m {snapshot.engagementSeconds % 60}s / 5m</b>
            </div>
            <div className="tb-bar"><div className="tb-bar-fill" style={{ width: engProgress + "%" }} /></div>
          </li>
          <li>
            <div className="tb-req-h">
              <span>关注创作者 · 至少 5 位</span>
              <b>{snapshot.followCount} / {snapshot.requiredFollows}</b>
            </div>
            <div className="tb-bar"><div className="tb-bar-fill" style={{ width: followProgress + "%" }} /></div>
          </li>
        </ul>

        {snapshot.eligible ? (
          <button type="button" onClick={() => setShowOffer(true)} className="tb-cta">立即领取 24h £0 →</button>
        ) : (
          <p className="tb-fine">
            打开创作者主页浏览 · 关注你感兴趣的 sugargirl / sugarboy · 达到条件后此处会自动出现「领取」按钮。
          </p>
        )}

        <style>{bannerStyles}</style>
      </div>
      <TrialOfferModal
        open={showOffer}
        onClose={() => setShowOffer(false)}
        onActivated={() => { setShowOffer(false); refresh(); }}
        demoMode={demoMode}
      />
    </>
  );
}

const bannerStyles = `
  .tb{position:relative;background:linear-gradient(135deg,#0F0F11,#161618);color:#EEDDB8;border:1px solid rgba(238,221,184,.28);border-radius:20px;padding:22px 26px;display:flex;flex-direction:column;gap:12px;box-shadow:0 24px 60px -30px rgba(184,167,137,.5)}
  .tb--active{background:linear-gradient(135deg,#0F0F11,#2b2213)}
  .tb--unlocked{background:linear-gradient(135deg,#0F0F11,#3d2f16);border-color:#B8A789}
  .tb--mandate{background:linear-gradient(135deg,#0F0F11,#2b1b0c);border-color:rgba(183,121,69,.5)}
  .tb-h{display:flex;flex-direction:column;gap:2px}
  .tb-eye{font-size:10.5px;letter-spacing:.24em;color:#B8A789;font-weight:800;text-transform:uppercase}
  .tb-h b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:22px;font-weight:600;color:#EEDDB8;letter-spacing:-0.008em}

  .tb-count{display:flex;align-items:baseline;gap:8px}
  .tb-count span{font-size:11.5px;color:rgba(238,221,184,.65)}
  .tb-count b{font-family:ui-monospace,monospace;font-size:28px;color:#EEDDB8;font-weight:800;font-variant-numeric:tabular-nums}

  .tb-req{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
  .tb-req li{background:rgba(238,221,184,.08);padding:8px 12px;border-radius:10px}
  .tb-req-h{display:flex;justify-content:space-between;align-items:baseline;font-size:12px;color:rgba(238,221,184,.7);margin-bottom:4px}
  .tb-req-h b{color:#EEDDB8;font-weight:800;font-family:ui-monospace,monospace}
  .tb-bar{height:6px;background:rgba(238,221,184,.14);border-radius:99px;overflow:hidden}
  .tb-bar-fill{height:100%;background:linear-gradient(90deg,#EEDDB8,#B8A789);border-radius:99px;transition:width .4s}

  .tb-info{margin:0;font-size:12.5px;color:rgba(238,221,184,.75);line-height:1.65}
  .tb-info b{color:#EEDDB8;font-weight:800}
  .tb-info em{font-style:italic;color:rgba(238,221,184,.9)}
  .tb-fine{margin:0;font-size:12.5px;color:rgba(238,221,184,.6);line-height:1.7}

  .tb-cta{align-self:flex-start;padding:11px 22px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;border:0;border-radius:99px;font:inherit;font-size:13.5px;font-weight:800;cursor:pointer;letter-spacing:-0.005em}
  .tb-cta:hover{transform:translateY(-1px);box-shadow:0 12px 28px -14px rgba(238,221,184,.5)}
  .tb-cancel{align-self:flex-start;background:rgba(238,221,184,.08);color:#EEDDB8;border:1px solid rgba(238,221,184,.28);border-radius:99px;padding:8px 16px;font:inherit;font-size:12px;font-weight:700;cursor:pointer}
  .tb-cancel:hover{background:rgba(238,221,184,.14)}
`;
