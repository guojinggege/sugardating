// Admin · 新建 Journal 文章
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { cmsRepo } from "@/lib/cms/repository";
import JournalEditor from "@/components/admin/JournalEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "New Journal Post · Admin" };

export default function AdminJournalNewPage() {
  const categories = cmsRepo.listCategories();
  return (
    <>
      <AdminPageHeader
        eyebrow="Journal"
        title="新建文章"
        description="填写标题、slug、正文块。可保存草稿或直接发布。"
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Journal", href: "/admin/journal/posts" },
          { label: "New" },
        ]}
      />
      <JournalEditor categories={categories} isNew />
    </>
  );
}
