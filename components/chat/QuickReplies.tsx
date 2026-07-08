"use client";
import type { SupportedLocale } from "@/lib/translation";

const PRESETS: Record<SupportedLocale, string[]> = {
  zh:  ["你好 👋", "在线吗?", "看了你的动态,很喜欢", "可以聊聊吗?"],
  en:  ["Hi 👋", "Are you online?", "Loved your latest post", "Can we chat?"],
  th:  ["สวัสดีค่ะ 👋", "อยู่ออนไลน์ไหม?", "ชอบโพสต์ของคุณมาก", "คุยกันได้ไหม?"],
  vi:  ["Chào bạn 👋", "Bạn online không?", "Thích bài đăng của bạn lắm", "Mình nói chuyện được không?"],
  fil: ["Kumusta 👋", "Nasa online ka ba?", "Gustong-gusto ko ang post mo", "Pwede tayong mag-usap?"],
};

interface Props {
  locale: SupportedLocale;
  onPick: (text: string) => void;
}

export default function QuickReplies({ locale, onPick }: Props) {
  const list = PRESETS[locale] ?? PRESETS.zh;
  return (
    <div className="qr">
      {list.map((t) => (
        <button key={t} type="button" className="qr-item" onClick={() => onPick(t)}>{t}</button>
      ))}
      <style jsx>{`
        .qr{display:flex;gap:6px;padding:6px 10px;overflow-x:auto;scrollbar-width:none;border-top:1px solid #E8E8EC;background:#fff}
        .qr::-webkit-scrollbar{display:none}
        .qr-item{flex-shrink:0;background:#F4F4F5;color:#161618;border:1px solid #E8E8EC;border-radius:99px;padding:6px 12px;font-size:12.5px;cursor:pointer;white-space:nowrap;transition:background .12s}
        .qr-item:hover{background:#EFEFF1}
      `}</style>
    </div>
  );
}
