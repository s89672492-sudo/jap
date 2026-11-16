/**
 * 考試鎖的密碼：4〜8 位數字。
 * 手機裡只存加鹽後的雜湊，不存密碼本身。這只是讓密碼不會直接被看到，
 * 不是高強度的加密（能打開手機儲存空間的人仍可以清掉它）。
 */

export type ExamPin = { salt: string; hash: string };

export const PIN_MIN = 4;
export const PIN_MAX = 8;

export function isValidPin(pin: string): boolean {
  return new RegExp(`^\\d{${PIN_MIN},${PIN_MAX}}$`).test(pin);
}

/** FNV-1a（32 位元），重複多次讓逐一嘗試慢一點 */
function fnv(text: string, seed: number): number {
  let h = seed >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

export function hashPin(pin: string, salt: string): string {
  let a = 0x811c9dc5;
  let b = 0x01234567;
  for (let round = 0; round < 2000; round++) {
    a = fnv(`${salt}:${pin}:${b}`, a);
    b = fnv(`${pin}:${a}:${salt}`, b ^ round);
  }
  return a.toString(16).padStart(8, '0') + b.toString(16).padStart(8, '0');
}

export function makePin(pin: string, random: () => number = Math.random): ExamPin {
  const salt = Array.from({ length: 4 }, () =>
    Math.floor(random() * 0x10000)
      .toString(16)
      .padStart(4, '0'),
  ).join('');
  return { salt, hash: hashPin(pin, salt) };
}

export function checkPin(saved: ExamPin, pin: string): boolean {
  return isValidPin(pin) && hashPin(pin, saved.salt) === saved.hash;
}

export function parsePin(value: unknown): ExamPin | null {
  const p = value as ExamPin;
  return typeof p?.salt === 'string' && typeof p?.hash === 'string' && /^[0-9a-f]{16}$/.test(p.hash)
    ? { salt: p.salt, hash: p.hash }
    : null;
}
