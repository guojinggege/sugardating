// Sugardating 会员页 · 3 级递进 (Basic / Paid / Verified) + Credits 4 套餐
import type { Metadata } from "next";
import MembershipPage from "@/components/Membership/MembershipPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Membership · Basic / Paid / Verified · Sugardating",
  description:
    "开通付费会员,解除私密聊天人数与消息限制,使用多语言翻译、已读状态与匿名浏览。 " +
    "完成身份认证后升级为认证会员。Credits 用于解锁私密内容、礼物与优先互动。18+ 高端私密社交平台。",
};

export default function Page() {
  return <MembershipPage />;
}
