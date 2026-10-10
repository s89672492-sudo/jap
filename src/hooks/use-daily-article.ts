import { useEffect, useState } from 'react';

import { READING_BY_LEVEL, type ReadingArticle } from '@/data/reading';
import type { JlptLevel } from '@/data/vocab';
import { dateKey, pickDaily, readingStreak } from '@/lib/daily';
import {
  saveDailyPick,
  useDailyPicks,
  useReadArticles,
  useReadingDays,
  useReadingLoaded,
} from '@/stores/reading-store';

export type DailyArticle = {
  article: ReadingArticle;
  /** 今天有沒有讀完任何一篇 */
  doneToday: boolean;
  /** 連續閱讀天數 */
  streak: number;
};

/**
 * 今日文章：每天每個等級固定一篇，優先選還沒讀過的。
 * 跟日期有關，所以等畫面載入後才計算（網頁版預先產生的 HTML 不知道今天是幾號）。
 */
export function useDailyArticle(level: JlptLevel): DailyArticle | null {
  const [today, setToday] = useState<string | null>(null);
  const loaded = useReadingLoaded();
  const read = useReadArticles();
  const days = useReadingDays();
  const daily = useDailyPicks();

  useEffect(() => {
    setToday(dateKey());
  }, []);

  const articles = READING_BY_LEVEL[level];
  const savedId = today && daily.date === today ? daily.picks[level] : undefined;
  const saved = articles.find((a) => a.id === savedId);
  const article = saved ?? (today ? pickDaily(articles, read, today) : undefined);

  useEffect(() => {
    if (loaded && today && article && !saved) saveDailyPick(today, level, article.id);
  }, [loaded, today, article, saved, level]);

  if (!loaded || !today || !article) return null;
  return { article, doneToday: days.has(today), streak: readingStreak(days) };
}
