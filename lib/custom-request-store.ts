// In-memory store for custom service requests · globalThis-backed (HMR-safe)
import { randomBytes } from "node:crypto";

export interface CustomServiceRequest {
  id: string;
  userId?: string;         // 已登录时绑定
  name: string;
  email: string;
  phone?: string;
  eventTypes: string[];
  country?: string;
  city?: string;
  area?: string;
  venue?: string;
  date?: string;
  startTime?: string;
  duration?: string;
  languages?: string[];
  stylePreferences?: string[];
  guestCount?: number;
  dressCode?: string;
  needsPhotoVideo?: boolean;
  needsVideoConfirmation?: boolean;
  requiresVerified?: boolean;
  wantsRecommendations?: boolean;
  budgetRange?: string;
  notes?: string;
  confirmAdult: boolean;
  acceptPlatformRules: boolean;
  status: "submitted" | "matched" | "cancelled";
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __sgCustomRequests: Map<string, CustomServiceRequest> | undefined;
}
const store = globalThis.__sgCustomRequests ?? new Map<string, CustomServiceRequest>();
globalThis.__sgCustomRequests = store;

export function createRequest(input: Omit<CustomServiceRequest, "id" | "status" | "createdAt">): CustomServiceRequest {
  const rec: CustomServiceRequest = {
    ...input,
    id: `cr_${randomBytes(5).toString("hex")}`,
    status: "submitted",
    createdAt: new Date().toISOString(),
  };
  store.set(rec.id, rec);
  return rec;
}

export function listByUser(userId: string): CustomServiceRequest[] {
  return Array.from(store.values())
    .filter((r) => r.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
