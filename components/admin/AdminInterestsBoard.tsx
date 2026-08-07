"use client";
// Admin · 入驻意向卡片列表 · client-side 搜索 · 完全展开显示所有字段
// 服务端已完整加载(数据量小 · 全部为已授权 admin 场景)
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface Row {
  id: string;
  nickname: string;
  city: string;
  status: string;                  // student | employed | freelancer
  whatsapp: string | null;
  instagram: string | null;
  xHandle: string | null;
  otherContact: string | null;
  telephone: string | null;
  email: string | null;
  mobile: string | null;
  ageConfirmed: boolean;
  contactConsent: boolean;
  locale: string | null;
  source: string | null;
  pagePath: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  ipHash: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_LABEL: Record<string, string> = {
  student: "留学生", employed: "工作者", freelancer: "自由职业",
};
const SOURCE_LABEL: Record<string, string> = {
  inline_form:       "页面内嵌表单",
  header_apply:      "顶部导航申请按钮",
  hero_apply:        "首屏申请按钮",
  floating_primary:  "悬浮「立即登记」",
  floating_secondary:"悬浮「咨询入驻」",
  onboarding_cta:    "入驻流程按钮",
  footer_apply:      "页面底部申请按钮",
  mobile_menu_apply: "移动端菜单申请按钮",
};
const LOCALE_LABEL: Record<string, string> = {
  zh: "中文", "zh-cn": "中文", "zh-hans": "中文",
  en: "English", "en-gb": "English", "en-us": "English",
};

function fmtWhen(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
}
function statusZh(s: string): string {
  return STATUS_LABEL[s] || `其他:${s}`;
}
function localeZh(s: string | null): string {
  if (!s) return "未填写";
  return LOCALE_LABEL[s.toLowerCase()] || s;
}
function sourceZh(s: string | null): string {
  if (!s) return "未填写";
  return SOURCE_LABEL[s] || s;
}
function na(v: string | null | undefined): string {
  return v && v.trim().length > 0 ? v : "未填写";
}

/** 生成 wa.me 链接;需要能提取到国际号码格式 */
function waLink(v: string | null): string | null {
  if (!v) return null;
  const digits = v.replace(/[^0-9]/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}`;
}
/** Instagram 主页链接 */
function igLink(v: string | null): string | null {
  if (!v) return null;
  const t = v.trim();
  if (/^https?:\/\//i.test(t)) return t;
  const handle = t.replace(/^@/, "");
  if (!/^[A-Za-z0-9._]+$/.test(handle)) return null;
  return `https://www.instagram.com/${handle}/`;
}
/** X 主页链接 · 支持 twitter.com URL */
function xLink(v: string | null): string | null {
  if (!v) return null;
  const t = v.trim();
  if (/^https?:\/\//i.test(t)) return t;
  const handle = t.replace(/^@/, "");
  if (!/^[A-Za-z0-9_]+$/.test(handle)) return null;
  return `https://x.com/${handle}`;
}

async function copy(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch { /* silent */ }
}

export default function AdminInterestsBoard({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((r) => {
      return [
        r.nickname, r.city, r.id,
        r.whatsapp, r.instagram, r.xHandle, r.otherContact,
        r.telephone, r.email, r.mobile,
      ].some((v) => (v || "").toLowerCase().includes(query));
    });
  }, [rows, q]);

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return rows.filter((r) => new Date(r.createdAt) >= now).length;
  }, [rows]);

  async function doCopy(id: string, text: string) {
    await copy(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((c) => c === id ? null : c), 1400);
  }

  return (
    <>
      <div className="ai-topbar">
        <div className="ai-stats">
          <div><span>全部记录</span><b>{rows.length}</b></div>
          <div><span>今日新增</span><b>{today}</b></div>
        </div>
        <div className="ai-controls">
          <input
            className="ai-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索昵称、城市或联系方式"
          />
          <button type="button" className="ai-refresh" onClick={() => router.refresh()}>
            刷新
          </button>
        </div>
      </div>

      {rows.length > 0 && filtered.length === 0 && (
        <div className="ai-empty">没有找到符合条件的入驻意向</div>
      )}
      {rows.length === 0 && (
        <div className="ai-empty">
          还没有 /apply 提交记录 · 前台意向表单成功提交后会在这里出现。
        </div>
      )}

      <div className="ai-list">
        {filtered.map((r) => {
          const hasLegacy = r.telephone || r.email || r.mobile;
          const cid = (label: string) => `${r.id}:${label}`;
          return (
            <article key={r.id} className="ai-card">
              <header className="ai-card-h">
                <div className="ai-card-title">
                  <span className="ai-avatar" aria-hidden>{(r.nickname[0] || "?").toUpperCase()}</span>
                  <div>
                    <div className="ai-name">{r.nickname}</div>
                    <div className="ai-id" title={r.id}>ID · {r.id}</div>
                  </div>
                </div>
                <div className="ai-when">
                  <div><em>提交</em>{fmtWhen(r.createdAt)}</div>
                  {r.updatedAt !== r.createdAt && <div><em>更新</em>{fmtWhen(r.updatedAt)}</div>}
                </div>
              </header>

              <div className="ai-block">
                <h4 className="ai-block-h">基础信息</h4>
                <div className="ai-grid ai-grid--3">
                  <Field label="昵称" value={r.nickname} />
                  <Field label="所在城市" value={r.city} />
                  <Field label="当前状态" value={statusZh(r.status)} />
                </div>
              </div>

              <div className="ai-block">
                <h4 className="ai-block-h">联系方式</h4>
                <div className="ai-contacts">
                  <ContactRow icon="WA" label="WhatsApp" value={r.whatsapp}
                    link={waLink(r.whatsapp)} onCopy={() => doCopy(cid("wa"), r.whatsapp || "")}
                    copied={copiedId === cid("wa")} />
                  <ContactRow icon="Ins" label="Ins" value={r.instagram}
                    link={igLink(r.instagram)} onCopy={() => doCopy(cid("ig"), r.instagram || "")}
                    copied={copiedId === cid("ig")} />
                  <ContactRow icon="X" label="X" value={r.xHandle}
                    link={xLink(r.xHandle)} onCopy={() => doCopy(cid("x"), r.xHandle || "")}
                    copied={copiedId === cid("x")} />
                  <ContactRow icon="•" label="其他" value={r.otherContact}
                    link={null} onCopy={() => doCopy(cid("other"), r.otherContact || "")}
                    copied={copiedId === cid("other")} />
                </div>
              </div>

              <div className="ai-block">
                <h4 className="ai-block-h">确认信息</h4>
                <div className="ai-grid ai-grid--2">
                  <Field label="年满 18 岁"
                    value={r.ageConfirmed ? "已确认" : "未确认"}
                    tone={r.ageConfirmed ? "ok" : "warn"} />
                  <Field label="联系与隐私同意"
                    value={r.contactConsent ? "已同意" : "未同意"}
                    tone={r.contactConsent ? "ok" : "warn"} />
                </div>
              </div>

              <div className="ai-block ai-block--muted">
                <div className="ai-grid ai-grid--3">
                  <div>
                    <h4 className="ai-block-h">提交来源</h4>
                    <Field label="页面语言" value={localeZh(r.locale)} />
                    <Field label="提交入口" value={sourceZh(r.source)} />
                    <Field label="页面路径" value={na(r.pagePath)} mono />
                    <Field label="Referrer"  value={na(r.referrer)}  mono />
                  </div>
                  <div>
                    <h4 className="ai-block-h">UTM 信息</h4>
                    <Field label="UTM Source"   value={na(r.utmSource)}   mono />
                    <Field label="UTM Medium"   value={na(r.utmMedium)}   mono />
                    <Field label="UTM Campaign" value={na(r.utmCampaign)} mono />
                    <Field label="UTM Content"  value={na(r.utmContent)}  mono />
                  </div>
                  <div>
                    <h4 className="ai-block-h">安全审计</h4>
                    <Field label="IP hash"    value={na(r.ipHash)}    mono />
                    <Field label="User-Agent" value={na(r.userAgent)} mono />
                  </div>
                </div>
              </div>

              {hasLegacy && (
                <div className="ai-block ai-block--legacy">
                  <h4 className="ai-block-h">历史联系方式(旧字段 · 不再收集)</h4>
                  <div className="ai-grid ai-grid--3">
                    <Field label="联系电话" value={na(r.telephone)} mono selectable />
                    <Field label="邮箱"     value={na(r.email)}     mono selectable />
                    <Field label="手机号"   value={na(r.mobile)}    mono selectable />
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <style jsx>{`
        .ai-topbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:16px 0 12px;flex-wrap:wrap}
        .ai-stats{display:flex;gap:16px}
        .ai-stats > div{background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:8px 14px;display:flex;align-items:baseline;gap:8px}
        .ai-stats span{font-size:11px;color:#6B7280;font-weight:600}
        .ai-stats b{font-size:16px;color:#111;font-variant-numeric:tabular-nums}
        .ai-controls{display:flex;gap:8px;flex:1 1 260px;max-width:520px}
        .ai-search{flex:1;min-width:0;padding:9px 14px;border:1px solid #E5E7EB;border-radius:10px;font-size:13px;color:#111;background:#fff;outline:none;font-family:inherit}
        .ai-search:focus{border-color:#111}
        .ai-refresh{padding:9px 16px;border:1px solid #111;background:#111;color:#EEDDB8;border-radius:10px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit}
        .ai-refresh:hover{background:#000}

        .ai-empty{padding:32px 20px;text-align:center;background:#fff;border:1px dashed #E5E7EB;border-radius:12px;color:#6B7280;font-size:13px}

        .ai-list{display:flex;flex-direction:column;gap:14px}
        .ai-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:18px 20px;box-shadow:0 1px 2px rgba(15,23,42,.03)}
        .ai-card-h{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #F3F4F6;flex-wrap:wrap}
        .ai-card-title{display:flex;align-items:center;gap:12px;min-width:0}
        .ai-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;font-weight:800;font-size:14px;display:grid;place-items:center;flex-shrink:0}
        .ai-name{font-size:14.5px;font-weight:800;color:#111;letter-spacing:-0.005em}
        .ai-id{font-size:11px;color:#9CA3AF;font-family:ui-monospace,SFMono-Regular,monospace;margin-top:1px;overflow-wrap:anywhere}
        .ai-when{font-size:11.5px;color:#6B7280;font-variant-numeric:tabular-nums;text-align:right;line-height:1.5}
        .ai-when em{font-style:normal;color:#9CA3AF;margin-right:6px;font-weight:600}

        .ai-block{margin-top:12px}
        .ai-block:first-of-type{margin-top:0}
        .ai-block--muted{padding-top:12px;border-top:1px dashed #F3F4F6}
        .ai-block--legacy{padding:10px 12px;background:#FBFAF7;border:1px solid #EEE9DC;border-radius:10px;margin-top:14px}
        .ai-block-h{margin:0 0 8px;font-size:11px;font-weight:700;color:#374151;letter-spacing:.06em;text-transform:uppercase}
        .ai-grid{display:grid;gap:10px 20px}
        .ai-grid--3{grid-template-columns:repeat(3,minmax(0,1fr))}
        .ai-grid--2{grid-template-columns:repeat(2,minmax(0,1fr))}

        .ai-contacts{display:flex;flex-direction:column;gap:8px}

        @media(max-width:1024px){
          .ai-grid--3{grid-template-columns:repeat(2,minmax(0,1fr))}
        }
        @media(max-width:640px){
          .ai-card{padding:16px 14px}
          .ai-card-h{flex-direction:column;align-items:flex-start;gap:6px}
          .ai-when{text-align:left}
          .ai-grid,.ai-grid--3,.ai-grid--2{grid-template-columns:1fr}
          .ai-controls{max-width:100%}
        }
      `}</style>
    </>
  );
}

// ─── Presentational helpers ─────────────────────────────────

function Field({ label, value, mono, muted, selectable, tone }: {
  label: string; value: string; mono?: boolean; muted?: boolean; selectable?: boolean;
  tone?: "ok" | "warn";
}) {
  const cls = ["ai-fv", mono && "mono", muted && "muted", selectable && "selectable", tone && "tone-" + tone]
    .filter(Boolean).join(" ");
  return (
    <div className="ai-fld">
      <span className="ai-fk">{label}</span>
      <span className={cls}>{value}</span>
      <style jsx>{`
        .ai-fld{display:flex;flex-direction:column;gap:2px;min-width:0}
        .ai-fk{font-size:11px;color:#9CA3AF;font-weight:600}
        .ai-fv{font-size:13px;color:#111;font-weight:600;line-height:1.45;overflow-wrap:anywhere;word-break:break-word}
        .ai-fv.mono{font-family:ui-monospace,SFMono-Regular,monospace;font-size:12.5px}
        .ai-fv.muted{color:#6B7280;font-weight:500}
        .ai-fv.selectable{user-select:all}
        .ai-fv.tone-ok{color:#166534}
        .ai-fv.tone-warn{color:#B45309}
      `}</style>
    </div>
  );
}

function ContactRow({ icon, label, value, link, onCopy, copied }: {
  icon: string; label: string; value: string | null;
  link: string | null; onCopy: () => void; copied: boolean;
}) {
  const has = !!(value && value.trim());
  return (
    <div className="ai-crow">
      <span className="ai-ck">
        <span className="ai-cico" aria-hidden>{icon}</span>{label}
      </span>
      <span className={"ai-cv" + (has ? "" : " empty")}>
        {has ? value : "未填写"}
      </span>
      {has && (
        <span className="ai-cops">
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="ai-op ai-op--open">打开</a>
          )}
          <button type="button" className="ai-op" onClick={onCopy}>
            {copied ? "已复制" : "复制"}
          </button>
        </span>
      )}
      <style jsx>{`
        .ai-crow{display:grid;grid-template-columns:110px minmax(0,1fr) auto;gap:12px;align-items:center;padding:8px 10px;background:#FBFAF7;border:1px solid #F0EAE1;border-radius:10px}
        .ai-ck{font-size:12px;font-weight:800;color:#111;display:inline-flex;align-items:center;gap:6px}
        .ai-cico{display:inline-grid;place-items:center;width:22px;height:22px;background:#171512;color:#EEDDB8;font-size:9.5px;border-radius:6px;font-weight:800}
        .ai-cv{font-size:13px;color:#111;font-weight:600;line-height:1.45;overflow-wrap:anywhere;word-break:break-word;font-family:ui-monospace,SFMono-Regular,monospace;user-select:all}
        .ai-cv.empty{color:#9CA3AF;font-family:inherit;font-weight:500;user-select:none}
        .ai-cops{display:inline-flex;gap:6px}
        .ai-op{min-width:44px;min-height:32px;padding:0 10px;background:#fff;border:1px solid #E5E7EB;color:#374151;font-size:11.5px;font-weight:700;border-radius:8px;cursor:pointer;font-family:inherit;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
        .ai-op:hover{border-color:#111;color:#111}
        .ai-op--open{background:#171512;color:#EEDDB8;border-color:#171512}
        .ai-op--open:hover{background:#000;color:#EEDDB8}
        @media(max-width:640px){
          .ai-crow{grid-template-columns:1fr;gap:4px;align-items:flex-start}
          .ai-cops{grid-column:1;margin-top:6px}
        }
      `}</style>
    </div>
  );
}
