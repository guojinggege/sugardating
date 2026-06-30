import Link from "next/link";
import { Spark } from "./icons";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <div className="container foot-in">
        <div>
          <div className="fbrand"><span className="gm"><Spark /></span>Sugardating</div>
          <p className="about">{t("tagline")}</p>
        </div>
        <div>
          <h5>{t("browse")}</h5>
          <ul>
            <li><Link href="/photography">{t("links.feed")}</Link></li>
            <li><Link href="/video">{t("links.video")}</Link></li>
            <li><Link href="/art-services">{t("links.services")}</Link></li>
            <li><Link href="/male-artists">{t("links.sugargirls")}</Link></li>
            <li><Link href="/ai-artists">{t("links.ai")}</Link></li>
          </ul>
        </div>
        <div>
          <h5>{t("platform")}</h5>
          <ul>
            <li><Link href="/live">{t("links.live")}</Link></li>
            <li><Link href="/community">{t("links.community")}</Link></li>
            <li><Link href="/rankings">{t("links.rankings")}</Link></li>
            <li><Link href="/studio">{t("links.studio")}</Link></li>
          </ul>
        </div>
        <div>
          <h5>{t("about")}</h5>
          <ul>
            <li><Link href="#">{t("links.help")}</Link></li>
            <li><Link href="#">{t("links.guidelines")}</Link></li>
            <li><Link href="#">{t("links.terms")}</Link></li>
            <li><Link href="#">{t("links.privacy")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="container foot-b">
        <span>{t("copyright", { year })}</span>
        <span>{t("langs")}</span>
      </div>
    </footer>
  );
}
