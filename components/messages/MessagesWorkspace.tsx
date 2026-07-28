"use client";
// 私信 workspace · 三栏容器 (VerticalNav + ConversationList + ChatArea)
// 移动端切换视图 · list / chat
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { ChatLang } from "./chat/types";
import { useChatStore } from "./chat/store";
import MessagesVerticalNav from "./MessagesVerticalNav";
import ConversationList from "./ConversationList";
import ChatHeader from "./ChatHeader";
import ChatThread from "./ChatThread";
import MessageComposer from "./MessageComposer";
import VoiceCallModal from "./VoiceCallModal";
import VideoCallModal from "./VideoCallModal";
import NewConversationModal from "./NewConversationModal";
import ChatSearchBar from "./ChatSearchBar";
import { workspaceStyles } from "./workspaceStyles";

interface Props { loggedIn: boolean; }

export default function MessagesWorkspace({ loggedIn }: Props) {
  const rawLocale = useLocale();
  const locale: ChatLang = rawLocale === "zh" ? "zh" : "en";
  const t = useTranslations("messages");
  const store = useChatStore(locale);

  const [mobileView, setMobileView] = useState<"list" | "chat">("chat");
  // 移动端默认展示会话列表 · 桌面端该状态不影响布局(CSS 双栏)
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches) {
      setMobileView("list");
    }
  }, []);
  // 私信页移动端 · 给 body 挂 class · CSS 侧隐藏 Footer + BottomNav · 页面自身不再滚动
  // 保留全局 sticky Nav (含 Logo · 返回首页) · 只让 workspace 独立占满剩余视口
  useEffect(() => {
    document.body.classList.add("page-messages");
    return () => document.body.classList.remove("page-messages");
  }, []);
  const [voiceCall, setVoiceCall] = useState(false);
  const [videoCall, setVideoCall] = useState(false);
  const [newConv, setNewConv] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [hitId, setHitId] = useState<string | null>(null);

  if (!loggedIn) {
    return (
      <div className="wgate">
        <div className="wgate-in">
          <div className="wgate-eye">Private Messages</div>
          <h1>{t("gateTitle")}</h1>
          <p>{t("gateDesc")}</p>
          <Link href="/login?next=/messages" className="wgate-btn">{t("gateLogin")}</Link>
        </div>
        <style>{workspaceStyles}</style>
      </div>
    );
  }

  const active = store.active;

  return (
    <div className={"ws ws--" + mobileView}>
      <MessagesVerticalNav activeKey="messages" />

      <ConversationList
        convos={store.convos}
        activeId={store.activeId}
        onOpen={(id) => { store.setActiveId(id); setMobileView("chat"); setSearchOpen(false); }}
        onNewConversation={() => setNewConv(true)}
        locale={locale}
      />

      <main className="ws-main">
        {active ? (
          <div className="ws-chat">
            <ChatHeader
              conv={active}
              autoTranslate={store.autoTranslate}
              onToggleAutoTranslate={() => store.setAutoTranslate(!store.autoTranslate)}
              onToggleSearch={() => setSearchOpen((v) => !v)}
              onVoiceCall={() => setVoiceCall(true)}
              onVideoCall={() => setVideoCall(true)}
              onBackMobile={() => setMobileView("list")}
              locale={locale}
            />
            {searchOpen && (
              <ChatSearchBar
                messages={store.messages}
                onClose={() => setSearchOpen(false)}
                onQueryChange={setSearchQ}
                onActiveHitChange={setHitId}
              />
            )}
            <ChatThread
              messages={store.messages}
              locale={locale}
              autoTranslate={store.autoTranslate}
              searchQuery={searchQ}
              activeHitId={hitId}
            />
            <MessageComposer
              onSendText={store.sendText}
              onSendImage={store.sendImage}
              onSendVoice={store.sendVoice}
            />
          </div>
        ) : (
          <div className="ws-empty">
            <h3>{t("noneSelectedTitle")}</h3>
            <p>{t("noneSelectedDesc")}</p>
          </div>
        )}
      </main>

      {voiceCall && active && (
        <VoiceCallModal conv={active}
          onClose={(sec) => { setVoiceCall(false); store.appendCallRecord("voice", sec); }} />
      )}
      {videoCall && active && (
        <VideoCallModal conv={active}
          onClose={(sec) => { setVideoCall(false); store.appendCallRecord("video", sec); }} />
      )}
      {newConv && (
        <NewConversationModal
          onClose={() => setNewConv(false)}
          onPick={(name, seed, handle) => store.upsertConversationForPeer(name, seed, handle)} />
      )}

      <style>{workspaceStyles}</style>
    </div>
  );
}
