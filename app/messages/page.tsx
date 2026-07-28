// /messages · 私信收件箱 · 双栏布局
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import MessagesWorkspace from "@/components/messages/MessagesWorkspace";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "私信 · Messages · Sugardating",
  description: "查看和回复与已认证创作者的私信 · 支持多语言自动翻译。",
  robots: { index: false, follow: false },
};

export default function MessagesPage() {
  const s = getSession();
  return <MessagesWorkspace loggedIn={!!s} />;
}
