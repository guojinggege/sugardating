// 服务 4 宫格:约会 / 旅游 / 拍摄 / 视频聊天
import { getTranslations } from "next-intl/server";
import type { ServiceItem } from "@/lib/creatorProfileMock";
import ServiceCtaButton from "./ServiceCtaButton";

// 4 个服务的 icon (内联 SVG)
const ICONS: Record<ServiceItem["key"], React.ReactNode> = {
  dating: (
    <svg viewBox="0 0 24 24"><path d="M12 21s-7-5-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 4.5C19 16 12 21 12 21z" /></svg>
  ),
  travel: (
    <svg viewBox="0 0 24 24"><path d="M2 12l8-3 4 4 6-7 2 2-7 9-4-4z" /></svg>
  ),
  shoot: (
    <svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="12" cy="13" r="3.5" /><path d="M8 7l2-3h4l2 3" /></svg>
  ),
  "video-chat": (
    <svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></svg>
  ),
};

export default async function ServiceCards({ services }: { services: ServiceItem[] }) {
  const t = await getTranslations("creatorProfile.services");
  return (
    <div className="cr-services">
      {services.map((s) => (
        <article key={s.key} className="cr-service">
          <div className="cr-service-ic">{ICONS[s.key]}</div>
          <h4 className="cr-service-title">{t(`items.${s.key}.title`)}</h4>
          <p className="cr-service-desc">{t(`items.${s.key}.desc`)}</p>
          <div className="cr-service-row">
            <div className="cr-service-price">
              <b>{s.price}</b>
              <span>· {s.duration}</span>
            </div>
            <ServiceCtaButton label={t("book")} />
          </div>
        </article>
      ))}
    </div>
  );
}
