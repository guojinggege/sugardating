// 6 channel entry cards — large image + gradient + hover lift
import Link from "next/link";
import Img from "@/components/Img";
import { pick } from "@/lib/images";

interface Channel {
  key: string; title: string; en: string; desc: string;
  cta: string; href: string; img: string; badge?: string;
}

export default function ChannelMatrix() {
  const channels: Channel[] = [
    { key: "sugargirl", title: "Sugargirl", en: "Female Creators", desc: "浏览已认证的高质量女性 Creator,查看照片、视频、服务入口和在线状态,发起私密聊天或解锁更多内容。", cta: "浏览 Sugargirls", href: "/male-artists", img: pick(1, 3) ?? "" },
    { key: "sugarboy",  title: "Sugarboy",  en: "Male Creators",   desc: "发现高质量男性 Creator,适合聊天、视频、商务陪同、旅行陪伴与高端活动场景。", cta: "浏览 Sugarboys",  href: "/sugarboy",     img: "/sugarboy/profile_photo.avif", badge: "NEW" },
    { key: "massage",   title: "情趣按摩",  en: "Sensual Massage", desc: "浏览 18+ 高端私密按摩与放松体验服务者,按城市、语言、认证、在线状态和预约方式筛选。", cta: "探索按摩频道",   href: "/massage",      img: pick(5, 13) ?? "" },
    { key: "events",    title: "高端活动定制", en: "Premium Events", desc: "游艇派对、高端酒会、私人拍摄、商务伴游、会员俱乐部之夜 — 提交需求由平台按场景推荐合适的 sugargirl。", cta: "提交定制需求", href: "/art-services", img: pick(9, 19) ?? "" },
    { key: "videos",    title: "视频专区",  en: "Video Directory", desc: "通过短视频、介绍视频和视频资料更快判断真实感与匹配度。", cta: "查看视频",        href: "/video",        img: pick(13, 27) ?? "" },
    { key: "journal",   title: "Sugardating Journal", en: "Content Hub", desc: "高端男性关系、伦敦生活方式、隐私安全、跨文化沟通与平台使用指南。", cta: "阅读 Journal", href: "/community",   img: pick(17, 37) ?? "" },
  ];

  return (
    <section id="channels" className="hv-cm" aria-label="Choose a channel">
      <div className="hv-cm-in">
        <div className="hv-cm-head">
          <div className="hv-cm-eyebrow">Choose Your Scenario</div>
          <h2>选择你想进入的高端场景</h2>
          <p>不同需求,对应不同频道 — 你可以浏览个人主页,也可以提交活动需求,由平台推荐合适的对象。</p>
        </div>
        <div className="hv-cm-grid">
          {channels.map((c) => (
            <Link key={c.key} href={c.href} className="hv-cm-card">
              <div className="hv-cm-media">
                <Img src={c.img} alt={c.title} sizes="(max-width:900px) 100vw, 420px" />
                <div className="hv-cm-veil" />
                {c.badge && <span className="hv-cm-badge">{c.badge}</span>}
              </div>
              <div className="hv-cm-body">
                <div className="hv-cm-en">{c.en}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <span className="hv-cm-cta">{c.cta} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .hv-cm{background:#0F0F11;color:#EEDDB8;padding:80px 0}
        .hv-cm-in{max-width:1280px;margin:0 auto;padding:0 24px}
        .hv-cm-head{max-width:64ch;margin-bottom:40px}
        .hv-cm-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:14px}
        .hv-cm-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:40px;font-style:italic;font-weight:500;line-height:1.2;color:#fff;margin:0 0 12px;letter-spacing:-0.01em}
        .hv-cm-head p{font-size:15.5px;line-height:1.75;color:rgba(238,221,184,.7);margin:0}
        .hv-cm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .hv-cm-card{position:relative;display:flex;flex-direction:column;background:#181818;border:1px solid rgba(238,221,184,.12);border-radius:22px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .22s,border-color .22s,box-shadow .22s}
        .hv-cm-card:hover{transform:translateY(-4px);border-color:rgba(238,221,184,.4);box-shadow:0 28px 56px -24px rgba(0,0,0,.6)}
        .hv-cm-media{position:relative;aspect-ratio:5/4;overflow:hidden;background:#0a0a0c}
        .hv-cm-media img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease-out}
        .hv-cm-card:hover .hv-cm-media img{transform:scale(1.06)}
        .hv-cm-veil{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(15,15,17,.75));pointer-events:none}
        .hv-cm-badge{position:absolute;top:12px;right:12px;padding:4px 10px;background:#EEDDB8;color:#1a1409;font-size:10.5px;font-weight:800;letter-spacing:.06em;border-radius:99px}
        .hv-cm-body{padding:22px 24px 24px;display:flex;flex-direction:column;gap:8px;flex:1}
        .hv-cm-en{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:#B8A789;font-weight:700}
        .hv-cm-body h3{font-family:'Cormorant Garamond',ui-serif;font-size:26px;font-style:italic;font-weight:500;color:#fff;margin:0;letter-spacing:-0.005em}
        .hv-cm-body p{font-size:13.5px;line-height:1.7;color:rgba(255,255,255,.72);margin:0;flex:1}
        .hv-cm-cta{margin-top:8px;font-size:13px;font-weight:700;color:#EEDDB8;letter-spacing:.02em}
        @media (max-width:1024px){.hv-cm-grid{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:640px){
          .hv-cm{padding:60px 0}
          .hv-cm-head h2{font-size:28px}
          .hv-cm-grid{grid-template-columns:1fr;gap:14px}
          .hv-cm-body{padding:18px 20px 20px}
          .hv-cm-body h3{font-size:22px}
        }
      `}</style>
    </section>
  );
}
