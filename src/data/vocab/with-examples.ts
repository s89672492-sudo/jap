import type { VocabExample, VocabWord } from './types';

import { stripRuby } from '@/lib/furigana';

/** 把例句（另外存放，方便維護）合併到單字上；例句檔裡存的是加了假名注音的句子 */
export function withExamples(
  words: VocabWord[],
  examples: Record<string, VocabExample>,
): VocabWord[] {
  return words.map((word) => {
    const raw = examples[word.id];
    if (!raw) return word;
    return {
      ...word,
      example: { ja: stripRuby(raw.ja), zh: raw.zh, furigana: raw.ja },
    };
  });
}
