import FilterBar from "./FilterBar";
import CreatorGrid from "./CreatorGrid";
import { Creator } from "@/lib/types";

export default function ChannelListing({
  eyebrow, title, desc, items, chips, photos,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  items: Creator[];
  chips?: string[];
  photos?: string[];
}) {
  return (
    <div className="container">
      <div className="chero">
        <div className="ey">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      <FilterBar chips={chips} />
      {items.length === 0 ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "var(--muted)" }}>暂无创作者</div>
      ) : (
        <CreatorGrid items={items} photos={photos} />
      )}
      <div style={{ height: 40 }} />
    </div>
  );
}
