import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { listRegionsGrouped } from "@/lib/queries";

// Layout 调 listRegionsGrouped() 拉 DB → 必须全应用走 SSR,
// 否则 build 时会尝试 prerender 未标 dynamic 的页面,触发 Prisma 在 build 阶段连 DB
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "拾光 — 华语与亚裔创作者发现平台",
  description: "发现摄影、视频、艺术服务等领域的华语与亚裔创作者，订阅他们的作品。",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const regionGroups = await listRegionsGrouped();
  return (
    <html lang="zh-Hans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav regionGroups={regionGroups} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
