// Sugargirl 入驻向导 · /apply/start
// 9 步分段填写 · 客户端 wizard 组件负责 auth gate + draft 自动保存
import type { Metadata } from "next";
import ApplyWizard from "@/components/ApplyWizard/ApplyWizard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "创建你的 sugargirl 主页 · Sugargirl Onboarding · Sugardating",
  description: "9 步分段填写:基础身份、主页介绍、外貌资料、生活方式、兴趣爱好、服务设置、照片上传、视频上传、认证与提交。支持保存草稿。",
};

interface Props {
  searchParams: { resume?: string };
}

export default function ApplyStartPage({ searchParams }: Props) {
  return <ApplyWizard resume={searchParams.resume === "1"} />;
}
