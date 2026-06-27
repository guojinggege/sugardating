import Placeholder from "./Placeholder";
import { Work } from "@/lib/types";
export default function WorkTile({ w }: { w: Work }) {
  return (
    <div className="tile">
      <Placeholder label={`作品图 占位\n${w.title}`} fill />
      <div className="m"><b>{w.title}</b><span>{w.author} · {w.category}</span></div>
    </div>
  );
}
