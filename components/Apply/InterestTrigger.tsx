"use client";
// 通用 · /apply 页面任何 button/link 都可以通过它调起入驻意向弹窗
// 保留原按钮 className · 不改视觉 · 只替换点击行为
import { useInterestDialog } from "./InterestDialogProvider";

interface Props {
  source?: "hero" | "inline" | "sticky" | "final";
  className?: string;
  children: React.ReactNode;
}

export default function InterestTrigger({ source = "inline", className, children }: Props) {
  const { openDialog } = useInterestDialog();
  return (
    <button type="button" className={className} onClick={() => openDialog(source)}>
      {children}
    </button>
  );
}
