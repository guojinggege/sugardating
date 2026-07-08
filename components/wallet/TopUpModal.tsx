"use client";
// Mock 充值弹窗 — 不接真实支付,前端选套餐 → POST /api/wallet/top-up
import { useState } from "react";

interface TopUpPackage { coins: number; price: string; badge?: string }
const PACKAGES: TopUpPackage[] = [
  { coins: 50,  price: "S$5" },
  { coins: 100, price: "S$9",  badge: "最受欢迎" },
  { coins: 300, price: "S$25", badge: "推荐" },
  { coins: 500, price: "S$40" },
];

interface Props {
  open: boolean;
  balance: number;
  onClose: () => void;
  onSuccess: (newBalance: number) => void;
}

export default function TopUpModal({ open, balance, onClose, onSuccess }: Props) {
  const [selected, setSelected] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleTopUp() {
    setLoading(true); setError(null);
    try {
      const r = await fetch("/api/wallet/top-up", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ coins: selected }),
      });
      const data = await r.json();
      if (!data.ok) throw new Error(data.message || "充值失败");
      onSuccess(data.wallet.coins);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "充值失败,请稍后重试");
    } finally { setLoading(false); }
  }

  return (
    <div className="topup-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="topup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="topup-head">
          <div>
            <div className="topup-title">充值金币</div>
            <div className="topup-sub">当前余额 <b>{balance}</b> 金币</div>
          </div>
          <button className="topup-x" onClick={onClose} aria-label="关闭">×</button>
        </div>

        <div className="topup-grid">
          {PACKAGES.map((p) => {
            const active = selected === p.coins;
            return (
              <button
                key={p.coins}
                className={`topup-pkg ${active ? "is-active" : ""}`}
                onClick={() => setSelected(p.coins)}
              >
                {p.badge && <span className="topup-badge">{p.badge}</span>}
                <div className="topup-coins">{p.coins}</div>
                <div className="topup-coin-label">金币</div>
                <div className="topup-price">{p.price}</div>
              </button>
            );
          })}
        </div>

        {error && <div className="topup-error">{error}</div>}

        <div className="topup-note">
          仅作演示。生产环境将通过 Stripe 处理支付,平台不撮合任何线下交易。
        </div>

        <div className="topup-actions">
          <button className="topup-btn topup-btn--ghost" onClick={onClose} disabled={loading}>取消</button>
          <button className="topup-btn topup-btn--primary" onClick={handleTopUp} disabled={loading}>
            {loading ? "处理中…" : "确认充值"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .topup-backdrop{position:fixed;inset:0;background:rgba(10,10,12,.72);backdrop-filter:blur(8px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;animation:tu-fade .18s ease}
        .topup-modal{width:100%;max-width:480px;background:#fff;border-radius:20px;padding:24px;box-shadow:0 30px 80px rgba(0,0,0,.35);animation:tu-rise .22s cubic-bezier(.2,.9,.3,1.2)}
        .topup-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px}
        .topup-title{font-size:20px;font-weight:700;color:#161618}
        .topup-sub{font-size:13px;color:#6a6a70;margin-top:4px}
        .topup-sub b{color:#B8A789;font-weight:700}
        .topup-x{background:none;border:none;font-size:24px;cursor:pointer;color:#6a6a70;line-height:1;padding:4px 8px}
        .topup-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
        .topup-pkg{position:relative;background:#F4F4F5;border:2px solid transparent;border-radius:12px;padding:16px 12px;cursor:pointer;text-align:center;transition:all .15s}
        .topup-pkg:hover{background:#EFEFF1}
        .topup-pkg.is-active{background:#fff;border-color:#161618;box-shadow:0 4px 16px rgba(0,0,0,.08)}
        .topup-badge{position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#B8A789;color:#fff;font-size:10px;padding:2px 10px;border-radius:99px;font-weight:600;white-space:nowrap}
        .topup-coins{font-size:24px;font-weight:800;color:#161618;line-height:1}
        .topup-coin-label{font-size:11px;color:#6a6a70;margin-top:2px}
        .topup-price{font-size:14px;color:#161618;font-weight:600;margin-top:8px;padding-top:8px;border-top:1px dashed #E8E8EC}
        .topup-error{background:#FEE;color:#C73E3A;padding:10px 12px;border-radius:8px;font-size:13px;margin-bottom:12px}
        .topup-note{font-size:11px;color:#8a8a92;text-align:center;margin-bottom:14px;line-height:1.5}
        .topup-actions{display:flex;gap:10px}
        .topup-btn{flex:1;padding:12px;border-radius:10px;border:none;cursor:pointer;font-weight:600;font-size:14px;transition:opacity .15s}
        .topup-btn:disabled{opacity:.5;cursor:not-allowed}
        .topup-btn--ghost{background:#F4F4F5;color:#161618}
        .topup-btn--primary{background:#161618;color:#fff}
        @keyframes tu-fade{from{opacity:0}to{opacity:1}}
        @keyframes tu-rise{from{opacity:0;transform:translateY(20px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
      `}</style>
    </div>
  );
}
