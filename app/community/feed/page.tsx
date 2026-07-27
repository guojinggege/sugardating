// /community/feed · 动态 (广义 feed · 话题 / 问答 / Creator Post 混合流)
// 复用 latest 页面的实现 · 提供更符合 spec 的 URL
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default function CommunityFeedRedirect() { redirect("/community/latest"); }
