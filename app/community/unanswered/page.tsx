// /community/unanswered · 已下线 · 重定向到动态 tab
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default function UnansweredRedirect() { redirect("/community/feed"); }
