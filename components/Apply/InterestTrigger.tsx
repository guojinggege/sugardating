"use client";
// /apply 页面通用 · 任何按钮通过它调起意向表单
// 保留原 className · 只替换 onClick 为 openDialog(source)
import { useInterestDialog } from "./InterestDialogProvider";

type Source =
  | "inline_form" | "header_apply" | "hero_apply"
  | "floating_primary" | "floating_secondary"
  | "onboarding_cta" | "footer_apply" | "mobile_menu_apply";

interface Props {
  source?: Source;
  className?: string;
  children: React.ReactNode;
}

export default function InterestTrigger({ source = "inline_form", className, children }: Props) {
  const { openDialog } = useInterestDialog();
  return (
    <button type="button" className={className} onClick={() => openDialog(source)}>
      {children}
    </button>
  );
}
