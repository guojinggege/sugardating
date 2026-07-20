"use client";
// User Account Center — 左侧 sidebar + 右侧 section
// 8 sections: Overview · Profile · Preferences · Following · Saved · Bookings · Gifts · Membership · Security · Creator Apply Status
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/AuthProvider";
import type { UserProfile } from "@/lib/mock-db";

type Role = "user" | "creator" | "admin";

interface Props {
  user:    { id: string; name: string; email: string; role: string; createdAt: string };
  profile: UserProfile;
  counts:  { following: number; saved: number; bookings: number; gifts: number };
  creatorApplication: { slug: string; status: string } | null;
}

type SectionKey =
  | "overview" | "profile" | "preferences" | "following"
  | "saved" | "bookings" | "gifts" | "membership" | "security" | "creator";

const MENU: { key: SectionKey; label: string; icon: string }[] = [
  { key: "overview",    label: "总览",        icon: "◎" },
  { key: "profile",     label: "个人资料",    icon: "◐" },
  { key: "preferences", label: "偏好设置",    icon: "❉" },
  { key: "following",   label: "我的关注",    icon: "♡" },
  { key: "saved",       label: "我的收藏",    icon: "☆" },
  { key: "bookings",    label: "我的预约",    icon: "▤" },
  { key: "gifts",       label: "我的打赏",    icon: "🎁" },
  { key: "membership",  label: "会员中心",    icon: "◆" },
  { key: "security",    label: "账号安全",    icon: "⛨" },
  { key: "creator",     label: "创作者中心",  icon: "★" },
];

