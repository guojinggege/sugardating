import FilterBar from "@/components/FilterBar";
import CreatorGrid from "@/components/CreatorGrid";
import { listCreators } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const creators = await listCreators();
  return (
    <div className="container">
      <div className="chero"><div className="ey">目录</div><h1>发现创作者</h1><p>按地区、分类、排序浏览全部创作者。</p></div>
      <FilterBar />
      <CreatorGrid items={creators} />
      <div style={{ height: 40 }} />
    </div>
  );
}
