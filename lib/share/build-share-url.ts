// 分享 URL 清理 · 只保留公开、可分享的部分
// - 移除 auth token · session · preview · admin · debug · secret 等
// - 拒绝非 http(s) scheme
// - Locked media 由调用方替换为 creator profile URL,不在此处理

const STRIP_QUERY_PARAMS = new Set([
  "access_token", "token", "session", "preview", "secret",
  "admin", "debug", "impersonate", "return_to", "next",
  "signature", "sig", "state", "code", "auth",
]);

// 允许的 UTM 与合规追踪
const ALLOW_QUERY_PATTERNS: RegExp[] = [
  /^utm_/i,
  /^ref$/i,        // 系统已有的 referral code · 仅在业务明确启用时保留
];

const HOST_ALIASES: Record<string, string> = {
  // production canonical host
  "sugardating.vercel.app": "sugardating.co.uk",
};

const DEFAULT_HOST = "sugardating.co.uk";

export interface CleanUrlOptions {
  /** 强制使用的 canonical host · 覆盖 alias 映射 */
  forceHost?: string;
  /** 允许保留额外白名单查询参数 */
  extraAllowedParams?: string[];
}

/**
 * 传入任意 URL (含相对路径) · 返回一个可以对外分享的 canonical URL
 * 不做的:不主动跟随重定向、不去 fetch。
 */
export function toCanonicalShareUrl(input: string, opts: CleanUrlOptions = {}): string {
  const allowExtra = new Set((opts.extraAllowedParams ?? []).map((s) => s.toLowerCase()));
  let url: URL;
  try {
    // 支持相对路径
    url = new URL(input, `https://${opts.forceHost || DEFAULT_HOST}`);
  } catch {
    return `https://${opts.forceHost || DEFAULT_HOST}`;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return `https://${opts.forceHost || DEFAULT_HOST}`;
  }
  // Host alias
  const host = opts.forceHost || HOST_ALIASES[url.host] || url.host || DEFAULT_HOST;
  url.host = host;
  url.protocol = "https:";
  url.hash = "";
  // 清理 query
  const kept = new URLSearchParams();
  url.searchParams.forEach((v, k) => {
    const lower = k.toLowerCase();
    if (STRIP_QUERY_PARAMS.has(lower)) return;
    if (allowExtra.has(lower)) { kept.set(k, v); return; }
    if (ALLOW_QUERY_PATTERNS.some((r) => r.test(k))) { kept.set(k, v); return; }
    // 默认严格 · 未在白名单则丢弃
  });
  url.search = kept.toString() ? `?${kept.toString()}` : "";
  return url.toString();
}
