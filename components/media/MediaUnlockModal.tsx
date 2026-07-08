"use client";
// 解锁确认弹窗 — 三态:confirm / insufficient / login
import Link from "next/link";

type Mode = "confirm" | "insufficient" | "login";

interface Props {
  open: boolean;
  mode: Mode;
  price: number;
  balance: number;
  creatorName: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm?: () => void;   // confirm mode → 扣款
  onTopUp?: () => void;     // insufficient → 打开充值
}

export default function MediaUnlockModal({
  open, mode, price, balance, creatorName, loading, onClose, onConfirm, onTopUp,
}: Props) {
  if (!open) return null;

  return (
    <div className="mu-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="mu-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mu-x" onClick={onClose} aria-label="关闭">×</button>

        <div className="mu-icon">
          {mode === "login" ? "🔒" : mode === "insufficient" ? "🪙" : "💎"}
        </div>

        {mode === "confirm" && (
          <>
            <div className="mu-title">解锁 {creatorName} 的内容</div>
            <div className="mu-desc">解锁后可无限次查看,金币不退还</div>
            <div className="mu-price-row">
              <div>
                <div className="mu-price-label">解锁费用</div>
                <div className="mu-price"><b>{price}</b> 金币</div>
              </div>
              <div className="mu-divider" />
              <div>
                <div className="mu-price-label">解锁后余额</div>
                <div className="mu-price mu-price--sub"><b>{balance - price}</b> 金币</div>
              </div>
            </div>
            <div className="mu-actions">
              <button className="mu-btn mu-btn--ghost" onClick={onClose} disabled={loading}>取消</button>
              <button className="mu-btn mu-btn--primary" onClick={onConfirm} disabled={loading}>
                {loading ? "处理中…" : `确认解锁 · ${price} 金币`}
              </button>
            </div>
          </>
        )}

        {mode === "insufficient" && (
          <>
            <div className="mu-title">余额不足</div>
            <div className="mu-desc">解锁此内容需 <b>{price}</b> 金币,当前余额 <b>{balance}</b></div>
            <div className="mu-diff">还差 <b>{price - balance}</b> 金币</div>
            <div className="mu-actions">
              <button className="mu-btn mu-btn--ghost" onClick={onClose}>稍后再说</button>
              <button className="mu-btn mu-btn--primary" onClick={onTopUp}>去充值</button>
            </div>
          </>
        )}

        {mode === "login" && (
          <>
            <div className="mu-title">登录后可解锁</div>
            <div className="mu-desc">注册即赠 30 金币,可解锁多份专属内容</div>
            <div className="mu-actions">
              <Link href="/login" className="mu-btn mu-btn--ghost">登录</Link>
              <Link href="/register" className="mu-btn mu-btn--primary">注册领金币</Link>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .mu-backdrop{position:fixed;inset:0;background:rgba(10,10,12,.72);backdrop-filter:blur(8px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;animation:mu-fade .18s ease}
        .mu-modal{position:relative;width:100%;max-width:420px;background:#fff;border-radius:20px;padding:32px 24px 24px;box-shadow:0 30px 80px rgba(0,0,0,.35);text-align:center;animation:mu-rise .22s cubic-bezier(.2,.9,.3,1.2)}
        .mu-x{position:absolute;top:12px;right:16px;background:none;border:none;font-size:24px;cursor:pointer;color:#6a6a70;line-height:1;padding:4px 8px}
        .mu-icon{font-size:44px;margin-bottom:14px;line-height:1}
        .mu-title{font-size:20px;font-weight:700;color:#161618;margin-bottom:8px}
        .mu-desc{font-size:14px;color:#6a6a70;margin-bottom:20px;line-height:1.5}
        .mu-desc b{color:#B8A789;font-weight:700}
        .mu-price-row{display:flex;align-items:center;justify-content:center;gap:16px;background:linear-gradient(135deg,#F4F4F5,#EFEFF1);border-radius:12px;padding:14px;margin-bottom:20px}
        .mu-divider{width:1px;height:32px;background:#E8E8EC}
        .mu-price-label{font-size:11px;color:#6a6a70;text-transform:uppercase;letter-spacing:.5px}
        .mu-price{font-size:20px;color:#161618;margin-top:2px}
        .mu-price b{font-weight:800}
        .mu-price--sub{font-size:16px;color:#6a6a70}
        .mu-price--sub b{color:#6a6a70}
        .mu-diff{background:#FEE;color:#C73E3A;padding:10px 14px;border-radius:10px;font-size:14px;margin-bottom:18px}
        .mu-diff b{font-weight:800}
        .mu-actions{display:flex;gap:10px}
        .mu-btn{flex:1;padding:12px;border-radius:10px;border:none;cursor:pointer;font-weight:600;font-size:14px;text-align:center;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;transition:opacity .15s}
        .mu-btn:disabled{opacity:.5;cursor:not-allowed}
        .mu-btn--ghost{background:#F4F4F5;color:#161618}
        .mu-btn--primary{background:#161618;color:#fff}
        @keyframes mu-fade{from{opacity:0}to{opacity:1}}
        @keyframes mu-rise{from{opacity:0;transform:translateY(20px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
      `}</style>
    </div>
  );
}
