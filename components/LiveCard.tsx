import Link from "next/link";
import Img from "./Img";
import Placeholder from "./Placeholder";
import { LiveItem } from "@/lib/types";

export default function LiveCard({ l, photoSrc }: { l: LiveItem; photoSrc?: string }) {
  return (
    <Link href={`/creators/${l.slug}`} className="lcard">
      {photoSrc
        ? <Img src={photoSrc} alt={`${l.name} 直播`} sizes="(max-width: 860px) 60vw, 220px" />
        : <Placeholder label={`直播画面 占位`} fill />}
      <span className="lb"><i />LIVE</span>
      <span className="vw">{l.viewers}</span>
      <div className="gr" />
      <div className="nm"><b>{l.name}</b><span>{l.title}</span></div>
    </Link>
  );
}
