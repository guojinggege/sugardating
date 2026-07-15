"use client";
// 内容智能工坊 · Tab A (原生 CMS 转换) + Tab B (原始工具 iframe)
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import type { ConversionOutput, ConversionSettings } from "@/lib/content-tools/conversion-types";

interface Category { slug: string; title: string; titleZh: string }

interface Props {
  categories: Category[];
}

const CTA_OPTIONS = [
  "browse-sugargirls", "browse-asian", "browse-london",
  "premium", "credits", "safety", "apply-creator", "video-profiles",
];

const LENGTH_LABEL: Record<string, string> = {
  brief: "简短 (适合社交预告)",
  standard: "标准 (~ 400-800 字)",
  deep: "深度 (原文全保留)",
};

const TONE_LABEL: Record<string, string> = {
  editorial: "编辑体 (克制客观)",
  insider:   "内行体 (稍带主张)",
  practical: "实用型 (清单为主)",
  narrative: "叙事型 (故事感)",
};

const LANG_LABEL: Record<string, string> = {
  zh: "中文",
  en: "English (占位,需人工翻译)",
  bilingual: "双语 (需人工补 EN)",
};

export default function XhsToBlogWorkspace({ categories }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"native" | "external">("native");

  // Source
  const [rawText, setRawText] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceAuthor, setSourceAuthor] = useState("");

  // Settings
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug ?? "relationship-intelligence");
  const [language, setLanguage] = useState<"zh" | "en" | "bilingual">("zh");
  const [tone, setTone] = useState<"editorial" | "insider" | "practical" | "narrative">("editorial");
  const [length, setLength] = useState<"brief" | "standard" | "deep">("standard");
  const [insertInsight, setInsertInsight] = useState(true);
  const [selectedCtas, setSelectedCtas] = useState<string[]>([]);
  const [sourceRightsConfirmed, setSourceRightsConfirmed] = useState(false);

  // Output
  const [output, setOutput] = useState<ConversionOutput | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit overlay
  const [editedTitle, setEditedTitle] = useState("");
  const [editedSlug, setEditedSlug] = useState("");
  const [editedExcerpt, setEditedExcerpt] = useState("");
  const [humanReviewed, setHumanReviewed] = useState(false);
  const [creating, setCreating] = useState(false);

  const wordCount = useMemo(() => rawText.length, [rawText]);
  const canConvert = rawText.trim().length >= 30 && sourceRightsConfirmed;

  function toggleCta(v: string) {
    setSelectedCtas((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v].slice(0, 3));
  }

  async function convert() {
    if (!canConvert || converting) return;
    setConverting(true); setError(null); setOutput(null);
    try {
      const r = await fetch("/api/admin/content-tools/convert", {
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
            sourceRightsConfirmed,
          } as ConversionSettings,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.message || "转换失败");
      setOutput(d.output);
      setEditedTitle(d.output.title);
      setEditedSlug(d.output.slug);
      setEditedExcerpt(d.output.excerpt);
      setHumanReviewed(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "转换失败");
    } finally { setConverting(false); }
  }

  async function createDraft() {
    if (!output || !humanReviewed || creating) return;
    setCreating(true); setError(null);
    try {
      const r = await fetch("/api/admin/journal/posts/from-conversion", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          conversionId: output.id,
          humanReviewed: true,
          override: {
            title: editedTitle || undefined,
            slug: editedSlug || undefined,
            excerpt: editedExcerpt || undefined,
          },
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.message || "创建草稿失败");
      // 跳到 JournalEditor 继续人工编辑
      router.push(`/admin/journal/posts/${d.post.slug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "创建草稿失败");
      setCreating(false);
    }
  }

  function resetAll() {
    if (!confirm("清空当前会话并从头开始?")) return;
    setRawText(""); setSourceUrl(""); setSourceAuthor("");
    setOutput(null); setError(null);
    setSourceRightsConfirmed(false); setHumanReviewed(false);
    setEditedTitle(""); setEditedSlug(""); setEditedExcerpt("");
  }

  return (
    <div className="wf">
      {/* Tabs */}
      <div className="wf-tabs">
        <button type="button" onClick={() => setTab("native")} className={"wf-tab" + (tab === "native" ? " is-active" : "")}>
          <b>Native · CMS 转换</b>
          <span>启发式重写 + 人工编辑 + 创建草稿</span>
        </button>
        <button type="button" onClick={() => setTab("external")} className={"wf-tab" + (tab === "external" ? " is-active" : "")}>
          <b>Original · 原始工具</b>
          <span>iframe 嵌入 xhs-to-blog.vercel.app</span>
        </button>
      </div>

      {tab === "native" ? (
        <div className="wf-grid">
          {/* Left column: source + settings */}
          <div className="wf-col">
            <div className="wf-card">
              <div className="wf-h">
                <span className="wf-step">Step 1</span>
                <h3>粘贴笔记正文</h3>
                <p>直接从小红书 App 复制正文粘贴 · 不抓取 URL · 保留出处仅作归属</p>
              </div>
              <textarea
                className="wf-source"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="姐妹们 今天来讲讲在伦敦怎么筛选真实的 sugargirls…&#10;&#10;粘贴笔记正文,至少 30 字。工具会自动清理小红书装饰符号、话术噪点,并识别标题、列表结构。"
                rows={10}
                maxLength={20000}
              />
              <div className="wf-source-meta">
                <span className={wordCount >= 30 ? "" : "wf-warn"}>{wordCount} / 20,000 字</span>
                {rawText && <button type="button" onClick={() => setRawText("")} className="wf-clear">清空</button>}
              </div>

              <div className="wf-row2">
                <label>
                  <span>来源链接 (可选,仅归属)</span>
                  <input type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://www.xiaohongshu.com/..." />
                </label>
                <label>
                  <span>原作者 (可选)</span>
                  <input type="text" value={sourceAuthor} onChange={(e) => setSourceAuthor(e.target.value)} placeholder="@原作者昵称" />
                </label>
              </div>

              <label className="wf-check wf-check--critical">
                <input type="checkbox" checked={sourceRightsConfirmed} onChange={(e) => setSourceRightsConfirmed(e.target.checked)} />
                <div>
                  <b>已确认素材授权</b>
                  <span>我承诺:内容为原创改写,或已获原作者授权,或仅使用公开常识信息,不侵犯任何第三方权益。</span>
                </div>
              </label>
            </div>

            <div className="wf-card">
              <div className="wf-h">
                <span className="wf-step">Step 2</span>
                <h3>Sugardating 内容设置</h3>
                <p>选择内容方向 · 语气 · 长度 · 自动 Insight 与 CTA</p>
              </div>

              <div className="wf-row2">
                <label>
                  <span>内容方向 (Journal 分类)</span>
                  <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.title} · {c.titleZh}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>语言</span>
                  <select value={language} onChange={(e) => setLanguage(e.target.value as any)}>
                    {Object.entries(LANG_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                </label>
              </div>

              <div className="wf-row2">
                <label>
                  <span>语气</span>
                  <select value={tone} onChange={(e) => setTone(e.target.value as any)}>
                    {Object.entries(TONE_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                </label>
                <label>
                  <span>长度</span>
                  <select value={length} onChange={(e) => setLength(e.target.value as any)}>
                    {Object.entries(LENGTH_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                </label>
              </div>

              <label className="wf-check">
                <input type="checkbox" checked={insertInsight} onChange={(e) => setInsertInsight(e.target.checked)} />
                <div>
                  <b>自动插入 Sugardating Insight</b>
                  <span>末尾追加一条基于所选分类的 Sugardating 观点 block</span>
                </div>
              </label>

              <div className="wf-cta-row">
                <div className="wf-cta-h">底部 CTA (最多 3 个)</div>
                <div className="wf-chips">
                  {CTA_OPTIONS.map((v) => (
                    <button key={v} type="button" onClick={() => toggleCta(v)}
                      className={"wf-chip" + (selectedCtas.includes(v) ? " is-active" : "")}
                    >{v}</button>
                  ))}
                </div>
                <p className="wf-fine">留空使用分类默认 CTA</p>
              </div>
            </div>

            <div className="wf-actions">
              <button type="button" onClick={resetAll} className="wf-btn wf-btn--ghost">重置</button>
              <button type="button" onClick={convert} disabled={!canConvert || converting} className="wf-btn wf-btn--gold">
                {converting ? "转换中…" : "生成 Journal 草稿内容 →"}
              </button>
            </div>
            {!sourceRightsConfirmed && rawText.trim().length >= 30 && (
              <div className="wf-hint">请先勾选素材授权后再转换</div>
            )}
            {error && <div className="wf-err">{error}</div>}
          </div>

          {/* Right column: output */}
          <div className="wf-col">
            {!output ? (
              <div className="wf-empty">
                <div className="wf-empty-ic">✨</div>
                <h4>转换结果显示在这里</h4>
                <p>粘贴笔记,选设置,点右下角"生成"即可。生成后可微调标题/slug/摘要,然后创建 Journal 草稿进入编辑器。</p>
              </div>
            ) : (
              <>
                <div className="wf-card">
                  <div className="wf-h">
                    <span className="wf-step wf-step--done">Step 3</span>
                    <h3>转换结果</h3>
                    <p>ID: <code>{output.id}</code> · 可微调后创建草稿</p>
                  </div>
                  <label className="wf-field">
                    <span>文章标题</span>
                    <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} maxLength={200} />
                  </label>
                  <label className="wf-field">
                    <span>Slug</span>
                    <input type="text" value={editedSlug} onChange={(e) => setEditedSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))} maxLength={80} />
                  </label>
                  <label className="wf-field">
                    <span>摘要 (excerpt)</span>
                    <textarea rows={3} value={editedExcerpt} onChange={(e) => setEditedExcerpt(e.target.value)} maxLength={500} />
                  </label>
                  <div className="wf-meta">
                    <span>分类: <b>{categories.find((c) => c.slug === output.categorySlug)?.title || output.categorySlug}</b></span>
                    <span>语言: <b>{output.language.toUpperCase()}</b></span>
                    <span>字数: <b>{output.body.reduce((s, b) => s + (b.text?.length ?? b.items?.join("").length ?? 0), 0)}</b></span>
                    <span>{output.readingTime}</span>
                  </div>
                  {output.tags.length > 0 && (
                    <div className="wf-tags">{output.tags.map((t) => <span key={t}>#{t}</span>)}</div>
                  )}
                </div>

                <div className="wf-card">
                  <div className="wf-h">
                    <h3>Preview · Body Blocks</h3>
                    <p>{output.body.length} 个 block · 后续可在 JournalEditor 完整编辑</p>
                  </div>
                  <div className="wf-preview">
                    {output.body.map((b, i) => renderBlock(b, i))}
                  </div>
                  {output.cta.length > 0 && (
                    <div className="wf-cta-preview">
                      <div>底部 CTA:</div>
                      {output.cta.map((c) => <span key={c}>{c}</span>)}
                    </div>
                  )}
                </div>

                <div className="wf-card wf-card--checklist">
                  <div className="wf-h">
                    <h3>质量检查</h3>
                  </div>
                  <ul className="wf-checks">
                    {output.qualityChecks.map((q) => (
                      <li key={q.key} className={q.passed ? "is-ok" : "is-warn"}>
                        <span>{q.passed ? "✓" : "!"}</span>
                        <div>
                          <b>{q.label}</b>
                          <em>{q.hint}</em>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="wf-card wf-card--gate">
                  <label className="wf-check wf-check--critical">
                    <input type="checkbox" checked={humanReviewed} onChange={(e) => setHumanReviewed(e.target.checked)} />
                    <div>
                      <b>已人工复核内容 · Human Review Confirmed</b>
                      <span>我已阅读结果,确认内容不含低俗、未成年、明确交易或违反社区规则的元素;标题、slug、摘要与素材归属均已核实。</span>
                    </div>
                  </label>
                  <button type="button" onClick={createDraft} disabled={!humanReviewed || creating} className="wf-btn wf-btn--gold" style={{ width: "100%", marginTop: 12 }}>
                    {creating ? "创建中…" : "创建 Journal 草稿 → 打开编辑器"}
                  </button>
                  <p className="wf-fine">
                    草稿状态创建 · 不会自动发布 · 需在 JournalEditor 中完成编辑与预览后手动发布
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="wf-external">
          <div className="wf-external-tip">
            💡 原始工具 iframe · 你可以在这里用完整功能,复制结果后切回 Native tab 粘贴到 Step 1。
          </div>
          <iframe
            src="https://xhs-to-blog.vercel.app/"
            title="小红书笔记转博客 · 原始工具"
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            className="wf-iframe"
          />
        </div>
      )}

      <style>{`
        .wf{display:flex;flex-direction:column;gap:14px}
        .wf-tabs{display:flex;gap:6px;padding:6px;background:#fff;border:1px solid #E5E7EB;border-radius:14px}
        .wf-tab{flex:1;background:transparent;border:0;padding:12px 18px;border-radius:10px;font:inherit;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:2px;transition:background .12s,color .12s}
        .wf-tab b{font-size:13.5px;color:#374151;font-weight:700;letter-spacing:-0.005em}
        .wf-tab span{font-size:11px;color:#6B7280}
        .wf-tab:hover{background:#FBFAF7}
        .wf-tab.is-active{background:#111;color:#EEDDB8}
        .wf-tab.is-active b{color:#EEDDB8}
        .wf-tab.is-active span{color:rgba(238,221,184,.65)}

        .wf-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:flex-start}
        .wf-col{display:flex;flex-direction:column;gap:12px;min-width:0}
        .wf-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:18px 20px}
        .wf-card--checklist{background:#FBFAF7;border-color:#EEE9DC}
        .wf-card--gate{background:linear-gradient(135deg,#161618,#0F0F11);color:#EEDDB8;border-color:#B8A789}
        .wf-h{margin-bottom:14px}
        .wf-h h3{font-family:'Cormorant Garamond',ui-serif;font-size:20px;font-style:italic;font-weight:500;color:#161618;margin:6px 0 4px;letter-spacing:-0.005em}
        .wf-card--gate .wf-h h3{color:#fff}
        .wf-h p{font-size:12.5px;color:#6B7280;margin:0}
        .wf-card--gate .wf-h p{color:rgba(238,221,184,.65)}
        .wf-step{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#B8A789;font-weight:700}
        .wf-step--done{color:#166534}

        .wf-source{width:100%;padding:12px 14px;border:1px solid #E5E7EB;border-radius:10px;font:inherit;font-size:13.5px;color:#111;background:#FAFAF8;outline:none;resize:vertical;line-height:1.6;min-height:200px}
        .wf-source:focus{border-color:#D6B980;background:#fff}
        .wf-source-meta{display:flex;justify-content:space-between;align-items:center;margin-top:8px;font-size:11.5px;color:#9CA3AF}
        .wf-source-meta .wf-warn{color:#B91C1C}
        .wf-clear{background:none;border:0;color:#6B7280;font-size:11.5px;text-decoration:underline;cursor:pointer;padding:0}

        .wf-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
        .wf-row2 label,.wf-field{display:flex;flex-direction:column;gap:4px}
        .wf-row2 span,.wf-field > span{font-size:11.5px;color:#374151;font-weight:600}
        .wf-row2 input,.wf-row2 select,.wf-field input,.wf-field textarea{padding:8px 12px;border:1px solid #E5E7EB;border-radius:10px;font:inherit;font-size:13px;color:#111;background:#FAFAF8;outline:none;resize:vertical}
        .wf-row2 input:focus,.wf-row2 select:focus,.wf-field input:focus,.wf-field textarea:focus{border-color:#D6B980;background:#fff}
        .wf-field{margin-top:10px}

        .wf-check{display:flex;gap:12px;align-items:flex-start;margin-top:14px;padding:12px 14px;background:#FBFAF7;border:1px dashed #EEE9DC;border-radius:10px;cursor:pointer;font-size:12.5px;line-height:1.55}
        .wf-check--critical{background:#FEF3C7;border-color:#F5D073;color:#7C5A05}
        .wf-card--gate .wf-check--critical{background:rgba(238,221,184,.1);border-color:rgba(238,221,184,.35);color:#EEDDB8}
        .wf-check input{margin-top:3px;flex-shrink:0;width:16px;height:16px;accent-color:#111}
        .wf-check b{display:block;font-size:13px;font-weight:700;color:inherit;margin-bottom:2px}
        .wf-check span{color:inherit;opacity:.85}

        .wf-cta-row{margin-top:14px}
        .wf-cta-h{font-size:11.5px;color:#374151;font-weight:600;margin-bottom:6px}
        .wf-chips{display:flex;flex-wrap:wrap;gap:4px}
        .wf-chip{padding:5px 10px;background:#F3F4F6;color:#374151;border:0;border-radius:99px;font:inherit;font-size:11px;font-weight:600;font-family:ui-monospace,monospace;cursor:pointer}
        .wf-chip.is-active{background:#111;color:#EEDDB8}
        .wf-fine{font-size:11px;color:#9CA3AF;margin:6px 0 0}

        .wf-actions{display:flex;gap:8px;padding-top:6px}
        .wf-btn{padding:12px 20px;border-radius:10px;border:0;font:inherit;font-weight:700;font-size:13px;cursor:pointer;transition:transform .12s,opacity .12s}
        .wf-btn:disabled{opacity:.5;cursor:not-allowed}
        .wf-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;flex:1;box-shadow:0 10px 22px -12px rgba(184,167,137,.5)}
        .wf-btn--gold:hover:not(:disabled){transform:translateY(-1px)}
        .wf-btn--ghost{background:#F3F4F6;color:#111}
        .wf-hint{padding:8px 12px;background:#FEF3C7;color:#7C5A05;border-radius:8px;font-size:12px}
        .wf-err{padding:10px 14px;background:#FEE2E2;color:#B91C1C;border-radius:10px;font-size:13px}

        .wf-empty{padding:60px 24px;background:#fff;border:1px dashed #E5E7EB;border-radius:14px;text-align:center;color:#6B7280}
        .wf-empty-ic{font-size:36px;margin-bottom:12px}
        .wf-empty h4{font-size:15px;color:#111;font-weight:700;margin:0 0 6px}
        .wf-empty p{font-size:13px;margin:0;line-height:1.65}

        .wf-meta{display:flex;flex-wrap:wrap;gap:12px;font-size:11.5px;color:#6B7280;margin-top:8px;padding-top:10px;border-top:1px dashed #F3F4F6}
        .wf-meta b{color:#111;font-weight:700}
        .wf-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}
        .wf-tags span{padding:2px 8px;background:#F3F4F6;border-radius:99px;font-size:11px;color:#374151}
        .wf-preview{display:flex;flex-direction:column;gap:10px;font-size:13.5px;line-height:1.7;max-height:400px;overflow-y:auto;padding-right:6px}
        .wf-cta-preview{margin-top:12px;padding-top:10px;border-top:1px dashed #F3F4F6;font-size:11.5px;color:#6B7280;display:flex;flex-wrap:wrap;gap:6px;align-items:center}
        .wf-cta-preview > div{font-weight:700;color:#374151}
        .wf-cta-preview span{padding:3px 8px;background:#111;color:#EEDDB8;border-radius:99px;font-size:10.5px;font-weight:700;font-family:ui-monospace,monospace}

        .wf-checks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
        .wf-checks li{display:flex;gap:10px;align-items:flex-start;padding:8px 12px;background:#fff;border:1px solid #E5E7EB;border-radius:8px}
        .wf-checks li.is-ok{border-color:#BBF7D0}
        .wf-checks li.is-warn{background:#FEF3C7;border-color:#F5D073}
        .wf-checks li span{flex-shrink:0;width:18px;height:18px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800}
        .wf-checks li.is-ok span{background:#16A34A;color:#fff}
        .wf-checks li.is-warn span{background:#F59E0B;color:#fff}
        .wf-checks li b{display:block;font-size:12.5px;color:#111;font-weight:700}
        .wf-checks li em{font-size:11px;color:#6B7280;font-style:normal}

        .wf-external{padding:0}
        .wf-external-tip{padding:12px 16px;background:#FEF3C7;color:#7C5A05;border-radius:10px;font-size:12.5px;margin-bottom:12px}
        .wf-iframe{width:100%;height:calc(100vh - 260px);min-height:640px;border:1px solid #E5E7EB;border-radius:14px;background:#fff;display:block}

        @media (max-width:1024px){
          .wf-grid{grid-template-columns:1fr}
          .wf-row2{grid-template-columns:1fr}
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════
// Block preview renderer
// ══════════════════════════════════════

function renderBlock(b: any, i: number): React.ReactNode {
  switch (b.type) {
    case "heading":
      return <h4 key={i} style={{ fontSize: 16, fontWeight: 700, color: "#111", margin: "8px 0 4px", fontFamily: "'Cormorant Garamond',ui-serif", fontStyle: "italic" }}>{b.text}</h4>;
    case "paragraph":
      return <p key={i} style={{ margin: 0, color: "#374151" }}>{b.text}</p>;
    case "quote":
      return <blockquote key={i} style={{ margin: "6px 0", padding: "8px 14px", borderLeft: "3px solid #B8A789", background: "#FBFAF7", fontStyle: "italic", color: "#111", fontSize: 13 }}>{b.text}</blockquote>;
    case "list":
      return (
        <ul key={i} style={{ margin: 0, paddingLeft: 18, color: "#374151" }}>
          {(b.items || []).map((it: string, k: number) => <li key={k}>{it}</li>)}
        </ul>
      );
    case "checklist":
      return (
        <div key={i} style={{ padding: "10px 14px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8 }}>
          {b.title && <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#B8A789", fontWeight: 700, marginBottom: 8 }}>{b.title}</div>}
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4, fontSize: 13, color: "#374151" }}>
            {(b.items || []).map((it: string, k: number) => <li key={k}><span style={{ color: "#B8A789", marginRight: 6 }}>✓</span>{it}</li>)}
          </ul>
        </div>
      );
    case "insight":
      return (
        <div key={i} style={{ padding: "12px 14px", background: "linear-gradient(135deg,#FBFAF7,#F4F4F5)", border: "1px solid #EEE9DC", borderRadius: 10 }}>
          {b.title && <div style={{ fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#B8A789", fontWeight: 700, marginBottom: 6 }}>{b.title}</div>}
          <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "#111", fontWeight: 500 }}>{b.text}</div>
        </div>
      );
    default:
      return null;
  }
}
