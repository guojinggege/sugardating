import Link from "next/link";
import Placeholder from "./Placeholder";
import { LiveItem } from "@/lib/types";
export default function LiveCard({ l }: { l: LiveItem }) {
  return (
    <Link href={`/creators/${l.slug}`} className="lcard">
      <Placeholder label={`直播画面 占位`} fill />
      <span className="lb"><i />LIVE</span>
      <span className="vw">{l.viewers}</span>
      <div className="gr" />
      <div className="nm"><b>{l.name}</b><span>{l.title}</span></div>
    </Link>
  );
}
