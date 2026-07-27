// 兼容旧 URL · /photography 已并入 /messages 私信中心
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default function LegacyPhotographyRedirect() { redirect("/messages"); }
