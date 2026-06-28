import Placeholder from "./Placeholder";
import { Work } from "@/lib/types";

export default function WorkTile({ w, video = false }: { w: Work; video?: boolean }) {
  return (
    <div className="tile">
      <Placeholder label={`作品图 占位\n${w.title}`} fill />
      {video && (
        <span className="tile-play" aria-label="视频作品">
          <svg viewBox="0 0 24 24" aria-hidden><path d="M8 5v14l11-7z" /></svg>
        </span>
      )}
      <div className="m"><b>{w.title}</b><span>{w.author} · {w.category}</span></div>
    </div>
  );
}
