"use client";
// 私信 · 中间会话列表 · 桌面 380px · 移动端全宽
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { DemoConversation } from "./chat/types";
import { fmtAgo } from "./chat/utils";
import { IcoSearch, IcoPlus, IcoImage, IcoMic, IcoVerified, IcoClose } from "./chat/icons";

interface Props {
  convos: DemoConversation[];
  activeId: string | null;
  onOpen: (id: string) => void;
  onNewConversation: () => void;
  locale: "zh" | "en";
}

type Tab = "all" | "unread";

export default function ConversationList({ convos, activeId, onOpen, onNewConversation, locale }: Props) {
  const t = useTranslations("messages");
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = tab === "unread" ? convos.filter((c) => c.unreadCount > 0) : convos;
    if (query) {
      list = list.filter((c) =>
        c.peerName.toLowerCase().includes(query) ||
        (c.lastMessagePreview ?? "").toLowerCase().includes(query),
      );
    }
    return list;
  }, [convos, tab, q]);

  const unreadCount = convos.filter((c) => c.unreadCount > 0).length;

  return (
    <aside className="cl">
      <div className="cl-head">
        <div className="cl-head-row">
          <h1 className="cl-title">{t("title")}</h1>
          <button className="cl-icon-btn" type="button" onClick={onNewConversation} title={t("newConversation")}>
            <IcoPlus />
          </button>
        </div>
        <label className="cl-search">
          <IcoSearch width={16} height={16} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchConversations")}
          />
          {q && (
            <button type="button" className="cl-clear" onClick={() => setQ("")} aria-label="clear">
              <IcoClose width={14} height={14} />
            </button>
          )}
        </label>
        <div className="cl-tabs" role="tablist">
          <button role="tab" type="button" aria-selected={tab === "all"} onClick={() => setTab("all")}
            className={"cl-tab" + (tab === "all" ? " on" : "")}>
            {t("tabAll")}<span className="cl-tab-n">{convos.length}</span>
          </button>
          <button role="tab" type="button" aria-selected={tab === "unread"} onClick={() => setTab("unread")}
            className={"cl-tab" + (tab === "unread" ? " on" : "")}>
            {t("tabUnread")}<span className="cl-tab-n">{unreadCount}</span>
          </button>
        </div>
      </div>

      <div className="cl-scroll">
        {filtered.length === 0 && (
          <div className="cl-empty">
            {q ? t("noSearchResults") : tab === "unread" ? t("noUnread") : t("noConversations")}
          </div>
        )}
        {filtered.map((c) => (
          <button key={c.id} type="button"
            className={"cl-item" + (activeId === c.id ? " on" : "")}
            onClick={() => onOpen(c.id)}
          >
            <div className="cl-ava">
              <span className="cl-ava-t">{c.peerAvatarSeed}</span>
              {c.online && <span className="cl-online" aria-label={t("online")} />}
            </div>
            <div className="cl-body">
              <div className="cl-row1">
                <span className="cl-name">
                  {c.peerName}
                  {c.verified && <IcoVerified width={12} height={12} />}
                </span>
                <time className="cl-time" suppressHydrationWarning>{fmtAgo(c.lastMessageAt, locale)}</time>
              </div>
              <div className="cl-row2">
                <span className="cl-preview">
                  {c.lastMessageType === "voice" && <IcoMic width={12} height={12} />}
                  {c.lastMessageType === "image" && <IcoImage width={12} height={12} />}
                  <span className="cl-preview-t">{c.lastMessagePreview}</span>
                </span>
                {c.unreadCount > 0 && (
                  <span className="cl-badge">{c.unreadCount > 99 ? "99+" : c.unreadCount}</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
