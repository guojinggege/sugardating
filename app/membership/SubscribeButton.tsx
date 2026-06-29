"use client";
import { useEffect, useState, useTransition } from "react";
import { subscribeMembership } from "./actions";

export default function SubscribeButton({
  planId,
  label = "立即开通",
  className = "btn btn-ink",
}: {
  planId: string;
  label?: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 成功提示 2.5s 后自动消失
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 2500);
    return () => clearTimeout(t);
  }, [done]);

  const onClick = () => {
    setError(null);
    startTransition(async () => {
      const res = await subscribeMembership(planId);
      if (res.ok) setDone(true);
      else setError(res.error ?? "开通失败");
    });
  };

  if (done) {
    return (
      <button type="button" className={className + " mship-cta-done"} disabled>
        ✓ 已开通(暂未接支付)
      </button>
    );
  }

  return (
    <>
      <button type="button" className={className} disabled={pending} onClick={onClick}>
        {pending ? "提交中…" : label}
      </button>
      {error && <div className="modal-err" style={{ marginTop: 8 }}>{error}</div>}
    </>
  );
}
