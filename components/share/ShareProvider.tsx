"use client";
// 全站唯一分享入口 · openShare(payload) 触发弹窗
// - Desktop 居中 Modal · Mobile Bottom Sheet
// - Focus trap · Esc 关闭 · 点遮罩关闭 · 返回焦点到触发按钮
// - 6+ 分享渠道 · 复制链接 / native / WhatsApp / Telegram / X / Facebook / Email / QR
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toCanonicalShareUrl } from "@/lib/share/build-share-url";
import { trackShare } from "@/lib/share/analytics";

export type ShareContentType =
  | "creator" | "post" | "story" | "question"
  | "journal" | "video" | "service" | "event" | "location";

export interface SharePayload {
  title: string;
  text?: string;
  canonicalUrl: string;
  image?: string;
  contentType: ShareContentType;
  contentId?: string;
  /** 可选:允许保留的额外查询参数 (例:合规 UTM) */
  extraAllowedParams?: string[];
}

interface Ctx {
  openShare: (p: SharePayload) => void;
}
const ShareCtx = createContext<Ctx | null>(null);

export function useShare(): Ctx {
  const c = useContext(ShareCtx);
  if (!c) throw new Error("useShare must be inside <ShareProvider>");
  return c;
}

export default function ShareProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<SharePayload | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openShare = useCallback((p: SharePayload) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setPayload(p);
    trackShare("share_dialog_opened", { contentType: p.contentType, contentId: p.contentId });
  }, []);

  const close = useCallback(() => {
    setPayload(null);
    // 返回焦点到原分享按钮
    setTimeout(() => triggerRef.current?.focus?.(), 0);
  }, []);

  const value = useMemo(() => ({ openShare }), [openShare]);

  return (
    <ShareCtx.Provider value={value}>
      {children}
      {payload && <ShareDialog payload={payload} onClose={close} />}
    </ShareCtx.Provider>
  );
}

// ══════════════════════════════════════
// Dialog · desktop modal / mobile bottom sheet · 同一组件响应式切换
// ══════════════════════════════════════

function ShareDialog({ payload, onClose }: { payload: SharePayload; onClose: () => void }) {
  const [qrOpen, setQrOpen] = useState(false);
  const [toast, setToast] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const canonical = useMemo(
    () => toCanonicalShareUrl(payload.canonicalUrl, { extraAllowedParams: payload.extraAllowedParams }),
    [payload.canonicalUrl, payload.extraAllowedParams],
  );
  const shareText = payload.text ?? payload.title;
  const encoded = encodeURIComponent(shareText + " " + canonical);
  const encodedUrl = encodeURIComponent(canonical);
  const encodedText = encodeURIComponent(shareText);

  const [supportsNative, setSupportsNative] = useState(false);
  useEffect(() => {
    setSupportsNative(typeof navigator !== "undefined" && !!(navigator as any).share);
  }, []);

  // Focus trap · Esc close · overlay click
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const firstFocus = el.querySelector<HTMLElement>("button, a, [tabindex]");
    firstFocus?.focus?.();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusables = Array.from(el.querySelectorAll<HTMLElement>('button, a, [tabindex]:not([tabindex="-1"])'));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const showToast = (tone: "ok" | "err", text: string) => {
    setToast({ tone, text });
    setTimeout(() => setToast(null), 1600);
  };

  const track = (channel: string) => trackShare("share_channel_selected", { contentType: payload.contentType, contentId: payload.contentId, channel });

  async function copyLink() {
    try { await navigator.clipboard.writeText(canonical); showToast("ok", "链接已复制"); trackShare("share_copy_success", { channel: "copy" }); }
    catch { showToast("err", "复制失败"); trackShare("share_copy_failed", { channel: "copy" }); }
  }
  async function nativeShare() {
    track("native");
    try {
      await (navigator as any).share({ title: payload.title, text: payload.text, url: canonical });
    } catch { /* user cancelled */ }
  }

  return (
    <>
      <div className="sh-overlay" onClick={onClose} aria-hidden />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="分享"
        className={"sh-dialog" + (qrOpen ? " has-qr" : "")}
      >
        <div className="sh-h">
          <div className="sh-title">
            <span className="sh-title-ic" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <b>分享</b>
          </div>
          <button type="button" onClick={onClose} className="sh-x" aria-label="关闭">×</button>
        </div>

        <div className="sh-preview" aria-hidden>
          <div className="sh-preview-t">{payload.title}</div>
          <div className="sh-preview-u">{canonical}</div>
        </div>

        {qrOpen ? (
          <ShareQrCode canonical={canonical} onBack={() => setQrOpen(false)} />
        ) : (
          <ul className="sh-list" role="list">
            <ShareOption icon="📋" title="复制链接" desc="复制当前页面的公开链接" onClick={copyLink} />
            {supportsNative && <ShareOption icon="↗"  title="分享给朋友" desc="通过手机中的应用发送" onClick={nativeShare} />}
            <ShareOption icon="💬" title="WhatsApp" desc="通过 WhatsApp 分享"
              href={`https://wa.me/?text=${encoded}`} onClickTrack={() => track("whatsapp")} />
            <ShareOption icon="✈"  title="Telegram" desc="通过 Telegram 分享"
              href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`} onClickTrack={() => track("telegram")} />
            <ShareOption icon="𝕏"  title="X" desc="发布到 X (Twitter)"
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`} onClickTrack={() => track("x")} />
            <ShareOption icon="f"  title="Facebook" desc="分享到 Facebook"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} onClickTrack={() => track("facebook")} />
            <ShareOption icon="✉"  title="邮件" desc="通过邮件发送"
              href={`mailto:?subject=${encodedText}&body=${encoded}`} onClickTrack={() => track("email")} />
            <ShareOption icon="⏏"  title="二维码" desc="生成公开链接二维码" onClick={() => { setQrOpen(true); track("qr"); }} />
            <ShareOption icon="↙"  title="复制完整链接" desc="复制包含当前公开页面路径的完整地址" onClick={copyLink} />
          </ul>
        )}

        {toast && <div className={"sh-toast " + toast.tone}>{toast.text}</div>}
      </div>

      <style>{overlayStyles}</style>
    </>
  );
}

