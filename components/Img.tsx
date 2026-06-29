import NextImage from "next/image";

// 统一的 next/image 包装:fill + object-cover,父容器需要 position:relative + 明确高度
// sizes 必传(否则浏览器请求最大尺寸,浪费带宽);priority 用于首屏关键图
interface Props {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export default function Img({ src, alt, sizes = "100vw", priority = false, className }: Props) {
  return (
    <NextImage
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ objectFit: "cover" }}
    />
  );
}
