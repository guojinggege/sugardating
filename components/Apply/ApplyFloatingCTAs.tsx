"use client";
// /apply 页面 · 两个悬浮操作按钮
// 主按钮 · 提交入驻意向 → 打开同一张表单弹窗
// 次按钮 · 了解平台优势 → 平滑滚动到 #benefits
// 滚动 > 400px 才出现 · 避免遮 Hero
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useInterestDialog } from "./InterestDialogProvider";

export default function ApplyFloatingCTAs() {
  const t = useTranslations("apply.interest");
  const [visible, setVisible] = useState(false);
  const { openDialog } = useInterestDialog();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollBenefits(e: React.MouseEvent) {
    e.preventDefault();
    const el = document.getElementById("benefits");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className={"cif-fabs" + (visible ? " on" : "")} aria-hidden={!visible}>
      <button type="button" className="cif-fab cif-fab--primary"
        onClick={() => openDialog("sticky")}>
        {t("floatPrimary")}
      </button>
      <a href="#benefits" className="cif-fab cif-fab--ghost" onClick={scrollBenefits}>
        {t("floatSecondary")}
      </a>
    </div>
  );
}
