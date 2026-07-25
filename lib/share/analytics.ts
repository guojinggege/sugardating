// 轻量 · 无依赖 · 只 log 到 console + globalThis buffer · 生产接真实 analytics 时替换
export type ShareEventName =
  | "share_dialog_opened"
  | "share_channel_selected"
  | "share_copy_success"
  | "share_copy_failed"
  | "share_qr_downloaded";

export interface ShareEventPayload {
  contentType?: string;
  contentId?: string;
  channel?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __sgShareEvents: Array<{ name: ShareEventName; payload: ShareEventPayload; at: string }> | undefined;
}

export function trackShare(name: ShareEventName, payload: ShareEventPayload = {}): void {
  const buf = globalThis.__sgShareEvents ?? [];
  buf.push({ name, payload, at: new Date().toISOString() });
  if (buf.length > 200) buf.shift();
  globalThis.__sgShareEvents = buf;
  if (typeof window !== "undefined" && (window as any).__DEV_SHARE_LOG__) {
    console.log("[share]", name, payload);
  }
}
