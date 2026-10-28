import { isDue, recallChance, type StoredCard } from '@/lib/srs';
import { shuffle } from '@/lib/quiz';

/** 每一輪大約幾成題目留給「該複習」的項目，其餘出新的，兼顧複習和進度 */
const REVIEW_SHARE = 0.6;

/**
 * 依學習紀錄挑一輪要出的題目：
 * 1. 到期該複習的（越快忘記的越先）
 * 2. 錯題本裡、或常答錯的
 * 3. 還沒練過的新項目
 * 4. 其他（還沒到期的）
 * 該複習的最多佔六成，剩下的出新題；不夠時再互相補滿。
 */
export function pickForStudy<T extends { id: string }>(
  items: T[],
  count: number,
  cards: Record<string, StoredCard>,
  mistakes: ReadonlySet<string>,
  now = Date.now(),
): T[] {
  const due: T[] = [];
  const weak: T[] = [];
  const fresh: T[] = [];
  const later: T[] = [];
  for (const item of items) {
    const card = cards[item.id];
    if (isDue(card, now)) due.push(item);
    else if (mistakes.has(item.id) || (card && card.l > 0)) weak.push(item);
    else if (!card) fresh.push(item);
    else later.push(item);
  }
  due.sort((a, b) => recallChance(cards[a.id], now) - recallChance(cards[b.id], now));
  weak.sort((a, b) => (cards[b.id]?.l ?? 0) - (cards[a.id]?.l ?? 0));
  later.sort((a, b) => cards[a.id].d - cards[b.id].d);

  const review = [...due, ...weak];
  const reviewQuota = Math.ceil(count * REVIEW_SHARE);
  const picked = review.slice(0, reviewQuota);
  const newOnes = shuffle(fresh).slice(0, count - picked.length);
  picked.push(...newOnes);
  if (picked.length < count)
    picked.push(...review.slice(reviewQuota, reviewQuota + count - picked.length));
  if (picked.length < count) picked.push(...later.slice(0, count - picked.length));
  return picked;
}
