import { createPersistedStore, usePersistedStore } from './persisted-store';

import { JLPT_LEVELS, type JlptLevel } from '@/data/vocab';

/** 限時挑戰每個等級的最高分 */
type BestScores = Partial<Record<JlptLevel, number>>;

const EMPTY: BestScores = {};

const challengeStore = createPersistedStore<BestScores>({
  key: 'challenge-best',
  initial: EMPTY,
  serialize: (scores) => JSON.stringify(scores),
  deserialize: (raw) => {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const scores: BestScores = {};
      for (const level of JLPT_LEVELS) {
        const value = parsed?.[level];
        if (typeof value === 'number' && value >= 0) scores[level] = value;
      }
      return scores;
    } catch {
      return null;
    }
  },
});

/** 比最高分高才記錄 */
export function recordChallengeScore(level: JlptLevel, score: number) {
  challengeStore.update((current) =>
    score > (current[level] ?? 0) ? { ...current, [level]: score } : current,
  );
}

export function useBestScores(): BestScores {
  return usePersistedStore(challengeStore, EMPTY);
}
