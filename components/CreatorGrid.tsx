import CreatorCard from "./CreatorCard";
import { Creator } from "@/lib/types";

export default function CreatorGrid({ items, photos }: { items: Creator[]; photos?: string[] }) {
  const n = photos?.length ?? 0;
  return (
    <div className="grid">
      {items.map((c, i) => (
        <CreatorCard
          key={c.slug}
          c={c}
          photoSrc={n > 0 ? photos![i % n] : undefined}
        />
      ))}
    </div>
  );
}
