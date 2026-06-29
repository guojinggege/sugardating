import FilterBar from "@/components/FilterBar";
import CreatorGrid from "@/components/CreatorGrid";
import { listCreators } from "@/lib/queries";
import { photos } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: { region?: string } }) {
  const region = typeof searchParams.region === "string" ? searchParams.region : undefined;
  const creators = await listCreators({ region });
  return (
    <div className="container">
      <div className="chero">
        <div className="ey">目录</div>
        <h1>发现创作者</h1>
        <p>{region ? `${region} · 共 ${creators.length} 位` : "按地区、分类、排序浏览全部创作者。"}</p>
      </div>
      <FilterBar />
      {creators.length === 0 ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "var(--muted)" }}>
          {region ? `${region} 暂无创作者` : "暂无创作者"}
        </div>
      ) : (
        <CreatorGrid items={creators} photos={photos} />
      )}
      <div style={{ height: 40 }} />
    </div>
  );
}
