# Hero Video Asset

## 需上传文件

`hero.mp4` — Hero Cover Background (统一给所有 Creator Detail 页)

Next.js 从 `public/` 直接服务,URL 为 `/videos/hero.mp4`,
被 `app/creators/[slug]/page.tsx` 中 `HERO_VIDEO_SRC` 引用。

## 规格
- 时长: **8 秒 loop** (循环无痕最佳,首尾帧可对齐)
- 编码: H.264 mp4, 5-8 Mbps
- 分辨率: 1920×1080 (或 1600×900)
- 无音轨 (页面 muted autoplay,即使有也不播)
- 无水印 / logo / 字幕 / 时间轴
- 风格: **Premium Lifestyle Creator** — 咖啡厅光线、旅行取景框、
  慢镜头人物侧影、都市街景 dust。**避免**:性感擦边 / 夸张动作 /
  直播感 / 自拍视频感 / 强滤镜。
- 授权: 需运营取得清晰授权(生成式 AI 素材需注明模型 + prompt)。

## 未上传时的行为
`<video>` 元素的 `poster={cover}` 会作为静态背景显示,cinematic drift
CSS 动画 (24s ease-in-out alternate) 提供"背景动画"感,页面
不会 broken。

## 未来:Creator 自上传 Cover Video
一旦 Creator 上传自己的封面视频,`getCreatorBySlug` 返回
`creator.coverVideoSrc`,页面组件优先使用它,自动替换 Hero Video。
无需修改布局或组件结构。

## 优先级 (spec)
1. Creator Cover Video (`creator.coverVideoSrc`)
2. Hero Video (`/videos/hero.mp4`)  ← 当前默认
3. Cover Image (poster,视频加载失败自动回退)
