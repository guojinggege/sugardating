// Client-safe · 无 node: 依赖 · JournalInternalLinksPanel 使用
export function applyInlineLink(text: string, phrase: string, url: string): string {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(escaped);
  if (!re.test(text)) return text;
  return text.replace(re, `[${phrase}](${url})`);
}
