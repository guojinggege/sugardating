// 服务端校验 · 独立于 UI · 拒绝非法 payload
import type { ReportCreateInput, ReportScene, ReportTargetType } from "./types";
import { ONLINE_CATEGORIES, OFFLINE_CATEGORIES } from "./categories";

const VALID_TARGETS: ReportTargetType[] = [
  "creator", "user", "chat", "booking", "custom_service", "media", "community_post", "self_general",
];
const VALID_CONTACT = ["email", "in_app", "no_contact"] as const;

export function validateReportInput(body: any): { ok: true; input: ReportCreateInput } | { ok: false; message: string } {
  if (!body || typeof body !== "object") return { ok: false, message: "无效 payload" };

  const scene: ReportScene = body.scene === "online" || body.scene === "offline" ? body.scene : ("online" as ReportScene);
  if (scene !== "online" && scene !== "offline") return { ok: false, message: "scene 必须是 online 或 offline" };

  const validCats = (scene === "online" ? ONLINE_CATEGORIES : OFFLINE_CATEGORIES).map((c) => c.key as string);
  if (typeof body.category !== "string" || !validCats.includes(body.category)) {
    return { ok: false, message: "category 不合法 · 请从列表中选择" };
  }

  if (!body.target || typeof body.target !== "object") return { ok: false, message: "缺少 target" };
  if (!VALID_TARGETS.includes(body.target.type)) return { ok: false, message: "target.type 不合法" };

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (title.length < 4)    return { ok: false, message: "标题至少 4 个字" };
  if (title.length > 120)  return { ok: false, message: "标题不能超过 120 字" };

  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (description.length < 20)   return { ok: false, message: "详细经过至少 20 字 · 有助于我们判断" };
  if (description.length > 4000) return { ok: false, message: "详细经过不能超过 4000 字" };

  if (!VALID_CONTACT.includes(body.contactPreference)) {
    return { ok: false, message: "联系偏好不合法" };
  }
  if (body.agreedToTerms !== true) return { ok: false, message: "请勾选社区规则确认" };

  // Evidence · 数组 · 每项元数据 · 拒绝异常
  const evidence: NonNullable<ReportCreateInput["evidence"]> = [];
  if (Array.isArray(body.evidence)) {
    for (const e of body.evidence.slice(0, 8)) {
      if (!e || typeof e !== "object") continue;
      const filename = typeof e.filename === "string" ? e.filename.slice(0, 200) : "";
      const mimeType = typeof e.mimeType === "string" ? e.mimeType.slice(0, 80) : "";
      const sizeBytes = Number.isFinite(e.sizeBytes) ? Math.min(Math.max(0, e.sizeBytes), 50 * 1024 * 1024) : 0;
      if (!filename || !mimeType) continue;
      evidence.push({
        filename, mimeType, sizeBytes,
        description: typeof e.description === "string" ? e.description.slice(0, 500) : undefined,
      });
    }
  }

  return {
    ok: true,
    input: {
      scene,
      category: body.category,
      target: {
        type: body.target.type,
        id: typeof body.target.id === "string" ? body.target.id.slice(0, 120) : undefined,
        label: typeof body.target.label === "string" ? body.target.label.slice(0, 200) : undefined,
      },
      title,
      description,
      occurredAt: typeof body.occurredAt === "string" ? body.occurredAt.slice(0, 40) : undefined,
      location: typeof body.location === "string" ? body.location.slice(0, 120) : undefined,
      contactPreference: body.contactPreference,
      agreedToTerms: true,
      evidence,
    },
  };
}
