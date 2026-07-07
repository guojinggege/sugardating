// Shared validators — used by API routes + client forms

export function isValidEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function isValidPassword(v: unknown): v is string {
  return typeof v === "string" && v.length >= 8 && v.length <= 128;
}

export function isValidName(v: unknown): v is string {
  return typeof v === "string" && v.trim().length >= 1 && v.trim().length <= 60;
}

export function isNonEmptyString(v: unknown, max = 200): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.trim().length <= max;
}
