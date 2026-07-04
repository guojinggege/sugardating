// 热门 Sugargirls — 4-col portrait grid (spec: aspect 3/4 · 统一比例 · 紧凑目录风)
// desktop 4 / tablet 3 / mobile 2 · 移动优先浏览效率
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { sugarGirls } from "@/lib/sugarGirlMock";
import type { SugarGirlEntry } from "@/lib/sugarGirlMock";

interface Props {
  limit?: number;
}

export default async function SugargirlGrid({ limit = 12 }: Props) {
  const t = await getTranslations("home.featuredGrid");
  const items = sugarGirls
    .slice()
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);

  return (
    <div className="sg-grid">
      {items.map((sg) => (
        <SugargirlCard key={sg.id} sg={sg} t={t as (k: string) => string} />
      ))}
    </div>
  );
}

function SugargirlCard({ sg, t }: { sg: SugarGirlEntry; t: (k: string) => string }) {
  // 3 顶格 tags,超出隐藏 (spec: 最多显示 2-3 个)
  const tags = sg.tags.slice(0, 3);
  return (
    <Link href={`/creators/${sg.id}`} className="sg-card">
      <div className="sg-media">
        <Image
          src={sg.cover}
          alt={sg.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, (max-width:1279px) 25vw, 280px"
          className="object-cover"
        />
        {/* 顶部 badges */}
        <div className="sg-badges">
          {sg.online && (
            <span className="sg-badge sg-badge-online">
              <i />{t("online")}
            </span>
          )}
          {sg.featured && (
            <span className="sg-badge sg-badge-verified">{t("verified")}</span>
          )}
        </div>
      </div>
      <div className="sg-body">
        <div className="sg-row1">
          <h3 className="sg-name">{sg.name}</h3>
          <span className="sg-age">{sg.age}</span>
        </div>
        <div className="sg-meta">
          {sg.city} · {sg.languages[0]}
        </div>
        {tags.length > 0 && (
          <div className="sg-tags">
            {tags.map((tag) => (
              <span key={tag} className="sg-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
