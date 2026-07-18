import Link from "next/link";

interface Props {
  kind: "story" | "question";
  returnTo?: string;
}

export default function CommunityLoginGate({ kind, returnTo }: Props) {
  const isStory = kind === "story";
  const rt = returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : "";
  return (
    <div className="lg">
      <div className="lg-eye">{isStory ? "STORY COMPOSER" : "QUESTION COMPOSER"}</div>
      <h2 className="lg-h">{isStory ? "讲一个故事" : "提一个问题"}</h2>
      <p className="lg-sub">
        {isStory
          ? "分享经历、心事、反转或关系观察 —— 那些不方便对熟人说的话,可以在这里被听见。"
          : "向社区寻求回答与建议 —— 提出清晰、可被搜索的问题,让不同人的经验汇聚起来。"}
      </p>

      <div className="lg-preview">
        <div className="lg-preview-h">发布前你需要</div>
        <ul>
          <li>登录 Sugardating 账户 · 支持匿名身份</li>
          <li>确认 18+ 与社区规则</li>
          <li>移除任何可识别真实身份的信息 (真名、电话、地址、公司)</li>
          {!isStory && <li>写成清晰、可以被搜索和回答的问题</li>}
        </ul>
      </div>

      <div className="lg-cta">
        <Link href={`/login${rt}`} className="lg-btn lg-btn--dark">登录后发布</Link>
        <Link href="/register" className="lg-btn lg-btn--ghost">注册新账号</Link>
      </div>

      <p className="lg-fine">
        Composer 完整表单开发中 · 登录后将进入草稿 / 预览 / 发布流程 · 所有内容需经审核后公开。
      </p>

      <style>{`
        .lg{background:#fff;border:1px solid #E9E3DA;border-radius:20px;padding:36px 40px;max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
        .lg-eye{font-size:11px;letter-spacing:.24em;color:#C5A56A;font-weight:700}
        .lg-h{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-weight:500;font-size:36px;color:#171512;letter-spacing:-0.015em;margin:0}
        .lg-sub{font-size:15px;line-height:1.7;color:#3d3a35;margin:0 0 6px;max-width:60ch}
        .lg-preview{background:#F7F4EF;border:1px dashed #E9E3DA;border-radius:14px;padding:14px 18px}
        .lg-preview-h{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#77716A;font-weight:700;margin-bottom:6px}
        .lg-preview ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px;font-size:13px;color:#3d3a35;line-height:1.6}
        .lg-preview li:before{content:"·";margin-right:8px;color:#C5A56A;font-weight:800}
        .lg-cta{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}
        .lg-btn{display:inline-flex;align-items:center;padding:12px 22px;border-radius:999px;font-size:13.5px;font-weight:700;text-decoration:none;letter-spacing:-0.005em;transition:transform .12s}
        .lg-btn--dark{background:#171512;color:#F5EEDD}
        .lg-btn--dark:hover{transform:translateY(-1px)}
        .lg-btn--ghost{background:#F7F4EF;color:#171512;border:1px solid #E9E3DA}
        .lg-fine{font-size:11.5px;color:#a19a91;margin:8px 0 0;line-height:1.55}
      `}</style>
    </div>
  );
}
