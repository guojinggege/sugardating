"use client";
// Admin Journal 文章编辑器 · new + edit 共用
// 左:笔记导入 (可选) + 标题/摘要/正文 · 右:发布状态/关键词/SEO/SERP 预览/CTA
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import type { CmsJournalPostFull, CmsJournalBlock, CmsStatus, JournalBlockType } from "@/lib/cms/types";
import type { ConversionOutput } from "@/lib/content-tools/conversion-types";
import NoteImportPanel from "@/components/admin/journal/NoteImportPanel";
import JournalSerpPreview from "@/components/admin/journal/JournalSerpPreview";
import JournalSeoChecklist from "@/components/admin/journal/JournalSeoChecklist";
import { analyzeSeo } from "@/lib/journal/seo";

interface Category { slug: string; title: string; titleZh: string }

interface Props {
  post?: CmsJournalPostFull;
  categories: Category[];
  isNew?: boolean;
  /** New-post 页面从 URL ?mode=import 传入 · 默认打开笔记导入面板 */
  showImportInitially?: boolean;
}

const BLOCK_TYPES: { key: JournalBlockType; label: string; icon: string }[] = [
  { key: "paragraph", label: "段落",    icon: "¶" },
  { key: "heading",   label: "标题",    icon: "H" },
  { key: "quote",     label: "引用",    icon: "❝" },
  { key: "list",      label: "列表",    icon: "•" },
  { key: "insight",   label: "Insight", icon: "💡" },
  { key: "checklist", label: "Checklist", icon: "✓" },
];

const CTA_OPTIONS = [
  "browse-sugargirls", "browse-asian", "browse-london",
  "premium", "credits", "safety", "apply-creator", "video-profiles",
];

