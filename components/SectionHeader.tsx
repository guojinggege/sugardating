import Link from "next/link";
import { Arrow } from "./icons";
export default function SectionHeader({ title, count, moreHref, moreText = "查看全部", live = false }:
  { title: string; count?: string; moreHref?: string; moreText?: string; live?: boolean }) {
  return (
    <div className="sec-h">
      <div className="l">
        {live ? <span className="livetag"><i />{title}</span> : <h2>{title}</h2>}
        {count && <span className="cnt">{count}</span>}
      </div>
      {moreHref && <Link href={moreHref} className="more">{moreText} <Arrow /></Link>}
    </div>
  );
}
