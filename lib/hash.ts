// 密码 hashing — 用 node 自带 crypto.pbkdf2 (100k iterations · sha256 · 16 byte salt · 32 byte key)
// 与 bcrypt 强度相当,无需 npm install
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const ITERATIONS = 100_000;
const KEYLEN = 32;
const DIGEST = "sha256";

// 返回 "pbkdf2$iters$saltHex$hashHex" 格式,可直接存
export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const derived = pbkdf2Sync(plain, salt, ITERATIONS, KEYLEN, DIGEST);
  return `pbkdf2$${ITERATIONS}$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  try {
    const parts = stored.split("$");
    if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
    const iters = parseInt(parts[1], 10);
    const salt = Buffer.from(parts[2], "hex");
    const expected = Buffer.from(parts[3], "hex");
    const actual = pbkdf2Sync(plain, salt, iters, expected.length, DIGEST);
    // 常数时间比较,防 timing attack
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
