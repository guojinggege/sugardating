// Welcome Card — 欢迎语 + 用户状态 + 发布按钮
"use client";
import { useAuth, useRequireLogin } from "@/components/Auth/AuthProvider";

interface Props {
  onlineTotal: number;
  joinedCount: number;
}

export default function CommunityHeader({ onlineTotal, joinedCount }: Props) {
  const { user } = useAuth();
  const requireLogin = useRequireLogin();
  const displayName = user?.name || "夜猫子";

  return (
    <section
      className="rounded-[18px] border p-5 md:p-6"
      style={{
        background: "rgba(255,255,255,0.05)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h2 className="text-[20px] md:text-[22px] font-bold text-white leading-tight m-0">
            晚上好,{displayName}
          </h2>
          <p className="text-[13px] text-[var(--cm-muted)] mt-1.5 leading-[1.6]">
            你加入了 <b className="text-white">{joinedCount}</b> 个社区 ·
            此刻全站 <b className="text-white tabular-nums">{onlineTotal.toLocaleString("en-US")}</b> 人在线
          </p>
        </div>
        <button
          type="button"
          onClick={() => requireLogin()}
          className="h-11 px-5 rounded-full text-[13px] font-bold text-white transition hover:opacity-90 whitespace-nowrap inline-flex items-center gap-2"
          style={{ background: "linear-gradient(135deg,#EC4C86 0%,#7C5CFF 100%)" }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          写点什么
        </button>
      </div>
    </section>
  );
}
