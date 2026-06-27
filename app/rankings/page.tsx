import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import { creators, tierText } from "@/lib/mock";
export default function Page() {
  return (
    <div className="container">
      <div className="chero"><div className="ey">排行榜</div><h1>本周创作者榜</h1><p>按订阅与活跃度排序。（实时榜单为后续功能）</p></div>
      <div style={{ height: 12, marginBottom: 4 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 720 }}>
        {creators.map((c, i) => (
          <Link key={c.slug} href={`/creators/${c.slug}`} style={{ display: "flex", alignItems: "center", gap: 14, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: 12 }}>
            <b style={{ fontSize: 18, width: 28, textAlign: "center", color: i < 3 ? "var(--ink)" : "var(--muted)" }}>{i + 1}</b>
            <div style={{ width: 52, height: 52, borderRadius: 12, overflow: "hidden", position: "relative", flex: "0 0 52px" }}><Placeholder label="图" fill /></div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{c.name}</div><div style={{ fontSize: 12.5, color: "var(--muted)" }}>{c.category} · {c.specialty}</div></div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>{c.subs} 订阅</div>
            <span className={c.tier === "elite" ? "badge elite" : "badge"} style={{ position: "static" }}>{c.tier === "elite" ? "Elite" : tierText(c.tier)}</span>
          </Link>
        ))}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}
