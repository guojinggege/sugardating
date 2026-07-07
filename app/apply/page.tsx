"use client";
// 创作者入驻 — 单页多字段表单 (未来可拆步骤 wizard)
// 未登录 → 引导登录 · 登录后填写 → 提交 → 生成 CreatorProfileDraft + role 升级 creator
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";

const BODY_TYPES  = ["纤细", "标准", "运动型", "曲线"];
const SKIN_TONES  = ["白皙", "自然", "小麦色", "浅古铜"];
const HAIR_COLORS = ["黑色", "棕色", "深棕", "栗色", "亚麻色", "金色"];
const EYE_COLORS  = ["黑色", "深棕色", "棕色", "琥珀色", "灰色"];
const ZODIACS     = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const BLOOD_TYPES = ["A","B","AB","O"];
const EDUCATIONS  = ["Bachelor","Master","PhD","College"];
const SMOKING     = ["不吸烟","偶尔","社交场合"];
const DRINKING    = ["不饮酒","偶尔","社交场合","享受红酒"];
const DIETS       = ["无禁忌","弹性素食","地中海","低碳饮食","轻食主义"];

interface ServiceState { enabled: boolean; price: string; duration: string }
const emptyService = (): ServiceState => ({ enabled: false, price: "", duration: "" });

export default function Page() {
  const { user, hydrated, openLoginModal } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    displayName: "",
    username:    "",
    slogan:      "",
    bio:         "",
    city:        "",
    country:     "",
    age:         "" as string,
    height:      "" as string,
    weight:      "" as string,
    bodyType:    "",
    skinTone:    "",
    hairColor:   "",
    eyeColor:    "",
    occupation:  "",
    education:   "",
    zodiac:      "",
    bloodType:   "",
    languages:   "",   // comma-separated
    interests:   "",
    avatar:      "",
    coverImage:  "",
    coverVideo:  "",
    smoking:     "",
    drinking:    "",
    diet:        "",
    fitness:     "",
    travel:      "",
    datingPref:  "",
    replyTime:   "",
    timezone:    "GMT+8",
  });
  const [services, setServices] = useState<Record<string, ServiceState>>({
    chat:         emptyService(),
    videoChat:    emptyService(),
    privatePhoto: emptyService(),
    dating:       emptyService(),
    travel:       emptyService(),
    shooting:     emptyService(),
  });
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ slug: string; url: string } | null>(null);

  useEffect(() => {
    if (hydrated && !user) openLoginModal();
  }, [hydrated, user, openLoginModal]);

  // Load existing draft if any
  useEffect(() => {
    if (!user) return;
    fetch("/api/creator/apply", { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.application) {
          const a = data.application;
          setForm((f) => ({
            ...f,
            displayName: a.displayName || "",
            username:    a.username || "",
            slogan:      a.slogan || "",
            bio:         a.bio || "",
            city:        a.city || "",
            country:     a.country || "",
            age:         a.age ? String(a.age) : "",
            height:      a.height ? String(a.height) : "",
            weight:      a.weight ? String(a.weight) : "",
            bodyType:    a.bodyType || "",
            skinTone:    a.skinTone || "",
            hairColor:   a.hairColor || "",
            eyeColor:    a.eyeColor || "",
            occupation:  a.occupation || "",
            education:   a.education || "",
            zodiac:      a.zodiac || "",
            bloodType:   a.bloodType || "",
            languages:   (a.languages || []).join(", "),
            interests:   (a.interests || []).join(", "),
            avatar:      a.avatar || "",
            coverImage:  a.coverImage || "",
            coverVideo:  a.coverVideo || "",
            smoking:     a.lifestyle?.smoking || "",
            drinking:    a.lifestyle?.drinking || "",
            diet:        a.lifestyle?.diet || "",
            fitness:     a.lifestyle?.fitness || "",
            travel:      a.lifestyle?.travel || "",
            datingPref:  a.lifestyle?.datingPref || "",
            replyTime:   a.availability?.replyTime || "",
            timezone:    a.availability?.timezone || "GMT+8",
          }));
          if (a.services) setServices((s) => ({ ...s, ...normalizeServices(a.services) }));
        }
      })
      .catch(() => {});
  }, [user]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const setSvc = (k: string, patch: Partial<ServiceState>) =>
    setServices((s) => ({ ...s, [k]: { ...s[k], ...patch } }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!agree) return setErr("请先同意平台规则");

    setLoading(true);
    const payload = {
      displayName: form.displayName,
      username:    form.username,
      slogan:      form.slogan || undefined,
      bio:         form.bio || undefined,
      city:        form.city || undefined,
      country:     form.country || undefined,
      age:         form.age ? Number(form.age) : undefined,
      height:      form.height ? Number(form.height) : undefined,
      weight:      form.weight ? Number(form.weight) : undefined,
      bodyType:    form.bodyType || undefined,
      skinTone:    form.skinTone || undefined,
      hairColor:   form.hairColor || undefined,
      eyeColor:    form.eyeColor || undefined,
      occupation:  form.occupation || undefined,
      education:   form.education || undefined,
      zodiac:      form.zodiac || undefined,
      bloodType:   form.bloodType || undefined,
      languages:   splitTags(form.languages),
      interests:   splitTags(form.interests),
      avatar:      form.avatar || undefined,
      coverImage:  form.coverImage || undefined,
      coverVideo:  form.coverVideo || undefined,
      lifestyle: {
        smoking: form.smoking, drinking: form.drinking, diet: form.diet,
        fitness: form.fitness, travel: form.travel, datingPref: form.datingPref,
      },
      services,
      availability: { replyTime: form.replyTime, timezone: form.timezone },
    };

    try {
      const res = await fetch("/api/creator/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErr(data?.message || "提交失败");
        return;
      }
      setSuccess({ slug: data.application.slug, url: data.profilePreview.url });
      router.refresh();
    } catch {
      setErr("网络错误,请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) return null;

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div className="authwrap" style={{ textAlign: "center" }}>
          <h1>创作者入驻</h1>
          <p className="s">请先登录或注册,再申请成为创作者。</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
            <Link className="btn btn-ink" href="/login?next=/apply">登录</Link>
            <Link className="btn" href="/register?next=/apply">注册</Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div className="authwrap" style={{ textAlign: "center", maxWidth: 520 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
          <h1>申请已提交</h1>
          <p className="s">你的创作者资料已进入 <b>pending 待审核</b>。审核通过后主页正式对外可见。</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
            <Link className="btn btn-ink" href={success.url}>预览我的主页</Link>
            <Link className="btn" href="/apply" onClick={() => setSuccess(null)}>继续编辑</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <header style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "var(--accent)", textTransform: "uppercase" }}>Sugardating Creator Apply</div>
        <h1 style={{ margin: "6px 0 0", fontSize: 30, fontWeight: 800, letterSpacing: "-.02em" }}>创作者入驻</h1>
        <p className="s" style={{ marginTop: 8 }}>填写下面信息生成你的公开创作者主页。审核通过后正式对外展示。</p>
      </header>

      <form onSubmit={onSubmit} className="ap-form">
        <Section title="1. 账号与身份">
          <Row>
            <Field label="主页昵称 *"><input required maxLength={60} value={form.displayName} onChange={(e) => set("displayName", e.target.value)} placeholder="Aria" /></Field>
            <Field label="Username / URL *" hint="仅字母/数字/短横线,3-32 位。将作为主页地址 /creators/{username}">
              <input required maxLength={32} value={form.username} onChange={(e) => set("username", e.target.value)} placeholder="aria" />
            </Field>
          </Row>
          <Row>
            <Field label="国家"><input maxLength={60} value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="新加坡" /></Field>
            <Field label="常驻城市"><input maxLength={60} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="新加坡" /></Field>
          </Row>
          <Row>
            <Field label="语言 (逗号分隔)"><input value={form.languages} onChange={(e) => set("languages", e.target.value)} placeholder="中文, English, 日本語" /></Field>
            <Field label="职业"><input maxLength={60} value={form.occupation} onChange={(e) => set("occupation", e.target.value)} placeholder="Travel Creator" /></Field>
          </Row>
        </Section>

        <Section title="2. 主页公开信息">
          <Field label="Slogan (一句话签名)"><input maxLength={140} value={form.slogan} onChange={(e) => set("slogan", e.target.value)} placeholder="Life is short — dine well." /></Field>
          <Field label="Bio (个人简介)">
            <textarea rows={4} maxLength={800} value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="介绍你的生活方式、性格、兴趣..." />
          </Field>
          <Field label="兴趣标签 (逗号分隔)"><input value={form.interests} onChange={(e) => set("interests", e.target.value)} placeholder="旅行, 摄影, 咖啡, Luxury" /></Field>
        </Section>

        <Section title="3. 外貌与基础资料">
          <Row>
            <Field label="年龄 (18+)"><input type="number" min={18} max={99} value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="26" /></Field>
            <Field label="身高 (cm)"><input type="number" min={120} max={220} value={form.height} onChange={(e) => set("height", e.target.value)} placeholder="168" /></Field>
            <Field label="体重 (kg)"><input type="number" min={30} max={200} value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="52" /></Field>
          </Row>
          <Row>
            <Field label="体型"><Select value={form.bodyType} onChange={(v) => set("bodyType", v)} options={BODY_TYPES} /></Field>
            <Field label="肤色"><Select value={form.skinTone} onChange={(v) => set("skinTone", v)} options={SKIN_TONES} /></Field>
            <Field label="发色"><Select value={form.hairColor} onChange={(v) => set("hairColor", v)} options={HAIR_COLORS} /></Field>
            <Field label="眼睛"><Select value={form.eyeColor} onChange={(v) => set("eyeColor", v)} options={EYE_COLORS} /></Field>
          </Row>
          <Row>
            <Field label="星座"><Select value={form.zodiac} onChange={(v) => set("zodiac", v)} options={ZODIACS} /></Field>
            <Field label="血型"><Select value={form.bloodType} onChange={(v) => set("bloodType", v)} options={BLOOD_TYPES} /></Field>
            <Field label="学历"><Select value={form.education} onChange={(v) => set("education", v)} options={EDUCATIONS} /></Field>
          </Row>
        </Section>

        <Section title="4. 生活方式">
          <Row>
            <Field label="吸烟"><Select value={form.smoking} onChange={(v) => set("smoking", v)} options={SMOKING} /></Field>
            <Field label="饮酒"><Select value={form.drinking} onChange={(v) => set("drinking", v)} options={DRINKING} /></Field>
            <Field label="饮食"><Select value={form.diet} onChange={(v) => set("diet", v)} options={DIETS} /></Field>
          </Row>
          <Row>
            <Field label="运动习惯"><input value={form.fitness} onChange={(e) => set("fitness", e.target.value)} placeholder="每周 3-5 次" /></Field>
            <Field label="旅行频率"><input value={form.travel} onChange={(e) => set("travel", e.target.value)} placeholder="经常旅行" /></Field>
            <Field label="约会偏好"><input value={form.datingPref} onChange={(e) => set("datingPref", e.target.value)} placeholder="咖啡 / 晚餐" /></Field>
          </Row>
          <Row>
            <Field label="平均回复"><input value={form.replyTime} onChange={(e) => set("replyTime", e.target.value)} placeholder="7 分钟" /></Field>
            <Field label="时区"><input value={form.timezone} onChange={(e) => set("timezone", e.target.value)} placeholder="GMT+8" /></Field>
          </Row>
        </Section>

        <Section title="5. 服务入口">
          <p className="s" style={{ marginTop: -8, marginBottom: 12 }}>启用你愿意提供的服务并填价格。所有交互均遵守平台规则、双方自愿、18+。</p>
          {[
            { k: "chat",         label: "💬 聊天",        placeholderP: "S$ 8",    placeholderD: "即时"    },
            { k: "videoChat",    label: "📹 视频聊天",    placeholderP: "S$ 48",   placeholderD: "30 分钟" },
            { k: "privatePhoto", label: "📸 私拍内容",    placeholderP: "S$ 680",  placeholderD: "3 小时"  },
            { k: "dating",       label: "☕ 约会",        placeholderP: "S$ 280",  placeholderD: "2 小时"  },
            { k: "travel",       label: "✈️ 旅游",       placeholderP: "S$ 1,200", placeholderD: "1 天"    },
            { k: "shooting",     label: "🎬 拍摄",        placeholderP: "S$ 680",  placeholderD: "3 小时"  },
          ].map((s) => (
            <div key={s.k} className="ap-svc-row">
              <label className="ap-svc-toggle">
                <input type="checkbox" checked={services[s.k].enabled} onChange={(e) => setSvc(s.k, { enabled: e.target.checked })} />
                <span>{s.label}</span>
              </label>
              <input placeholder={s.placeholderP} disabled={!services[s.k].enabled} value={services[s.k].price} onChange={(e) => setSvc(s.k, { price: e.target.value })} />
              <input placeholder={s.placeholderD} disabled={!services[s.k].enabled} value={services[s.k].duration} onChange={(e) => setSvc(s.k, { duration: e.target.value })} />
            </div>
          ))}
        </Section>

        <Section title="6. 媒体资料">
          <p className="s" style={{ marginTop: -8, marginBottom: 12 }}>当前阶段填写公开图片 / 视频 URL 即可。未来将支持直接上传。</p>
          <Field label="头像 URL"><input value={form.avatar} onChange={(e) => set("avatar", e.target.value)} placeholder="https://.../avatar.jpg" /></Field>
          <Field label="Cover 图 URL"><input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="https://.../cover.jpg" /></Field>
          <Field label="Cover 视频 URL (可选)"><input value={form.coverVideo} onChange={(e) => set("coverVideo", e.target.value)} placeholder="https://.../cover.mp4" /></Field>
        </Section>

        <Section title="7. 提交确认">
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--ink2)", lineHeight: 1.6 }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: 3 }} />
            <span>
              我确认以上信息真实。我已阅读并同意 <Link href="/community/guidelines" style={{ color: "var(--ink)", fontWeight: 600 }}>平台规则</Link>,承诺遵守当地法律 · 不发布未成年内容 · 不进行诈骗/胁迫/骚扰或非自愿行为 · 所有互动 18+ 双方自愿。
            </span>
          </label>
        </Section>

        {err && <div style={{ color: "var(--live)", fontWeight: 600, marginBottom: 10 }}>{err}</div>}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button type="submit" className="btn btn-ink" disabled={loading}>
            {loading ? "提交中…" : "提交申请"}
          </button>
          <span className="s">提交后状态为 pending 待审核。</span>
        </div>
      </form>

      <style jsx>{`
        .ap-form { display: flex; flex-direction: column; gap: 24px; max-width: 880px; }
        .ap-svc-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr); gap: 10px; align-items: center; margin-bottom: 10px; }
        .ap-svc-toggle { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--ink); user-select: none; }
        @media (max-width: 640px) { .ap-svc-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 20, margin: 0 }}>
      <legend style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".14em", color: "var(--muted)", textTransform: "uppercase", padding: "0 8px" }}>{title}</legend>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </fieldset>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>{children}</div>;
}
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink2)", marginBottom: 4 }}>{label}</label>
      {children}
      {hint && <div className="s" style={{ marginTop: 4, fontSize: 11 }}>{hint}</div>}
    </div>
  );
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">选择…</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function splitTags(s: string): string[] {
  return s.split(/[,，]/g).map((x) => x.trim()).filter(Boolean).slice(0, 20);
}
function normalizeServices(s: Record<string, unknown>): Record<string, ServiceState> {
  const out: Record<string, ServiceState> = {};
  for (const [k, v] of Object.entries(s)) {
    const obj = (v ?? {}) as { enabled?: boolean; price?: string; duration?: string };
    out[k] = { enabled: !!obj.enabled, price: obj.price ?? "", duration: obj.duration ?? "" };
  }
  return out;
}
