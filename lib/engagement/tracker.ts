// 有效浏览时长追踪 · 服务端计数 · P0 globalThis · 生产建议接 Redis / Neon
// 每次 heartbeat 加 seconds (客户端只在 visible + focus 时上报)
// 幂等:同一 windowKey (userId + minute-bucket) 短时间内多次 upsert 只算一次

interface EngagementRecord {
  userId: string;
  totalSeconds: number;
  lastHeartbeatAt: string;
  // 防刷:每分钟窗口最多计入 90s · 阻止长时间挂机刷时长
  buckets: Record<string, number>;   // minuteKey → seconds
}

declare global {
  // eslint-disable-next-line no-var
  var __sgEngagement: Map<string, EngagementRecord> | undefined;
}
const store = globalThis.__sgEngagement ?? new Map<string, EngagementRecord>();
globalThis.__sgEngagement = store;

const MAX_PER_MINUTE = 90;   // 允许每分钟上限 90s (含边界效应)
const MAX_PER_TICK = 60;     // 单次 heartbeat 最多累计 60s

function minuteKey(now: number): string {
  return String(Math.floor(now / 60_000));
}

export function recordHeartbeat(userId: string, addSeconds: number): EngagementRecord {
  const capped = Math.max(0, Math.min(MAX_PER_TICK, Math.floor(addSeconds || 0)));
  const now = Date.now();
  const key = minuteKey(now);
  const cur = store.get(userId) ?? {
    userId, totalSeconds: 0, lastHeartbeatAt: new Date().toISOString(), buckets: {},
  };
  const bucket = cur.buckets[key] ?? 0;
  const allowed = Math.max(0, MAX_PER_MINUTE - bucket);
  const actualAdd = Math.min(capped, allowed);
  cur.buckets[key] = bucket + actualAdd;
  cur.totalSeconds += actualAdd;
  cur.lastHeartbeatAt = new Date(now).toISOString();
  // 清理旧 buckets (保留 30 分钟)
  for (const k of Object.keys(cur.buckets)) {
    if (Number(k) < Number(key) - 30) delete cur.buckets[k];
  }
  store.set(userId, cur);
  return cur;
}

export function getEngagement(userId: string): EngagementRecord {
  return store.get(userId) ?? {
    userId, totalSeconds: 0, lastHeartbeatAt: new Date().toISOString(), buckets: {},
  };
}

// 管理员测试用 · 直接设置 totalSeconds
export function setTotalSeconds(userId: string, seconds: number): EngagementRecord {
  const cur = getEngagement(userId);
  cur.totalSeconds = Math.max(0, Math.floor(seconds));
  cur.lastHeartbeatAt = new Date().toISOString();
  store.set(userId, cur);
  return cur;
}
