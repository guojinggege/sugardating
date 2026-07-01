# Creator Hero Videos

## 需上传的资产

**运营需上传实际视频文件到此目录:**

`creator-ai-demo.mp4` — AI Demo Video (统一 Cover Placeholder)

### 规格
- 时长: **8 秒 loop**
- 编码: H.264 mp4, 5-8 Mbps
- 分辨率: 1920×1080 (或 1600×900)
- 无音轨 (页面 muted autoplay)
- 无水印 / logo / 字幕 / 时间轴
- 风格: **Premium Lifestyle Creator** — 咖啡厅光线、旅行取景框、
  慢镜头人物侧影、都市街景 dust。**避免**:性感擦边 / 夸张动作 /
  直播感 / 自拍视频感 / 强滤镜。
- 授权: 需运营取得清晰授权(生成式 AI 素材需注明模型 + prompt)。

### 未上传时的行为
`<video>` 元素的 poster (cover 图) 会作为静态背景显示,cinematic drift
CSS 动画 (24s ease-in-out alternate) 已提供"背景动画"感,页面
不会 broken。

### 未来:Creator 自上传 Cover Video
一旦 Creator 上传自己的封面视频,`getCreatorBySlug` 会返回
`creator.coverVideoSrc`,页面组件优先使用它,自动替换 AI Demo。
无需修改布局或组件结构。

### 优先级 (spec)
1. Creator Cover Video (`creator.coverVideoSrc`)
2. AI Demo Video (`/videos/creator-ai-demo.mp4`)  ← 当前默认
3. Cover Image (poster fallback)
