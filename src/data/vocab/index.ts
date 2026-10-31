import type { JlptLevel } from './types';

export { PART_OF_SPEECH_LABELS } from './types';
export type { JlptLevel, PartOfSpeech, VocabExample, VocabWord } from './types';
export {
  POS_FILTER_LABELS,
  WORD_CLASS_LABELS,
  matchesPosFilter,
  wordClass,
  wordClassLabel,
} from './word-class';
export type { PosFilter, WordClass } from './word-class';

/** 由簡單到難排列，給切換按鈕使用 */
export const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

// 單字資料依等級分批載入，見 data/level-data.ts
