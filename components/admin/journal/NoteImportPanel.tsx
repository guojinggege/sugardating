"use client";
// 内嵌在 Journal 编辑器顶部的「从小红书笔记导入」面板
// 转换结果 → hydrate 上层编辑器的 title/excerpt/tags/blocks · 不落库
import { useState } from "react";
import type { ConversionOutput, ConversionSettings } from "@/lib/content-tools/conversion-types";

interface Category { slug: string; title: string; titleZh: string }

interface Props {
  categories: Category[];
  currentCategorySlug: string;
  onApply: (output: ConversionOutput) => void;
  onDismiss: () => void;
}

const CTA_OPTIONS = [
  "browse-sugargirls", "browse-asian", "browse-london",
  "premium", "credits", "safety", "apply-creator", "video-profiles",
];
const LEN_LABEL: Record<string, string> = { brief: "简短 · 600-900 字", standard: "标准 · 1200-1800", deep: "深度 · 2000-3000" };
const TONE_LABEL: Record<string, string> = { editorial: "编辑体", insider: "内行体", practical: "实用型", narrative: "叙事型" };
const LANG_LABEL: Record<string, string> = { zh: "中文", en: "English (占位需翻译)", bilingual: "双语 (需人工补)" };

export default function NoteImportPanel({ categories, currentCategorySlug, onApply, onDismiss }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [rawText, setRawText] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceAuthor, setSourceAuthor] = useState("");

  const [categorySlug, setCategorySlug] = useState(currentCategorySlug);
  const [language, setLanguage] = useState<"zh" | "en" | "bilingual">("zh");
  const [tone, setTone] = useState<"editorial" | "insider" | "practical" | "narrative">("editorial");
  const [length, setLength] = useState<"brief" | "standard" | "deep">("standard");
  const [insertInsight, setInsertInsight] = useState(true);
  const [selectedCtas, setSelectedCtas] = useState<string[]>([]);
  const [rightsOk, setRightsOk] = useState(false);

  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canConvert = rawText.trim().length >= 30 && rightsOk;

  function toggleCta(v: string) {
    setSelectedCtas((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v].slice(0, 3));
  }

  async function convert() {
    if (!canConvert || converting) return;
    setConverting(true); setError(null);
    try {
      const r = await fetch("/api/admin/journal/convert", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          rawText,
          sourceUrl: sourceUrl || undefined,
          sourceAuthor: sourceAuthor || undefined,
          settings: {
            categorySlug, language, tone, length,
            insertInsight,
            suggestedCtas: selectedCtas,
            sourceRightsConfirmed: rightsOk,
          } as ConversionSettings,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.message || "转换失败");
      onApply(d.output as ConversionOutput);
      setExpanded(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "转换失败");
    } finally { setConverting(false); }
  }

  if (!expanded) {
    return (
      <div className="nip-collapsed">
        <span>✅ 已从笔记导入到正文</span>
        <button type="button" onClick={() => setExpanded(true)}>重新导入笔记</button>
        <button type="button" onClick={onDismiss} className="nip-x">关闭导入面板</button>
        <style>{`
          .nip-collapsed{display:flex;align-items:center;gap:12px;padding:10px 16px;background:#DCFCE7;border:1px solid #BBF7D0;border-radius:10px;font-size:12.5px;color:#166534;font-weight:600;margin-bottom:14px}
          .nip-collapsed span{flex:1}
          .nip-collapsed button{background:#fff;border:1px solid #16A34A;color:#166534;padding:5px 12px;font:inherit;font-size:11.5px;font-weight:700;border-radius:99px;cursor:pointer}
          .nip-x{border-color:#D6D3D1 !important;color:#78716C !important}
        `}</style>
      </div>
    );
  }

  return (
    <div className="nip">
      <div className="nip-h">
        <div>
          <span className="nip-eye">Import</span>
          <h3>从小红书笔记生成正文</h3>
          <p>粘贴笔记 · 选设置 · 一键生成 Body Blocks 与 SEO 建议 · 直接写入下方编辑器 · 不会跳转页面 · 生成后仍可逐块编辑</p>
        </div>
        <button type="button" onClick={onDismiss} className="nip-close" title="关闭导入面板 · 手动撰写">×</button>
      </div>

      <div className="nip-grid">
        <div className="nip-col">
          <label className="nip-lbl">
            <b>粘贴笔记正文</b>
            <span className={rawText.length < 30 ? "nip-warn" : ""}>{rawText.length} / 20,000</span>
          </label>
          <textarea
            className="nip-textarea"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="姐妹们 今天来讲讲在伦敦怎么筛选真实的 sugargirls…&#10;&#10;粘贴笔记正文,至少 30 字。工具会自动清理 emoji 装饰、话术噪点,并识别标题、列表结构。"
            rows={8}
            maxLength={20000}
          />

          <div className="nip-row2">
            <label>
              <b>来源链接 (可选)</b>
              <input type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://www.xiaohongshu.com/..." />
            </label>
            <label>
              <b>原作者 (可选)</b>
              <input type="text" value={sourceAuthor} onChange={(e) => setSourceAuthor(e.target.value)} placeholder="@原作者昵称" />
            </label>
          </div>
        </div>

        <div className="nip-col">
          <div className="nip-row2">
            <label>
              <b>分类</b>
              <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.title} · {c.titleZh}</option>)}
              </select>
            </label>
            <label>
              <b>语言</b>
              <select value={language} onChange={(e) => setLanguage(e.target.value as any)}>
                {Object.entries(LANG_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
          </div>
          <div className="nip-row2">
            <label>
              <b>语气</b>
              <select value={tone} onChange={(e) => setTone(e.target.value as any)}>
                {Object.entries(TONE_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
            <label>
              <b>长度</b>
              <select value={length} onChange={(e) => setLength(e.target.value as any)}>
                {Object.entries(LEN_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
          </div>

          <label className="nip-toggle">
            <input type="checkbox" checked={insertInsight} onChange={(e) => setInsertInsight(e.target.checked)} />
            末尾自动插入 Sugardating Insight
          </label>

          <div>
            <b className="nip-cta-h">底部 CTA (最多 3 个 · 留空使用分类默认)</b>
            <div className="nip-chips">
              {CTA_OPTIONS.map((v) => (
                <button key={v} type="button" onClick={() => toggleCta(v)}
                  className={"nip-chip" + (selectedCtas.includes(v) ? " is-active" : "")}>{v}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <label className="nip-rights">
        <input type="checkbox" checked={rightsOk} onChange={(e) => setRightsOk(e.target.checked)} />
        <div>
          <b>已确认素材授权</b>
          <span>承诺:内容为原创改写、或已获原作者授权、或仅使用公开常识信息 · 不侵犯第三方权益</span>
        </div>
      </label>

      {error && <div className="nip-err">{error}</div>}

      <div className="nip-actions">
        <button type="button" onClick={onDismiss} className="nip-btn nip-btn--ghost">切换到手动撰写</button>
        <button type="button" onClick={convert} disabled={!canConvert || converting} className="nip-btn nip-btn--gold">
          {converting ? "生成中…" : "生成并写入正文 →"}
        </button>
      </div>

      <style>{`
        .nip{background:linear-gradient(135deg,#FBFAF7,#F4F4F5);border:1px solid #EEE9DC;border-radius:14px;padding:20px 22px;margin-bottom:14px;display:flex;flex-direction:column;gap:14px}
        .nip-h{display:flex;justify-content:space-between;align-items:flex-start;gap:14px}
        .nip-eye{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:#B8A789;font-weight:700}
        .nip-h h3{font-family:'Cormorant Garamond',ui-serif;font-size:22px;font-style:italic;font-weight:500;color:#111;margin:4px 0}
        .nip-h p{font-size:12.5px;color:#6B7280;margin:0;line-height:1.55;max-width:680px}
        .nip-close{background:#fff;border:1px solid #E5E7EB;width:32px;height:32px;border-radius:50%;font-size:18px;color:#6B7280;cursor:pointer;line-height:1;flex-shrink:0}
        .nip-close:hover{border-color:#111;color:#111}

        .nip-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .nip-col{display:flex;flex-direction:column;gap:10px}
        .nip-lbl{display:flex;justify-content:space-between;align-items:baseline;font-size:11.5px;color:#374151}
        .nip-lbl b{font-weight:600}
        .nip-lbl .nip-warn{color:#B91C1C}
        .nip-lbl span{font-size:11px;color:#9CA3AF;font-variant-numeric:tabular-nums}

        .nip-textarea{width:100%;padding:12px 14px;border:1px solid #E5E7EB;border-radius:10px;font:inherit;font-size:13.5px;color:#111;background:#fff;outline:none;resize:vertical;line-height:1.6;min-height:180px}
        .nip-textarea:focus{border-color:#D6B980}

        .nip-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .nip-row2 label,.nip-col > label{display:flex;flex-direction:column;gap:4px}
        .nip-row2 b,.nip-col > label b{font-size:11.5px;color:#374151;font-weight:600}
        .nip-row2 input,.nip-row2 select{padding:8px 12px;border:1px solid #E5E7EB;border-radius:10px;font:inherit;font-size:13px;color:#111;background:#fff;outline:none}
        .nip-row2 input:focus,.nip-row2 select:focus{border-color:#D6B980}

        .nip-toggle{display:flex;gap:8px;align-items:center;font-size:12.5px;color:#374151;cursor:pointer;padding:2px 0}
        .nip-toggle input{width:14px;height:14px;accent-color:#111}

        .nip-cta-h{display:block;font-size:11.5px;color:#374151;font-weight:600;margin-bottom:6px}
        .nip-chips{display:flex;flex-wrap:wrap;gap:4px}
        .nip-chip{padding:5px 10px;background:#F3F4F6;color:#374151;border:0;border-radius:99px;font:inherit;font-size:11px;font-weight:600;font-family:ui-monospace,monospace;cursor:pointer}
        .nip-chip.is-active{background:#111;color:#EEDDB8}

        .nip-rights{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;background:#FEF3C7;border:1px dashed #F5D073;border-radius:10px;cursor:pointer;font-size:12.5px;line-height:1.55;color:#7C5A05}
        .nip-rights input{margin-top:3px;flex-shrink:0;width:16px;height:16px;accent-color:#111}
        .nip-rights b{display:block;font-size:13px;font-weight:700;color:inherit;margin-bottom:2px}
        .nip-rights span{color:inherit;opacity:.85}

        .nip-err{padding:10px 14px;background:#FEE2E2;color:#B91C1C;border-radius:10px;font-size:13px}
        .nip-actions{display:flex;gap:8px;justify-content:flex-end}
        .nip-btn{padding:10px 20px;border-radius:10px;border:0;font:inherit;font-weight:700;font-size:13px;cursor:pointer}
        .nip-btn:disabled{opacity:.5;cursor:not-allowed}
        .nip-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;box-shadow:0 10px 22px -12px rgba(184,167,137,.5)}
        .nip-btn--ghost{background:#F3F4F6;color:#374151}

        @media (max-width:1024px){.nip-grid{grid-template-columns:1fr}.nip-row2{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
