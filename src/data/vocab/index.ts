import { N1_WORDS } from './n1';
import { N2_WORDS } from './n2';
import { N3_WORDS } from './n3';
import { N4_WORDS } from './n4';
import { N5_WORDS } from './n5';
import type { JlptLevel, VocabWord } from './types';

export type { JlptLevel, VocabWord } from './types';

/** 由簡單到難排列，給切換按鈕使用 */
export const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

export const VOCAB_BY_LEVEL: Record<JlptLevel, VocabWord[]> = {
  N5: N5_WORDS,
  N4: N4_WORDS,
  N3: N3_WORDS,
  N2: N2_WORDS,
  N1: N1_WORDS,
};
