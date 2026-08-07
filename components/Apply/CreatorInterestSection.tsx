"use client";
// /apply · 入驻意向表单模块 · Hero 下方 · 桌面双栏 · 移动单列
// 复用与 Dialog / Drawer 相同的 CreatorInterestForm · 单一 schema · 单一提交
import { useTranslations } from "next-intl";
import CreatorInterestForm from "./CreatorInterestForm";

export default function CreatorInterestSection() {
  const t = useTranslations("apply.interest");
  return (
    <section id="apply-interest-form" className="cif-section" aria-labelledby="cif-section-h">
      <div className="cif-sec-in">
        <div className="cif-sec-copy">
          <div className="cif-eye">JOIN SUGARDATING</div>
          <h2 id="cif-section-h">{t("sectionTitle")}</h2>
          <p>{t("sectionDesc")}</p>
          <div className="cif-privacy-box">
            <b>{t("privacyBoxTitle")}</b>
            <span>{t("privacyBoxText")}</span>
          </div>
        </div>
        <div className="cif-sec-form">
          <CreatorInterestForm source="inline_form" />
        </div>
      </div>
    </section>
  );
}
