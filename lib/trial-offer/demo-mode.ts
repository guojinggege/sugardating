// Trial Demo Mode 判断 · 集中在此 · 其它地方一律 import
// 生产环境 (VERCEL_ENV=production) 无论 TRIAL_DEMO_MODE 是否为 true 都强制关闭
// 本地开发 (VERCEL_ENV=undefined) 与 Vercel Preview 允许启用

/** 是否允许 Trial Demo · 只在 dev/preview 且显式开关 = true 时返回 true */
export function isTrialDemoEnabled(): boolean {
  if (process.env.VERCEL_ENV === "production") return false;
  return process.env.TRIAL_DEMO_MODE === "true";
}

/** 是否为生产环境 · 用于 UI 文案区分 */
export function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}
