"use client";
// /apply · 两个悬浮 CTA · 全部调起同一张意向表
// 桌面 · 右侧纵向双按钮 · 移动 · 底部双按钮栏
// 打开表单时自动隐藏(避免遮键盘)
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useInterestDialog } from "./InterestDialogProvider";

export default function ApplyFloatingCTAs() {
  const t = useTranslations("apply.interest");
  const [visible, setVisible] = useState(false);
  const { openDialog, open } = useInterestDialog();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shown = visible && !open;

  return (
    <div className={"cif-fabs" + (shown ? " on" : "")} aria-hidden={!shown}>
      <button type="button" className="cif-fab cif-fab--ghost"
        onClick={() => openDialog("floating_secondary")}>
        {t("floatSecondary")}
      </button>
      <button type="button" className="cif-fab cif-fab--primary"
        onClick={() => openDialog("floating_primary")}>
        {t("floatPrimary")}
      </button>
    </div>
  );
}
