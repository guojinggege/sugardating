// Translation abstraction — 5 语言互译
// 当前:mock impl 基于字符集识别 + 包装文本;未来接真实 API (Google/DeepL/OpenAI) 只需换 impl
export type SupportedLocale = "zh" | "en" | "th" | "vi" | "fil";

export const LOCALE_LABEL: Record<SupportedLocale, string> = {
  zh:  "中文",
  en:  "English",
  th:  "ภาษาไทย",
  vi:  "Tiếng Việt",
  fil: "Filipino",
};

/** Basic script detection · 简单启发式,足够 mock 场景 */
export function detectLanguage(text: string): SupportedLocale {
  if (!text) return "en";
  // Thai unicode range
  if (/[฀-๿]/.test(text)) return "th";
  // Vietnamese diacritics (common ones like ế, ă, ơ, etc)
  if (/[à-üĂăƠơƯưẠ-ỹ]/.test(text)) return "vi";
  // CJK unified ideographs → 中文
  if (/[一-鿿]/.test(text)) return "zh";
  // Filipino uses Latin — hard to distinguish from English by chars alone.
  // Simple heuristic: presence of common Tagalog words
  if (/\b(ang|ng|sa|ako|ikaw|siya|kami|kayo|sila|mahal|salamat|kumusta|magandang|paano)\b/i.test(text)) return "fil";
  // Default to English
  return "en";
}

export interface TranslateInput {
  text: string;
  from?: SupportedLocale;
  to: SupportedLocale;
}
export interface TranslateResult {
  translatedText: string;
  detectedLanguage: SupportedLocale;
  provider: string;
}

/** Mock translation · 保 UI 流程 · 用小前缀标注,不做真翻译 */
export async function translateText({ text, from, to }: TranslateInput): Promise<TranslateResult> {
  const detected = from ?? detectLanguage(text);
  if (detected === to) {
    return { translatedText: text, detectedLanguage: detected, provider: "mock:no-op" };
  }
  // Mock quick "translation" table for common short phrases (让 demo 更真实一些)
  const key = text.trim().toLowerCase();
  const table = SHORT_TRANSLATIONS[key];
  if (table && table[to]) {
    return { translatedText: table[to]!, detectedLanguage: detected, provider: "mock:table" };
  }
  // Fallback:用目标语言 label 做前缀
  const label = LOCALE_LABEL[to];
  return {
    translatedText: `[${label}译文] ${text}`,
    detectedLanguage: detected,
    provider: "mock:wrap",
  };
}

// 少量常见短语的多语言对照表 (演示用)
const SHORT_TRANSLATIONS: Record<string, Partial<Record<SupportedLocale, string>>> = {
  "hi": { zh: "你好", en: "Hi", th: "สวัสดีค่ะ", vi: "Chào bạn", fil: "Kumusta" },
  "hello": { zh: "你好", en: "Hello", th: "สวัสดีค่ะ", vi: "Xin chào", fil: "Kumusta" },
  "你好": { zh: "你好", en: "Hello", th: "สวัสดีค่ะ", vi: "Chào bạn", fil: "Kumusta" },
  "谢谢": { zh: "谢谢", en: "Thank you", th: "ขอบคุณ", vi: "Cảm ơn", fil: "Salamat" },
  "thank you": { zh: "谢谢", en: "Thank you", th: "ขอบคุณ", vi: "Cảm ơn", fil: "Salamat" },
  "how are you?": { zh: "你今天怎么样?", en: "How are you?", th: "วันนี้เป็นยังไงบ้าง", vi: "Hôm nay bạn thế nào?", fil: "Kumusta ka?" },
  "在线吗?": { zh: "在线吗?", en: "Are you online?", th: "อยู่ออนไลน์อยู่ไหม?", vi: "Bạn đang online không?", fil: "Nasa online ka ba?" },
};
