"use client";
// Trial 领取 modal · 展示条款 · 需要用户显式勾选授权 · 提交 activate
// P0 Demo · 支付方式选自复用的 PaymentMethodDisplayModal (但由本 modal 内嵌 6 常见方式)
// 生产 · 应打开真实支付授权 (Stripe SetupIntent · TrueLayer VRP 等) · 完成后再 activate
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onActivated: () => void;
}

// 简洁支付方式列表 · 与 PaymentMethodDisplayModal 保持一致品牌 · 用户选一种作为绑定
const METHODS = [
  { id: "card",         label: "Visa / Mastercard / American Express" },
  { id: "apple_pay",    label: "Apple Pay" },
  { id: "google_pay",   label: "Google Pay" },
  { id: "paypal",       label: "PayPal" },
  { id: "pay_by_bank",  label: "Pay by Bank (英国开放银行)" },
  { id: "direct_debit", label: "Direct Debit (周期扣款)" },
];

export default function TrialOfferModal({ open, onClose, onActivated }: Props) {
  const [method, setMethod] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  const canSubmit = !!method && agreed && !busy;

  async function submit() {
    if (!canSubmit) return;
    const chosen = METHODS.find((m) => m.id === method);
    if (!chosen) return;
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/trial/activate", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          consent: true,
          paymentMethodDescriptor: `${chosen.label} · Demo`,
        }),
      });
      const d = await r.json();
      if (!r.ok || !d?.ok) throw new Error(d?.message || "领取失败");
      onActivated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "领取失败");
    } finally { setBusy(false); }
  }

  return (
    <>
      <div className="tom-overlay" onClick={onClose} aria-hidden />
      <div className="tom" role="dialog" aria-modal="true" aria-label="24h £0 体验授权">
        <div className="tom-h">
          <div>
            <div className="tom-eye">24 小时 £0 体验</div>
            <h2>解锁全部付费会员权益 · 24 小时</h2>
          </div>
          <button type="button" onClick={onClose} className="tom-x" aria-label="关闭">×</button>
        </div>

        <div className="tom-body">
          <div className="tom-facts">
            <div><b>体验时长</b><span>24 小时</span></div>
            <div><b>费用</b><span>£0</span></div>
            <div><b>到期后</b><span>£29.99 / 月</span></div>
            <div><b>取消</b><span>到期前随时可取消 · 不扣款</span></div>
          </div>

          <div className="tom-benefits">
            <b>包含权益</b>
            <ul>
              <li>· 解除聊天对象人数与消息次数限制</li>
              <li>· 多语言自动翻译 · 已读状态 · 匿名浏览</li>
              <li>· 高级筛选</li>
              <li>· 付费会员身份 (24 小时内生效)</li>
            </ul>
          </div>

          <div className="tom-method">
            <b>选择用于自动续费的支付方式 <span>*</span></b>
            <div className="tom-method-list">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  aria-pressed={method === m.id}
                  className={"tom-method-row" + (method === m.id ? " is-selected" : "")}
                >
                  <span className="tom-method-name">{m.label}</span>
                  <span className="tom-method-arrow">{method === m.id ? "✓" : "→"}</span>
                </button>
              ))}
            </div>
            <p className="tom-fine">
              授权后 · 24 小时内你不会被扣款 · 到期时按 £29.99/月 收费 · 除非你在到期前取消。
              真实支付通道尚在接入中 · Demo 模式下不产生任何扣款。
            </p>
          </div>

          <label className="tom-agree">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>
              我已阅读并同意 <a href="/legal/terms" target="_blank" rel="noreferrer">服务条款</a> 与 <a href="/legal/privacy" target="_blank" rel="noreferrer">隐私政策</a> ·
              授权 Sugardating 在 24 小时体验期结束后按 £29.99/月 自动续费 ·
              我理解可以在到期前随时取消,取消后不产生任何扣款。
            </span>
          </label>

          {err && <div className="tom-err">{err}</div>}
        </div>

        <div className="tom-foot">
          <button type="button" onClick={onClose} className="tom-btn tom-btn--ghost">稍后再说</button>
          <button type="button" onClick={submit} disabled={!canSubmit} className="tom-btn tom-btn--gold">
            {busy ? "开通中…" : "确认领取 · 24 小时 £0"}
          </button>
        </div>

        <style>{modalStyles}</style>
      </div>
    </>
  );
}

