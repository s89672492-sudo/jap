/** 用手機的當地時間算出今天的日期，例如 2026-10-10 */
export function dateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 把日期字串變成固定的數字，同一天每次算出來都一樣 */
function hash(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

/**
 * 今日文章：依日期決定起點，往後找第一篇還沒讀過的；
 * 全部讀完就直接用起點那篇（每天換一篇複習）。
 */
export function pickDaily<T extends { id: string }>(
  items: T[],
  read: ReadonlySet<string>,
  today: string,
): T | undefined {
  if (items.length === 0) return undefined;
  const start = hash(today) % items.length;
  for (let i = 0; i < items.length; i++) {
    const item = items[(start + i) % items.length];
    if (!read.has(item.id)) return item;
  }
  return items[start];
}

/** 連續閱讀天數：從今天往回數；今天還沒讀的話從昨天開始算，不會因為還沒讀就歸零 */
export function readingStreak(days: ReadonlySet<string>, now: Date = new Date()): number {
  const cursor = new Date(now);
  if (!days.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