export default function JournalEditor({ post, categories, isNew, showImportInitially }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState<"" | "draft" | "publish">("");
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [subtitle, setSubtitle] = useState(post?.subtitle ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [categorySlug, setCategorySlug] = useState(post?.categorySlug ?? categories[0]?.slug ?? "");
  const [language, setLanguage] = useState<"zh" | "en">(post?.language ?? "zh");
  const [author, setAuthor] = useState(post?.author ?? "Sugardating Editorial");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [readingTime, setReadingTime] = useState(post?.readingTime ?? "5 min read");
  const [tagsRaw, setTagsRaw] = useState((post?.tags ?? []).join(", "));
  const [featured, setFeatured] = useState(!!post?.featured);
  const [popular, setPopular] = useState(!!post?.popular);
  const [blocks, setBlocks] = useState<CmsJournalBlock[]>(post?.body ?? [{ type: "paragraph", text: "" }]);
  const [ctas, setCtas] = useState<string[]>(post?.cta ?? []);
  const [seoTitle, setSeoTitle] = useState(post?.seo?.title ?? "");
  const [seoDesc, setSeoDesc] = useState(post?.seo?.description ?? "");
  const [seoOg, setSeoOg] = useState(post?.seo?.ogImage ?? "");
  const [seoNoindex, setSeoNoindex] = useState(!!post?.seo?.noindex);
  const [primaryKeyword, setPrimaryKeyword] = useState(post?.seo?.primaryKeyword ?? "");
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>(post?.seo?.secondaryKeywords ?? []);
  const [longTailKeywords, setLongTailKeywords] = useState<string[]>(post?.seo?.longTailKeywords ?? []);
  const [secondaryDraft, setSecondaryDraft] = useState("");
  const [longTailDraft, setLongTailDraft] = useState("");

  // Import panel · new-post 页面从 URL 传入初始值
  const [showImport, setShowImport] = useState(!!(isNew && showImportInitially));

  const currentStatus = post?.status ?? "draft";

  const canPublish = useMemo(() => {
    return !!(title && slug && excerpt && categorySlug && blocks.some((b) => (b.text || b.items?.length)));
  }, [title, slug, excerpt, categorySlug, blocks]);

  function normalizeSlug(s: string) {
    return s.toLowerCase().trim()
      .replace(/[^a-z0-9\-]+/g, "-")
      .replace(/-+/g, "-").replace(/^-|-$/g, "")
      .slice(0, 80);
  }

  const addBlock = (type: JournalBlockType) => {
    const block: CmsJournalBlock = type === "list" || type === "checklist"
      ? { type, items: [""], title: type === "checklist" ? "" : undefined }
      : type === "insight"
      ? { type, title: "", text: "" }
      : { type, text: "" };
    setBlocks((p) => [...p, block]);
  };
  const updateBlock = (i: number, patch: Partial<CmsJournalBlock>) => {
    setBlocks((p) => p.map((b, idx) => idx === i ? { ...b, ...patch } : b));
  };
  const removeBlock = (i: number) => setBlocks((p) => p.filter((_, idx) => idx !== i));
  const moveBlock = (i: number, dir: 1 | -1) => {
    setBlocks((p) => {
      const next = [...p];
      const j = i + dir;
      if (j < 0 || j >= next.length) return next;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const toggleCta = (v: string) => setCtas((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  // ══════════════════════════════════════
  // 笔记导入 → 直接 hydrate 表单
  // ══════════════════════════════════════

  const handleImportApply = (o: ConversionOutput) => {
    setTitle((prev) => prev || o.title);
    setSlug((prev) => prev || o.slug);
    setExcerpt((prev) => prev || o.excerpt);
    setCategorySlug(o.categorySlug);
    setLanguage(o.language);
    setReadingTime(o.readingTime);
    setTagsRaw(o.tags.join(", "));
    // Body blocks · 完全替换
    setBlocks(o.body.length ? o.body : [{ type: "paragraph", text: "" }]);
    // CTA · 合并
    setCtas((prev) => Array.from(new Set([...prev, ...o.cta])).slice(0, 6));
    // 主关键词:tag 里第一个作为 fallback · 不覆盖已填内容
    setPrimaryKeyword((prev) => prev || (o.tags[0] ?? ""));
    setSecondaryKeywords((prev) => prev.length ? prev : o.tags.slice(1, 4));
    // SEO title/description 若为空 · 用生成内容预填
    setSeoTitle((prev) => prev || o.title);
    setSeoDesc((prev) => prev || o.excerpt);
    setError(null);
  };

  // 关键词编辑
  const addSecondary = (v?: string) => {
    const raw = (v ?? secondaryDraft).trim();
    if (!raw) return;
    setSecondaryKeywords((p) => Array.from(new Set([...p, raw])).slice(0, 8));
    setSecondaryDraft("");
  };
  const removeSecondary = (kw: string) => setSecondaryKeywords((p) => p.filter((x) => x !== kw));
  const addLongTail = (v?: string) => {
    const raw = (v ?? longTailDraft).trim();
    if (!raw) return;
    setLongTailKeywords((p) => Array.from(new Set([...p, raw])).slice(0, 6));
    setLongTailDraft("");
  };
  const removeLongTail = (kw: string) => setLongTailKeywords((p) => p.filter((x) => x !== kw));

  // 实时 SEO 分析
  const seoReport = useMemo(() => {
    const bodyText = blocks.map((b) => b.text ?? (b.items?.join(" ") ?? "")).join("\n");
    const headings = blocks.filter((b) => b.type === "heading").map((b) => b.text ?? "");
    return analyzeSeo({
      title,
      seoTitle: seoTitle || undefined,
      slug,
      excerpt,
      seoDescription: seoDesc || undefined,
      primaryKeyword: primaryKeyword || undefined,
      secondaryKeywords,
      bodyText,
      headings,
      categorySlug,
      coverImage: coverImage || undefined,
      ogImage: seoOg || undefined,
    });
  }, [title, seoTitle, slug, excerpt, seoDesc, primaryKeyword, secondaryKeywords, blocks, categorySlug, coverImage, seoOg]);

  async function save(action: "draft" | "publish") {
    if (action === "publish" && !canPublish) {
      setError("发布需要:标题、slug、摘要、分类、至少一段正文");
      return;
    }
    setSaving(action); setError(null);
    try {
      const payload: any = {
        title, slug: normalizeSlug(slug),
        subtitle: subtitle || undefined,
        excerpt, categorySlug, language, author,
        coverImage: coverImage || undefined,
        readingTime,
        tags: tagsRaw.split(",").map((s) => s.trim()).filter(Boolean),
        featured, popular,
        body: blocks.filter((b) => (b.text?.trim() || b.items?.some((i) => i.trim())) || b.title?.trim()),
        cta: ctas,
        seo: {
          title: seoTitle || undefined,
          description: seoDesc || undefined,
          ogImage: seoOg || undefined,
          noindex: seoNoindex,
          primaryKeyword: primaryKeyword || undefined,
          secondaryKeywords: secondaryKeywords.length ? secondaryKeywords : undefined,
          longTailKeywords: longTailKeywords.length ? longTailKeywords : undefined,
        },
        status: (action === "publish" ? "published" : "draft") as CmsStatus,
      };
      const endpoint = isNew ? "/api/admin/journal/posts" : `/api/admin/journal/posts/${post!.slug}`;
      const method = isNew ? "POST" : "PATCH";
      const r = await fetch(endpoint, {
        method,
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data?.ok) throw new Error(data?.message || "保存失败");
      setSavedAt(new Date().toLocaleTimeString("zh-CN", { hour12: false }));
      if (isNew) {
        router.push(`/admin/journal/posts/${data.post.slug}`);
      } else {
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    } finally { setSaving(""); }
  }

  async function del() {
    if (!post) return;
    if (!confirm("确认归档/删除该文章?")) return;
    setSaving("draft"); setError(null);
    try {
      const r = await fetch(`/api/admin/journal/posts/${post.slug}`, { method: "DELETE", credentials: "include" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data?.ok) throw new Error(data?.message || "删除失败");
      router.push("/admin/journal/posts");
    } catch (e) {
      setError(e instanceof Error ? e.message : "删除失败");
    } finally { setSaving(""); }
  }

  return (
    <div className="je">
      {/* Top actions */}
      <div className="je-top">
        <div className="je-top-left">
          <a href="/admin/journal/posts" className="je-back">← 返回列表</a>
          <div className="je-status">
            <span className={"je-badge je-badge--" + currentStatus}>{
              currentStatus === "published" ? "已发布"
              : currentStatus === "archived" ? "已归档"
              : "草稿"
            }</span>
            {savedAt && <span className="je-saved">已保存 · {savedAt}</span>}
          </div>
        </div>
        <div className="je-top-right">
          {post && (
            <a href={`/admin/journal/posts/${post.slug}/preview`} target="_blank" rel="noreferrer" className="je-btn je-btn--ghost">预览</a>
          )}
          {post && post.status === "published" && (
            <a href={`/community/${post.categorySlug}/post/${post.slug}`} target="_blank" rel="noreferrer" className="je-btn je-btn--ghost">前台</a>
          )}
          <button type="button" disabled={!!saving} onClick={() => save("draft")} className="je-btn je-btn--ghost">
            {saving === "draft" ? "保存中…" : "保存草稿"}
          </button>
          <button type="button" disabled={!!saving || !canPublish} onClick={() => save("publish")} className="je-btn je-btn--gold">
            {saving === "publish" ? "发布中…" : (currentStatus === "published" ? "更新" : "发布")}
          </button>
        </div>
      </div>

      {error && <div className="je-err">{error}</div>}

      {isNew && !showImport && (
        <div className="je-mode-switch">
          <span>创作模式:<b>手动撰写</b></span>
          <button type="button" onClick={() => setShowImport(true)}>切换到「从笔记导入」</button>
        </div>
      )}

      {isNew && showImport && (
        <NoteImportPanel
          categories={categories}
          currentCategorySlug={categorySlug}
          onApply={handleImportApply}
          onDismiss={() => setShowImport(false)}
        />
      )}

      <div className="je-grid">
        {/* Left: title + subtitle + excerpt + block editor */}
        <div className="je-main">
          <input
            className="je-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="文章标题 · Article Title"
            maxLength={200}
          />
          <input
            className="je-subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="副标题 · Optional subtitle"
            maxLength={200}
          />
          <textarea
            className="je-excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="摘要 · 300-400 字符 · 用于列表和 SEO"
            rows={3}
            maxLength={400}
          />

          <div className="je-body-h">正文 · Body Blocks</div>
          <div className="je-blocks">
            {blocks.map((b, i) => (
              <div key={i} className="je-block">
                <div className="je-block-h">
                  <span className="je-block-type">{BLOCK_TYPES.find((t) => t.key === b.type)?.icon} {BLOCK_TYPES.find((t) => t.key === b.type)?.label}</span>
                  <div className="je-block-ops">
                    <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0}>↑</button>
                    <button type="button" onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1}>↓</button>
                    <button type="button" onClick={() => removeBlock(i)} className="je-block-del">×</button>
                  </div>
                </div>
                {(b.type === "insight" || b.type === "checklist") && (
                  <input
                    className="je-block-input"
                    value={b.title || ""}
                    onChange={(e) => updateBlock(i, { title: e.target.value })}
                    placeholder={b.type === "insight" ? "Insight 标题" : "Checklist 标题"}
                  />
                )}
                {(b.type === "list" || b.type === "checklist") ? (
                  <div className="je-list-items">
                    {(b.items || []).map((item, k) => (
                      <div key={k} className="je-list-row">
                        <span>{b.type === "checklist" ? "✓" : "•"}</span>
                        <input value={item} onChange={(e) => {
                          const next = [...(b.items || [])];
                          next[k] = e.target.value;
                          updateBlock(i, { items: next });
                        }} placeholder="列表项内容" />
                        <button type="button" onClick={() => updateBlock(i, { items: (b.items || []).filter((_, x) => x !== k) })}>×</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => updateBlock(i, { items: [...(b.items || []), ""] })} className="je-list-add">+ 添加项</button>
                  </div>
                ) : (
                  <textarea
                    className="je-block-input je-block-text"
                    value={b.text || ""}
                    onChange={(e) => updateBlock(i, { text: e.target.value })}
                    placeholder={b.type === "heading" ? "标题文本" : b.type === "quote" ? "引用文本" : "内容"}
                    rows={b.type === "heading" ? 1 : 3}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="je-add-row">
            {BLOCK_TYPES.map((t) => (
              <button key={t.key} type="button" onClick={() => addBlock(t.key)} className="je-add-btn">
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: settings panels */}
        <div className="je-side">
          {/* Publish panel */}
          <div className="je-panel">
            <h4>发布设置</h4>
            <div className="je-row">
              <label>Slug *</label>
              <input value={slug} onChange={(e) => setSlug(normalizeSlug(e.target.value))} onBlur={() => setSlug(normalizeSlug(slug))} placeholder="my-article-slug" />
            </div>
            <div className="je-row">
              <label>分类 *</label>
              <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
              </select>
            </div>
            <div className="je-row">
              <label>语言</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value as "zh" | "en")}>
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="je-row">
              <label>作者</label>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="je-row">
              <label>阅读时间</label>
              <input value={readingTime} onChange={(e) => setReadingTime(e.target.value)} placeholder="5 min read / 5 分钟阅读" />
            </div>
            <label className="je-toggle">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              Featured (首页 & Journal 精选)
            </label>
            <label className="je-toggle">
              <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} />
              Popular (Sidebar & 排序加分)
            </label>
            {post && (
              <button type="button" onClick={del} className="je-btn je-btn--danger" style={{ marginTop: 12, width: "100%" }}>
                {post.isNewPost ? "删除文章" : "归档文章"}
              </button>
            )}
          </div>

          {/* Media panel */}
          <div className="je-panel">
            <h4>媒体</h4>
            <div className="je-row">
              <label>封面图 URL</label>
              <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="/images/xxx.jpg" />
            </div>
            {coverImage && (
              <div className="je-cover-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="cover preview" />
              </div>
            )}
          </div>

          {/* Tags panel */}
          <div className="je-panel">
            <h4>Tags</h4>
            <input value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} placeholder="asian, london, privacy (逗号分隔)" />
          </div>

          {/* CTA panel */}
          <div className="je-panel">
            <h4>底部 CTA</h4>
            <div className="je-chips">
              {CTA_OPTIONS.map((v) => (
                <button key={v} type="button" onClick={() => toggleCta(v)}
                  className={"je-chip" + (ctas.includes(v) ? " is-active" : "")}>{v}</button>
              ))}
            </div>
          </div>

          {/* Keywords panel */}
          <div className="je-panel">
            <h4>关键词</h4>
            <div className="je-row">
              <label>主关键词 (必填 · 用于 Google SEO 定位)</label>
              <input value={primaryKeyword} onChange={(e) => setPrimaryKeyword(e.target.value)} placeholder="例:london sugar dating" />
              <span className="je-hint">建议 1 个 · 2-5 词 · 出现在标题/描述/正文</span>
            </div>
            <div className="je-row">
              <label>次要关键词 (最多 8 个)</label>
              <div className="je-kw-input">
                <input
                  value={secondaryDraft}
                  onChange={(e) => setSecondaryDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSecondary(); } }}
                  placeholder="回车添加 · 例:mayfair dating"
                />
                <button type="button" onClick={() => addSecondary()} disabled={!secondaryDraft.trim()}>+</button>
              </div>
              {secondaryKeywords.length > 0 && (
                <div className="je-kw-chips">
                  {secondaryKeywords.map((kw) => (
                    <span key={kw} className="je-kw-chip">
                      {kw}<button type="button" onClick={() => removeSecondary(kw)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="je-row">
              <label>长尾关键词 (最多 6 个)</label>
              <div className="je-kw-input">
                <input
                  value={longTailDraft}
                  onChange={(e) => setLongTailDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLongTail(); } }}
                  placeholder="回车添加 · 例:how to find verified sugargirls in london"
                />
                <button type="button" onClick={() => addLongTail()} disabled={!longTailDraft.trim()}>+</button>
              </div>
              {longTailKeywords.length > 0 && (
                <div className="je-kw-chips">
                  {longTailKeywords.map((kw) => (
                    <span key={kw} className="je-kw-chip">
                      {kw}<button type="button" onClick={() => removeLongTail(kw)}>×</button>
                    </span>
                  ))}
                </div>
              )}
              <span className="je-hint">用于抓取具体意图 · 每条 5+ 词 · 命中长尾流量</span>
            </div>
          </div>

          {/* SEO panel */}
          <div className="je-panel">
            <h4>Google SEO Metadata</h4>
            <div className="je-row">
              <label>SEO Title <em>{(seoTitle || title).length}/60</em></label>
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="留空使用文章标题" maxLength={80} />
            </div>
            <div className="je-row">
              <label>Meta Description <em>{(seoDesc || excerpt).length}/158</em></label>
              <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} placeholder="留空使用摘要 · 建议 120-158 字符" rows={3} maxLength={200} />
            </div>
            <div className="je-row">
              <label>OG / 分享图</label>
              <input value={seoOg} onChange={(e) => setSeoOg(e.target.value)} placeholder="留空使用封面图" />
            </div>
            <label className="je-toggle">
              <input type="checkbox" checked={seoNoindex} onChange={(e) => setSeoNoindex(e.target.checked)} />
              noindex · 禁止 Google 收录
            </label>
          </div>

          {/* SERP preview */}
          <div className="je-panel">
            <h4>Google SERP 预览</h4>
            <JournalSerpPreview
              title={seoReport.effectiveTitle}
              description={seoReport.effectiveDescription}
              slug={slug}
              categorySlug={categorySlug}
            />
          </div>

          {/* SEO checklist */}
          <div className="je-panel">
            <h4>SEO 检查清单</h4>
            <JournalSeoChecklist report={seoReport} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .je{display:flex;flex-direction:column;gap:16px}
        .je-top{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 18px;background:#fff;border:1px solid #E5E7EB;border-radius:12px;position:sticky;top:70px;z-index:10}
        .je-top-left{display:flex;align-items:center;gap:14px}
        .je-back{font-size:13px;color:#6B7280;text-decoration:none}
        .je-back:hover{color:#111}
        .je-status{display:flex;align-items:center;gap:10px}
        .je-badge{padding:3px 10px;border-radius:99px;font-size:11.5px;font-weight:700}
        .je-badge--draft{background:#F3F4F6;color:#374151}
        .je-badge--published{background:#DCFCE7;color:#166534}
        .je-badge--archived{background:#FEE2E2;color:#B91C1C}
        .je-saved{font-size:11.5px;color:#B8A789;font-weight:600}
        .je-top-right{display:flex;gap:8px}
        .je-btn{padding:8px 16px;border-radius:8px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;border:0;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;transition:opacity .12s}
        .je-btn:disabled{opacity:.5;cursor:not-allowed}
        .je-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}
        .je-btn--ghost{background:#F7F5F0;color:#111;border:1px solid #E5E7EB}
        .je-btn--ghost:hover{border-color:#D6B980}
        .je-btn--danger{background:#fff;color:#B91C1C;border:1px solid #FEE2E2}
        .je-btn--danger:hover{background:#FEE2E2}
        .je-err{padding:10px 14px;background:#FEE2E2;color:#B91C1C;border-radius:10px;font-size:13px}
        .je-grid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px;align-items:flex-start}
        .je-main{display:flex;flex-direction:column;gap:12px}
        .je-title,.je-subtitle,.je-excerpt{width:100%;background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:12px 14px;font:inherit;color:#111;outline:none;transition:border-color .12s}
        .je-title{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:26px;font-weight:600;letter-spacing:-0.005em}
        .je-subtitle{font-size:15px;color:#5a5a62;font-style:italic}
        .je-excerpt{font-size:14px;line-height:1.6;resize:vertical}
        .je-title:focus,.je-subtitle:focus,.je-excerpt:focus,.je-block-input:focus{border-color:#D6B980}
        .je-body-h{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6B7280;font-weight:700;margin-top:8px}
        .je-blocks{display:flex;flex-direction:column;gap:10px}
        .je-block{background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:8px}
        .je-block-h{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#6B7280;letter-spacing:.06em;font-weight:600;text-transform:uppercase}
        .je-block-type{display:inline-flex;align-items:center;gap:5px}
        .je-block-ops{display:inline-flex;gap:4px}
        .je-block-ops button{background:#F3F4F6;color:#374151;border:0;width:24px;height:24px;border-radius:6px;font-size:12px;cursor:pointer}
        .je-block-ops button:disabled{opacity:.3;cursor:not-allowed}
        .je-block-del{color:#B91C1C !important}
        .je-block-input,.je-block-text{width:100%;padding:8px 12px;border:1px solid #E5E7EB;border-radius:8px;font:inherit;font-size:14px;color:#111;background:#FAFAF8;outline:none;resize:vertical}
        .je-list-items{display:flex;flex-direction:column;gap:4px}
        .je-list-row{display:flex;align-items:center;gap:6px;font-size:13px}
        .je-list-row span{color:#B8A789;font-weight:700;width:16px}
        .je-list-row input{flex:1;padding:6px 10px;border:1px solid #E5E7EB;border-radius:6px;font:inherit;font-size:13.5px;background:#FAFAF8;outline:none}
        .je-list-row button{background:none;border:0;color:#9CA3AF;cursor:pointer;font-size:14px}
        .je-list-add{background:none;border:1px dashed #E5E7EB;color:#6B7280;padding:6px;border-radius:6px;font-size:12px;cursor:pointer;margin-top:4px}
        .je-add-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
        .je-add-btn{padding:6px 12px;background:#fff;border:1px dashed #D6B980;color:#B8A789;font:inherit;font-size:12px;font-weight:600;border-radius:99px;cursor:pointer;display:inline-flex;gap:5px;align-items:center}
        .je-add-btn:hover{background:#FBFAF7}
        .je-add-btn span{font-size:14px}
        .je-side{display:flex;flex-direction:column;gap:12px;position:sticky;top:130px}
        .je-panel{background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:16px}
        .je-panel h4{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6B7280;font-weight:700;margin:0 0 12px}
        .je-row{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
        .je-row label{font-size:11.5px;color:#374151;font-weight:600}
        .je-row input,.je-row select,.je-row textarea{padding:8px 10px;border:1px solid #E5E7EB;border-radius:8px;font:inherit;font-size:13px;color:#111;background:#FAFAF8;outline:none}
        .je-row input:focus,.je-row select:focus,.je-row textarea:focus{border-color:#D6B980;background:#fff}
        .je-toggle{display:flex;gap:8px;align-items:center;font-size:12.5px;color:#374151;cursor:pointer;padding:4px 0}
        .je-toggle input{width:14px;height:14px;accent-color:#111}
        .je-cover-preview{margin-top:8px;aspect-ratio:16/10;background:#F3F4F6;border-radius:8px;overflow:hidden}
        .je-cover-preview img{width:100%;height:100%;object-fit:cover}
        .je-chips{display:flex;flex-wrap:wrap;gap:4px}
        .je-chip{padding:5px 10px;background:#F3F4F6;color:#374151;border:0;border-radius:99px;font:inherit;font-size:11px;font-weight:600;cursor:pointer;font-family:ui-monospace,monospace}
        .je-chip.is-active{background:#111;color:#EEDDB8}
        .je-mode-switch{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:#FBFAF7;border:1px dashed #EEE9DC;border-radius:10px;font-size:12.5px;color:#374151}
        .je-mode-switch b{color:#111;font-weight:700}
        .je-mode-switch button{background:#111;color:#EEDDB8;border:0;padding:6px 14px;font:inherit;font-size:11.5px;font-weight:700;border-radius:99px;cursor:pointer}
        .je-mode-switch button:hover{background:#1a1a1c}
        .je-hint{font-size:11px;color:#9CA3AF;margin-top:2px}
        .je-row label em{font-style:normal;font-size:10.5px;color:#9CA3AF;font-weight:500;margin-left:6px;font-variant-numeric:tabular-nums}
        .je-kw-input{display:flex;gap:6px;align-items:stretch}
        .je-kw-input input{flex:1}
        .je-kw-input button{background:#111;color:#EEDDB8;border:0;width:32px;font-size:15px;font-weight:700;border-radius:8px;cursor:pointer}
        .je-kw-input button:disabled{opacity:.3;cursor:not-allowed}
        .je-kw-chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
        .je-kw-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 4px 3px 10px;background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409;font-size:11px;font-weight:600;border-radius:99px}
        .je-kw-chip button{background:rgba(26,20,9,.15);color:#1a1409;border:0;width:16px;height:16px;font-size:11px;font-weight:700;border-radius:50%;cursor:pointer;line-height:1;display:inline-flex;align-items:center;justify-content:center;padding:0}
        .je-kw-chip button:hover{background:rgba(26,20,9,.3)}
        @media (max-width:1024px){.je-grid{grid-template-columns:1fr}.je-side{position:static}}
      `}</style>
    </div>
  );
}
