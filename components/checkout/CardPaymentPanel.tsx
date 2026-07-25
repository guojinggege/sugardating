"use client";
// Card 面板 · 生产接入时:此处渲染 provider 的托管 iframe / hosted element
// Sugardating 服务器不接收/存储完整卡号 · 只由 provider 处理
export default function CardPaymentPanel({ provider }: { provider?: string }) {
  return (
    <div className="cp">
      <div className="cp-hosted">
        <p>
          <b>银行卡由 {provider ? provider.toUpperCase() : "已审核收单机构"} 托管处理</b>
        </p>
        <p>
          Sugardating 不接收也不存储完整卡号 · CVV 不落库 · 3D Secure / SCA 由支付商完成。
        </p>
        <p>接入真实 provider 后 · 此处将嵌入 provider 的 hosted card element。</p>
      </div>
      <style>{`
        .cp{display:flex;flex-direction:column;gap:10px}
        .cp-hosted{padding:16px 18px;background:#FBFAF7;border:1px dashed #E9E3DA;border-radius:12px;font-size:12.5px;color:#3d3a35;line-height:1.7}
        .cp-hosted b{font-weight:800;color:#171512}
      `}</style>
    </div>
  );
}
