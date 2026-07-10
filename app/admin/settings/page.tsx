// Admin · 站点设置 · Feature Flags + 基础配置
import { AdminPageHeader, AdminCard } from "@/components/admin/AdminPrimitives";
import { cmsRepo } from "@/lib/cms/repository";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings · Sugardating Admin" };

export default function AdminSettingsPage() {
  const settings = cmsRepo.getSettings();

  return (
    <>
      <AdminPageHeader
        eyebrow="System"
        title="站点设置"
        description="全站配置与 Feature Flags · 关闭频道后前台入口隐藏,页面路由保留"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Settings" }]}
      />

      <SettingsForm initial={settings} />

      <div style={{ marginTop: 20 }}>
        <AdminCard title="配置说明">
          <ul className="st-note">
            <li><b>Maintenance Mode</b> — 开启后前台可访问但显示维护提示 (未来接入 middleware)</li>
            <li><b>Registration Enabled</b> — 关闭时新用户注册接口 403</li>
            <li><b>Creator Application Enabled</b> — 关闭时 /apply 显示暂停申请提示</li>
            <li><b>Chat / Locked Media / Credits Enabled</b> — 分模块 kill switch,关闭时对应 API 返回 503 (待接入)</li>
            <li><b>Channel Enabled Flags</b> — 关闭对应频道 · Nav 隐藏 · Home 频道卡隐藏 · 页面仍可 URL 直达</li>
          </ul>
        </AdminCard>
      </div>

      <style>{`
        .st-note{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
        .st-note li{font-size:13px;line-height:1.65;color:#374151;padding-left:18px;position:relative}
        .st-note li:before{content:"";position:absolute;left:0;top:10px;width:8px;height:1px;background:#D6B980}
        .st-note b{color:#111;font-weight:700}
      `}</style>
    </>
  );
}
