import Img from "./Img";
import Placeholder from "./Placeholder";
import { Work } from "@/lib/types";

export default function WorkTile({
  w,
  video = false,
  photoSrc,
}: {
  w: Work;
  video?: boolean;
  photoSrc?: string;
}) {
  return (
    <div className="tile">
      {photoSrc
        ? <Img src={photoSrc} alt={w.title} sizes="(max-width: 860px) 50vw, 20vw" />
        : <Placeholder label={`作品图 占位\n${w.title}`} fill />}
      {video && (
        <span className="tile-play" aria-label="视频作品">
          <svg viewBox="0 0 24 24" aria-hidden><path d="M8 5v14l11-7z" /></svg>
        </span>
      )}
      <div className="m"><b>{w.title}</b><span>{w.author} · {w.category}</span></div>
    </div>
  );
}
