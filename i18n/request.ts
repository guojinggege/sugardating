import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

// 站点支持的语言。新增语言时只需:
// 1) 加 messages/<code>.json
// 2) 加到 SUPPORTED 数组
// 3) LanguageSwitcher 的按钮里加一项
export const SUPPORTED = ["en", "zh"] as const;
export type Locale = (typeof SUPPORTED)[number];
export const DEFAULT_LOCALE: Locale = "en";

function pick(raw: string | undefined): Locale {
  if (raw && (SUPPORTED as readonly string[]).includes(raw)) return raw as Locale;
  return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  // cookies() 在 Next 14 是同步 API;Next 15 才异步
  const store = cookies();
  const locale = pick(store.get("NEXT_LOCALE")?.value);
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages };
});
