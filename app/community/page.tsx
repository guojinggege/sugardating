// /community · 默认落到 博客 tab (顶部 switcher 新顺序:博客 / 瓜田 / 问答)
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default function CommunityRootRedirect() { redirect("/community/journal"); }
