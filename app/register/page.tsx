"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";

const INTEREST_OPTIONS = [
  "旅行","摄影","咖啡","美食","音乐","电影","健身","艺术","夜生活","时尚","Luxury","阅读","徒步","品酒","收藏","设计",
];
const LANGUAGE_OPTIONS = ["中文","English","日本語","한국어","ภาษาไทย","Français","Deutsch"];
const GENDER_OPTIONS = [
  { v: "male",   l: "男" },
  { v: "female", l: "女" },
  { v: "other",  l: "其他" },
  { v: "na",     l: "不便回答" },
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

export default function Page() {
  const { registerWithApi } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";     // 默认回首页(登录态);"我的主页"点击才进 /me

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const age = useMemo(() => (birthDate ? computeAge(birthDate) : null), [birthDate]);
  const isAdult = age !== null && age >= 18;

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (pw !== pw2)         return setErr("两次密码不一致");
    if (pw.length < 8)      return setErr("密码至少 8 位");
    if (!birthDate)         return setErr("请填写出生日期");
    if (age !== null && age < 18) return setErr("本平台仅面向 18 岁以上成年人");
    if (!country.trim())    return setErr("请填写国家");
    if (!city.trim())       return setErr("请填写城市");
    if (interests.length < 3) return setErr("请至少选择 3 个兴趣爱好");
    if (!agree)             return setErr("请先同意平台条款");

    setLoading(true);
    const res = await registerWithApi({
      displayName: displayName.trim(),
      email:       email.trim(),
      password:    pw,
      birthDate,
      gender:      gender || undefined,
      country:     country.trim(),
      city:        city.trim(),
      languages,
      interests,
      bio:         bio.trim() || undefined,
      acceptTerms: true,
    });
    setLoading(false);
    if (!res.ok) { setErr(res.message); return; }
    router.push(next);
    router.refresh();
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <div className="authwrap" style={{ maxWidth: 640 }}>
        <h1>创建账号</h1>
        <p className="s">填写基础信息,快速加入 Sugardating。所有资料仅用于账号管理,<b>不会</b>公开到 Sugargirl 主页。</p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
          <Section title="账号">
            <Field label="昵称 *">
              <input required maxLength={60} value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                placeholder="你的显示名" disabled={loading} />
            </Field>
            <Field label="邮箱 *">
              <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" disabled={loading} />
            </Field>
            <Row2>
              <Field label="密码 * (≥ 8 位)">
                <input type="password" required autoComplete="new-password" minLength={8}
                  value={pw} onChange={(e) => setPw(e.target.value)} disabled={loading} />
              </Field>
              <Field label="确认密码 *">
                <input type="password" required autoComplete="new-password" minLength={8}
                  value={pw2} onChange={(e) => setPw2(e.target.value)} disabled={loading} />
              </Field>
            </Row2>
          </Section>

          <Section title="基础信息">
            <Row2>
              <Field label={`出生日期 * ${age !== null ? `(${age} 岁${!isAdult ? " · 未满 18" : ""})` : ""}`}>
                <input type="date" required value={birthDate} onChange={(e) => setBirthDate(e.target.value)} disabled={loading} />
              </Field>
              <Field label="性别 (可选)">
                <select value={gender} onChange={(e) => setGender(e.target.value)} disabled={loading}>
                  <option value="">选择…</option>
                  {GENDER_OPTIONS.map((g) => <option key={g.v} value={g.v}>{g.l}</option>)}
                </select>
              </Field>
            </Row2>
            <Row2>
              <Field label="国家 *"><input required maxLength={60} value={country} onChange={(e) => setCountry(e.target.value)}
                placeholder="新加坡" disabled={loading} /></Field>
              <Field label="城市 *"><input required maxLength={60} value={city} onChange={(e) => setCity(e.target.value)}
                placeholder="新加坡" disabled={loading} /></Field>
            </Row2>
            <Field label="常用语言">
              <div className="ap-chips">
                {LANGUAGE_OPTIONS.map((l) => (
                  <button key={l} type="button" disabled={loading}
                    onClick={() => toggle(languages, setLanguages, l)}
                    className={"ap-chip" + (languages.includes(l) ? " on" : "")}>
                    {l}
                  </button>
                ))}
              </div>
            </Field>
          </Section>

          <Section title={`兴趣爱好 * (已选 ${interests.length} · 至少 3)`}>
            <div className="ap-chips">
              {INTEREST_OPTIONS.map((it) => (
                <button key={it} type="button" disabled={loading}
                  onClick={() => toggle(interests, setInterests, it)}
                  className={"ap-chip" + (interests.includes(it) ? " on" : "")}>
                  {it}
                </button>
              ))}
            </div>
          </Section>

          <Section title="个人简介 (可选)">
            <Field label="Bio">
              <textarea rows={3} maxLength={400} value={bio} onChange={(e) => setBio(e.target.value)}
                placeholder="用一两句话介绍自己,方便匹配更合适的 Sugargirl。" disabled={loading} />
            </Field>
          </Section>

          <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--ink2)", lineHeight: 1.6 }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} disabled={loading} style={{ marginTop: 3 }} />
            <span>
              我确认已年满 18 岁,并已阅读同意 <Link href="/community/guidelines" style={{ color: "var(--ink)", fontWeight: 600 }}>平台条款</Link>
              · 承诺遵守当地法律 · 不发布或索取未成年内容 · 不进行诈骗/胁迫/骚扰或非自愿行为。
            </span>
          </label>

          {err && <div style={{ color: "var(--live)", fontSize: 13, fontWeight: 600 }}>{err}</div>}

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn btn-ink" type="submit" disabled={loading}>
              {loading ? "注册中…" : "创建账号"}
            </button>
            <span className="s">已有账号？<Link href="/login" style={{ color: "var(--ink)", fontWeight: 600 }}>登录</Link></span>
          </div>
        </form>
      </div>

      <style jsx>{`
        .ap-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        .ap-chip { padding: 6px 12px; border-radius: 999px; background: #fff; border: 1px solid var(--line); color: var(--ink2); font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; }
        .ap-chip:hover:not(:disabled) { border-color: var(--ink); color: var(--ink); }
        .ap-chip.on { background: var(--ink); color: #fff; border-color: var(--ink); }
        .ap-chip:disabled { opacity: .5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: 16, margin: 0 }}>
      <legend style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--muted)", textTransform: "uppercase", padding: "0 6px" }}>{title}</legend>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </fieldset>
  );
}
function Row2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field" style={{ marginBottom: 0 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink2)", marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}
