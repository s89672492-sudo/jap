import type { VocabWord } from '@/data/vocab';

export type QuizQuestion = {
  word: VocabWord;
  /** 四個中文選項（已打亂），其中一個是 word.meaning */
  options: string[];
};

/** 每一輪的題數 */
export const QUESTIONS_PER_ROUND = 10;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 從同一個等級的單字出一輪題目：看日文選中文。
 * 錯誤選項取自同等級的其他單字，且不會和正確答案重複。
 */
export function buildRound(words: VocabWord[], count = QUESTIONS_PER_ROUND): QuizQuestion[] {
  const targets = shuffle(words).slice(0, Math.min(count, words.length));

  return targets.map((word) => {
    const distractors = shuffle(
      [...new Set(words.map((w) => w.meaning))].filter((meaning) => meaning !== word.meaning),
    ).slice(0, 3);

    return { word, options: shuffle([word.meaning, ...distractors]) };
  });
}
