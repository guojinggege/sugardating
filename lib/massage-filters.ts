// Parse Next search params → ProviderFilter + SortKey
import type { ProviderFilter } from "./massage-data";
import type { SortKey, ProviderTag, ServiceStyle } from "./massage-labels";

type SP = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseFilter(sp: SP, city?: string, area?: string): ProviderFilter {
  const priceMax = Number(first(sp.priceMax));
  return {
    city,
    area,
    verifiedOnly: first(sp.verified) === "1",
    onlineOnly: first(sp.online) === "1",
    availableToday: first(sp.today) === "1",
    hasVideo: first(sp.video) === "1",
    vipOnly: first(sp.vip) === "1",
    language: first(sp.language),
    tag: first(sp.tag) as ProviderTag | undefined,
    serviceStyle: first(sp.style) as ServiceStyle | undefined,
    priceMax: Number.isFinite(priceMax) && priceMax > 0 ? priceMax : undefined,
  };
}

export function parseSort(sp: SP): SortKey {
  const s = first(sp.sort);
  const ok: SortKey[] = ["recommended", "newest", "online-first", "top-rated", "fast-reply", "price-asc", "price-desc", "video-first", "gifts"];
  return (ok.includes(s as SortKey) ? (s as SortKey) : "recommended");
}

export function buildSummary(f: ProviderFilter): string[] {
  const out: string[] = [];
  if (f.verifiedOnly) out.push("Verified");
  if (f.onlineOnly) out.push("Online");
  if (f.hasVideo) out.push("Video");
  if (f.vipOnly) out.push("VIP");
  if (f.availableToday) out.push("Today");
  if (f.language) out.push(f.language);
  if (f.tag) out.push(f.tag.charAt(0).toUpperCase() + f.tag.slice(1));
  if (f.serviceStyle) out.push(f.serviceStyle);
  if (f.priceMax) out.push(`≤ £${f.priceMax}`);
  return out;
}
