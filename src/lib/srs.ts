import { createEmptyCard, fsrs, Rating, State, type Card } from 'ts-fsrs';

/**
 * 間隔複習（FSRS 演算法，ts-fsrs）：依每次答對、答錯安排下次複習時間。
 * 這裡只放計算，資料存在 stores/study-store.ts。
 */

const scheduler = fsrs({ enable_fuzz: true });

const DAY = 24 * 60 * 60 * 1000;

/** 存在手機裡的精簡格式（時間用毫秒數，欄位名縮短，9,000 多個單字也不會太大） */
export type StoredCard = {
  /** 下次複習時間 */
  d: number;
  /** 記憶穩定度（天） */
  s: number;
  /** 難度 1〜10 */
  f: number;
  /** 上次複習距今天數 */
  e: number;
  /** 排定的間隔天數 */
  i: number;
  /** 學習步驟 */
  ls: number;
  /** 複習次數 */
  r: number;
  /** 忘記次數（答錯過幾次） */
  l: number;
  /** FSRS 狀態：0 新、1 學習、2 複習、3 重新學習 */
  st: State;
  /** 上次複習時間 */
  lr?: number;
  /** 由舊的「已記住」紀錄轉換而來 */
  m?: 1;
};

export function toCard(stored: StoredCard): Card {
  return {
    due: new Date(stored.d),
    stability: stored.s,
    difficulty: stored.f,
    elapsed_days: stored.e,
    scheduled_days: stored.i,
    learning_steps: stored.ls,
    reps: stored.r,
    lapses: stored.l,
    state: stored.st,
    last_review: stored.lr === undefined ? undefined : new Date(stored.lr),
  };
}

export function fromCard(card: Card, migrated?: boolean): StoredCard {
  return {
    d: card.due.getTime(),
    s: Math.round(card.stability * 1000) / 1000,
    f: Math.round(card.difficulty * 1000) / 1000,
    e: card.elapsed_days,
    i: card.scheduled_days,
    ls: card.learning_steps,
    r: card.reps,
    l: card.lapses,
    st: card.state,
    lr: card.last_review?.getTime(),
    ...(migrated ? { m: 1 as const } : {}),
  };
}

/** 答一次題後的新狀態：答對算 Good、答錯算 Again */
export function review(stored: StoredCard | undefined, correct: boolean, now: number): StoredCard {
  const card = stored ? toCard(stored) : createEmptyCard(new Date(now));
  const next = scheduler.next(card, new Date(now), correct ? Rating.Good : Rating.Again).card;
  return fromCard(next);
}

/**
 * 舊的「已記住」單字轉成間隔複習：當作「大約記得 4 天」的複習中單字，
 * 不是永久精通。下次複習時間分散在 1〜10 天後，避免同一天全部到期。
 */
export function migratedKnownCard(id: string, now: number): StoredCard {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const days = 1 + (hash % 10);
  const due = now + days * DAY;
  return {
    d: due,
    s: 4,
    f: 5,
    e: 0,
    i: 4,
    ls: 0,
    r: 1,
    l: 0,
    st: State.Review,
    lr: due - 4 * DAY,
    m: 1,
  };
}

export type Mastery = 'new' | 'learning' | 'reviewing' | 'mastered';

export const MASTERY_LABELS: Record<Mastery, string> = {
  new: '新單字',
  learning: '學習中',
  reviewing: '複習中',
  mastered: '已熟練',
};

/** 複習間隔達到幾天，錯題才算真的會了（從錯題本移除） */
export const GRADUATE_DAYS = 7;
/** 複習間隔達到幾天算「已熟練」 */
export const MASTERED_DAYS = 21;

/**
 * 學習狀態：
 * 新單字（還沒練過）→ 學習中（間隔不到 7 天）→ 複習中（7〜20 天）→ 已熟練（21 天以上）
 */
export function masteryOf(stored: StoredCard | undefined): Mastery {
  if (!stored) return 'new';
  if (stored.st !== State.Review || stored.i < GRADUATE_DAYS) return 'learning';
  return stored.i >= MASTERED_DAYS ? 'mastered' : 'reviewing';
}

/** 錯題是否已經可以從錯題本移除：要在不同天答對幾次、間隔拉長到 7 天以上 */
export function isGraduated(stored: StoredCard | undefined): boolean {
  return stored !== undefined && stored.st === State.Review && stored.i >= GRADUATE_DAYS;
}

export function isDue(stored: StoredCard | undefined, now: number): boolean {
  return stored !== undefined && stored.d <= now;
}

/** 現在還記得的機率（0〜1），越低越該複習 */
export function recallChance(stored: StoredCard, now: number): number {
  return scheduler.get_retrievability(toCard(stored), new Date(now), false);
}

/** 下次複習時間的說明，例如「今天」「3 天後」 */
export function dueLabel(stored: StoredCard, now: number): string {
  const days = Math.ceil((stored.d - now) / DAY);
  if (days <= 0) return '今天';
  if (days === 1) return '明天';
  return `${days} 天後`;
}
