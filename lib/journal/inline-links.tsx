// 安全的内联链接解析 · 仅识别 [text](url)
// 严格限制:URL 必须是 / 开头的站内路径 · 拒绝 javascript:/data:/http(s)://其它域
import { Fragment, type ReactNode } from "react";

const SAFE_URL_RE = /^\/[a-zA-Z0-9\-_/.?=&#%]*$/;

export interface InlineToken {
  kind: "text" | "link";
  text: string;
  url?: string;
}

export function tokenizeInline(source: string): InlineToken[] {
  const out: InlineToken[] = [];
  const re = /\[([^\]\n]{1,120})\]\((\/[^)\s]{1,300})\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source)) !== null) {
    const [full, phrase, url] = match;
    const start = match.index;
    if (start > lastIndex) out.push({ kind: "text", text: source.slice(lastIndex, start) });
    if (SAFE_URL_RE.test(url)) {
      out.push({ kind: "link", text: phrase, url });
    } else {
      // 不安全 · 原样输出
      out.push({ kind: "text", text: full });
    }
    lastIndex = start + full.length;
  }
  if (lastIndex < source.length) out.push({ kind: "text", text: source.slice(lastIndex) });
  return out;
}

// React 渲染 · 返回 (a) 或 fragment
export function renderInlineWithLinks(source: string): ReactNode {
  const tokens = tokenizeInline(source);
  if (tokens.length === 0) return null;
  if (tokens.length === 1 && tokens[0].kind === "text") return tokens[0].text;
  return tokens.map((t, i) => {
    if (t.kind === "text") return <Fragment key={i}>{t.text}</Fragment>;
    return <a key={i} href={t.url} className="jn-il">{t.text}</a>;
  });
}
