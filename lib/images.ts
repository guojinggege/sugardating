// 服务端读 public/images/ 目录,导出图片路径数组 + 循环取图工具
// 模块顶层 fs.readdirSync 在 Node 启动/首次导入时跑一次,后续命中模块缓存。
// 客户端组件不要 import 此文件 — Next.js 会在打包阶段抛错(fs 不可用)。

import fs from "node:fs";
import path from "node:path";

const IMG_DIR = path.join(process.cwd(), "public", "images");
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

function loadPhotos(): string[] {
  try {
    return fs
      .readdirSync(IMG_DIR)
      .filter((f) => !f.startsWith(".") && EXTS.has(path.extname(f).toLowerCase()))
      .sort()
      .map((f) => `/images/${f}`);
  } catch {
    return [];
  }
}

export const photos: string[] = loadPhotos();

// 按索引循环取图;offset 让不同 section 错开起点,降低视觉重复感
export function pick(index: number, offset = 0): string | undefined {
  if (photos.length === 0) return undefined;
  const n = photos.length;
  return photos[(((index + offset) % n) + n) % n];
}
