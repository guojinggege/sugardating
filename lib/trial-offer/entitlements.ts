// 判断当前用户是否处于「24h £0 体验中」· 用于会员权益 gate
import { getTrial } from "./repository";

export function isTrialActive(userId: string): boolean {
  const t = getTrial(userId);
  return !!(t && t.status === "active" && t.endsAt && new Date(t.endsAt).getTime() > Date.now());
}

export function trialSecondsLeft(userId: string): number {
  const t = getTrial(userId);
  if (!t || t.status !== "active" || !t.endsAt) return 0;
  const ms = new Date(t.endsAt).getTime() - Date.now();
  return Math.max(0, Math.floor(ms / 1000));
}
