// /apply — Sugargirl 全球招募计划 · 意向信息收集页
// 允许未登录访问 · 数据落 CreatorInterest 表 · 后台只读展示
import type { Metadata } from "next";
import Img from "@/components/Img";
import { pick } from "@/lib/images";
import InterestDialogProvider from "@/components/Apply/InterestDialogProvider";
import InterestTrigger from "@/components/Apply/InterestTrigger";
import CreatorInterestSection from "@/components/Apply/CreatorInterestSection";
import ApplyFloatingCTAs from "@/components/Apply/ApplyFloatingCTAs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sugargirl全球招募计划 | Sugardating",
  description:
    "加入 Sugargirl 全球招募计划,提交昵称、所在城市、当前状态及常用社交联系方式,Sugardating 团队将与你沟通后续入驻安排。",
  alternates: { canonical: "/apply" },
  openGraph: {
    title: "Sugargirl全球招募计划 | Sugardating",
    description: "加入 Sugargirl 全球招募计划,提交你的入驻意向,团队将与你联系。",
    images: ["/images/apply/sugargirl-global-recruitment-hero.jpg"],
  },
};

// ─── Icon helpers ──────────────────
const Ic = {
  users:    (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6"/><circle cx="17" cy="9" r="2.5"/><path d="M22 21c0-2.5-2-4.5-5-4.5"/></svg>),
  megaphone:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11v2a2 2 0 0 0 2 2h2l6 5V4l-6 5H5a2 2 0 0 0-2 2z"/><path d="M17 8a5 5 0 0 1 0 8"/></svg>),
  shield:   (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/></svg>),
  star:     (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2.5 6 6.5.6-5 4.5 1.5 6.5L12 17l-5.5 3.6L8 14.1l-5-4.5 6.5-.6z"/></svg>),
  camera:   (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 7l2-3h4l2 3"/></svg>),
  chat:     (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 12z"/></svg>),
  check:    (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10"/></svg>),
};

const BENEFITS = [
  { icon: Ic.users,     title: "高端用户人群",     desc: "平台面向成熟、真实、有消费能力的用户,减少无效社交和低质量打扰。" },
  { icon: Ic.megaphone, title: "更多曝光机会",     desc: "sugargirl 主页 · 动态推荐 · Sugargirl 列表 · 视频专区 · 社区推荐等多入口曝光。" },
  { icon: Ic.shield,    title: "安全验证体系",     desc: "身份认证 · 手机认证 · 邮箱认证 · 真人识别 · 安全见面认证等机制,降低风险。" },
  { icon: Ic.star,      title: "个人主页包装",     desc: "以更高级的方式展示头像 · 封面 · 简介 · 兴趣 · 服务和内容。" },
  { icon: Ic.camera,    title: "免费写真与视频",   desc: "符合条件的 sugargirl 可获得平台支持的免费写真与短视频拍摄,用于主页展示。" },
  { icon: Ic.chat,      title: "多种转化入口",     desc: "聊天 · 视频 · 私拍 · 预约 · 打赏 · 会员内容等多种互动方式。" },
];

const AUDIENCE = [
  { k: "真实认证用户",   v: "真实资料审核 · 减少小号骚扰" },
  { k: "高意向访问",     v: "有明确意愿的高质量访问" },
  { k: "成熟用户群体",   v: "更成熟、更尊重边界的用户群体" },
  { k: "尊重隐私",       v: "重视隐私 · 尊重 sugargirl 边界" },
  { k: "会员优先",       v: "会员用户优先推荐" },
  { k: "安全通信",       v: "反诈骗 · 举报拉黑等安全机制" },
  { k: "18+ 年龄认证",   v: "年龄验证 · 严格准入" },
  { k: "精选高质增长",   v: "持续增长的高意向用户群体" },
];

const SHOOT_STEPS = [
  { n: "01", title: "形象定位", desc: "确认你的风格 · 城市 · 语言 · 兴趣与主页定位,由平台内容顾问对接。" },
  { n: "02", title: "内容拍摄", desc: "提供写真与短视频拍摄支持,帮助主页更有质感和电影感。" },
  { n: "03", title: "主页上线", desc: "生成完整 sugargirl 主页,进入 Sugargirl 频道推荐与曝光流量池。" },
];

const SAFETY_TAGS = [
  { label: "18+ 年龄认证" },
  { label: "身份审核" },
  { label: "手机认证" },
  { label: "邮箱认证" },
  { label: "真人识别" },
  { label: "安全见面" },
  { label: "隐私优先" },
  { label: "举报与拉黑" },
];

const PROCESS = [
  { n: "01", t: "提交基础资料", d: "昵称 · 城市 · 年龄 · 语言 · 兴趣 · 个人介绍" },
  { n: "02", t: "安全验证",     d: "确认 18+ · 联系方式 · 资料真实性" },
  { n: "03", t: "主页内容",     d: "上传头像 · 封面 · 照片 · 视频,或申请平台拍摄支持" },
  { n: "04", t: "审核通过上线", d: "主页进入 Sugargirl 频道公开展示" },
  { n: "05", t: "曝光与互动",   d: "通过主页 · 动态 · 推荐 · 视频 · 社区获得关注" },
];

const FAQS = [
  { q: "入驻需要费用吗?", a: "基础入驻不收取费用。符合条件的 sugargirl 还可以申请平台写真与视频拍摄支持。" },
  { q: "我必须公开真实姓名吗?", a: "不需要。公开主页展示的是你选择展示的昵称和资料,敏感信息不会公开。" },
  { q: "平台会审核用户吗?", a: "我们会逐步完善用户验证、举报和安全机制,努力减少低质量和不真实互动。" },
  { q: "拍摄支持是免费的吗?", a: "符合条件的 sugargirl 可申请平台支持的写真或短视频拍摄,具体安排以审核后沟通为准。" },
  { q: "我可以控制展示哪些信息吗?", a: "可以。你的公开主页只展示你同意展示的内容。敏感资料在后台自持,不会公开。" },
  { q: "入驻后一定会有收益吗?", a: "平台提供曝光 · 主页展示和互动工具,实际结果取决于个人资料完整度、内容质量、用户互动和平台审核机制。平台不承诺固定收益。" },
  { q: "我可以之后退出吗?", a: "可以随时申请关闭或隐藏主页,平台会提供对应的账号和资料处理方式。" },
];

export default function ApplyPage() {
  const heroBg = pick(0, 5) ?? "/images/placeholder.png";
  const narrativeImg = pick(2, 0) ?? "/images/placeholder.png";
  const shootImgs = [
    pick(0, 12) ?? "/images/placeholder.png",
    pick(1, 8)  ?? "/images/placeholder.png",
    pick(2, 4)  ?? "/images/placeholder.png",
  ];
  const previewCover = pick(0, 3) ?? "/images/placeholder.png";

  return (
    <InterestDialogProvider>
      {/* ═══ 1. Hero · 恢复原 .ap-hero 结构 · 桌面用旧图 · 移动用竖版新图 · <picture> 分发 ═══ */}
      <section className="ap-hero">
        <div className="ap-hero-media">
          <picture>
            <source media="(max-width: 767px)" srcSet="/images/apply/sugargirl-recruitment-mobile.png" />
            <img src={heroBg} alt="" loading="eager" fetchPriority="high" decoding="async" />
          </picture>
        </div>
        <div className="ap-hero-veil" />
        <div className="ap-hero-inner">
          <div className="ap-hero-badges">
            <span className="ap-hero-badge">18+ sugargirl 入驻申请</span>
            <span className="ap-hero-badge">高端认证社区</span>
            <span className="ap-hero-badge">隐私优先</span>
          </div>
          <div className="ap-hero-eye">SUGARDATING GLOBAL RECRUITMENT</div>
          <h1 className="ap-hero-title">Sugargirl全球招募计划</h1>
          <p className="ap-hero-sub">
            加入 Sugargirl 全球招募计划 · 留下昵称、所在城市和你常用的社交联系方式,
            Sugardating 团队会与你沟通后续入驻安排。
          </p>
          <div className="ap-hero-cta">
            <InterestTrigger source="hero_apply" className="ap-btn-primary">提交入驻意向</InterestTrigger>
            <a href="#benefits" className="ap-btn-ghost">了解平台优势</a>
          </div>
        </div>
      </section>

      {/* ═══ 1.5 意向资料收集 ═══ Hero 下方 · 页面主转化模块 */}
      <CreatorInterestSection />

      {/* ═══ 2. Narrative ═══ */}
      <section className="ap-sec">
        <div className="ap-narrative">
          <div>
            <div className="ap-eye">你的故事</div>
            <h2 className="ap-h2">你不缺被看见,<br />缺的是被更好地看见</h2>
            <p className="ap-lead">
              很多平台只让人停留在照片表面。Sugardating 更关注完整的你 —— 气质 · 生活方式 · 语言 · 城市 ·
              兴趣 · 服务和你自己定义的边界。我们帮助你把个人形象做成一个真正有吸引力的 sugargirl 主页,
              而不是一张普通资料卡。
            </p>
          </div>
          <div className="ap-narrative-img"><Img src={narrativeImg} alt="" sizes="(max-width:900px) 100vw, 560px" /></div>
        </div>
      </section>

      {/* ═══ 3. Benefits ═══ */}
      <section id="benefits" className="ap-sec" style={{ paddingTop: 48 }}>
        <div className="ap-eye">为什么选择 Sugardating</div>
        <h2 className="ap-h2">为什么选择我们</h2>
        <p className="ap-lead">六个核心价值,让你的每一分投入都被认真回应。</p>
        <div className="ap-benefits">
          {BENEFITS.map((b) => (
            <div key={b.title} className="ap-bcard">
              <div className="ap-bcard-ic">{b.icon}</div>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 4. Audience (dark) ═══ */}
      <section className="ap-dark">
        <div className="ap-sec">
          <div className="ap-eye" style={{ color: "#d4bf95" }}>我们的社区</div>
          <h2 className="ap-h2">我们不追求所有人,只连接更匹配的人</h2>
          <p className="ap-lead">Sugardating 的用户不是随机流量 · 而是更明确 · 更成熟 · 更尊重边界的人群。</p>
          <div className="ap-audience-row">
            {AUDIENCE.map((a) => (
              <div key={a.k} className="ap-a-item">
                <div className="k">{a.k}</div>
                <div className="v">{a.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. Shoot Support ═══ */}
      <section id="shoot-support" className="ap-sec">
        <div className="ap-eye">内容支持</div>
        <h2 className="ap-h2">我们不只给你一个页面,<br />也帮你打造被选择的第一印象</h2>
        <p className="ap-lead">符合条件的入驻 sugargirl,可申请平台支持的免费写真与短视频拍摄。所有素材用于主页展示与内容包装。</p>
        <div className="ap-shoot-grid">
          {SHOOT_STEPS.map((s, i) => (
            <article key={s.n} className="ap-shoot-card">
              <div className="ap-shoot-cover"><Img src={shootImgs[i]} alt="" sizes="(max-width:900px) 100vw, 380px" /></div>
              <div className="ap-shoot-body">
                <div className="ap-shoot-n">第 {s.n} 步</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ═══ 6. Safety (dark) ═══ */}
      <section className="ap-dark">
        <div className="ap-sec">
          <div className="ap-eye" style={{ color: "#d4bf95" }}>安全与隐私</div>
          <h2 className="ap-h2">安全,是我们认真做这件事的底线</h2>
          <p className="ap-lead">
            平台面向 18 岁以上成年人 · 严格审核 sugargirl 与用户资料 · 保护隐私 · 尊重边界 · 反诈骗 · 举报拉黑机制。
          </p>
          <div className="ap-safety-badges">
            {SAFETY_TAGS.map((t) => (
              <div key={t.label} className="ap-sbadge">
                {Ic.check}
                <b>{t.label}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. Profile Preview ═══ */}
      <section className="ap-sec">
        <div className="ap-eye">你的主页</div>
        <h2 className="ap-h2">你将拥有的,不只是资料页,<br />而是一个高级个人主页</h2>
        <p className="ap-lead">动态视频封面 · 头像与认证 · 个人简介 · 基础资料 · 生活方式 · 服务入口 · 作品相册 · 视频展示 · 礼物 · 评价 · 推荐曝光 —— 一体化呈现。</p>
        <div className="ap-preview">
          <div className="ap-preview-frame">
            <div className="ap-preview-hero"><Img src={previewCover} alt="" sizes="(max-width:640px) 100vw, 640px" /></div>
            <div className="ap-preview-row">
              <div className="ap-preview-ava">S</div>
              <div>
                <div className="ap-preview-name">Sugargirl · 已认证</div>
                <div className="ap-preview-sub">新加坡 · 26 · 中文 / English · 旅行博主</div>
              </div>
            </div>
            <div className="ap-preview-chips">
              <span className="ap-preview-chip">旅行</span><span className="ap-preview-chip">摄影</span>
              <span className="ap-preview-chip">咖啡</span><span className="ap-preview-chip">美食</span>
              <span className="ap-preview-chip">Luxury</span>
            </div>
            <div className="ap-preview-cta-row">
              <div className="ap-preview-cta gold">🎁 打赏</div>
              <div className="ap-preview-cta dark">💬 聊天</div>
              <div className="ap-preview-cta ghost">📅 约她</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 8. Process Timeline ═══ */}
      <section className="ap-sec">
        <div className="ap-eye">如何入驻</div>
        <h2 className="ap-h2">入驻很简单,但我们会认真审核</h2>
        <div className="ap-process">
          {PROCESS.map((p) => (
            <div key={p.n} className="ap-step">
              <div className="ap-step-n">{p.n}</div>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 9. 页面底部 CTA ═══ 主转化 = 意向表单弹窗 · 不再直跳分步向导 */}
      <section id="apply-form" className="ap-gate-wrap">
        <div className="ap-form-inner" style={{ textAlign: "center", padding: "48px 20px" }}>
          <div className="ap-eye" style={{ marginBottom: 10 }}>准备好开始</div>
          <h2 className="ap-h2" style={{ marginBottom: 12 }}>留下意向 · 平台联系你</h2>
          <p className="ap-lead" style={{ marginBottom: 24 }}>
            填写基础信息后 · Sugardating 团队会通过你选择的联系方式与你沟通后续入驻安排。
          </p>
          <InterestTrigger source="footer_apply" className="ap-btn-primary">提交入驻意向</InterestTrigger>
        </div>
      </section>

      {/* ═══ 10. FAQ ═══ */}
      <section className="ap-sec">
        <div className="ap-eye">常见问题</div>
        <h2 className="ap-h2">你可能想知道</h2>
        <div className="ap-faq-list">
          {FAQS.map((f, i) => (
            <details key={f.q} className="ap-faq-item" name="apply-faq" open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 32, textAlign: "center" }}>
          Sugardating 面向 18 岁以上成年人 · 遵守当地法律 · 严格审核 · 隐私优先 · 不撮合面对面交易 · 平台不做任何收益承诺。
        </p>
      </section>

      {/* ═══ 11. 悬浮双 CTA ═══ 全部由 InterestDialogProvider 承载 · 见页面外层 wrapper */}
      <ApplyFloatingCTAs />
    </InterestDialogProvider>
  );
}
