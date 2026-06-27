import CreatorCard from "./CreatorCard";
import { Creator } from "@/lib/types";
export default function CreatorGrid({ items }: { items: Creator[] }) {
  return <div className="grid">{items.map((c) => <CreatorCard key={c.slug} c={c} />)}</div>;
}
