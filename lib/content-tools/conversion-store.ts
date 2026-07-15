// 转换历史 · globalThis-backed in-memory · 最多保留最近 50 条
import type { ConversionOutput } from "./conversion-types";

declare global {
  // eslint-disable-next-line no-var
  var __sgConversions: ConversionOutput[] | undefined;
}
const store = globalThis.__sgConversions ?? [];
globalThis.__sgConversions = store;

export function saveConversion(c: ConversionOutput): void {
  store.unshift(c);
  if (store.length > 50) store.length = 50;
}

export function getConversion(id: string): ConversionOutput | undefined {
  return store.find((c) => c.id === id);
}

export function listConversions(limit = 20): ConversionOutput[] {
  return store.slice(0, limit);
}

export function markUsedForDraft(id: string, slug: string): void {
  const c = store.find((x) => x.id === id);
  if (c) c.usedForDraft = slug;
}
