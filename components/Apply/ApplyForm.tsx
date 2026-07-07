"use client";
// Creator Recruitment Form — 4 sections + 3 confirms
// 18+ 前后端双 gate · 未登录展示 CTA card · 登录后完整表单
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";

const INTEREST_OPTIONS = ["旅行","摄影","咖啡","美食","音乐","电影","健身","艺术","夜生活","时尚","Luxury","阅读","徒步","品酒","收藏","设计"];
const LANGUAGE_OPTIONS = ["中文","English","日本語","한국어","ภาษาไทย","Français","Deutsch"];
const BODY_TYPES = ["纤细","标准","运动型","曲线"];
const SKIN_TONES = ["白皙","自然","小麦色","浅古铜"];
const HAIR_COLORS = ["黑色","棕色","深棕","栗色","亚麻色","金色"];
const EYE_COLORS  = ["黑色","深棕色","棕色","琥珀色","灰色"];
const SERVICES = [
  { k: "chat",         label: "聊天" },
  { k: "videoChat",    label: "视频聊天" },
  { k: "privatePhoto", label: "私拍" },
  { k: "dating",       label: "预约约会" },
  { k: "travel",       label: "旅行陪伴" },
  { k: "shooting",     label: "写真拍摄" },
  { k: "tips",         label: "接受打赏" },
];

