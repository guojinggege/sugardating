// Admin · 新建 Journal 文章 · 支持 ?mode=import 从笔记直接导入
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { cmsRepo } from "@/lib/cms/repository";
import JournalEditor from "@/components/admin/JournalEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "新建文章 · Journal · Admin" };

export default function AdminJournalNewPage({ searchParams }: { searchParams?: { mode?: string } }) {
  const categories = cmsRepo.listCategories();
  const showImportInitially = searchParams?.mode === "import";
  return (
    <>
      <AdminPageHeader
        eyebrow="Journal"
        title="新建文章"
        description={
          showImportInitially
            ? "从笔记生成 · 粘贴小红书笔记 → 一键写入正文 → 继续编辑 → 保存草稿。生成结果直接进入下方编辑器,不允许跳过人工确认。"
            : "填写标题、摘要、正文块。可切换到「从笔记导入」快速产文;也可直接手动撰写。"
        }
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Journal", href: "/admin/journal/posts" },
          { label: "New" },
        ]}
      />
      <JournalEditor categories={categories} isNew showImportInitially={showImportInitially} />
    </>
  );
}
