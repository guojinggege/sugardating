import { regions } from "@/lib/mock";
// 静态筛选栏：仅展示入口，交互后续补充
export default function FilterBar({ chips = ["全部", "摄影", "视频", "艺术服务", "AI艺术"] }: { chips?: string[] }) {
  return (
    <div className="fbar">
      <button className="fdrop"><svg viewBox="0 0 24 24" style={{ stroke: "var(--ink)", fill: "none", strokeWidth: 1.9, width: 14, height: 14 }}><path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" /></svg>{regions[0]}<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg></button>
      <button className="fdrop">排序：推荐<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg></button>
      <span className="fdiv" />
      {chips.map((c, i) => (<button key={c} className={i === 0 ? "fchip on" : "fchip"}>{c}</button>))}
    </div>
  );
}
