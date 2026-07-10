"use client";
// Settings form · client · PATCH /api/admin/settings
import { useState } from "react";
import type { CmsSettings } from "@/lib/cms/types";

interface Props { initial: CmsSettings }

const FLAG_META: { key: keyof CmsSettings["flags"]; label: string; hint: string }[] = [
  { key: "registrationEnabled",       label: "Registration Enabled",         hint: "允许新用户注册" },
  { key: "creatorApplicationEnabled", label: "Creator Application Enabled",  hint: "允许 sugargirl/sugarboy/massage 入驻申请" },
  { key: "chatEnabled",               label: "Chat Enabled",                 hint: "站内私密聊天 + 多语言翻译" },
  { key: "lockedMediaEnabled",        label: "Locked Media Enabled",         hint: "付费图片/视频解锁" },
  { key: "creditsEnabled",            label: "Credits Enabled",              hint: "钱包充值 · 打赏 · 解锁" },
  { key: "massageChannelEnabled",     label: "Massage Channel",              hint: "情趣按摩频道 (前台入口 + 页面)" },
  { key: "sugarboyChannelEnabled",    label: "Sugarboy Channel",             hint: "Sugarboy 频道" },
  { key: "journalEnabled",            label: "Journal",                      hint: "Sugardating Journal 内容" },
  { key: "customServicesEnabled",     label: "Custom Services",              hint: "高端活动定制服务" },
];

export default function SettingsForm({ initial }: Props) {
  const [state, setState] = useState<CmsSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  function toggleFlag(key: keyof CmsSettings["flags"]) {
    setState((p) => ({ ...p, flags: { ...p.flags, [key]: !p.flags[key] } }));
  }

  async function save() {
    setSaving(true); setMsg(null);
    try {
      const r = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          siteName: state.siteName,
          defaultLocale: state.defaultLocale,
          maintenanceMode: state.maintenanceMode,
          flags: state.flags,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data?.ok) throw new Error(data?.message || "保存失败");
      setMsg({ tone: "ok", text: `已保存 · ${new Date().toLocaleTimeString("zh-CN", { hour12: false })}` });
    } catch (e) {
      setMsg({ tone: "err", text: e instanceof Error ? e.message : "保存失败" });
    } finally { setSaving(false); }
  }

  return (
    <div className="sf">
      {/* Site */}
      <div className="sf-card">
        <h4>Site</h4>
        <label className="sf-row">
          <span>Site Name</span>
          <input value={state.siteName} onChange={(e) => setState({ ...state, siteName: e.target.value })} />
        </label>
        <label className="sf-row">
          <span>Default Locale</span>
          <select value={state.defaultLocale} onChange={(e) => setState({ ...state, defaultLocale: e.target.value })}>
            {state.supportedLocales.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        <label className="sf-tog">
          <input type="checkbox" checked={state.maintenanceMode} onChange={(e) => setState({ ...state, maintenanceMode: e.target.checked })} />
          <div>
            <b>Maintenance Mode</b>
            <span>开启后前台会显示维护中提示 (需接 middleware)</span>
          </div>
        </label>
      </div>

      {/* Feature flags */}
      <div className="sf-card">
        <h4>Feature Flags</h4>
        <div className="sf-flags">
          {FLAG_META.map((f) => (
            <label key={f.key} className={"sf-flag" + (state.flags[f.key] ? " is-on" : "")}>
              <div className="sf-flag-info">
                <b>{f.label}</b>
                <span>{f.hint}</span>
              </div>
              <div className="sf-switch" role="switch" aria-checked={state.flags[f.key]}>
                <input type="checkbox" checked={state.flags[f.key]} onChange={() => toggleFlag(f.key)} />
                <span />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="sf-actions">
        <button onClick={save} disabled={saving} className="sf-save">
          {saving ? "保存中…" : "保存全部设置"}
        </button>
        {msg && <span className={"sf-msg " + msg.tone}>{msg.text}</span>}
      </div>

      <style jsx>{`
        .sf{display:flex;flex-direction:column;gap:16px}
        .sf-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:22px 24px}
        .sf-card h4{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#111;font-weight:700;margin:0 0 16px}
        .sf-row{display:grid;grid-template-columns:180px 1fr;gap:16px;align-items:center;padding:10px 0}
        .sf-row > span{font-size:13px;color:#374151;font-weight:600}
        .sf-row input,.sf-row select{padding:8px 12px;border:1px solid #E5E7EB;border-radius:10px;font:inherit;font-size:13.5px;color:#111;outline:none;background:#F7F5F0;max-width:360px}
        .sf-row input:focus,.sf-row select:focus{border-color:#D6B980;background:#fff}
        .sf-tog{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-top:1px solid #F3F4F6;margin-top:8px;cursor:pointer}
        .sf-tog input{margin-top:3px;width:16px;height:16px;accent-color:#111}
        .sf-tog b{display:block;font-size:13.5px;color:#111;font-weight:700}
        .sf-tog span{font-size:12px;color:#6B7280;line-height:1.55}
        .sf-flags{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .sf-flag{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#FAFAF8;border:1px solid #E5E7EB;border-radius:12px;cursor:pointer;transition:border-color .12s,background .12s}
        .sf-flag:hover{border-color:#D6B980}
        .sf-flag.is-on{background:#fff;border-color:#D6B980}
        .sf-flag-info{display:flex;flex-direction:column;gap:2px;min-width:0}
        .sf-flag-info b{font-size:13px;color:#111;font-weight:700}
        .sf-flag-info span{font-size:11.5px;color:#6B7280}
        .sf-switch{width:38px;height:22px;background:#D1D5DB;border-radius:99px;position:relative;flex-shrink:0;transition:background .16s}
        .sf-switch input{position:absolute;inset:0;opacity:0;cursor:pointer}
        .sf-switch span{position:absolute;top:2px;left:2px;width:18px;height:18px;background:#fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.15);transition:transform .16s}
        .sf-flag.is-on .sf-switch{background:#111}
        .sf-flag.is-on .sf-switch span{transform:translateX(16px);background:#EEDDB8}
        .sf-actions{display:flex;align-items:center;gap:14px}
        .sf-save{padding:12px 24px;background:#111;color:#fff;border:0;border-radius:10px;font:inherit;font-weight:700;font-size:13.5px;cursor:pointer;transition:background .12s}
        .sf-save:hover:not(:disabled){background:#000}
        .sf-save:disabled{opacity:.5;cursor:not-allowed}
        .sf-msg{font-size:12.5px;font-weight:600}
        .sf-msg.ok{color:#166534}
        .sf-msg.err{color:#B91C1C}
        @media (max-width:900px){.sf-flags{grid-template-columns:1fr}.sf-row{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
