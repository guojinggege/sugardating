import Image from "next/image";

// 4 张图的 2x2 gallery,4:5 比例,圆角 + hover 微缩放
// 用 next/image,默认 loading="lazy"
export default function ServiceGallery({
  images,
  alt = "",
}: {
  images: string[];
  alt?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      {images.slice(0, 4).map((src, i) => (
        <div
          key={i}
          className="group relative overflow-hidden rounded-2xl border border-feed-line bg-feed-surface"
          style={{ aspectRatio: "4/5" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 45vw, 280px"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition duration-500 ease-out group-hover:opacity-100" />
        </div>
      ))}
    </div>
  );
}
