// Wallet / Coins — 演示阶段 in-memory 存储 · 未来接真支付
import { randomBytes } from "node:crypto";

export interface WalletBalance {
  userId: string;
  coins: number;
  updatedAt: string;
}

export interface WalletTx {
  id: string;
  userId: string;
  type: "top-up" | "spend" | "refund";
  amount: number;         // positive for top-up/refund, negative for spend
  memo?: string;
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __sgWallets: Map<string, WalletBalance> | undefined;
  // eslint-disable-next-line no-var
  var __sgWalletTx: Map<string, WalletTx[]> | undefined;
}
const wallets = globalThis.__sgWallets ?? new Map<string, WalletBalance>();
const txs     = globalThis.__sgWalletTx ?? new Map<string, WalletTx[]>();
globalThis.__sgWallets = wallets;
globalThis.__sgWalletTx = txs;

const DEFAULT_COINS = 30;

export function getWallet(userId: string): WalletBalance {
  let w = wallets.get(userId);
  if (!w) {
    w = { userId, coins: DEFAULT_COINS, updatedAt: new Date().toISOString() };
    wallets.set(userId, w);
  }
  return w;
}

export function topUp(userId: string, amount: number, memo?: string): WalletBalance {
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100_000) {
    throw new Error("INVALID_AMOUNT");
  }
  const w = getWallet(userId);
  w.coins += Math.round(amount);
  w.updatedAt = new Date().toISOString();
  wallets.set(userId, w);
  addTx({ userId, type: "top-up", amount: Math.round(amount), memo });
  return w;
}

export function spend(userId: string, amount: number, memo?: string): WalletBalance {
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("INVALID_AMOUNT");
  const w = getWallet(userId);
  if (w.coins < amount) throw new Error("INSUFFICIENT_BALANCE");
  w.coins -= Math.round(amount);
  w.updatedAt = new Date().toISOString();
  wallets.set(userId, w);
  addTx({ userId, type: "spend", amount: -Math.round(amount), memo });
  return w;
}

function addTx(input: Omit<WalletTx, "id" | "createdAt">): WalletTx {
  const tx: WalletTx = { ...input, id: `tx_${randomBytes(4).toString("hex")}`, createdAt: new Date().toISOString() };
  const arr = txs.get(input.userId) ?? [];
  arr.push(tx);
  txs.set(input.userId, arr);
  return tx;
}

// 充值套餐(mock)
export const TOPUP_PACKAGES = [
  { coins: 50,  price: "S$ 5",   badge: null as string | null },
  { coins: 100, price: "S$ 9",   badge: "最受欢迎" },
  { coins: 300, price: "S$ 25",  badge: null },
  { coins: 500, price: "S$ 39",  badge: "超值" },
];
