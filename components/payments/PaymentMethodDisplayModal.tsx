"use client";
// 支付方式展示弹窗 · 纯 UI · 不创建订单 · 不调支付 API
// 用户点击某种方式 → 显示已选择状态 + "支付功能暂未开放" 提示
import { useEffect, useRef, useState } from "react";
import PaymentMethodRow from "./PaymentMethodRow";
import { DISPLAY_PAYMENT_METHODS } from "@/lib/payments/display-methods";

interface Props {
  open: boolean;
  onClose: () => void;
  /** 弹窗顶部展示的订单摘要 · 例:付费会员 · 3 个月 · £69.99 */
  productLine?: string;
  amountLine?: string;
}

export default function PaymentMethodDisplayModal({ open, onClose, productLine, amountLine }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Reset selection each time modal opens
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      setSelectedId(null);
    } else {
      setTimeout(() => openerRef.current?.focus?.(), 0);
    }
  }, [open]);

  // Esc + focus trap
  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    if (!el) return;
    (el.querySelector<HTMLElement>("button, [tabindex]"))?.focus?.();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const items = Array.from(el.querySelectorAll<HTMLElement>('button, [tabindex]:not([tabindex="-1"])'));
        if (items.length === 0) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const selected = DISPLAY_PAYMENT_METHODS.find((m) => m.id === selectedId) ?? null;

  return (
    <>
      <div className="pmm-overlay" onClick={onClose} aria-hidden />
      <div
        ref={dialogRef}
        className="pmm"
        role="dialog"
        aria-modal="true"
        aria-label="选择付款方式"
      >
        <div className="pmm-h">
          <div>
            <div className="pmm-eye">Payment</div>
            <h2>选择付款方式</h2>
            {(productLine || amountLine) && (
              <p>
                {productLine && <span>{productLine}</span>}
                {amountLine && <b>{amountLine}</b>}
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} className="pmm-x" aria-label="关闭">×</button>
        </div>

        <div className="pmm-body">
          <ul className="pmm-list">
            {DISPLAY_PAYMENT_METHODS.map((m) => (
              <li key={m.id}>
                <PaymentMethodRow
                  method={m}
                  selected={selectedId === m.id}
                  onClick={() => setSelectedId(m.id)}
                />
              </li>
            ))}
          </ul>

          {selected && (
            <div className="pmm-notice" role="status" aria-live="polite">
              <div className="pmm-notice-h">
                <b>已选择</b>
                <span>{selected.title}</span>
              </div>
              <p>
                支付功能暂未开放 · 我们正在与英国合规支付商完成审核对接 ·
                届时会以邮件与站内通知告知你。
              </p>
              <p className="pmm-notice-fine">
                本次不会创建订单 · 不会扣款 · 不会修改你的会员或 Credits 余额。
              </p>
            </div>
          )}
        </div>

        <div className="pmm-foot">
          <button type="button" onClick={onClose} className="pmm-btn pmm-btn--ghost">关闭</button>
        </div>

        <style>{styles}</style>
      </div>
    </>
  );
}

const styles = `
  .pmm-overlay{position:fixed;inset:0;background:rgba(10,10,12,.72);backdrop-filter:blur(8px);z-index:900;animation:pmm-fade .16s}
  .pmm{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:901;width:min(520px,calc(100vw - 32px));max-height:min(760px,calc(100vh - 40px));background:linear-gradient(180deg,#FBFAF7,#fff);color:#171512;border:1px solid #E9E3DA;border-radius:22px;box-shadow:0 30px 100px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden;animation:pmm-rise .22s cubic-bezier(.2,.9,.3,1.2)}

  .pmm-h{padding:20px 24px 14px;border-bottom:1px solid #F0EAE1;display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
  .pmm-eye{font-size:10.5px;letter-spacing:.24em;color:#B8A789;font-weight:800;text-transform:uppercase}
  .pmm-h h2{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:24px;font-weight:600;color:#171512;margin:4px 0 6px;letter-spacing:-0.008em}
  .pmm-h p{margin:0;display:flex;justify-content:space-between;align-items:baseline;gap:12px;font-size:12.5px;color:#77716A}
  .pmm-h p b{font-family:ui-monospace,monospace;color:#171512;font-weight:800}
  .pmm-x{background:#F7F4EF;color:#171512;border:1px solid #E9E3DA;width:32px;height:32px;border-radius:50%;font-size:20px;line-height:1;cursor:pointer;flex-shrink:0}
  .pmm-x:hover{border-color:#171512}

  .pmm-body{flex:1;overflow-y:auto;padding:14px 20px;display:flex;flex-direction:column;gap:12px}
  .pmm-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}

  .pmm-notice{padding:14px 16px;background:#FEF3C7;border:1px dashed #F5D073;border-radius:12px;color:#7C5A05}
  .pmm-notice-h{display:flex;align-items:baseline;gap:8px;margin-bottom:6px}
  .pmm-notice-h b{font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:800}
  .pmm-notice-h span{font-size:13.5px;font-weight:800;color:#1a1409}
  .pmm-notice p{margin:0 0 4px;font-size:12.5px;line-height:1.65}
  .pmm-notice-fine{color:#8a6a1c;font-size:11.5px !important}

  .pmm-foot{padding:14px 20px;border-top:1px solid #F0EAE1;background:#FBFAF7;display:flex;justify-content:flex-end;gap:8px}
  .pmm-btn{padding:10px 22px;border-radius:99px;border:0;font:inherit;font-size:13px;font-weight:800;cursor:pointer}
  .pmm-btn--ghost{background:#F7F4EF;color:#171512;border:1px solid #E9E3DA}
  .pmm-btn--ghost:hover{border-color:#171512}

  @keyframes pmm-fade{from{opacity:0}to{opacity:1}}
  @keyframes pmm-rise{from{opacity:0;transform:translate(-50%,-42%) scale(.96)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}

  @media(max-width:640px){
    .pmm{left:0;top:auto;bottom:0;transform:none;width:100vw;max-height:90vh;border-radius:22px 22px 0 0;padding-bottom:env(safe-area-inset-bottom,0)}
    @keyframes pmm-rise{from{transform:translateY(24%)}to{transform:translateY(0)}}
  }
`;
