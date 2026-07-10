// Admin · 编辑 Journal 文章 · [id] 即 slug
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPrimitives";
import { cmsRepo } from "@/lib/cms/repository";
import JournalEditor from "@/components/admin/JournalEditor";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = cmsRepo.getJournalPost(params.id);
  return { title: `${post?.title ?? "Edit"} · Journal · Admin` };
}

export default function AdminJournalEditPage({ params }: { params: { id: string } }) {
  const post = cmsRepo.getJournalPost(params.id);
  if (!post) notFound();
  const categories = cmsRepo.listCategories();
  return (
    <>
      <AdminPageHeader
        eyebrow="Journal"
        title="编辑文章"
        description={post.title}
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Journal", href: "/admin/journal/posts" },
          { label: post.title },
        ]}
      />
      <JournalEditor post={post} categories={categories} />
    </>
  );
}
