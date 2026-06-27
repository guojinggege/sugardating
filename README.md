# 拾光 Lumina — 前端静态框架（v1）

华语与亚裔创作者发现 / 订阅平台的前端骨架。当前阶段：**全而静态** —— 所有频道与模块的入口、完整 UI 已搭好，使用纯前端 mock 数据与标注占位框，交互与后端功能后续逐步补充。

## 技术栈
- Next.js 14（App Router）+ TypeScript
- 纯 CSS 设计系统（`app/globals.css`，单色 token，无外部 UI 库依赖）
- 无外部图片：所有图位均为「标注占位框」（`components/Placeholder.tsx`），上线替换为真实授权素材

## 本地启动
```bash
npm install        # 或 pnpm install
npm run dev        # 打开 http://localhost:3000
```
构建：`npm run build && npm run start`

## 路由 / 页面（所有入口已生成）
| 路由 | 页面 |
|---|---|
| `/` | 首页（轮播 banner + 直播 + 创作者 + 作品） |
| `/photography` `/video` `/art-services` `/male-artists` | 频道列表页 |
| `/ai-artists` | AI 频道（含静态智能搜索入口） |
| `/live` | 直播平台 |
| `/community` | 社区动态 |
| `/creators` | 创作者目录（筛选） |
| `/creators/[slug]` | 创作者主页（公开/订阅/档位 Tab） |
| `/rankings` | 排行榜 |
| `/studio` | 创作者中心 |
| `/login` `/register` | 登录 / 注册 |

## 目录结构
```
app/            路由与页面（App Router）
  globals.css   设计系统 + 全部组件样式
  layout.tsx    根布局（Nav + Footer）
components/      可复用组件（Nav/Footer/HeroCarousel/CreatorCard/...）
lib/            类型与静态 mock 数据（types.ts / mock.ts）
```

## 当前为「静态占位」的部分（后续补）
- 图片 → `Placeholder`，待替换为真实授权素材
- 搜索 / 筛选 / 排序 → 仅展示入口，无实际过滤
- 登录 / 注册 / 发布 / 订阅 / 支付 → 表单与按钮为静态
- 直播间 / AI 智能搜索 / 发帖互动 → 仅入口

## 下一步建议顺序
1. 接入数据层（Prisma + Postgres 或先 API mock）
2. 搜索与筛选逻辑
3. 认证（登录/注册）
4. 创作者发布流
5. 订阅与支付（Stripe Connect）
