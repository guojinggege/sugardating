import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
// Processing 状态 · 让主 checkout 页面自己轮询 · 直接回到主页
export default function Page({ params }: { params: { orderId: string } }) {
  redirect(`/checkout/${params.orderId}`);
}
