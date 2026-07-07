// /me — 普通用户 Account Center
// 全防御式:任何异常 fallback 到 redirect,不允许抛 server exception
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import {
  getUserProfile, createUserProfile, getApplicationByUser,
  getFollowing, getBookings, getGifts, getSaved,
} from "@/lib/mock-db";
import UserDashboard from "@/components/User/UserDashboard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function MePage() {
  // 1. 读 session — 完全 safe (session.ts 内已 try/catch)
  let s: ReturnType<typeof getSession> = null;
  try { s = getSession(); } catch { s = null; }

  // 2. 无 session → redirect (不 clear cookie · server component 不允许改 cookie ·
  //    invalid cookie 由 client-side logout 或用户重新登录清理)
  if (!s) {
    redirect("/login?next=/me");
  }

  // 3. 拉 profile — 缺失自动补建 (globalThis map 冷启动可能没)
  let profile;
  try {
    profile = getUserProfile(s.userId) || createUserProfile(s.userId, s.name);
  } catch {
    // 极端情况:补建也失败 → 返最小 profile 对象,避免 crash
    profile = null;
  }

  if (!profile) {
    // 兜底:仍然让 UserDashboard 渲染,只是 profile 空 · 用户可编辑
    profile = {
      userId: s.userId,
      displayName: s.name,
      interests: [],
      preferences: {},
      membership: { tier: "free" as const, status: "active" as const },
      privacy: { showOnlineStatus: true, showLastActive: true, receivePromo: false },
      createdAt: new Date(s.iat * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // 4. 其它数据全 fallback 空数组 · 拿不到不 crash
  const following = safeCall(() => getFollowing(s!.userId), [] as string[]);
  const saved     = safeCall(() => getSaved(s!.userId),     [] as ReturnType<typeof getSaved>);
  const bookings  = safeCall(() => getBookings(s!.userId),  [] as ReturnType<typeof getBookings>);
  const gifts     = safeCall(() => getGifts(s!.userId),     [] as ReturnType<typeof getGifts>);
  const application = safeCall(() => getApplicationByUser(s!.userId), null as ReturnType<typeof getApplicationByUser>);

  return (
    <UserDashboard
      user={{
        id: s.userId, name: s.name, email: s.email, role: s.role,
        createdAt: new Date(s.iat * 1000).toISOString(),
      }}
      profile={profile}
      counts={{
        following: following.length,
        saved:     saved.length,
        bookings:  bookings.length,
        gifts:     gifts.length,
      }}
      creatorApplication={application ? { slug: application.slug, status: application.status } : null}
    />
  );
}

function safeCall<T>(fn: () => T, fallback: T): T {
  try { return fn(); } catch { return fallback; }
}