export default function UserDashboard({ user, profile, counts, creatorApplication }: Props) {
  const [active, setActive] = useState<SectionKey>("overview");
  const [prof, setProf] = useState<UserProfile>(profile);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const patch = async (body: Record<string, unknown>): Promise<boolean> => {
    setSaving(true); setSavedMsg(null);
    try {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setProf(data.profile);
        setSavedMsg("已保存");
        setTimeout(() => setSavedMsg(null), 1600);
        return true;
      }
      setSavedMsg(data?.message || "保存失败");
      return false;
    } catch {
      setSavedMsg("网络错误"); return false;
    } finally { setSaving(false); }
  };

  const onLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const role = (user.role as Role) || "user";
  const tierLabel: Record<string, string> = { free: "普通用户", basic: "基础会员", premium: "高级会员", elite: "尊享会员" };

  return (
    <div className="me-page">
      <div className="me-container">
        {/* ═══ Left Sidebar ═══ */}
        <aside className="me-side">
          <div className="me-user">
            <div className="me-ava">{(prof.displayName || user.name)[0]?.toUpperCase() || "?"}</div>
            <div className="me-user-info">
              <div className="me-name">{prof.displayName || user.name}</div>
              <div className="me-email">{user.email}</div>
              <div className="me-role-chip">
                {role === "creator" ? "✓ 创作者" : role === "admin" ? "管理员" : tierLabel[prof.membership.tier] || "普通用户"}
              </div>
            </div>
          </div>

          <nav className="me-nav">
            {MENU.map((m) => {
              // Hide "创作者中心" 除非 role=creator 或 已提交 application
              if (m.key === "creator" && role !== "creator" && !creatorApplication) return null;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setActive(m.key)}
                  className={"me-nav-item" + (active === m.key ? " on" : "")}
                >
                  <span className="me-nav-ic">{m.icon}</span>
                  <span>{m.label}</span>
                  {m.key === "following" && counts.following > 0 && <span className="me-nav-badge">{counts.following}</span>}
                </button>
              );
            })}
          </nav>

          <div className="me-side-external">
            <Link href="/me/reports" className="me-nav-item me-nav-external">
              <span className="me-nav-ic me-nav-ic--warn">⛨</span>
              <span>我要举报</span>
            </Link>
          </div>

          <div className="me-side-foot">
            <button type="button" onClick={onLogout} className="me-logout">退出登录</button>
          </div>
        </aside>

        {/* ═══ Main Content ═══ */}
        <main className="me-main">
          {savedMsg && <div className="me-toast">{savedMsg}</div>}

          {active === "overview"    && <OverviewSection user={user} profile={prof} counts={counts} creatorApp={creatorApplication} onNav={setActive} />}
          {active === "profile"     && <ProfileSection profile={prof} email={user.email} onSave={patch} saving={saving} />}
          {active === "preferences" && <PreferencesSection profile={prof} onSave={patch} saving={saving} />}
          {active === "following"   && <FollowingSection />}
          {active === "saved"       && <SavedSection />}
          {active === "bookings"    && <BookingsSection />}
          {active === "gifts"       && <GiftsSection />}
          {active === "membership"  && <MembershipSection profile={prof} />}
          {active === "security"    && <SecuritySection email={user.email} />}
          {active === "creator"     && <CreatorStatusSection creatorApp={creatorApplication} role={role} />}
        </main>
      </div>

      <style jsx>{`
        .me-page { background: var(--page); min-height: 100vh; padding: 32px 0 80px; }
        .me-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 264px minmax(0, 1fr); gap: 32px; align-items: start; }
        @media (max-width: 900px) { .me-container { grid-template-columns: 1fr; gap: 16px; } }

        .me-side { background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 20px; position: sticky; top: 100px; display: flex; flex-direction: column; gap: 16px; }
        @media (max-width: 900px) { .me-side { position: static; } }

        .me-user { display: flex; gap: 12px; align-items: flex-start; padding-bottom: 16px; border-bottom: 1px solid var(--line); }
        .me-ava { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #7C5CFF, #EC4C86); color: #fff; display: grid; place-items: center; font-size: 20px; font-weight: 800; flex-shrink: 0; }
        .me-user-info { min-width: 0; flex: 1; }
        .me-name { font-size: 15px; font-weight: 800; color: var(--ink); truncate; }
        .me-email { font-size: 11.5px; color: var(--muted); margin-top: 2px; word-break: break-all; }
        .me-role-chip { display: inline-block; margin-top: 6px; font-size: 10.5px; font-weight: 700; background: var(--page); color: var(--ink); padding: 3px 8px; border-radius: 999px; border: 1px solid var(--line); }

        .me-nav { display: flex; flex-direction: column; gap: 2px; }
        @media (max-width: 900px) { .me-nav { flex-direction: row; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; } .me-nav::-webkit-scrollbar { display: none; } }
        .me-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; background: transparent; color: var(--ink2); font-size: 13.5px; font-weight: 600; text-align: left; transition: background .15s, color .15s; cursor: pointer; white-space: nowrap; }
        .me-nav-item:hover { background: var(--page); color: var(--ink); }
        .me-nav-item.on { background: var(--ink); color: #fff; }
        .me-nav-ic { font-size: 13px; opacity: .8; width: 18px; text-align: center; flex-shrink: 0; }
        .me-nav-badge { margin-left: auto; font-size: 10px; font-weight: 800; background: rgba(0,0,0,.08); color: var(--ink); padding: 2px 6px; border-radius: 999px; }
        .me-nav-item.on .me-nav-badge { background: rgba(255,255,255,.2); color: #fff; }

        .me-side-external { padding-top: 12px; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 2px; }
        .me-nav-external { text-decoration: none; }
        .me-nav-ic--warn { color: #B77945; opacity: 1; }
        .me-side-foot { padding-top: 12px; border-top: 1px solid var(--line); }
        .me-logout { width: 100%; height: 36px; border-radius: 10px; border: 1px solid var(--line); background: #fff; color: var(--muted); font-size: 13px; font-weight: 600; cursor: pointer; transition: color .15s, border-color .15s; }
        .me-logout:hover { color: var(--live); border-color: var(--live); }

        .me-main { display: flex; flex-direction: column; gap: 16px; }
        .me-toast { position: fixed; top: 90px; right: 24px; background: var(--ink); color: #fff; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; z-index: 60; box-shadow: 0 8px 24px -8px rgba(0,0,0,.3); }
      `}</style>
    </div>
  );
}

