"use client";
// 私信 · 聊天记录搜索栏 · 前端匹配 · 上一条/下一条
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { DemoMessage } from "./chat/types";
import { IcoSearch, IcoClose, IcoUp, IcoDown } from "./chat/icons";

interface Props {
  messages: DemoMessage[];
  onClose: () => void;
  onQueryChange: (q: string) => void;
  onActiveHitChange: (id: string | null) => void;
}

export default function ChatSearchBar({ messages, onClose, onQueryChange, onActiveHitChange }: Props) {
  const t = useTranslations("messages");
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  const hits = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [] as DemoMessage[];
    return messages.filter((m) => {
      if (m.type !== "text") return false;
      const t1 = (m.originalText ?? "").toLowerCase();
      const t2 = Object.values(m.translations ?? {}).join(" ").toLowerCase();
      return t1.includes(query) || t2.includes(query);
    });
  }, [messages, q]);

  useEffect(() => { onQueryChange(q); }, [q, onQueryChange]);
  useEffect(() => {
    if (hits.length === 0) { onActiveHitChange(null); return; }
    onActiveHitChange(hits[Math.min(idx, hits.length - 1)].id);
  }, [hits, idx, onActiveHitChange]);
  useEffect(() => { setIdx(0); }, [q]);

  return (
    <div className="csb">
      <IcoSearch width={16} height={16} />
      <input value={q} onChange={(e) => setQ(e.target.value)}
        placeholder={t("searchMessages")} autoFocus />
      <div className="csb-count">
        {q ? (hits.length === 0 ? t("noSearchResults") : t("hitsOfN", { i: Math.min(idx + 1, hits.length), n: hits.length })) : ""}
      </div>
      <button type="button" className="csb-nav" disabled={hits.length === 0}
        onClick={() => setIdx((i) => (i - 1 + hits.length) % hits.length)} aria-label="prev">
        <IcoUp width={16} height={16} />
      </button>
      <button type="button" className="csb-nav" disabled={hits.length === 0}
        onClick={() => setIdx((i) => (i + 1) % hits.length)} aria-label="next">
        <IcoDown width={16} height={16} />
      </button>
      <button type="button" className="csb-close" onClick={() => { onQueryChange(""); onActiveHitChange(null); onClose(); }}
        aria-label={t("cancel")}>
        <IcoClose width={16} height={16} />
      </button>
    </div>
  );
}
