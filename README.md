# Sugardating

华语与亚裔创作者发现 / 订阅平台的前端 + 数据层。当前阶段已完成静态前端骨架、Postgres 数据层、真图替换、打赏 / 评论、平台会员体系、品牌升级。

## 技术栈
- **Next.js 14**（App Router）+ TypeScript
- **Prisma + PostgreSQL**（Neon），本地与 prod 共用 schema
- **next/image** + `public/images/` 真图，`components/Placeholder.tsx` 兜底
- 单色设计系统（`app/globals.css`，design tokens 一处管全部颜色）
- 部署：Vercel + Neon

## 本地启动
```bash
npm install                      # 自动跑 prisma generate(postinstall)
cp .env.example .env             # 填入 Neon 的 DATABASE_URL + DIRECT_URL
npx prisma migrate dev --name init   # 首次:把 schema apply 到 Neon
npm run db:seed                  # 灌种子数据
npm run dev                      # http://localhost:3000
```

构建:`npm run build`(= `prisma generate && next build`)

## 路由

| 路由 | 页面 |
|---|---|
| `/` | 首页（沉浸 hero + 叙事 section + 创作者滑廊 + 平台数据 + 入驻 CTA + 直播） |
| `/photography` | 动态推荐 |
| `/video` | 视频专区 |
| `/art-services` | 专属服务 |
| `/male-artists` | SugarGirl |
| `/ai-artists` | 在线伴侣（含静态智能搜索入口） |
| `/live` | 直播平台 |
| `/community` | 社区动态 |
| `/creators` | 创作者目录（按地区 / 分类 / 排序，地区从 Nav 下拉过滤） |
| `/creators/[slug]` | 创作者主页（公开作品图片/视频两段 + 打赏 + 评论 + 订阅档位） |
| `/membership` | 平台会员（3 等级 × 4 周期，落库不接支付） |
| `/rankings` | 排行榜 |
| `/studio` | 创作者中心 |
| `/login` `/register` | 登录 / 注册 |

## 目录结构
```
app/            路由与页面（App Router）
  globals.css   设计系统 + 全部组件样式
  layout.tsx    根布局（Nav + Footer + 全应用 force-dynamic）
  membership/   会员页 + server action + client button
  creators/[slug]/  创作者主页 + tip/comment server actions
components/     可复用组件
  Img.tsx       next/image fill + object-cover 包装
  Reveal.tsx    IntersectionObserver 淡入
  Stat.tsx      数字滚动计数
  CreatorRail.tsx  鼠标拖拽 / 滚轮横滑
  HomeHero.tsx  100dvh 沉浸式首屏
  Nav.tsx       城市下拉 + 品牌入口 + 开通会员
lib/
  db.ts         Prisma client 单例
  queries.ts    所有 DB 查询函数
  images.ts     public/images/ 扫盘 + pick(i) 循环工具(server-only)
  mock.ts       仍在用的少量静态数据(频道列表/sorts/posts/liveNow)
prisma/
  schema.prisma   Postgres + Json benefits
  seed.ts         本地 + Neon 通用 seed
  migrations/     Postgres migration 历史
public/images/  11 张授权真图
```

## 部署
1. Neon 项目建好,Pooled + Direct 两个连接串
2. Vercel Import GitHub repo → 设两个 env vars
3. 自动跑 `npm install`(postinstall: prisma generate) → `npm run build`
4. 首次部署前 schema 已通过本地 `prisma migrate dev` apply 到 Neon
5. seed 数据本地手动跑一次,Vercel 不重复跑

## 下一步
1. 认证（NextAuth / Clerk）
2. 发布流（创作者上传 + 审核）
3. 订阅与支付（Stripe Connect）
4. 内容审核（图片 + 文字）
