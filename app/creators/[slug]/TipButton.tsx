"use client";
import { useEffect, useState, useTransition } from "react";
import { useRequireLogin } from "@/components/Auth/AuthProvider";
import { addTip } from "./actions";

const PRESETS = [2, 5, 10];

export default function TipButton({ slug }: { slug: string }) {
  const requireLogin = useRequireLogin();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number | "custom">(5);
  const [custom, setCustom] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const reset = () => {
    setAmount(5); setCustom(""); setMessage("");
    setSubmitted(false); setError(null);
  };

  const close = () => { if (pending) return; setOpen(false); reset(); };

  // Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pending]);

  // 提交后 2s 自动关
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(close, 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const finalAmount = amount === "custom" ? parseInt(custom, 10) : amount;
    if (!Number.isFinite(finalAmount) || finalAmount < 1) {
      setError("请输入有效金额(>= S$1)");
      return;
    }
    const fd = new FormData();
    fd.set("amount", String(finalAmount));
    fd.set("message", message);
    startTransition(async () => {
      const res = await addTip(slug, fd);
      if (res.ok) setSubmitted(true);
      else setError(res.error ?? "提交失败");
    });
  };

  return (
    <>
      <button type="button" className="btn btn-out" onClick={() => { if (requireLogin()) setOpen(true); }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4 }}>
          <path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" />
        </svg>
        打赏
      </button>

      {open && (
        <div className="modal-backdrop" onClick={close} role="dialog" aria-modal="true" aria-label="打赏">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {submitted ? (
              <div className="modal-success">
                <div className="modal-success-ic">✓</div>
                <h3>感谢你的支持</h3>
                <p>打赏已记录,创作者会看到你的留言。</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="modal-h"><h3>打赏创作者</h3><p>不接真实支付,只在 DB 留个记录。</p></div>
                <div className="tip-amounts">
                  {PRESETS.map((a) => (
                    <button type="button" key={a}
                      className={"tip-amt" + (amount === a ? " on" : "")}
                      onClick={() => setAmount(a)}>S${a}</button>
                  ))}
                  <button type="button"
                    className={"tip-amt" + (amount === "custom" ? " on" : "")}
                    onClick={() => setAmount("custom")}>自定义</button>
                </div>
                {amount === "custom" && (
                  <input type="number" min={1} max={9999} value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="输入金额(S$)" className="tip-custom" required autoFocus />
                )}
                <textarea
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="留一句话(可选)" maxLength={200} rows={3}
                  className="tip-msg"
                />
                {error && <div className="modal-err">{error}</div>}
                <div className="modal-acts">
                  <button type="button" className="btn btn-out" onClick={close} disabled={pending}>取消</button>
                  <button type="submit" className="btn btn-ink" disabled={pending}>
                    {pending ? "提交中…" : "确认打赏"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
