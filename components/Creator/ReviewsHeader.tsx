// Reviews summary header — Overall rating + 4 filter chips (Overall/Verified/Photo/Latest)
// 4 filter 目前是视觉状态,后续接实际过滤逻辑时保持 API 不变
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  overall: number;      // 4.98
  total: number;        // 245
  verified: number;     // 210
  withPhoto: number;    // 88
}

type Filter = "all" | "verified" | "photo" | "latest";

export default function ReviewsHeader({ overall, total, verified, withPhoto }: Props) {
  const t = useTranslations("creatorProfile.reviewsHeader");
  const [f, setF] = useState<Filter>("all");

  const chips: { k: Filter; label: string; count: number }[] = [
    { k: "all",      label: t("all"),      count: total },
    { k: "verified", label: t("verified"), count: verified },
    { k: "photo",    label: t("withPhoto"), count: withPhoto },
    { k: "latest",   label: t("latest"),   count: total },
  ];

  return (
    <div className="cr-rh">
      <div className="cr-rh-top">
        <div className="cr-rh-overall">
          <b className="cr-rh-num">{overall.toFixed(2)}</b>
          <span className="cr-rh-stars" aria-hidden>★★★★★</span>
          <span className="cr-rh-total">· {total} {t("reviews")}</span>
        </div>
        <div className="cr-rh-summary">
          <span>{Math.round((verified / total) * 100)}% {t("verifiedPct")}</span>
          <span>·</span>
          <span>{withPhoto} {t("photoCount")}</span>
        </div>
      </div>
      <div className="cr-rh-chips">
        {chips.map((c) => (
          <button
            key={c.k}
            type="button"
            onClick={() => setF(c.k)}
            className={"cr-rh-chip" + (f === c.k ? " on" : "")}
          >
            {c.label} <em>({c.count})</em>
          </button>
        ))}
      </div>
    </div>
  );
}
