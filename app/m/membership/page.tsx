// Mobile Membership — 复用同一 MembershipPage 组件 (已响应式)
import type { Metadata } from "next";
import MembershipPage from "@/components/Membership/MembershipPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Membership · Basic / Paid / Verified · Sugardating",
  description:
    "开通付费会员,解除私密聊天限制,使用多语言翻译与匿名浏览。完成身份认证升级为认证会员。Credits 用于解锁内容与礼物。",
};

export default function Page() {
  return <MembershipPage />;
}
