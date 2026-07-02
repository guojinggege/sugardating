import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import LoginModal from "@/components/Auth/LoginModal";

// 子页面调 DB(如 listCreators, listSugarGirls 等),全应用走 SSR
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return { title: t("title"), description: t("description") };
}

// 移动端 viewport — 关键:防 iOS 缩放输入框,支持 safe-area
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#F4F4F5",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, messages] = await Promise.all([
    getLocale(),
    getMessages(),
  ]);

  // 语言对应的 html lang 值
  const htmlLang = locale === "zh" ? "zh-Hans" : "en";

  // 判断当前是否 /m/* 路径 (middleware 设置 x-pathname header)
  // 是则跳过 desktop Nav/Footer/BottomNav,/m/layout.tsx 提供自己的移动 shell
  const pathname = headers().get("x-pathname") || "";
  const isMobileRoute = pathname === "/m" || pathname.startsWith("/m/");

  return (
    <html lang={htmlLang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700&family=Cormorant+Garamond:ital,wght@1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            {!isMobileRoute && <Nav />}
            <main>{children}</main>
            {!isMobileRoute && <Footer />}
            <LoginModal />
            {!isMobileRoute && <BottomNav />}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
