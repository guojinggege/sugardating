"use client";
// Search Panel — 顶部大搜索条 (keyword + city + distance)
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { CITY_LIST as cities } from "@/lib/massage-labels";

interface Props {
  defaultCity?: string;
  defaultKeyword?: string;
  defaultDistance?: string;
}

export default function MassageSearchPanel({ defaultCity = "", defaultKeyword = "", defaultDistance = "10" }: Props) {
  const router = useRouter();
  const [kw, setKw] = useState(defaultKeyword);
  const [city, setCity] = useState(defaultCity);
  const [distance, setDistance] = useState(defaultDistance);

  function submit(e: FormEvent) {
    e.preventDefault();
    const target = city ? `/massage/${city}` : "/massage";
    const params = new URLSearchParams();
    if (kw) params.set("q", kw);
    if (distance && distance !== "10") params.set("d", distance);
    router.push(params.toString() ? `${target}?${params}` : target);
  }

  return (
    <form className="ms-search" onSubmit={submit} role="search">
      <div className="ms-search-row">
        <label className="ms-field ms-field--kw">
          <span>Keyword</span>
          <input
            type="text"
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            placeholder="搜索昵称、语言、服务或关键词"
          />
        </label>
        <label className="ms-field">
          <span>Category</span>
          <input type="text" value="Sensual Massage" readOnly disabled />
        </label>
        <label className="ms-field">
          <span>Location</span>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">All UK cities</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
        </label>
        <label className="ms-field ms-field--sm">
          <span>Distance</span>
          <select value={distance} onChange={(e) => setDistance(e.target.value)}>
            <option value="0">0 mi</option>
            <option value="1">1 mi</option>
            <option value="5">5 mi</option>
            <option value="10">10 mi</option>
            <option value="20">20 mi</option>
            <option value="50">50 mi</option>
          </select>
        </label>
        <button type="submit" className="ms-search-btn">Search</button>
      </div>
      <style jsx>{`
        .ms-search{background:#fff;border:1px solid var(--line);border-radius:20px;padding:14px;box-shadow:0 8px 30px -18px rgba(0,0,0,.1)}
        .ms-search-row{display:grid;grid-template-columns:1.5fr 1fr 1fr 0.7fr auto;gap:8px;align-items:end}
        .ms-field{display:flex;flex-direction:column;gap:4px;min-width:0}
        .ms-field span{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#8a8a92;font-weight:700;padding-left:2px}
        .ms-field input,.ms-field select{padding:11px 12px;border:1px solid #E8E8EC;border-radius:12px;font:inherit;font-size:14px;background:#F8F8F9;color:#161618;outline:none;transition:background .12s,border-color .12s}
        .ms-field input:focus,.ms-field select:focus{background:#fff;border-color:#161618}
        .ms-field input:disabled{opacity:.7;cursor:not-allowed}
        .ms-search-btn{padding:12px 22px;border-radius:12px;background:#161618;color:#fff;border:0;font:inherit;font-weight:700;font-size:14px;cursor:pointer;height:44px;transition:transform .12s}
        .ms-search-btn:hover{transform:translateY(-1px)}
        @media (max-width:900px){
          .ms-search-row{grid-template-columns:1fr 1fr;gap:8px}
          .ms-field--kw{grid-column:1/-1}
          .ms-search-btn{grid-column:1/-1;height:46px}
        }
      `}</style>
    </form>
  );
}
