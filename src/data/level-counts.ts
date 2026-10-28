import type { JlptLevel } from '@/data/vocab';

/**
 * 各等級的單字、文法、文章數量：首頁和進度總覽只需要數量，不必為了算百分比下載整個等級的資料。
 * 資料增減時要一起更新（npm run check:data 會檢查數量是否一致）。
 */
export const LEVEL_COUNTS: Record<JlptLevel, { words: number; grammar: number; reading: number }> =
  {
    N5: { words: 975, grammar: 120, reading: 20 },
    N4: { words: 1476, grammar: 182, reading: 20 },
    N3: { words: 2459, grammar: 219, reading: 20 },
    N2: { words: 2363, grammar: 221, reading: 20 },
    N1: { words: 2345, grammar: 258, reading: 20 },
  };
