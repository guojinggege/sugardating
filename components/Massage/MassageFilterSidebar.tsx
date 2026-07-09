"use client";
// Filter sidebar — desktop 左侧 sticky · mobile bottom-sheet
// 以 URL search params 存储关键筛选,Apply Filters 提交
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SERVICE_STYLE_LABEL, APPOINTMENT_LABEL, type ServiceStyle, type AppointmentType } from "@/lib/massage-labels";

const LANGUAGES = ["Chinese", "English", "Thai", "Vietnamese", "Filipino", "Japanese", "Korean"];
const TAGS = ["asian", "thai", "filipina", "vietnamese", "chinese", "japanese", "korean", "european", "mixed"];

export default function MassageFilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Draft state (提交前不 push URL)
  const [priceMax, setPriceMax] = useState(sp.get("priceMax") ?? "");
  const [ageMin, setAgeMin]   = useState(sp.get("ageMin") ?? "");
  const [ageMax, setAgeMax]   = useState(sp.get("ageMax") ?? "");
  const [style, setStyle]     = useState<ServiceStyle | "">((sp.get("style") as ServiceStyle) ?? "");
  const [apt, setApt]         = useState<AppointmentType | "">((sp.get("apt") as AppointmentType) ?? "");
  const [lang, setLang]       = useState(sp.get("language") ?? "");
  const [tag, setTag]         = useState(sp.get("tag") ?? "");
  const [verified, setVerified] = useState(sp.get("verified") === "1");
  const [online, setOnline]     = useState(sp.get("online") === "1");
  const [today, setToday]       = useState(sp.get("today") === "1");
  const [video, setVideo]       = useState(sp.get("video") === "1");
  const [vip, setVip]           = useState(sp.get("vip") === "1");

  useEffect(() => { setSheetOpen(false); }, [pathname]);

  const activeCount = useMemo(() => {
    let n = 0;
    if (priceMax) n++;
    if (ageMin) n++;
    if (ageMax) n++;
    if (style) n++;
    if (apt) n++;
    if (lang) n++;
    if (tag) n++;
    if (verified) n++;
    if (online) n++;
    if (today) n++;
    if (video) n++;
    if (vip) n++;
    return n;
  }, [priceMax, ageMin, ageMax, style, apt, lang, tag, verified, online, today, video, vip]);

  function apply() {
    const p = new URLSearchParams(sp.toString());
    const set = (k: string, v: string | boolean | undefined) => {
      if (v === true) p.set(k, "1");
      else if (v && v !== "") p.set(k, String(v));
      else p.delete(k);
    };
    set("priceMax", priceMax);
    set("ageMin", ageMin);
    set("ageMax", ageMax);
    set("style", style);
    set("apt", apt);
    set("language", lang);
    set("tag", tag);
    set("verified", verified);
    set("online", online);
    set("today", today);
    set("video", video);
    set("vip", vip);
    router.push(p.toString() ? `${pathname}?${p}` : pathname);
    setSheetOpen(false);
  }

  function clear() {
    setPriceMax(""); setAgeMin(""); setAgeMax("");
    setStyle(""); setApt(""); setLang(""); setTag("");
    setVerified(false); setOnline(false); setToday(false); setVideo(false); setVip(false);
    router.push(pathname);
    setSheetOpen(false);
  }

  const body = (
    <div className="ms-fs-body">
      {/* Rate */}
      <div className="ms-fs-sec">
        <h5>Rates</h5>
        <div className="ms-fs-range">
          <input type="number" placeholder="Min" value="" disabled title="Min £/hr" />
          <span>—</span>
          <input type="number" placeholder="Max £/hr" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
        </div>
      </div>

      {/* Service Style */}
      <div className="ms-fs-sec">
        <h5>Service Style</h5>
        <select value={style} onChange={(e) => setStyle(e.target.value as ServiceStyle | "")}>
          <option value="">All styles</option>
          {(Object.keys(SERVICE_STYLE_LABEL) as ServiceStyle[]).map((k) => (
            <option key={k} value={k}>{SERVICE_STYLE_LABEL[k].en}</option>
          ))}
        </select>
      </div>

      {/* Appointment */}
      <div className="ms-fs-sec">
        <h5>Appointment Type</h5>
        <select value={apt} onChange={(e) => setApt(e.target.value as AppointmentType | "")}>
          <option value="">Any</option>
          {(Object.keys(APPOINTMENT_LABEL) as AppointmentType[]).map((k) => (
            <option key={k} value={k}>{APPOINTMENT_LABEL[k].en}</option>
          ))}
        </select>
      </div>

      {/* Age */}
      <div className="ms-fs-sec">
        <h5>Age (18+)</h5>
        <div className="ms-fs-range">
          <input type="number" min={18} placeholder="Min 18" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} />
          <span>—</span>
          <input type="number" min={18} placeholder="Max" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} />
        </div>
      </div>

      {/* Language */}
      <div className="ms-fs-sec">
        <h5>Language</h5>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="">Any</option>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Culture / Tag */}
      <div className="ms-fs-sec">
        <h5>Culture / Tags</h5>
        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">Any</option>
          {TAGS.map((t) => <option key={t} value={t} style={{ textTransform: "capitalize" }}>{t}</option>)}
        </select>
      </div>

      {/* Toggles */}
      <div className="ms-fs-sec">
        <h5>Verification & Media</h5>
        <label className="ms-fs-toggle"><input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} /> Identity verified</label>
        <label className="ms-fs-toggle"><input type="checkbox" checked={video} onChange={(e) => setVideo(e.target.checked)} /> Video introduction</label>
        <label className="ms-fs-toggle"><input type="checkbox" checked={vip} onChange={(e) => setVip(e.target.checked)} /> VIP</label>
      </div>

      <div className="ms-fs-sec">
        <h5>Availability</h5>
        <label className="ms-fs-toggle"><input type="checkbox" checked={online} onChange={(e) => setOnline(e.target.checked)} /> Online now</label>
        <label className="ms-fs-toggle"><input type="checkbox" checked={today} onChange={(e) => setToday(e.target.checked)} /> Available today</label>
      </div>

      <div className="ms-fs-actions">
        <button type="button" onClick={clear} className="ms-fs-btn ms-fs-btn--ghost">Clear</button>
        <button type="button" onClick={apply} className="ms-fs-btn ms-fs-btn--primary">Apply Filters</button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="ms-fs-desktop" aria-label="Filters">
        <div className="ms-fs-head">
          <h4>Filters</h4>
          {activeCount > 0 && <span className="ms-fs-count">{activeCount}</span>}
        </div>
        {body}
      </aside>

      {/* Mobile trigger */}
      <button className="ms-fs-mobile-trigger" type="button" onClick={() => setSheetOpen(true)}>
        <span>Filters</span>
        {activeCount > 0 && <span className="ms-fs-count">{activeCount}</span>}
      </button>

      {/* Mobile bottom sheet */}
      {sheetOpen && (
        <div className="ms-fs-sheet-bd" onClick={() => setSheetOpen(false)}>
          <div className="ms-fs-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="ms-fs-sheet-h">
              <h4>Filters</h4>
              <button onClick={() => setSheetOpen(false)} aria-label="Close">×</button>
            </div>
            {body}
          </div>
        </div>
      )}

      <style jsx>{`
        .ms-fs-desktop{background:#fff;border:1px solid var(--line);border-radius:18px;padding:20px 22px;position:sticky;top:80px;max-height:calc(100vh - 100px);overflow-y:auto}
        .ms-fs-head{display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--line)}
        .ms-fs-head h4{font-size:14px;letter-spacing:.05em;color:#161618;font-weight:700;margin:0}
        .ms-fs-count{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;padding:0 6px;background:#161618;color:#EEDDB8;border-radius:999px;font-size:11px;font-weight:700}
        .ms-fs-body{display:flex;flex-direction:column;gap:20px}
        .ms-fs-sec h5{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:#8a8a92;font-weight:700;margin:0 0 8px}
        .ms-fs-sec select,.ms-fs-sec input[type="number"]{width:100%;padding:9px 12px;border:1px solid #E8E8EC;border-radius:10px;background:#F8F8F9;color:#161618;font:inherit;font-size:13.5px;outline:none}
        .ms-fs-sec select:focus,.ms-fs-sec input:focus{border-color:#161618;background:#fff}
        .ms-fs-range{display:flex;align-items:center;gap:8px}
        .ms-fs-range span{color:#8a8a92}
        .ms-fs-toggle{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13.5px;color:#3d3d42;cursor:pointer;user-select:none}
        .ms-fs-toggle input{width:16px;height:16px}
        .ms-fs-actions{display:flex;gap:8px;margin-top:8px;padding-top:16px;border-top:1px solid var(--line)}
        .ms-fs-btn{flex:1;padding:10px;border-radius:12px;font:inherit;font-weight:700;font-size:13.5px;cursor:pointer;border:0;transition:opacity .12s}
        .ms-fs-btn--ghost{background:#F4F4F5;color:#161618}
        .ms-fs-btn--primary{background:#161618;color:#fff}

        .ms-fs-mobile-trigger{display:none;position:sticky;top:60px;z-index:5;background:#161618;color:#EEDDB8;border:0;padding:10px 16px;border-radius:999px;font:inherit;font-weight:700;font-size:13px;cursor:pointer;align-items:center;gap:8px;margin:0 0 12px;box-shadow:0 8px 24px -12px rgba(0,0,0,.3)}

        .ms-fs-sheet-bd{position:fixed;inset:0;background:rgba(10,10,12,.55);backdrop-filter:blur(6px);z-index:900;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn .18s}
        .ms-fs-sheet{width:100%;max-height:88vh;background:#fff;border-radius:22px 22px 0 0;padding:16px 20px 24px;overflow-y:auto;animation:slideUp .24s cubic-bezier(.2,.9,.3,1.1)}
        .ms-fs-sheet-h{display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;margin-bottom:14px;border-bottom:1px solid var(--line);position:sticky;top:0;background:#fff;z-index:1}
        .ms-fs-sheet-h h4{font-size:16px;font-weight:700;margin:0}
        .ms-fs-sheet-h button{background:none;border:0;font-size:26px;color:#8a8a92;cursor:pointer;line-height:1;padding:0 6px}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}

        @media (max-width:1024px){
          .ms-fs-desktop{display:none}
          .ms-fs-mobile-trigger{display:inline-flex}
        }
      `}</style>
    </>
  );
}
