// Mobile Sugargirl 列表 — 2 columns grid
import Link from "next/link";
import Image from "next/image";
import { sugarGirls } from "@/lib/sugarGirlMock";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div>
      <header className="px-5 pt-5 pb-3">
        <h1 className="text-[22px] font-extrabold text-[var(--ink)] tracking-tight m-0">Sugargirl</h1>
        <p className="text-[13px] text-[var(--muted)] mt-1">{sugarGirls.length} 位精选创作者</p>
      </header>

      {/* 简易 filter chip row · 横滑 */}
      <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide pb-2">
        {["全部", "在线", "东京", "首尔", "上海", "曼谷", "新加坡"].map((chip) => (
          <button
            key={chip}
            type="button"
            className="flex-shrink-0 h-8 px-3.5 rounded-full text-[12.5px] font-semibold bg-white border border-[var(--line)] text-[var(--ink)]"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* 2-col grid */}
      <div className="grid grid-cols-2 gap-3 px-5 mt-4">
        {sugarGirls.map((sg) => (
          <Link
            key={sg.id}
            href={`/m/creators/${sg.id}`}
            className="flex flex-col"
          >
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#F3F4F6] shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
              <Image src={sg.cover} alt={sg.name} fill sizes="(max-width:640px) 50vw, 200px" className="object-cover" />
              {sg.online && (
                <span className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500/90 text-white text-[9.5px] font-bold rounded-full px-1.5 py-0.5">
                  <span className="w-1 h-1 bg-white rounded-full" />
                  Online
                </span>
              )}
              {sg.featured && (
                <span className="absolute top-2 left-2 text-[9.5px] font-bold bg-white/90 backdrop-blur-md text-[#1a1409] rounded-full px-1.5 py-0.5">
                  精选
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent text-white">
                <div className="text-[13px] font-bold truncate">{sg.name}</div>
                <div className="text-[10.5px] text-white/85 truncate">{sg.city} · {sg.age}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
