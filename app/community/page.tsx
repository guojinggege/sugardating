// /community · 默认落到 动态 tab (广义 feed)
// 三个模块入口:博客 /community/journal · 帖子 /community/stories · 动态 /community/feed
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default function CommunityRootRedirect() { redirect("/community/feed"); }
