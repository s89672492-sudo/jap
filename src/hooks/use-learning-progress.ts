import { useMemo, useSyncExternalStore } from 'react';

import { dateKey } from '@/lib/daily';
import { learningStreak, levelProgress, type LevelProgress } from '@/lib/progress';
import type { JlptLevel } from '@/data/vocab';
import { useMistakes, useMistakesLoaded } from '@/stores/mistakes-store';
import { useReadingDays, useReadingLoaded } from '@/stores/reading-store';
import { useStudyCards, useStudyLoaded, useStudyLog, type StudyLog } from '@/stores/study-store';

const MINUTE = 60 * 1000;

const subscribeMinute = (onChange: () => void) => {
  const timer = setInterval(onChange, MINUTE);
  return () => clearInterval(timer);
};

/**
 * 現在時間（每分鐘更新一次），用來判斷哪些項目到期。
 * 網頁版預先產生的畫面不知道現在幾點，回傳 null，載入到裝置後才有值。
 */
export function useNow(): number | null {
  return useSyncExternalStore(
    subscribeMinute,
    () => Math.floor(Date.now() / MINUTE) * MINUTE,
    () => null,
  );
}

export type LearningProgress = {
  now: number;
  today: string;
  levels: Record<JlptLevel, LevelProgress>;
  log: StudyLog;
  streak: number;
  /** 今天有沒有讀完文章 */
  readToday: boolean;
};

/** 首頁和進度總覽用的統計；紀錄還沒從手機讀回來時回傳 null */
export function useLearningProgress(): LearningProgress | null {
  const now = useNow();
  const cards = useStudyCards();
  const log = useStudyLog();
  const mistakes = useMistakes();
  const readingDays = useReadingDays();
  const studyLoaded = useStudyLoaded();
  const mistakesLoaded = useMistakesLoaded();
  const readingLoaded = useReadingLoaded();
  const loaded = studyLoaded && mistakesLoaded && readingLoaded;

  const levels = useMemo(
    () => (now === null ? null : levelProgress(cards, mistakes, now)),
    [cards, mistakes, now],
  );

  if (!loaded || now === null || !levels) return null;
  const today = dateKey(new Date(now));
  return {
    now,
    today,
    levels,
    log,
    streak: learningStreak(log, readingDays, now),
    readToday: readingDays.has(today),
  };
}
