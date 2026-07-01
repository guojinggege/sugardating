// Availability + Trust card — sidebar 顶部信任信号
// 展示:在线状态 / 响应率 / 平均回复时间 / 完成约会数 / 身份认证 / 加入时间
// 数据由 deterministic derive (基于 slug hash),后续接真实数据只换 props
import { getTranslations } from "next-intl/server";

export interface AvailabilityData {
  isOnline: boolean;
  lastActiveText: string;   // e.g. "2h ago" / "刚刚"
  responseRate: number;     // 0-100
  replyMinutes: number;     // avg reply time in minutes
  completedDates: number;   // 累计完成的约会数
  memberSince: string;      // e.g. "2024-08"
  identityVerified: boolean;
}

interface Props {
  data: AvailabilityData;
}

const IC = {
  clock: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24"><path d="M3 3v18h18" /><path d="M8 15V9M13 15V6M18 15V12" /></svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24"><path d="M21 11.5a8 8 0 0 1-12 6.9L4 20l1.1-5A8 8 0 1 1 21 11.5z" /></svg>
  ),
  check: (
    <svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" /><path d="M9 12l2.2 2.2L15 10.5" /></svg>
  ),
  cal: (
    <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
  ),
};

export default async function AvailabilityCard({ data }: Props) {
  const t = await getTranslations("creatorProfile.availability");

  const rows: { key: string; ic: React.ReactNode; icClass: string; label: string; value: React.ReactNode }[] = [
    {
      key: "status",
      ic: IC.clock,
      icClass: data.isOnline ? "pos" : "",
      label: t("status"),
      value: data.isOnline
        ? <span className="cr-sb-avail-value pos"><span className="cr-sb-avail-dot"><span /></span>{t("onlineNow")}</span>
        : <span>{t("lastActive")} {data.lastActiveText}</span>,
    },
    {
      key: "response",
      ic: IC.chart,
      icClass: "pos",
      label: t("responseRate"),
      value: <>{data.responseRate}%</>,
    },
    {
      key: "reply",
      ic: IC.chat,
      icClass: "",
      label: t("replyTime"),
      value: data.replyMinutes < 60
        ? <>&lt; {data.replyMinutes} {t("minutes")}</>
        : <>&lt; {Math.round(data.replyMinutes / 60)} {t("hours")}</>,
    },
    {
      key: "completed",
      ic: IC.cal,
      icClass: "",
      label: t("completedDates"),
      value: <>{data.completedDates}+</>,
    },
    {
      key: "verified",
      ic: IC.check,
      icClass: data.identityVerified ? "gold" : "",
      label: t("identity"),
      value: data.identityVerified ? t("verified") : t("unverified"),
    },
    {
      key: "member",
      ic: IC.clock,
      icClass: "",
      label: t("memberSince"),
      value: data.memberSince,
    },
  ];

  return (
    <div className="cr-sb-card">
      <h5 className="cr-sb-h">{t("title")}</h5>
      <ul className="cr-sb-avail">
        {rows.map((r) => (
          <li key={r.key}>
            <div className={"cr-sb-avail-ic " + r.icClass}>{r.ic}</div>
            <div className="cr-sb-avail-body">
              <div className="cr-sb-avail-label">{r.label}</div>
              <div className="cr-sb-avail-value">{r.value}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
