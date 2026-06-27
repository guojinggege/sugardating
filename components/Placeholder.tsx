// 标注占位框：本地静态阶段统一用它代替图片，便于后续替换为真实授权素材
export default function Placeholder({
  label, ratio = "4/5", fill = false,
}: { label: string; ratio?: string; fill?: boolean }) {
  return (
    <div className={fill ? "ph fill" : "ph"} style={fill ? undefined : { aspectRatio: ratio }} role="img" aria-label={label}>
      <span className="ph-l">{label}</span>
    </div>
  );
}