function computeAge(iso: string): number | null {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export default function ApplyForm() {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  // basic
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  // profile
  const [slogan, setSlogan] = useState("");
  const [bio, setBio] = useState("");
  const [occupation, setOccupation] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState("");
  // physical
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  // services
  const [services, setServices] = useState<Record<string, boolean>>({});
  const [wantsFreeShoot, setWantsFreeShoot] = useState<"yes" | "no" | "learn" | "">("");
  // confirms
  const [confirmAdult, setConfirmAdult] = useState(false);
  const [confirmTruth, setConfirmTruth] = useState(false);
  const [acceptRules, setAcceptRules] = useState(false);
  // state
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ slug: string; url: string } | null>(null);

  // Sync email from user
  useEffect(() => { if (user?.email && !email) setEmail(user.email); }, [user, email]);

  const age = useMemo(() => (birthDate ? computeAge(birthDate) : null), [birthDate]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!displayName.trim()) return setErr("请填写主页昵称");
    if (!username.trim())    return setErr("请填写 username(将成为主页 URL)");
    if (!email.trim())       return setErr("请填写邮箱");
    if (!birthDate)          return setErr("请填写出生日期");
    if (age !== null && age < 18) return setErr("平台仅面向 18 岁以上成年人");
    if (!country.trim())     return setErr("请填写国家");
    if (!city.trim())        return setErr("请填写城市");
    if (languages.length === 0) return setErr("请至少选择 1 种语言");
    if (interests.length < 3)   return setErr("请至少选择 3 个兴趣");
    if (!confirmAdult) return setErr("请勾选:我已满 18 岁");
    if (!confirmTruth) return setErr("请勾选:资料真实");
    if (!acceptRules)  return setErr("请勾选:同意平台规则");

    setLoading(true);
    try {
      const payload = {
        displayName: displayName.trim(),
        username:    username.trim(),
        email:       email.trim(),
        phone:       phone.trim() || undefined,
        birthDate,
        country:     country.trim(),
        city:        city.trim(),
        languages,
        slogan:      slogan.trim() || undefined,
        bio:         bio.trim() || undefined,
        occupation:  occupation.trim() || undefined,
        interests,
        availableCities: availableCities.split(/[,，]/g).map((s) => s.trim()).filter(Boolean).slice(0, 20),
        height:      height ? Number(height) : undefined,
        weight:      weight ? Number(weight) : undefined,
        bodyType, skinTone, hairColor, eyeColor,
        services: Object.fromEntries(
          Object.entries(services)
            .filter(([, v]) => v)
            .map(([k]) => [k, { enabled: true }])
        ),
        wantsFreeShoot,
        confirmAdult, confirmTruth, acceptRules,
      };
      const res = await fetch("/api/creator/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErr(data?.message || "提交失败,请稍后重试");
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

  // Loading state before hydration
  if (!hydrated) return <div className="ap-form-card" style={{ minHeight: 320 }} />;

  // Unauthed → CTA card
  if (!user) {
    return (
      <div className="ap-form-card" style={{ textAlign: "center" }}>
        <h2 className="ap-form-h1">先登录 · 再提交申请</h2>
        <p className="ap-form-sub">Sugardating 会审核每一位创作者的申请。登录或注册后,你可以填写主页信息 · 保存草稿 · 随时修改。</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }}>
          <Link href="/login?next=/apply" className="ap-btn-primary">登录</Link>
          <Link href="/register?next=/apply" className="ap-btn-ghost" style={{ background: "var(--page)", color: "var(--ink)", border: "1px solid var(--line)" }}>创建账号</Link>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="ap-form-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 12, color: "#16a34a" }}>✓</div>
        <h2 className="ap-form-h1">申请已提交</h2>
        <p className="ap-form-sub">我们会尽快审核你的资料。审核通过后,你的创作者主页将进入 Sugargirl 频道展示。</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={success.url} className="ap-btn-primary">预览我的主页</Link>
          <Link href="/me" className="ap-btn-ghost" style={{ background: "var(--page)", color: "var(--ink)", border: "1px solid var(--line)" }}>返回个人中心</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="ap-form-card">
      <h2 className="ap-form-h1">申请加入 Sugardating Creator</h2>
      <p className="ap-form-sub">填写基础信息后,我们会进行审核。通过后你将获得创作者主页和平台展示机会。</p>

      <fieldset className="ap-fs">
        <legend className="ap-fs-legend">1. 基础信息</legend>
        <div className="ap-fs-body">
          <div className="ap-fs-row">
            <F label="昵称 *"><input required maxLength={60} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="主页显示名" /></F>
            <F label="Username / URL *" hint="仅字母/数字/短横线 · 将作 /creators/{username}"><input required maxLength={32} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="aria" /></F>
          </div>
          <div className="ap-fs-row">
            <F label="邮箱 *"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></F>
            <F label="手机 (可选)"><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+65 XXXX XXXX" /></F>
          </div>
          <div className="ap-fs-row">
            <F label={`出生日期 * ${age !== null ? `(${age} 岁)` : ""}`}><input required type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></F>
            <F label="国家 *"><input required value={country} onChange={(e) => setCountry(e.target.value)} placeholder="新加坡" /></F>
            <F label="城市 *"><input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="新加坡" /></F>
          </div>
          <F label={`语言 * (至少 1)`}>
            <div className="ap-chips">
              {LANGUAGE_OPTIONS.map((l) => (
                <button key={l} type="button" className={"ap-chip" + (languages.includes(l) ? " on" : "")} onClick={() => toggle(languages, setLanguages, l)}>{l}</button>
              ))}
            </div>
          </F>
        </div>
      </fieldset>

      <fieldset className="ap-fs">
        <legend className="ap-fs-legend">2. 主页展示信息</legend>
        <div className="ap-fs-body">
          <F label="一句话介绍 / Slogan"><input maxLength={140} value={slogan} onChange={(e) => setSlogan(e.target.value)} placeholder="Life is short — dine well." /></F>
          <F label="个人简介 / Bio"><textarea rows={4} maxLength={800} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="介绍你的生活方式、性格、想被看见的一面…" /></F>
          <div className="ap-fs-row">
            <F label="职业 / Occupation"><input maxLength={60} value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Travel Creator" /></F>
            <F label="可展示城市 (逗号分隔)"><input value={availableCities} onChange={(e) => setAvailableCities(e.target.value)} placeholder="新加坡, 东京, 首尔" /></F>
          </div>
          <F label={`兴趣爱好 * (已选 ${interests.length} · 至少 3)`}>
            <div className="ap-chips">
              {INTEREST_OPTIONS.map((it) => (
                <button key={it} type="button" className={"ap-chip" + (interests.includes(it) ? " on" : "")} onClick={() => toggle(interests, setInterests, it)}>{it}</button>
              ))}
            </div>
          </F>
        </div>
      </fieldset>

      <fieldset className="ap-fs">
        <legend className="ap-fs-legend">3. 外貌与资料 (可选 · 建议填)</legend>
        <div className="ap-fs-body">
          <div className="ap-fs-row">
            <F label="身高 (cm)"><input type="number" min={120} max={220} value={height} onChange={(e) => setHeight(e.target.value)} placeholder="168" /></F>
            <F label="体重 (kg)"><input type="number" min={30} max={200} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="52" /></F>
          </div>
          <div className="ap-fs-row">
            <F label="体型"><Select value={bodyType} onChange={setBodyType} options={BODY_TYPES} /></F>
            <F label="肤色"><Select value={skinTone} onChange={setSkinTone} options={SKIN_TONES} /></F>
            <F label="发色"><Select value={hairColor} onChange={setHairColor} options={HAIR_COLORS} /></F>
            <F label="眼睛"><Select value={eyeColor} onChange={setEyeColor} options={EYE_COLORS} /></F>
          </div>
        </div>
      </fieldset>

      <fieldset className="ap-fs">
        <legend className="ap-fs-legend">4. 服务意向</legend>
        <div className="ap-fs-body">
          <F label="愿意提供的服务(可多选)">
            <div className="ap-svc-grid">
              {SERVICES.map((s) => (
                <label key={s.k} className="ap-svc-toggle">
                  <input type="checkbox" checked={!!services[s.k]} onChange={(e) => setServices({ ...services, [s.k]: e.target.checked })} />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
          </F>
          <F label="是否希望申请平台免费写真 / 视频拍摄支持?">
            <div className="ap-radio-group">
              <label className="ap-radio"><input type="radio" name="shoot" value="yes"   checked={wantsFreeShoot === "yes"}   onChange={() => setWantsFreeShoot("yes")}   /><span>是,希望平台联系我</span></label>
              <label className="ap-radio"><input type="radio" name="shoot" value="learn" checked={wantsFreeShoot === "learn"} onChange={() => setWantsFreeShoot("learn")} /><span>想先了解</span></label>
              <label className="ap-radio"><input type="radio" name="shoot" value="no"    checked={wantsFreeShoot === "no"}    onChange={() => setWantsFreeShoot("no")}    /><span>暂时不需要</span></label>
            </div>
          </F>
        </div>
      </fieldset>

      <fieldset className="ap-fs" style={{ marginBottom: 16 }}>
        <legend className="ap-fs-legend">5. 安全确认</legend>
        <div className="ap-fs-body">
          <label className="ap-confirm"><input type="checkbox" checked={confirmAdult} onChange={(e) => setConfirmAdult(e.target.checked)} /><span>我确认已满 <b>18 岁</b>,自愿申请成为 Sugardating Creator。</span></label>
          <label className="ap-confirm"><input type="checkbox" checked={confirmTruth} onChange={(e) => setConfirmTruth(e.target.checked)} /><span>我确认提交的所有资料真实,不存在冒用他人身份或虚假信息。</span></label>
          <label className="ap-confirm"><input type="checkbox" checked={acceptRules} onChange={(e) => setAcceptRules(e.target.checked)} /><span>我已阅读并同意 <Link href="/community/guidelines" style={{ color: "var(--ink)", fontWeight: 600 }}>平台规则</Link>,理解部分资料会用于创作者主页展示;不发布未成年内容,遵守当地法律。</span></label>
        </div>
      </fieldset>

      {err && <div style={{ color: "var(--live)", fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>{err}</div>}

      <button type="submit" disabled={loading} className="ap-btn-primary" style={{ width: "100%", height: 56 }}>
        {loading ? "提交中…" : "提交入驻申请"}
      </button>
      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>提交后申请进入 pending 状态 · 审核通过后主页正式对外可见</p>
    </form>
  );
}

function F({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="ap-fs-field">
      <label>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">选择…</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
