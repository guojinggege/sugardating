// Mobile UA 检测 → 自动重定向到 /m/[path]
// Desktop UA 不触发,访问 /m/ 也 serve 正常(允许桌面用户手动查看移动版)
// 也设置 x-pathname header,让 root layout 判断是否走 mobile shell (跳过 Nav/Footer/BottomNav)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MOBILE_UA = /Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get("user-agent") || "";

  // 已经在 /m/ 路径,不重定向
  const isMobileRoute = pathname === "/m" || pathname.startsWith("/m/");

  // 只 redirect 有 /m/ 实现的路径 — 其它 mobile UA 上看到 desktop 层 (responsive CSS 已保底)
  // Phase 2 覆盖: / · /creators · /photography · /video · /membership · /login · /live · /me
  const HAS_M =
    pathname === "/" ||
    pathname === "/creators" || pathname.startsWith("/creators/") ||
    pathname === "/community" || pathname.startsWith("/community/") ||
    pathname === "/photography" ||
    pathname === "/video" ||
    pathname === "/membership" ||
    pathname === "/login" ||
    pathname === "/live" ||
    pathname === "/me";
  if (!isMobileRoute && HAS_M && MOBILE_UA.test(ua)) {
    const url = request.nextUrl.clone();
    url.pathname = `/m${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // Set x-pathname header for layout 判断
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    // 排除 API / _next / 静态资源 / 显式带 . 的文件路径
    "/((?!api|_next/static|_next/image|favicon.ico|videos|images|.*\\..*).*)",
  ],
};
