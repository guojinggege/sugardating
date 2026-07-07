// /me — 普通用户 Account Center
// SSR:未登录 → /login?next=/me · 已登录直接从 session payload 拿 user(不依赖 mock-db 存储)
import { redirect } from "next/navigation";
import { getSession, clearSessionCookie } from "@/lib/session";
import {
  getUserProfile, createUserProfile, getApplicationByUser,
  getFollowing, getBookings, getGifts, getSaved,
} from "@/lib/mock-db";
import UserDashboard from "@/components/User/UserDashboard";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const s = getSession();
  if (!s) {
    // 可能是过期/被篡改的 cookie — 清掉后 redirect,避免 middleware 与 /me 反复跳
    clearSessionCookie();
    redirect("/login?next=/me");
  }

  // Serverless 实例可能没有 UserProfile (in-memory 冷启动) — 从 session 即时补建
  const profile = getUserProfile(s.userId) || createUserProfile(s.userId, s.name);
  const application = getApplicationByUser(s.userId);

  return (
    <UserDashboard
      user={{
        id: s.userId, name: s.name, email: s.email, role: s.role,
        createdAt: new Date(s.iat * 1000).toISOString(),
      }}
      profile={profile}
      counts={{
        following: getFollowing(s.userId).length,
        saved:     getSaved(s.userId).length,
        bookings:  getBookings(s.userId).length,
        gifts:     getGifts(s.userId).length,
      }}
      creatorApplication={application ? { slug: application.slug, status: application.status } : null}
    />
  );
}
