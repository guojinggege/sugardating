import Link from "next/link";
import Placeholder from "./Placeholder";
import { Tick } from "./icons";
import { Creator } from "@/lib/types";
import { tierText } from "@/lib/mock";

export default function CreatorCard({ c }: { c: Creator }) {
  const elite = c.tier === "elite";
  return (
    <Link href={`/creators/${c.slug}`} className="cc">
      <Placeholder label={`创作者图 占位\n${c.name}`} fill />
      <div className="gr" />
      <span className={elite ? "badge elite" : "badge"}>{elite ? "Elite" : tierText(c.tier)}</span>
      <div className="info">
        <div className="nm">{c.name} <Tick /></div>
        <div className="ct">{c.category} · {c.specialty} · {c.region}</div>
        <div className="f">
          <div className="pr"><b>{c.price}</b> /月起</div>
          <div className="enter"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div>
        </div>
      </div>
    </Link>
  );
}
