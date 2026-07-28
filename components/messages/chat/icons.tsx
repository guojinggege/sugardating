// 私信 workspace · 内联 SVG 图标 · 项目未引入图标库 · 保持零依赖
import type { SVGProps } from "react";
type P = SVGProps<SVGSVGElement>;
const base = {
  width: 18, height: 18, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};
export const IcoSearch = (p: P) => <svg {...base} {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
export const IcoPlus   = (p: P) => <svg {...base} {...p}><path d="M12 5v14M5 12h14"/></svg>;
export const IcoSend   = (p: P) => <svg {...base} {...p}><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>;
export const IcoMic    = (p: P) => <svg {...base} {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 19v3"/></svg>;
export const IcoPhone  = (p: P) => <svg {...base} {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.8 3.2a2 2 0 0 1-.5 2L8 10.1a16 16 0 0 0 6 6l1.2-1.4a2 2 0 0 1 2-.5l3.2.8a2 2 0 0 1 1.6 2z"/></svg>;
export const IcoVideo  = (p: P) => <svg {...base} {...p}><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8 16 12l6 4z"/></svg>;
export const IcoMore   = (p: P) => <svg {...base} {...p}><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>;
export const IcoSmile  = (p: P) => <svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 10h.01M15 10h.01"/></svg>;
export const IcoImage  = (p: P) => <svg {...base} {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m21 16-5-5-9 9"/></svg>;
export const IcoBack   = (p: P) => <svg {...base} {...p}><path d="m15 6-6 6 6 6"/></svg>;
export const IcoClose  = (p: P) => <svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;
export const IcoCheck  = (p: P) => <svg {...base} {...p}><path d="M20 6 9 17l-5-5"/></svg>;
export const IcoCheck2 = (p: P) => <svg {...base} {...p}><path d="M18 6 7 17l-3-3M22 10l-6 6"/></svg>;
export const IcoTranslate = (p: P) => <svg {...base} {...p}><path d="M4 5h10M9 3v2m0 0c0 5-3 8-6 9m4-4c1 3 4 5 8 6"/><path d="m14 21 5-11 5 11M16 17h6"/></svg>;
export const IcoPlay   = (p: P) => <svg {...base} {...p}><path d="M6 4v16l14-8z" fill="currentColor" stroke="none"/></svg>;
export const IcoPause  = (p: P) => <svg {...base} {...p}><rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none"/></svg>;
export const IcoUp     = (p: P) => <svg {...base} {...p}><path d="m18 15-6-6-6 6"/></svg>;
export const IcoDown   = (p: P) => <svg {...base} {...p}><path d="m6 9 6 6 6-6"/></svg>;
export const IcoVerified = (p: P) => (
  <svg width={14} height={14} viewBox="0 0 24 24" {...p}>
    <path d="M12 2 14.4 5l3.7 0.4 1 3.6 3 2.2-1.8 3.2 0.6 3.7-3.6 1L15 22l-3-1.6L9 22l-2.3-2.9-3.6-1 0.6-3.7L2 11.2l3-2.2 1-3.6 3.7-0.4z"
      fill="#B8A789"/>
    <path d="m9 12 2.2 2.2L15.5 10" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
export const IcoSpeaker = (p: P) => <svg {...base} {...p}><path d="M3 10v4h4l5 4V6L7 10z"/><path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"/></svg>;
export const IcoMicOff = (p: P) => <svg {...base} {...p}><path d="M9 9v3a3 3 0 0 0 5 2M15 12V6a3 3 0 0 0-6 0v1M2 2l20 20M5 11a7 7 0 0 0 12 5M12 19v3"/></svg>;
export const IcoVideoOff = (p: P) => <svg {...base} {...p}><path d="M16 16H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2M9 6h7a2 2 0 0 1 2 2v6M2 2l20 20M22 8l-4 4"/></svg>;
export const IcoLayout = (p: P) => <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18M9 15h6"/></svg>;
export const IcoPhoneOff = (p: P) => <svg {...base} {...p}><path d="M22 2 2 22"/><path d="M22 16.9v3a2 2 0 0 1-2.2 2c-3.7-.4-7.3-1.7-10.3-3.7"/><path d="M4.1 2a2 2 0 0 0-2 2.2 19.8 19.8 0 0 0 3.7 10.3"/></svg>;
