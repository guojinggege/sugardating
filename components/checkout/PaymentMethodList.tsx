"use client";
import type { PaymentMethodConfig } from "@/lib/payments/types";

interface Props {
  methods: PaymentMethodConfig[];
  selected: PaymentMethodConfig | null;
  disabled?: boolean;
  onSelect: (m: PaymentMethodConfig) => void;
}

const BADGE_LABEL: Record<string, string> = {
  "recommended":        "推荐",
  "instant":            "即时确认",
  "no-auto-renew":      "不自动续费",
  "requires-bank-app":  "需要银行 App",
  "crypto":             "Crypto",
};

const ICON: Record<string, string> = {
  "card":     "💳",
  "gpay":     "G",
  "apay":     "",
  "paypal":   "P",
  "bank-app": "🏦",
  "transfer": "⇄",
  "usdc":     "$",
  "usdt":     "₮",
  "voucher":  "🎟",
};

export default function PaymentMethodList({ methods, selected, disabled, onSelect }: Props) {
  return (
    <ul className="pml">
      {methods.map((m) => {
        const isSel = selected?.id === m.id;
        return (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => onSelect(m)}
              disabled={disabled}
              aria-pressed={isSel}
              className={"pm" + (isSel ? " is-selected" : "")}
            >
              <span className="pm-icon" aria-hidden>{ICON[m.icon ?? ""] ?? "•"}</span>
              <div className="pm-body">
                <div className="pm-h">
                  <b>{m.displayName}</b>
                  {(m.badges ?? []).map((b) => <span key={b} className={"pm-badge pm-badge--" + b}>{BADGE_LABEL[b] ?? b}</span>)}
                </div>
                <p>{m.description}</p>
              </div>
              <span className="pm-arrow" aria-hidden>→</span>
            </button>
          </li>
        );
      })}

      <style>{`
        .pml{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
        .pm{display:flex;gap:14px;align-items:center;width:100%;padding:14px 18px;background:#fff;border:1px solid #E9E3DA;border-radius:16px;font:inherit;text-align:left;cursor:pointer;transition:border-color .12s,background .12s}
        .pm:hover:not(:disabled){border-color:#B8A789}
        .pm.is-selected{border-color:#B8A789;background:linear-gradient(135deg,#FBF7EF,#F4EEDF)}
        .pm:disabled{opacity:.55;cursor:not-allowed}

        .pm-icon{width:40px;height:40px;background:#F7F4EF;color:#171512;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;flex-shrink:0}

        .pm-body{flex:1;min-width:0}
        .pm-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .pm-h b{font-size:14px;font-weight:800;color:#171512;letter-spacing:-0.005em}
        .pm-badge{font-size:9.5px;letter-spacing:.06em;font-weight:800;padding:2px 8px;border-radius:99px;background:#F0EAE1;color:#77716A;text-transform:uppercase}
        .pm-badge--recommended{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}
        .pm-badge--instant{background:rgba(66,133,107,.16);color:#2B6249}
        .pm-badge--crypto{background:rgba(75,94,128,.16);color:#4B5E80}
        .pm-badge--no-auto-renew{background:rgba(119,113,106,.12);color:#544f47}
        .pm-badge--requires-bank-app{background:rgba(183,121,69,.16);color:#7A4C27}
        .pm p{margin:2px 0 0;font-size:12px;color:#77716A;line-height:1.5}
        .pm-arrow{color:#a19a91;font-size:16px;font-weight:800;flex-shrink:0}
      `}</style>
    </ul>
  );
}
