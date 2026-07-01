// Timeline — 最近上线 / 更新 / 旅行 / 动态,竖直时间轴
import { getTranslations } from "next-intl/server";

export interface TimelineEvent {
  type: "online" | "update" | "travel" | "post";
  text: string;
  time: string;
}

const IC: Record<TimelineEvent["type"], React.ReactNode> = {
  online: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /></svg>,
  update: <svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-3-6.2L20 8M20 3v5h-5" /></svg>,
  travel: <svg viewBox="0 0 24 24"><path d="M2 12l8-3 4 4 6-7 2 2-7 9-4-4z" /></svg>,
  post:   <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>,
};

export default async function CreatorTimeline({ events }: { events: TimelineEvent[] }) {
  const t = await getTranslations("creatorProfile.timeline");
  if (events.length === 0) return null;
  return (
    <div className="cr-tl">
      <ol className="cr-tl-list">
        {events.map((e, i) => (
          <li key={i} className={"cr-tl-item cr-tl-" + e.type}>
            <div className="cr-tl-ic" aria-hidden>{IC[e.type]}</div>
            <div className="cr-tl-body">
              <div className="cr-tl-type">{t(`types.${e.type}`)}</div>
              <div className="cr-tl-text">{e.text}</div>
              <time className="cr-tl-time">{e.time}</time>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
