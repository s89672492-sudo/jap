import type { ExamFrequencyTag, VocabExample, VocabWord, WordRelation } from './types';

import { stripRuby } from '@/lib/furigana';

/** 另外存放的單字資料（方便維護），載入等級時合併到單字上 */
type WordExtras = {
  /** 真題頻率，key 是單字 id */
  frequency?: Record<string, ExamFrequencyTag>;
  /** 同義詞、反義詞，key 是單字 id */
  related?: Record<string, WordRelation[]>;
};

/** 把例句（例句檔裡存的是加了假名注音的句子）、真題頻率和相關單字合併到單字上 */
export function withExamples(
  words: VocabWord[],
  examples: Record<string, VocabExample>,
  extras: WordExtras = {},
): VocabWord[] {
  return words.map((word) => {
    const raw = examples[word.id];
    const freq = extras.frequency?.[word.id];
    const related = extras.related?.[word.id];
    if (!raw && !freq && !related) return word;
    return {
      ...word,
      ...(raw && { example: { ja: stripRuby(raw.ja), zh: raw.zh, furigana: raw.ja } }),
      ...(freq && { freq: freq[0], ...(freq[1] && { freqLevel: freq[1] }) }),
      ...(related && { related }),
    };
  });
}
