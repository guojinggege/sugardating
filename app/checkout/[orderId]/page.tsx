// /checkout/[orderId] · 主 Checkout 页
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { getOrder } from "@/lib/payments/repository";
import { listAvailableMethods } from "@/lib/payments/config";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Checkout · Sugardating",
  robots: { index: false, follow: false },
};

function isMockAllowed(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.PAYMENTS_ALLOW_MOCK === "true";
}

export default function CheckoutPage({ params }: { params: { orderId: string } }) {
  const s = getSession();
  if (!s) redirect(`/login?next=/checkout/${params.orderId}`);

  const order = getOrder(params.orderId);
  if (!order || order.userId !== s.userId) notFound();

  // Terminal states → redirect to status page
  if (order.status === "paid")     redirect(`/checkout/${params.orderId}/success`);
  if (order.status === "failed")   redirect(`/checkout/${params.orderId}/failed`);
  if (order.status === "expired" || order.status === "cancelled") redirect(`/checkout/${params.orderId}/failed`);

  const methods = listAvailableMethods({ orderType: "one_off" });

  return (
    <CheckoutClient
      initialOrder={order}
      availableMethods={methods}
      isMockAllowed={isMockAllowed()}
    />
  );
}
