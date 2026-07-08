"use client";
// 服务卡 CTA — video-chat 服务直接打开 ChatDrawer;其它 (dating/travel/shoot) 走预约占位
// 抽出来是因为 ServiceCards.tsx 是 server component
import { useChat } from "@/components/chat/ChatProvider";

interface Props {
  label: string;
  serviceKey?: "dating" | "travel" | "shoot" | "video-chat";
  creatorSlug?: string;
  creatorName?: string;
  creatorAvatar?: string;
}

export default function ServiceCtaButton({ label, serviceKey, creatorSlug, creatorName, creatorAvatar }: Props) {
  const { openChatWith } = useChat();

  const onClick = () => {
    // video-chat 直接开聊天窗;其它服务未来接预约,当前占位
    if (serviceKey === "video-chat" && creatorSlug && creatorName) {
      openChatWith({ slug: creatorSlug, name: creatorName, avatar: creatorAvatar, languages: ["zh", "en"] });
      return;
    }
    // TODO: 真正的预约流程接入
  };

  return (
    <button type="button" onClick={onClick} className="cr-service-cta">
      {label}
      <svg viewBox="0 0 24 24" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </button>
  );
}
