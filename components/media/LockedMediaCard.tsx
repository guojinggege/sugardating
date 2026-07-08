"use client";
// 付费媒体卡 — 未解锁只渲染 preview / 占位;解锁成功才注入 real src
// 安全:未解锁状态原始高清 src 不会进入 DOM (无 data attr / hidden img / video source)
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import MediaUnlockModal from "./MediaUnlockModal";
import TopUpModal from "@/components/wallet/TopUpModal";

export interface LockedMediaProps {
  creatorSlug: string;
  creatorName: string;
  mediaId: string;
  type: "image" | "video";
  price: number;                 // coins
  previewSrc?: string;           // 模糊/低清预览
  thumbnail?: string;            // video 缩略图
  aspect?: "1x1" | "16x9" | "9x16" | "4x5";
  className?: string;
  onUnlocked?: () => void;
  onOpenLightbox?: () => void;
}

export default function LockedMediaCard(props: LockedMediaProps) {
  const {
    creatorSlug, creatorName, mediaId, type, price,
    previewSrc, thumbnail, aspect = "4x5", className, onUnlocked, onOpenLightbox,
  } = props;

  const { user } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockedSrc, setUnlockedSrc] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"confirm" | "insufficient" | "login" | null>(null);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // 初次挂载 · 查询是否已解锁
  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/media/access?creatorSlug=${encodeURIComponent(creatorSlug)}&mediaIds=${encodeURIComponent(mediaId)}`);
        const data = await r.json();
        if (!alive || !data.ok) return;
        if (data.access?.[mediaId]) {
          setIsUnlocked(true);
          setUnlockedSrc(data.sources?.[mediaId] ?? null);
        }
      } catch { /* silent */ }
    })();
    return () => { alive = false; };
  }, [user, creatorSlug, mediaId]);

  async function fetchBalance() {
    try {
      const r = await fetch("/api/wallet/balance");
      const data = await r.json();
      if (data.ok) setBalance(data.wallet.coins);
    } catch { /* silent */ }
  }

  async function handleClick() {
    if (isUnlocked) { onOpenLightbox?.(); return; }
    if (!user) { setModalMode("login"); return; }
    await fetchBalance();
    // 直接 attempt unlock,后端会返回 402 if insufficient
    setModalMode("confirm");
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      const r = await fetch("/api/media/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ creatorSlug, mediaId, price }),
      });
      if (r.status === 402) {
        const data = await r.json();
        setBalance(data.wallet?.coins ?? 0);
        setModalMode("insufficient");
        return;
      }
      const data = await r.json();
      if (!data.ok) throw new Error(data.message || "解锁失败");
      setIsUnlocked(true);
      setUnlockedSrc(data.src ?? null);
      setBalance(data.wallet?.coins ?? balance - price);
      setModalMode(null);
      onUnlocked?.();
    } catch (e) {
      alert(e instanceof Error ? e.message : "解锁失败,请重试");
    } finally { setLoading(false); }
  }

  const aspectStyle = useMemo(() => {
    const map: Record<string, string> = { "1x1": "1/1", "16x9": "16/9", "9x16": "9/16", "4x5": "4/5" };
    return { aspectRatio: map[aspect] || "4/5" };
  }, [aspect]);

  // ==== 解锁后渲染 · 只有此分支 DOM 里才有真实 src
  if (isUnlocked && unlockedSrc) {
    return (
      <div className={`lm-card lm-card--unlocked ${className || ""}`} style={aspectStyle} onClick={onOpenLightbox}>
        {type === "image" ? (
          <img src={unlockedSrc} alt="" loading="lazy" />
        ) : (
          <video src={unlockedSrc} poster={thumbnail} controls playsInline preload="metadata" />
        )}
        <div className="lm-unlocked-badge">已解锁</div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  // ==== 未解锁 · 只渲染预览 · 无原始 src 泄露
  return (
    <>
      <button
        type="button"
        className={`lm-card lm-card--locked ${className || ""}`}
        style={aspectStyle}
        onClick={handleClick}
        aria-label={`解锁 ${type === "image" ? "照片" : "视频"} · ${price} 金币`}
      >
        {previewSrc ? (
          <img src={previewSrc} alt="" loading="lazy" aria-hidden />
        ) : (
          <div className="lm-placeholder" aria-hidden />
        )}
        <div className="lm-overlay" />
        <div className="lm-lock">
          <div className="lm-lock-ic">🔒</div>
          <div className="lm-lock-price">{price} 金币解锁</div>
          <div className="lm-lock-cta">{type === "image" ? "查看高清照片" : "解锁完整视频"}</div>
        </div>
        {type === "video" && <div className="lm-play">▶</div>}
        <style jsx>{styles}</style>
      </button>

      <MediaUnlockModal
        open={modalMode !== null}
        mode={modalMode || "confirm"}
        price={price}
        balance={balance}
        creatorName={creatorName}
        loading={loading}
        onClose={() => setModalMode(null)}
        onConfirm={handleConfirm}
        onTopUp={() => { setModalMode(null); setTopUpOpen(true); }}
      />
      <TopUpModal
        open={topUpOpen}
        balance={balance}
        onClose={() => setTopUpOpen(false)}
        onSuccess={(newBal) => { setBalance(newBal); setTopUpOpen(false); setModalMode("confirm"); }}
      />
    </>
  );
}

const styles = `
.lm-card{position:relative;display:block;width:100%;overflow:hidden;border-radius:14px;background:#1a1a1c;border:0;padding:0;cursor:pointer;font:inherit}
.lm-card--unlocked{cursor:zoom-in}
.lm-card img,.lm-card video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.lm-card--locked img{filter:blur(24px) brightness(.5) saturate(.7);transform:scale(1.1)}
.lm-placeholder{position:absolute;inset:0;background:linear-gradient(135deg,#2a2a2e,#1a1a1c)}
.lm-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35),rgba(0,0,0,.62))}
.lm-lock{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;padding:14px;text-align:center;gap:6px}
.lm-lock-ic{font-size:32px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5))}
.lm-lock-price{font-size:15px;font-weight:700;color:#EEDDB8;text-shadow:0 1px 4px rgba(0,0,0,.5);margin-top:6px}
.lm-lock-cta{font-size:11px;color:rgba(255,255,255,.75);letter-spacing:.5px;text-transform:uppercase;margin-top:2px}
.lm-play{position:absolute;top:12px;right:12px;background:rgba(0,0,0,.6);color:#fff;font-size:11px;padding:4px 8px;border-radius:99px;backdrop-filter:blur(6px)}
.lm-unlocked-badge{position:absolute;top:10px;right:10px;background:rgba(184,167,137,.9);color:#fff;font-size:10px;font-weight:700;padding:4px 10px;border-radius:99px;letter-spacing:.5px;text-transform:uppercase;backdrop-filter:blur(6px)}
`;
