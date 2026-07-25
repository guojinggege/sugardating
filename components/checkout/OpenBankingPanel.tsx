"use client";
export default function OpenBankingPanel({ redirectUrl }: { redirectUrl?: string }) {
  return (
    <div className="ob">
      <p>你将跳转到银行选择器 · 在银行 App 中完成 Faster Payments 确认 · 平均 1 分钟内到账</p>
      <ul>
        <li>选择你的英国银行 (HSBC · Barclays · Lloyds · NatWest · Monzo · Starling …)</li>
        <li>在银行 App 中确认付款金额与收款人</li>
        <li>返回本页 · 我们会通过 Provider 确认到账后更新订单</li>
      </ul>
      {redirectUrl && (
        <a href={redirectUrl} className="ob-cta" target="_self">前往银行选择器 →</a>
      )}
      <p className="ob-fine">本方式当前不自动续费 · 到期后需手动重新支付</p>
      <style>{`
        .ob{display:flex;flex-direction:column;gap:12px}
        .ob p{margin:0;font-size:13px;color:#3d3a35;line-height:1.65}
        .ob ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;font-size:12.5px;color:#77716A}
        .ob li{padding:8px 12px;background:#FBFAF7;border:1px solid #E9E3DA;border-radius:8px;line-height:1.55}
        .ob-cta{align-self:flex-start;padding:12px 22px;background:#171512;color:#fff;border-radius:99px;font-size:13.5px;font-weight:800;text-decoration:none}
        .ob-cta:hover{background:#2b2822}
        .ob-fine{margin:0;font-size:11.5px;color:#a19a91;font-style:italic}
      `}</style>
    </div>
  );
}
