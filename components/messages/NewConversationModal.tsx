"use client";
// 私信 · 新建会话联系人选择
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { DEMO_CONTACTS } from "./chat/mockData";
import { IcoSearch, IcoClose } from "./chat/icons";

interface Props {
  onClose: () => void;
  onPick: (peerName: string, peerAvatarSeed: string, peerHandle: string) => void;
}

export default function NewConversationModal({ onClose, onPick }: Props) {
  const t = useTranslations("messages");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return DEMO_CONTACTS;
    return DEMO_CONTACTS.filter((c) =>
      c.peerName.toLowerCase().includes(query) || c.peerHandle.toLowerCase().includes(query));
  }, [q]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-card nc" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="nc-head">
          <h3>{t("newConversation")}</h3>
          <button type="button" className="nc-close" onClick={onClose} aria-label={t("cancel")}>
            <IcoClose />
          </button>
        </div>
        <label className="nc-search">
          <IcoSearch width={16} height={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchContacts")} autoFocus />
        </label>
        <div className="nc-list">
          {list.length === 0 && <div className="nc-empty">{t("noContacts")}</div>}
          {list.map((c) => (
            <button key={c.peerHandle} type="button" className="nc-item"
              onClick={() => { onPick(c.peerName, c.peerAvatarSeed, c.peerHandle); onClose(); }}>
              <span className="nc-ava">{c.peerAvatarSeed}</span>
              <span className="nc-body">
                <b>{c.peerName}</b>
                <em>@{c.peerHandle}</em>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
