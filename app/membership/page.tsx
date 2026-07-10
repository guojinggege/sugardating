// Sugardating 会员页 · VIP / SVIP × 3 周期 + Credits 4 套餐
import type { Metadata } from "next";
import MembershipPage from "@/components/Membership/MembershipPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Membership · VIP / SVIP · Sugardating",
  description:
    "升级 VIP 或 SVIP,解除私密聊天人数与消息限制,使用多语言翻译、已读状态与匿名浏览。 " +
    "Credits 用于解锁私密内容、礼物与优先互动。18+ 高端私密社交平台。",
};

export default function Page() {
  return <MembershipPage />;
}
