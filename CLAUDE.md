# Claude Code 开发规范 — Sugardating

## 项目定位
Sugardating 是面向华语 / 亚裔创作者的发现 + 服务 + 订阅平台。频道：动态推荐 / 视频专区 / 专属服务 / SugarGirl / 在线伴侣 / 直播平台 / 社区。

## 当前阶段
全而静态的前端框架已就位 + 数据层接入 Postgres(Neon) + 已具备 Vercel 部署条件。你的任务是在此基础上**逐步补功能**，不要推倒重写、不要把现有结构改成其它形态。

## 技术约束
- Next.js 14 App Router + TypeScript，样式走 `app/globals.css`（单色设计 token）。
- 数据层 Prisma + PostgreSQL（Neon pooled URL + DIRECT_URL 直连用于 migration）。
- 新增图片优先走 `components/Img.tsx` + `next/image`，本地真图放 `public/images/`；做占位时用 `components/Placeholder.tsx`。**禁止用 AI 生成的人物图填充**；真实素材由运营提供授权后替换。
- 组件分层：Page → Section → Card → UI。单文件不超过 ~300 行，超了就拆。
- 客户端交互才加 `"use client"`，能服务端渲染的保持服务端。
- Layout 调 DB → 全应用 `force-dynamic`，不做 SSG。

## 设计 token（勿随意改）
- 颜色：`--ink #161618` / `--page #F4F4F5` / `--card #fff` / `--line #E8E8EC` / `--live #E5484D` / `--accent #B8A789`（低饱和暖灰点缀）
- 主操作=纯黑，整体黑白灰单色，accent 仅用于次要强调（hero eyebrow、section eyebrow、save badge）。
- 字体：Plus Jakarta Sans + Noto Sans SC + Cormorant Garamond italic（仅用在 logo monogram）

## 内容与合规
- 用户上传内容需经授权 + 内容审核流程后才上线
- 不接收未成年用户和未成年相关内容
- 不接收可证明违法的内容
- 接入支付（Stripe）时严格按 Stripe Acceptable Use 走;敏感品类提前申请 Stripe 高风险账户
- 平台不撮合面对面交易、不充当中介、不背书任何线下行为

## 每完成一个模块，输出
- 改动的文件清单 + 简述
- 如涉及数据：类型定义 + migration（Postgres）
- 不要只回一句"已完成"

## 路线（按序补）
数据层 ✓ → 真图接入 ✓ → 打赏 + 评论 ✓ → 会员体系 ✓ → 全站品牌升级 ✓ → 认证（NextAuth/Clerk）→ 发布流 → 订阅/支付（Stripe）