// ══════════════════════════════════════
// Option row
// ══════════════════════════════════════

function ShareOption({
  icon, title, desc, href, onClick, onClickTrack,
}: {
  icon: string; title: string; desc: string;
  href?: string; onClick?: () => void;
  onClickTrack?: () => void;
}) {
  const inner = (
    <>
      <span className="sh-opt-ic" aria-hidden>{icon}</span>
      <div className="sh-opt-body">
        <b>{title}</b>
        <em>{desc}</em>
      </div>
      <span className="sh-opt-arrow" aria-hidden>→</span>
    </>
  );
  if (href) {
    return (
      <li>
        <a href={href} target="_blank" rel="noreferrer" className="sh-opt" onClick={onClickTrack}>
          {inner}
        </a>
      </li>
    );
  }
  return (
    <li>
      <button type="button" onClick={onClick} className="sh-opt">{inner}</button>
    </li>
  );
}

// ══════════════════════════════════════
// QR code sub-view (uses external QR image service · encodes only canonical URL)
// ══════════════════════════════════════

function ShareQrCode({ canonical, onBack }: { canonical: string; onBack: () => void }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(canonical)}&size=280x280&margin=8`;
  async function copy() {
    try { await navigator.clipboard.writeText(canonical); } catch {}
  }
  return (
    <div className="sh-qr">
      <button type="button" onClick={onBack} className="sh-qr-back">← 返回</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrUrl} alt="Share QR code" width={220} height={220} />
      <div className="sh-qr-url">{canonical}</div>
      <div className="sh-qr-actions">
        <a href={qrUrl} download="sugardating-qr.png"
           onClick={() => trackShare("share_qr_downloaded")}
           className="sh-btn sh-btn--gold">下载二维码</a>
        <button type="button" onClick={copy} className="sh-btn sh-btn--ghost">复制链接</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// Styles
// ══════════════════════════════════════

const overlayStyles = `
  .sh-overlay{position:fixed;inset:0;background:rgba(10,10,12,.72);backdrop-filter:blur(8px);z-index:1000;animation:sh-fade .16s}
  .sh-dialog{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:1001;width:min(480px,calc(100vw - 32px));max-height:min(680px,calc(100vh - 40px));background:linear-gradient(180deg,#161618,#0F0F11);color:#EEDDB8;border:1px solid rgba(238,221,184,.14);border-radius:22px;box-shadow:0 30px 100px rgba(0,0,0,.5);display:flex;flex-direction:column;overflow:hidden;animation:sh-rise .22s cubic-bezier(.2,.9,.3,1.2)}

  .sh-h{display:flex;align-items:center;justify-content:space-between;padding:18px 22px 12px;border-bottom:1px solid rgba(238,221,184,.08)}
  .sh-title{display:flex;align-items:center;gap:10px}
  .sh-title-ic{width:32px;height:32px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;border-radius:10px;display:inline-flex;align-items:center;justify-content:center}
  .sh-title b{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:22px;font-weight:600;color:#EEDDB8;letter-spacing:-0.008em}
  .sh-x{background:rgba(238,221,184,.08);color:#EEDDB8;border:0;width:32px;height:32px;border-radius:50%;font-size:20px;cursor:pointer;line-height:1}
  .sh-x:hover{background:rgba(238,221,184,.16)}

  .sh-preview{padding:12px 22px;border-bottom:1px solid rgba(238,221,184,.08);background:rgba(238,221,184,.03)}
  .sh-preview-t{font-size:13px;color:#EEDDB8;font-weight:700;line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
  .sh-preview-u{margin-top:2px;font-family:ui-monospace,monospace;font-size:10.5px;color:rgba(238,221,184,.55);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

  .sh-list{list-style:none;margin:0;padding:10px;display:flex;flex-direction:column;gap:4px;overflow-y:auto;flex:1}
  .sh-opt{width:100%;display:flex;align-items:center;gap:12px;padding:11px 14px;background:transparent;border:1px solid transparent;border-radius:12px;color:#EEDDB8;text-decoration:none;font:inherit;cursor:pointer;text-align:left;transition:background .12s,border-color .12s}
  .sh-opt:hover,.sh-opt:focus-visible{background:rgba(238,221,184,.08);border-color:rgba(238,221,184,.16);outline:none}
  .sh-opt-ic{width:36px;height:36px;background:rgba(238,221,184,.08);color:#EEDDB8;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;flex-shrink:0}
  .sh-opt-body{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.3}
  .sh-opt-body b{font-size:13.5px;color:#EEDDB8;font-weight:700;letter-spacing:-0.005em}
  .sh-opt-body em{font-size:11.5px;color:rgba(238,221,184,.55);font-style:normal;margin-top:1px}
  .sh-opt-arrow{color:rgba(238,221,184,.4);font-size:14px;font-weight:800;flex-shrink:0}

  .sh-qr{padding:20px 22px 24px;display:flex;flex-direction:column;align-items:center;gap:12px}
  .sh-qr-back{align-self:flex-start;background:none;border:0;color:rgba(238,221,184,.7);font:inherit;font-size:12px;font-weight:700;cursor:pointer}
  .sh-qr-back:hover{color:#EEDDB8}
  .sh-qr img{background:#fff;padding:8px;border-radius:12px;image-rendering:pixelated}
  .sh-qr-url{font-family:ui-monospace,monospace;font-size:10.5px;color:rgba(238,221,184,.55);text-align:center;word-break:break-all;padding:0 10px}
  .sh-qr-actions{display:flex;gap:8px}
  .sh-btn{padding:9px 18px;border-radius:99px;font:inherit;font-size:12.5px;font-weight:800;cursor:pointer;border:0;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
  .sh-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}
  .sh-btn--ghost{background:rgba(238,221,184,.08);color:#EEDDB8;border:1px solid rgba(238,221,184,.16)}

  .sh-toast{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);padding:8px 16px;background:rgba(0,0,0,.7);color:#EEDDB8;border-radius:99px;font-size:12px;font-weight:700;pointer-events:none}
  .sh-toast.err{background:#B91C1C;color:#fff}

  @keyframes sh-fade{from{opacity:0}to{opacity:1}}
  @keyframes sh-rise{from{opacity:0;transform:translate(-50%,-42%) scale(.96)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}

  @media(max-width:640px){
    .sh-dialog{left:0;top:auto;bottom:0;transform:none;width:100vw;max-height:90vh;border-radius:22px 22px 0 0;padding-bottom:env(safe-area-inset-bottom,0)}
    @keyframes sh-rise{from{transform:translateY(20%)}to{transform:translateY(0)}}
  }
`;
