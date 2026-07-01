// 6 verification badges — Identity / Phone / Email / Video / Face / Safe Meet
import { getTranslations } from "next-intl/server";

interface TrustFlags {
  identity: boolean;
  phone: boolean;
  email: boolean;
  video: boolean;
  face: boolean;
  safeMeet: boolean;
}

const ICONS: Record<keyof TrustFlags, React.ReactNode> = {
  identity: <svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" /></svg>,
  phone:    <svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.9.6 2.8a2 2 0 0 1-.4 2L8 9.9a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2-.5c.9.3 1.9.5 2.8.6a2 2 0 0 1 1.7 2z" /></svg>,
  email:    <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>,
  video:    <svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></svg>,
  face:     <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M8 10h.01M16 10h.01M9 15c.8.7 2 1 3 1s2.2-.3 3-1" /></svg>,
  safeMeet: <svg viewBox="0 0 24 24"><path d="M12 2l3 5 5 1-4 4 1 6-5-3-5 3 1-6-4-4 5-1z" /></svg>,
};

export default async function CreatorTrust({ flags }: { flags: TrustFlags }) {
  const t = await getTranslations("creatorProfile.trust");
  const order: (keyof TrustFlags)[] = ["identity", "phone", "email", "video", "face", "safeMeet"];

  return (
    <section className="cr-trust" aria-label={t("title")}>
      <div className="cr-trust-h">
        <h4>{t("title")}</h4>
        <span className="cr-trust-count">
          {order.filter((k) => flags[k]).length} / {order.length} {t("verified")}
        </span>
      </div>
      <div className="cr-trust-grid">
        {order.map((k) => (
          <div key={k} className={"cr-trust-item " + (flags[k] ? "on" : "off")}>
            <div className="cr-trust-ic">{ICONS[k]}</div>
            <div className="cr-trust-label">{t(`items.${k}`)}</div>
            {flags[k] && (
              <svg className="cr-trust-check" viewBox="0 0 24 24" aria-hidden>
                <path d="M5 12l4 4 10-10" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
