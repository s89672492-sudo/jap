import { N1_EXAMPLES } from './examples/n1';
import { N2_EXAMPLES } from './examples/n2';
import { N3_EXAMPLES } from './examples/n3';
import { N4_EXAMPLES } from './examples/n4';
import { N5_EXAMPLES } from './examples/n5';
import { N1_WORDS } from './n1';
import { N2_WORDS } from './n2';
import { N3_WORDS } from './n3';
import { N4_WORDS } from './n4';
import { N5_WORDS } from './n5';
import type { JlptLevel, VocabExample, VocabWord } from './types';

import { stripRuby } from '@/lib/furigana';

export { PART_OF_SPEECH_LABELS } from './types';
export type { JlptLevel, PartOfSpeech, VocabExample, VocabWord } from './types';

/** 由簡單到難排列，給切換按鈕使用 */
export const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

/** 把例句（另外存放，方便維護）合併到單字上；例句檔裡存的是加了假名注音的句子 */
function withExamples(words: VocabWord[], examples: Record<string, VocabExample>): VocabWord[] {
  return words.map((word) => {
    const raw = examples[word.id];
    if (!raw) return word;
    return { ...word, example: { ja: stripRuby(raw.ja), zh: raw.zh, furigana: raw.ja } };
  });
}

export const VOCAB_BY_LEVEL: Record<JlptLevel, VocabWord[]> = {
  N5: withExamples(N5_WORDS, N5_EXAMPLES),
  N4: withExamples(N4_WORDS, N4_EXAMPLES),
  N3: withExamples(N3_WORDS, N3_EXAMPLES),
  N2: withExamples(N2_WORDS, N2_EXAMPLES),
  N1: withExamples(N1_WORDS, N1_EXAMPLES),
};
