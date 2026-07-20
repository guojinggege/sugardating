// 举报分类字典 · 中文标签 + 严重度默认 + 提示
import type { OfflineCategory, OnlineCategory, ReportCategory, ReportSeverity, ReportTargetType } from "./types";

export interface CategoryMeta {
  key: ReportCategory;
  label: string;
  hint: string;
  defaultSeverity: ReportSeverity;
}

export const ONLINE_CATEGORIES: CategoryMeta[] = [
  { key: "scam",                    label: "诈骗 · 骗取金钱或个人信息", hint: "包括虚假投资、代付、假冒身份索要转账等",           defaultSeverity: "high" },
  { key: "harassment",              label: "骚扰 · 语言侵犯 · 恐吓",      hint: "反复不受欢迎的联系、辱骂、恐吓、性骚扰",           defaultSeverity: "high" },
  { key: "fake_profile",            label: "资料不实 · 假照片",           hint: "身份、年龄、照片明显不符;PS 严重",                defaultSeverity: "medium" },
  { key: "underage",                label: "涉及未成年",                  hint: "对方疑似未成年,或推广未成年内容",                 defaultSeverity: "critical" },
  { key: "privacy_leak",            label: "隐私泄露 · 未经授权传播",     hint: "泄露真名、电话、地址、公司、亲私影像等",          defaultSeverity: "high" },
  { key: "off_platform_payment",    label: "站外付款诱导",                hint: "要求跳转微信/加密货币/银行卡等站外支付",          defaultSeverity: "high" },
  { key: "hate_speech",             label: "仇恨言论 · 歧视",             hint: "基于种族、性别、国籍、性取向的攻击",              defaultSeverity: "medium" },
  { key: "impersonation",           label: "冒充他人 · 冒充平台员工",     hint: "假装是别人 · 或声称自己是 Sugardating 工作人员",   defaultSeverity: "high" },
  { key: "spam",                    label: "垃圾信息 · 广告",             hint: "推广其它平台 · 与本次沟通无关的商业内容",         defaultSeverity: "low" },
  { key: "other_online",            label: "其它线上问题",                hint: "上述不覆盖 · 请在描述中详细说明",                 defaultSeverity: "medium" },
];

export const OFFLINE_CATEGORIES: CategoryMeta[] = [
  { key: "no_show",                     label: "爽约 · 未到场",              hint: "对方在约定时间未出现,提前也未通知",              defaultSeverity: "low" },
  { key: "safety_incident",             label: "见面时不安全感",             hint: "被跟踪、被拍照、感到威胁",                        defaultSeverity: "high" },
  { key: "coerced",                     label: "被强迫或胁迫",               hint: "被迫做出不同意的行为、被威胁隐私",                defaultSeverity: "critical" },
  { key: "physical_harm",               label: "人身伤害",                   hint: "身体受到伤害。请优先联系当地紧急服务",            defaultSeverity: "critical" },
  { key: "theft",                       label: "财物丢失 · 被拿走",          hint: "包、手机、卡、现金等被拿走",                      defaultSeverity: "high" },
  { key: "misrepresentation",           label: "与线上完全不符",             hint: "身份、外貌、条件与资料严重不同",                  defaultSeverity: "medium" },
  { key: "off_platform_solicitation",   label: "见面时被要求走站外",         hint: "见面后被要求转私人转账或与本次预约无关的额外服务", defaultSeverity: "high" },
  { key: "other_offline",               label: "其它线下问题",               hint: "上述不覆盖 · 请在描述中详细说明",                 defaultSeverity: "medium" },
];

export function getCategoriesByScene(scene: "online" | "offline"): CategoryMeta[] {
  return scene === "online" ? ONLINE_CATEGORIES : OFFLINE_CATEGORIES;
}

export function getCategoryMeta(key: ReportCategory): CategoryMeta | undefined {
  return [...ONLINE_CATEGORIES, ...OFFLINE_CATEGORIES].find((c) => c.key === key);
}

// ══════════════════════════════════════
// Target types · 中文标签 + 是否需要关联具体 ID
// ══════════════════════════════════════

export interface TargetTypeMeta {
  key: ReportTargetType;
  label: string;
  hint: string;
  needsContextPicker: boolean;   // wizard step 3 是否要求选具体记录
}

export const TARGET_TYPES: TargetTypeMeta[] = [
  { key: "creator",         label: "针对某位创作者 / Sugargirl / Sugarboy",  hint: "对方在平台上有公开资料",         needsContextPicker: true },
  { key: "chat",            label: "针对某段聊天记录",                        hint: "在私密聊天中发生的问题",         needsContextPicker: true },
  { key: "booking",         label: "针对某次预约",                            hint: "可选择近 30 天内的预约",         needsContextPicker: true },
  { key: "custom_service",  label: "针对某个定制服务需求",                    hint: "你提交过定制需求的经历",         needsContextPicker: true },
  { key: "media",           label: "针对某张图片 · 视频",                    hint: "被泄露 / 假冒 / 未成年 / 违规",   needsContextPicker: true },
  { key: "community_post",  label: "针对社区帖子 · 私语广场",                 hint: "对方发布了违规内容",             needsContextPicker: true },
  { key: "user",            label: "针对某个用户 ID",                         hint: "只能提供用户 ID 时",             needsContextPicker: false },
  { key: "self_general",    label: "没有具体对象 · 泛安全反馈",              hint: "提出建议或反映平台层面问题",     needsContextPicker: false },
];
