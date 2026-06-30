"use client";
// 服务卡的"立即预约"按钮 — 需要登录 gate
// 抽出来是因为 ServiceCards.tsx 是 server component
import { useRequireLogin } from "@/components/Auth/AuthProvider";

export default function ServiceCtaButton({ label }: { label: string }) {
  const requireLogin = useRequireLogin();
  const onClick = () => {
    if (!requireLogin()) return;
    // TODO: 真正的预约流程接入
  };
  return (
    <button type="button" onClick={onClick} className="cr-service-cta">
      {label}
      <svg viewBox="0 0 24 24" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </button>
  );
}