// ═══ Sections ═══════════════════════════════════════

function OverviewSection({ user, profile, counts, creatorApp, onNav }: {
  user: Props["user"]; profile: UserProfile;
  counts: Props["counts"]; creatorApp: Props["creatorApplication"];
  onNav: (k: SectionKey) => void;
}) {
  const joined = new Date(user.createdAt).toLocaleDateString("zh-CN");
  return (
    <>
      <Card>
        <h2 className="me-h2">总览</h2>
        <p className="me-sub">欢迎回来,{profile.displayName || user.name}。这里管理你的账号、偏好和互动记录。</p>
        <div className="me-stats">
          <StatBox label="关注创作者" value={counts.following} onClick={() => onNav("following")} />
          <StatBox label="收藏内容"   value={counts.saved}     onClick={() => onNav("saved")} />
          <StatBox label="预约记录"   value={counts.bookings}  onClick={() => onNav("bookings")} />
          <StatBox label="打赏记录"   value={counts.gifts}     onClick={() => onNav("gifts")} />
        </div>
        <div className="me-meta">
          <span>注册于 {joined}</span>
          <span>·</span>
          <span>{profile.membership.tier === "free" ? "普通用户" : "会员用户"}</span>
        </div>
      </Card>
      <div className="me-quick">
        <QuickLink title="编辑个人资料"   desc="修改昵称 · 头像 · 城市 · 语言"           onClick={() => onNav("profile")} />
        <QuickLink title="设置偏好"       desc="兴趣城市 · 类型偏好 · 价格区间"          onClick={() => onNav("preferences")} />
        <QuickLink title="开通/管理会员"  desc="解锁 VIP 内容 · 优先推荐"                onClick={() => onNav("membership")} />
        {creatorApp
          ? <QuickLink title={`创作者申请:${statusText(creatorApp.status)}`} desc={`预览 /creators/${creatorApp.slug}`} onClick={() => onNav("creator")} accent />
          : <QuickLink title="申请成为创作者" desc="创建你的公开主页 · 接收互动"          href="/apply" accent />
        }
        <QuickLink title="安全举报与反馈" desc="举报线上沟通、预约或线下接触中遇到的问题" href="/me/reports/new" safety />
      </div>
      <style jsx>{`
        .me-h2 { font-size: 20px; font-weight: 800; color: var(--ink); margin: 0 0 4px; letter-spacing: -.01em; }
        .me-sub { font-size: 13.5px; color: var(--muted); margin: 0 0 20px; line-height: 1.55; }
        .me-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
        @media (max-width: 640px) { .me-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        .me-meta { display: flex; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--line); font-size: 12px; color: var(--muted); }
        .me-quick { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        @media (max-width: 640px) { .me-quick { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}

function ProfileSection({ profile, email, onSave, saving }: {
  profile: UserProfile; email: string;
  onSave: (b: Record<string, unknown>) => Promise<boolean>; saving: boolean;
}) {
  const [f, setF] = useState({
    displayName: profile.displayName || "",
    username:    profile.username || "",
    bio:         profile.bio || "",
    phone:       profile.phone || "",
    gender:      profile.gender || "",
    birthday:    profile.birthday || "",
    city:        profile.city || "",
    country:     profile.country || "",
    language:    profile.language || "",
    avatar:      profile.avatar || "",
    interests:   (profile.interests || []).join(", "),
  });
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));
  return (
    <Card>
      <h2 className="me-h2">个人资料</h2>
      <p className="me-sub">这些资料展示在你的账号中心。<b>不会</b>公开到 Sugargirl 页面。如果想开通公开主页,请前往「创作者中心」申请入驻。</p>
      <div className="me-form">
        <Row2>
          <Field label="显示昵称"><input value={f.displayName} onChange={(e) => set("displayName", e.target.value)} /></Field>
          <Field label="Username (可选)"><input value={f.username} onChange={(e) => set("username", e.target.value)} placeholder="仅用于账号内展示" /></Field>
        </Row2>
        <Field label="邮箱 (只读)"><input value={email} disabled /></Field>
        <Row2>
          <Field label="手机 (可选)"><input value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+65 XXXX XXXX" /></Field>
          <Field label="性别"><select value={f.gender} onChange={(e) => set("gender", e.target.value)}>
            <option value="">选择…</option><option>男</option><option>女</option><option>其他</option><option>不便回答</option>
          </select></Field>
        </Row2>
        <Row2>
          <Field label="生日"><input type="date" value={f.birthday} onChange={(e) => set("birthday", e.target.value)} /></Field>
          <Field label="偏好语言"><input value={f.language} onChange={(e) => set("language", e.target.value)} placeholder="中文 / English" /></Field>
        </Row2>
        <Row2>
          <Field label="国家"><input value={f.country} onChange={(e) => set("country", e.target.value)} placeholder="新加坡" /></Field>
          <Field label="城市"><input value={f.city} onChange={(e) => set("city", e.target.value)} placeholder="新加坡" /></Field>
        </Row2>
        <Field label="Bio (自我介绍)"><textarea rows={3} value={f.bio} onChange={(e) => set("bio", e.target.value)} placeholder="简单介绍一下自己..." /></Field>
        <Field label="头像 URL"><input value={f.avatar} onChange={(e) => set("avatar", e.target.value)} placeholder="https://..." /></Field>
        <Field label="兴趣标签 (逗号分隔)"><input value={f.interests} onChange={(e) => set("interests", e.target.value)} placeholder="旅行, 咖啡, 摄影" /></Field>
        <div className="me-form-actions">
          <button type="button" disabled={saving} className="btn btn-ink" onClick={() => {
            const payload: Record<string, unknown> = { ...f, interests: f.interests.split(/[,，]/g).map((s) => s.trim()).filter(Boolean).slice(0, 30) };
            for (const k of Object.keys(payload)) if (payload[k] === "") delete payload[k];
            onSave(payload);
          }}>{saving ? "保存中…" : "保存资料"}</button>
        </div>
      </div>
      <style jsx>{`
        .me-h2 { font-size: 20px; font-weight: 800; color: var(--ink); margin: 0 0 4px; letter-spacing: -.01em; }
        .me-sub { font-size: 13.5px; color: var(--muted); margin: 0 0 20px; line-height: 1.55; }
        .me-form { display: flex; flex-direction: column; gap: 14px; }
        .me-form-actions { margin-top: 4px; }
      `}</style>
    </Card>
  );
}

function PreferencesSection({ profile, onSave, saving }: {
  profile: UserProfile;
  onSave: (b: Record<string, unknown>) => Promise<boolean>; saving: boolean;
}) {
  const prefs = profile.preferences || {};
  const [f, setF] = useState({
    interestedCities:    (prefs.interestedCities || []).join(", "),
    interestedLanguages: (prefs.interestedLanguages || []).join(", "),
    interestedTypes:     (prefs.interestedTypes || []).join(", "),
    ageMin:              prefs.ageRange?.[0]?.toString() || "",
    ageMax:              prefs.ageRange?.[1]?.toString() || "",
    priceMin:            prefs.priceRange?.[0]?.toString() || "",
    priceMax:            prefs.priceRange?.[1]?.toString() || "",
    onlinePriority:      !!prefs.onlinePriority,
    verifiedPriority:    !!prefs.verifiedPriority,
  });
  const set = (k: keyof typeof f, v: unknown) => setF((s) => ({ ...s, [k]: v as never }));
  return (
    <Card>
      <h2 className="me-h2">偏好设置</h2>
      <p className="me-sub">Sugardating 会根据这些偏好优先推荐匹配的 Sugargirl。</p>
      <div className="me-form">
        <Field label="感兴趣城市 (逗号分隔)"><input value={f.interestedCities} onChange={(e) => set("interestedCities", e.target.value)} placeholder="新加坡, 东京, 首尔" /></Field>
        <Field label="感兴趣语言 (逗号分隔)"><input value={f.interestedLanguages} onChange={(e) => set("interestedLanguages", e.target.value)} placeholder="中文, English, 日本語" /></Field>
        <Field label="感兴趣服务类型 (逗号分隔)"><input value={f.interestedTypes} onChange={(e) => set("interestedTypes", e.target.value)} placeholder="聊天, 视频, 拍摄, 旅游" /></Field>
        <Row2>
          <Field label="年龄下限"><input type="number" min={18} max={70} value={f.ageMin} onChange={(e) => set("ageMin", e.target.value)} placeholder="22" /></Field>
          <Field label="年龄上限"><input type="number" min={18} max={70} value={f.ageMax} onChange={(e) => set("ageMax", e.target.value)} placeholder="35" /></Field>
        </Row2>
        <Row2>
          <Field label="价格下限"><input type="number" min={0} value={f.priceMin} onChange={(e) => set("priceMin", e.target.value)} placeholder="0" /></Field>
          <Field label="价格上限"><input type="number" min={0} value={f.priceMax} onChange={(e) => set("priceMax", e.target.value)} placeholder="1000" /></Field>
        </Row2>
        <label className="me-chk"><input type="checkbox" checked={f.onlinePriority} onChange={(e) => set("onlinePriority", e.target.checked)} /> 在线中优先</label>
        <label className="me-chk"><input type="checkbox" checked={f.verifiedPriority} onChange={(e) => set("verifiedPriority", e.target.checked)} /> 已认证优先</label>
        <div>
          <button type="button" disabled={saving} className="btn btn-ink" onClick={() => {
            const preferences: Record<string, unknown> = {
              interestedCities:    splitTags(f.interestedCities),
              interestedLanguages: splitTags(f.interestedLanguages),
              interestedTypes:     splitTags(f.interestedTypes),
              onlinePriority:      f.onlinePriority,
              verifiedPriority:    f.verifiedPriority,
            };
            if (f.ageMin && f.ageMax)     preferences.ageRange   = [Number(f.ageMin),   Number(f.ageMax)];
            if (f.priceMin && f.priceMax) preferences.priceRange = [Number(f.priceMin), Number(f.priceMax)];
            onSave({ preferences });
          }}>{saving ? "保存中…" : "保存偏好"}</button>
        </div>
      </div>
      <style jsx>{`
        .me-h2 { font-size: 20px; font-weight: 800; color: var(--ink); margin: 0 0 4px; letter-spacing: -.01em; }
        .me-sub { font-size: 13.5px; color: var(--muted); margin: 0 0 20px; line-height: 1.55; }
        .me-form { display: flex; flex-direction: column; gap: 14px; }
        .me-chk { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--ink); user-select: none; cursor: pointer; }
      `}</style>
    </Card>
  );
}

function FollowingSection() {
  return <EmptyState title="我的关注" line="你还没有关注任何 Sugargirl。" ctaText="去发现" ctaHref="/creators" />;
}
function SavedSection() {
  return <EmptyState title="我的收藏" line="暂无收藏内容。浏览动态或视频时可收藏喜欢的内容。" ctaText="浏览动态" ctaHref="/photography" />;
}
function BookingsSection() {
  return <EmptyState title="我的预约" line="暂无预约记录。浏览创作者主页可发起预约。" ctaText="浏览 Sugargirl" ctaHref="/creators" />;
}
function GiftsSection() {
  return <EmptyState title="我的打赏" line="暂无打赏记录。在创作者主页点击「打赏」即可支持喜欢的 Sugargirl。" ctaText="看看推荐 Creator" ctaHref="/creators" />;
}
function MembershipSection({ profile }: { profile: UserProfile }) {
  const isFree = profile.membership.tier === "free";
  return (
    <Card>
      <h2 className="me-h2">会员中心</h2>
      <p className="me-sub">当前会员等级:<b>{isFree ? "普通用户 (免费)" : profile.membership.tier}</b>{profile.membership.expiresAt ? ` · 到期 ${new Date(profile.membership.expiresAt).toLocaleDateString("zh-CN")}` : ""}</p>
      <div className="me-mship-benefits">
        <b>会员权益:</b>
        <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 20px", display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--ink2)" }}>
          <li>✓ 查看更多 Sugargirl 完整资料</li>
          <li>✓ 解锁高级筛选</li>
          <li>✓ 提升私信优先级</li>
          <li>✓ 优先推荐 · 免广告</li>
        </ul>
      </div>
      <Link href="/membership" className="btn btn-ink">{isFree ? "开通会员" : "管理会员"}</Link>
      <style jsx>{`
        .me-h2 { font-size: 20px; font-weight: 800; color: var(--ink); margin: 0 0 4px; letter-spacing: -.01em; }
        .me-sub { font-size: 13.5px; color: var(--muted); margin: 0 0 16px; line-height: 1.6; }
      `}</style>
    </Card>
  );
}
function SecuritySection({ email }: { email: string }) {
  return (
    <Card>
      <h2 className="me-h2">账号安全</h2>
      <p className="me-sub">保护你的账号安全。密码修改与 KYC 认证功能开发中,暂请通过邮件联系客服。</p>
      <div className="me-sec-row"><span>邮箱</span><b>{email}</b><span className="me-tag ok">已验证</span></div>
      <div className="me-sec-row"><span>手机</span><b>—</b><span className="me-tag">未绑定</span></div>
      <div className="me-sec-row"><span>登录密码</span><b>••••••••</b><button type="button" className="me-sec-btn" disabled>修改 (开发中)</button></div>
      <div className="me-sec-row"><span>登录设备</span><b>当前设备</b><button type="button" className="me-sec-btn" disabled>管理 (开发中)</button></div>
      <div className="me-sec-row"><span>隐私设置</span><b>—</b><button type="button" className="me-sec-btn" disabled>配置 (开发中)</button></div>
      <style jsx>{`
        .me-h2 { font-size: 20px; font-weight: 800; color: var(--ink); margin: 0 0 4px; letter-spacing: -.01em; }
        .me-sub { font-size: 13.5px; color: var(--muted); margin: 0 0 20px; line-height: 1.6; }
        .me-sec-row { display: grid; grid-template-columns: 100px 1fr auto; gap: 12px; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--line); font-size: 13.5px; }
        .me-sec-row:last-child { border-bottom: none; }
        .me-sec-row span:first-child { color: var(--muted); }
        .me-sec-row b { color: var(--ink); font-weight: 600; }
        .me-tag { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: var(--page); color: var(--muted); border: 1px solid var(--line); }
        .me-tag.ok { background: rgba(34,197,94,.1); color: #16a34a; border-color: rgba(34,197,94,.3); }
        .me-sec-btn { font-size: 12px; font-weight: 600; color: var(--muted); border: 1px solid var(--line); border-radius: 8px; padding: 6px 12px; background: #fff; cursor: not-allowed; }
      `}</style>
    </Card>
  );
}
function CreatorStatusSection({ creatorApp, role }: { creatorApp: Props["creatorApplication"]; role: Role }) {
  if (!creatorApp) {
    return (
      <Card>
        <h2 className="me-h2">创作者中心</h2>
        <p className="me-sub">你还没有申请成为创作者。提交入驻可创建公开的 Creator 主页,接受关注/打赏/预约。</p>
        <Link href="/apply" className="btn btn-ink">申请成为创作者</Link>
        <style jsx>{`.me-h2{font-size:20px;font-weight:800;color:var(--ink);margin:0 0 4px}.me-sub{font-size:13.5px;color:var(--muted);margin:0 0 16px;line-height:1.6}`}</style>
      </Card>
    );
  }
  const isApproved = creatorApp.status === "approved" || role === "creator";
  return (
    <Card>
      <h2 className="me-h2">创作者中心</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 13.5, color: "var(--muted)" }}>申请状态:</span>
        <span style={{
          fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999,
          ...statusStyle(creatorApp.status),
        }}>{statusText(creatorApp.status)}</span>
      </div>
      <p className="me-sub">你的公开主页地址:<code style={{ background: "var(--page)", padding: "2px 6px", borderRadius: 4 }}>/creators/{creatorApp.slug}</code></p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href={`/creators/${creatorApp.slug}`} className="btn btn-ink">{isApproved ? "查看我的主页" : "预览主页"}</Link>
        <Link href="/apply" className="btn">继续完善资料</Link>
      </div>
      <style jsx>{`.me-h2{font-size:20px;font-weight:800;color:var(--ink);margin:0 0 12px}.me-sub{font-size:13.5px;color:var(--muted);margin:0 0 16px;line-height:1.6}`}</style>
    </Card>
  );
}

// ═══ Small helpers ═══════════════════════════════════

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 20, padding: 24 }}>
      {children}
    </section>
  );
}
function EmptyState({ title, line, ctaText, ctaHref }: { title: string; line: string; ctaText: string; ctaHref: string }) {
  return (
    <Card>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)", margin: "0 0 4px", letterSpacing: "-.01em" }}>{title}</h2>
      <div style={{ padding: "40px 20px", textAlign: "center", background: "var(--page)", borderRadius: 14, marginTop: 12 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>◌</div>
        <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.6 }}>{line}</p>
        <Link href={ctaHref} className="btn btn-ink">{ctaText}</Link>
      </div>
    </Card>
  );
}
function StatBox({ label, value, onClick }: { label: string; value: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      background: "var(--page)", border: "1px solid var(--line)", borderRadius: 14, padding: 16,
      cursor: "pointer", textAlign: "left", transition: "border-color .15s",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ink)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
    >
      <div style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)", lineHeight: 1, letterSpacing: "-.02em" }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{label}</div>
    </button>
  );
}
function QuickLink({ title, desc, href, onClick, accent, safety }: { title: string; desc: string; href?: string; onClick?: () => void; accent?: boolean; safety?: boolean }) {
  const background = safety
    ? "linear-gradient(135deg, rgba(183,121,69,.10), rgba(197,165,106,.06))"
    : accent
    ? "linear-gradient(135deg, rgba(184,167,137,.14), rgba(184,167,137,.04))"
    : "#fff";
  const border = safety
    ? "rgba(183,121,69,.28)"
    : accent
    ? "rgba(184,167,137,.35)"
    : "var(--line)";
  const style: React.CSSProperties = {
    background, border: `1px solid ${border}`,
    borderRadius: 16, padding: 18, textAlign: "left", cursor: "pointer",
    display: "flex", flexDirection: "column", gap: 4, transition: "transform .15s, box-shadow .15s",
  };
  const inner = (
    <>
      <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
        {safety && <span aria-hidden style={{ color: "#B77945", fontSize: 15 }}>⛨</span>}
        {title}
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>{desc}</div>
    </>
  );
  return href
    ? <Link href={href} style={style}>{inner}</Link>
    : <button type="button" onClick={onClick} style={style}>{inner}</button>;
}
function Row2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink2)", marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}
function splitTags(s: string): string[] {
  return s.split(/[,，]/g).map((x) => x.trim()).filter(Boolean).slice(0, 20);
}
function statusText(s: string): string {
  return { pending: "待审核", approved: "已通过", rejected: "被驳回", suspended: "已封禁", draft: "草稿" }[s] || s;
}
function statusStyle(s: string): React.CSSProperties {
  switch (s) {
    case "approved":  return { background: "rgba(34,197,94,.12)", color: "#16a34a" };
    case "pending":   return { background: "rgba(214,184,106,.15)", color: "#8a6c1f" };
    case "rejected":  return { background: "rgba(225,29,72,.12)", color: "#e11d48" };
    default:          return { background: "var(--page)", color: "var(--ink2)" };
  }
}
