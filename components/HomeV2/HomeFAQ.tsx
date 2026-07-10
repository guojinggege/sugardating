// Homepage FAQ — 10 questions accordion
export default function HomeFAQ() {
  const qs = [
    { q: "Sugardating 是什么?", a: "Sugardating 是一个面向 18+ 成年用户的高端私密社交与 Creator 平台。你可以浏览 Sugargirls、Sugarboys、情趣按摩服务者,使用私密聊天、视频资料、金币解锁、预约、打赏与定制服务完成高质量社交。" },
    { q: "Sugargirl 和 Sugarboy 有什么区别?", a: "内容和结构完全一致 — Sugargirl 是女性 Creator 频道,Sugarboy 是男性 Creator 频道。共享同一套聊天、翻译、解锁、预约、认证与安全体系。" },
    { q: "情趣按摩频道是什么?", a: "18+ 高端私密按摩与放松体验目录 · Sensual massage / wellness companion 定位。所有服务者经身份认证,支持视频介绍与站内预约。" },
    { q: "定制服务如何工作?", a: "你提交活动场景(游艇派对/酒会/私拍/商务伴游/俱乐部之夜)、城市、时间、语言、预算与偏好,平台根据条件推荐 3-5 位候选。" },
    { q: "聊天是否需要金币?", a: "不需要。已登录用户点击任意 Creator 的聊天按钮即可立即打开聊天窗口,支持 5 种语言之间的自动翻译。" },
    { q: "什么内容需要 Credits 解锁?", a: "部分私密照片、高清视频和 VIP 内容需要 Credits 解锁,一次解锁永久可看。免费预览与公开资料不需要 Credits。" },
    { q: "平台如何保护隐私?", a: "站内聊天不暴露真实手机号,未解锁高清内容不会进入 DOM,支持身份认证、视频认证、举报与拉黑机制。所有 Credits 消费均在钱包账本,可追溯。" },
    { q: "如何判断资料是否真实?", a: "认证徽章 (Verified) 表示身份核验通过;视频徽章 (Video) 表示上传了自我介绍视频;先看视频再决定投入注意力,是最高效的筛选。" },
    { q: "是否支持多语言?", a: "支持中文、英文、泰语、越南语、菲律宾语。聊天支持任意两种语言之间的自动翻译。" },
    { q: "如何申请成为 sugargirl?", a: "访问「我要入驻」页面提交申请,通过资料审核与视频认证后即可发布主页,并可预约免费写真支持。" },
  ];
  return (
    <section className="hv-fq" aria-label="Frequently asked questions">
      <div className="hv-fq-in">
        <div className="hv-fq-head">
          <div className="hv-fq-eyebrow">FAQ</div>
          <h2>关于 Sugardating</h2>
        </div>
        <div className="hv-fq-list">
          {qs.map((it, i) => (
            <details key={i} className="hv-fq-item">
              <summary>{it.q}</summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
      <style>{`
        .hv-fq{background:#FBFAF7;padding:80px 0}
        .hv-fq-in{max-width:900px;margin:0 auto;padding:0 24px}
        .hv-fq-head{margin-bottom:28px;text-align:center}
        .hv-fq-eyebrow{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#B8A789;font-weight:700;margin-bottom:12px}
        .hv-fq-head h2{font-family:'Cormorant Garamond',ui-serif;font-size:36px;font-style:italic;font-weight:500;color:#161618;margin:0;letter-spacing:-0.01em}
        .hv-fq-list{display:flex;flex-direction:column;background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden}
        .hv-fq-item{border-bottom:1px solid var(--line);padding:20px 24px;transition:background .12s}
        .hv-fq-item:last-child{border-bottom:0}
        .hv-fq-item[open]{background:#FBFAF7}
        .hv-fq-item summary{cursor:pointer;font-size:15.5px;font-weight:700;color:#161618;list-style:none;padding-right:32px;position:relative;letter-spacing:-0.003em}
        .hv-fq-item summary::-webkit-details-marker{display:none}
        .hv-fq-item summary::after{content:"+";position:absolute;right:0;top:-3px;font-size:24px;color:#B8A789;line-height:1;font-weight:400;transition:transform .2s}
        .hv-fq-item[open] summary::after{content:"−";transform:rotate(0)}
        .hv-fq-item p{margin:12px 0 0;font-size:14.5px;line-height:1.75;color:#3d3d42;max-width:74ch}
        @media (max-width:640px){
          .hv-fq{padding:60px 0}
          .hv-fq-item{padding:18px 20px}
          .hv-fq-item summary{font-size:15px}
        }
      `}</style>
    </section>
  );
}
