// 右侧 sticky 侧栏 — 6 个小卡片 widget
//   猜你喜欢 / 在线 Sugargirl / 热门创作者 / 最近加入 / 推荐视频 / 推荐服务
//   + 支持 Ta (打赏入口,沿用 TipButton)
import Link from "next/link";
import Img from "@/components/Img";
import { getTranslations } from "next-intl/server";
import type { Creator } from "@/lib/types";
import TipButton from "@/app/creators/[slug]/TipButton";

interface Props {
  creatorSlug: string;
  guesses: { creator: Creator; photo: string }[];   // 猜你喜欢
  online: { creator: Creator; photo: string }[];    // 在线
  hot: { creator: Creator; photo: string }[];       // 热门
  recent: { creator: Creator; photo: string }[];    // 最近加入
}

export default async function RightSidebar({
  creatorSlug, guesses, online, hot, recent,
}: Props) {
  const t = await getTranslations("creatorProfile.sidebar");

  const widget = (title: string, items: Props["guesses"]) => (
    <div className="cr-sb-card">
      <h5 className="cr-sb-h">{title}</h5>
      <ul className="cr-sb-list">
        {items.map(({ creator, photo }) => (
          <li key={creator.slug}>
            <Link href={`/creators/${creator.slug}`} className="cr-sb-row">
              <div className="cr-sb-ava">
                <Img src={photo} alt={creator.name} sizes="40px" />
              </div>
              <div className="cr-sb-meta">
                <div className="cr-sb-name">{creator.name}</div>
                <div className="cr-sb-sub">{creator.region} · {creator.followers} {t("followers")}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <aside className="cr-sidebar">
      {widget(t("guesses"), guesses)}
      {widget(t("online"),  online)}
      {widget(t("hot"),     hot)}
      {widget(t("recent"),  recent)}

      {/* 支持 Ta — 打赏入口 */}
      <div className="cr-sb-card cr-sb-tip">
        <h5 className="cr-sb-h">{t("support")}</h5>
        <p className="cr-sb-sub">{t("supportDesc")}</p>
        <div className="cr-sb-tip-act">
          <TipButton slug={creatorSlug} />
        </div>
      </div>
    </aside>
  );
}
