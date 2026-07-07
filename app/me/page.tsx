// /me — 普通用户个人中心 (Account Center · 与 Creator Profile 分开)
// SSR:未登录 → 跳 /login?next=/me · 已登录 → server 取 profile 传入客户端 dashboard
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import {
  findUserById, getUserProfile, createUserProfile, getApplicationByUser,
  getFollowing, getBookings, getGifts, getSaved,
} from "@/lib/mock-db";
import UserDashboard from "@/components/User/UserDashboard";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const uid = getSessionUserId();
  if (!uid) redirect("/login?next=/me");

  const user = findUserById(uid);
  if (!user) redirect("/login?next=/me");

  const profile = getUserProfile(uid) || createUserProfile(uid, user.name);
  const application = getApplicationByUser(uid);

  return (
    <UserDashboard
      user={{ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }}
      profile={profile}
      counts={{
        following: getFollowing(uid).length,
        saved:     getSaved(uid).length,
        bookings:  getBookings(uid).length,
        gifts:     getGifts(uid).length,
      }}
      creatorApplication={application ? { slug: application.slug, status: application.status } : null}
    />
  );
}
