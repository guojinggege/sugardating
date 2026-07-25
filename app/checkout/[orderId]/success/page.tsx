import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { getOrder } from "@/lib/payments/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata: Metadata = { title: "付款成功 · Sugardating", robots: { index: false, follow: false } };

export default function Page({ params }: { params: { orderId: string } }) {
  const s = getSession();
  if (!s) redirect(`/login?next=/checkout/${params.orderId}/success`);
  const o = getOrder(params.orderId);
  if (!o || o.userId !== s.userId) notFound();

  const cta = o.type === "membership"
    ? { label: "查看会员中心 →", href: "/me?section=membership" }
    : { label: "查看钱包 →", href: "/me?section=wallet" };

  return (
    <div className="ok">
      <div className="ok-shell">
        <div className="ok-ic">✓</div>
        <h1>付款成功</h1>
        <p>{o.productName} 已开通。你可以立即使用相应权益。</p>
        <div className="ok-facts">
          <div><b>Order</b><code>{o.reference}</code></div>
          <div><b>金额</b><span>£{(o.amount / 100).toFixed(2)}</span></div>
        </div>
        <div className="ok-cta">
          <Link href={cta.href} className="ok-btn ok-btn--gold">{cta.label}</Link>
          <Link href="/" className="ok-btn ok-btn--ghost">返回首页</Link>
        </div>
      </div>
      <style>{`
        .ok{background:#F7F4EF;min-height:100vh;display:grid;place-items:center;padding:24px}
        .ok-shell{max-width:520px;background:#fff;border:1px solid #E9E3DA;border-radius:24px;padding:44px 40px;text-align:center;box-shadow:0 30px 80px -40px rgba(15,23,42,.2)}
        .ok-ic{width:64px;height:64px;background:linear-gradient(135deg,#8FE3B7,#42856B);color:#fff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;margin-bottom:20px}
        .ok-shell h1{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:36px;font-weight:600;color:#171512;margin:0 0 8px}
        .ok-shell > p{font-size:14px;color:#3d3a35;margin:0 0 20px;line-height:1.7}
        .ok-facts{display:flex;justify-content:center;gap:14px;margin-bottom:24px;flex-wrap:wrap}
        .ok-facts > div{display:flex;flex-direction:column;padding:8px 14px;background:#FBFAF7;border:1px dashed #E9E3DA;border-radius:10px;text-align:left}
        .ok-facts b{font-size:10.5px;letter-spacing:.14em;color:#77716A;text-transform:uppercase;font-weight:800}
        .ok-facts code{font-family:ui-monospace,monospace;font-size:12.5px;color:#171512;font-weight:700}
        .ok-facts span{font-size:14px;color:#171512;font-weight:700}
        .ok-cta{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
        .ok-btn{padding:12px 22px;border-radius:99px;font-size:13.5px;font-weight:800;text-decoration:none}
        .ok-btn--gold{background:linear-gradient(135deg,#EEDDB8,#B8A789);color:#1a1409}
        .ok-btn--ghost{background:#F7F4EF;color:#171512;border:1px solid #E9E3DA}
      `}</style>
    </div>
  );
}