const modalStyles = `
  .tom-overlay{position:fixed;inset:0;background:rgba(10,10,12,.72);backdrop-filter:blur(8px);z-index:900;animation:tom-fade .16s}
  .tom{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:901;width:min(560px,calc(100vw - 32px));max-height:min(760px,calc(100vh - 40px));background:linear-gradient(180deg,#161618,#0F0F11);color:#EEDDB8;border:1px solid #B8A789;border-radius:22px;box-shadow:0 30px 100px rgba(0,0,0,.5);display:flex;flex-direction:column;overflow:hidden}
  .tom-h{padding:20px 24px 14px;border-bottom:1px solid rgba(238,221,184,.14);display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
  .tom-eye{font-size:10.5px;letter-spacing:.24em;color:#B8A789;font-weight:800;text-transform:uppercase}
  .tom-h h2{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:24px;font-weight:600;color:#EEDDB8;margin:4px 0 0;letter-spacing:-0.008em}
  .tom-x{background:rgba(238,221,184,.08);color:#EEDDB8;border:0;width:32px;height:32px;border-radius:50%;font-size:20px;cursor:pointer;line-height:1}

  .tom-body{flex:1;overflow-y:auto;padding:16px 22px;display:flex;flex-direction:column;gap:14px}
  .tom-facts{display:grid;grid-template-columns:1fr 1fr;gap:6px 12px;padding:12px 14px;background:rgba(238,221,184,.06);border:1px dashed rgba(238,221,184,.2);border-radius:12px;font-size:12.5px}
  .tom-facts > div{display:flex;justify-content:space-between}
  .tom-facts b{color:rgba(238,221,184,.6);font-weight:700}
  .tom-facts span{color:#EEDDB8;font-weight:800}

  .tom-benefits{padding:12px 14px;background:rgba(238,221,184,.06);border-radius:12px}
  .tom-benefits b{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#B8A789;font-weight:800;margin-bottom:6px}
  .tom-benefits ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:3px;font-size:12.5px;color:rgba(238,221,184,.85);line-height:1.7}

  .tom-method{display:flex;flex-direction:column;gap:6px}
  .tom-method > b{font-size:12px;color:#EEDDB8;font-weight:800}
  .tom-method > b span{color:#F5D073}
  .tom-method-list{display:flex;flex-direction:column;gap:4px}
  .tom-method-row{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:rgba(238,221,184,.04);border:1px solid rgba(238,221,184,.14);border-radius:10px;color:#EEDDB8;font:inherit;font-size:12.5px;cursor:pointer;text-align:left}
  .tom-method-row:hover{border-color:rgba(238,221,184,.4)}
  .tom-method-row.is-selected{background:linear-gradient(135deg,rgba(238,221,184,.18),rgba(184,167,137,.08));border-color:#B8A789}
  .tom-method-arrow{color:rgba(238,221,184,.5);font-weight:800}
  .tom-method-row.is-selected .tom-method-arrow{color:#42856B}

  .tom-fine{margin:6px 0 0;font-size:11px;color:rgba(238,221,184,.55);line-height:1.7}

  .tom-agree{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;background:rgba(238,221,184,.06);border:1px dashed rgba(238,221,184,.2);border-radius:10px;font-size:12px;color:rgba(238,221,184,.85);line-height:1.7;cursor:pointer}
  .tom-agree input{margin-top:2px;flex-shrink:0;width:16px;height:16px;accent-color:#EEDDB8}
  .tom-agree a{color:#EEDDB8;text-decoration:underline}

  .tom-err{padding:8px 12px;background:rgba(220,38,38,.18);color:#FCA5A5;border-radius:8px;font-size:12px}

  .tom-foot{padding:14px 22px;border-top:1px solid rgba(238,221,184,.14);display:flex;justify-content:flex-end;gap:8px}
  .tom-btn{padding:10px 20px;border-radius:99px;border:0;font:inherit;font-size:13px;font-weight:800;cursor:pointer}
  .tom-btn:disabled{opacity:.5;cursor:not-allowed}
  .tom-btn--ghost{background:rgba(238,221,184,.08);color:#EEDDB8;border:1px solid rgba(238,221,184,.24)}
  .tom-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}

  @keyframes tom-fade{from{opacity:0}to{opacity:1}}
  @media(max-width:640px){
    .tom{left:0;top:auto;bottom:0;transform:none;width:100vw;max-height:92vh;border-radius:22px 22px 0 0;padding-bottom:env(safe-area-inset-bottom,0)}
    .tom-facts{grid-template-columns:1fr}
  }
`;
