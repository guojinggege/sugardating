import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { getOrder } from "@/lib/payments/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata: Metadata = { title: "付款失败 · Sugardating", robots: { index: false, follow: false } };

export default function Page({ params }: { params: { orderId: string } }) {
  const s = getSession();
  if (!s) redirect(`/login?next=/checkout/${params.orderId}/failed`);
  const o = getOrder(params.orderId);
  if (!o || o.userId !== s.userId) notFound();

  const label = o.status === "expired" ? "订单已过期" : o.status === "cancelled" ? "付款已取消" : "付款失败";
  const backHref = o.type === "membership" ? "/membership" : "/membership#credits";

  return (
    <div className="fx">
      <div className="fx-shell">
        <div className="fx-ic">×</div>
        <h1>{label}</h1>
        <p>没有产生扣款 · 你可以重新选择支付方式或联系客服。</p>
        <div className="fx-cta">
          <Link href={backHref} className="fx-btn fx-btn--dark">重新购买</Link>
          <Link href="/me/reports/new" className="fx-btn fx-btn--ghost">联系客服</Link>
        </div>
      </div>
      <style>{`
        .fx{background:#F7F4EF;min-height:100vh;display:grid;place-items:center;padding:24px}
        .fx-shell{max-width:480px;background:#fff;border:1px solid #E9E3DA;border-radius:24px;padding:44px 40px;text-align:center}
        .fx-ic{width:60px;height:60px;background:#F1E1E4;color:#8C4B54;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;margin-bottom:16px}
        .fx-shell h1{font-family:'Cormorant Garamond',ui-serif;font-style:italic;font-size:32px;font-weight:600;color:#171512;margin:0 0 8px}
        .fx-shell p{font-size:13.5px;color:#3d3a35;margin:0 0 20px;line-height:1.7}
        .fx-cta{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
        .fx-btn{padding:10px 20px;border-radius:99px;font-size:13px;font-weight:800;text-decoration:none}
        .fx-btn--dark{background:#171512;color:#fff}
        .fx-btn--ghost{background:#F7F4EF;color:#171512;border:1px solid #E9E3DA}
      `}</style>
    </div>
  );
}
