// 旧的独立工具路径已迁移进 /admin/journal/posts/new?mode=import · 保留此路径做 301 redirect
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function XhsToBlogLegacyRedirect() {
  redirect("/admin/journal/posts/new?mode=import");
}
