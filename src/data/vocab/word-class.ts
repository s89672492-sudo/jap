import { PART_OF_SPEECH_LABELS, type VocabWord } from './types';

/**
 * 細分的詞性：單字資料的 pos 只有「形容詞」一種，這裡依寫法再分成い形容詞、な形容詞。
 * 不改單字資料（也不影響學習紀錄、自動出題），只用在畫面顯示和篩選。
 */
export type WordClass =
  | 'noun'
  | 'verb'
  | 'i-adjective'
  | 'na-adjective'
  | 'taru-adjective'
  | 'prenominal'
  | 'adverb';

export const WORD_CLASS_LABELS: Record<WordClass, string> = {
  noun: '名詞',
  verb: '動詞',
  'i-adjective': 'い形容詞',
  'na-adjective': 'な形容詞',
  'taru-adjective': 'タル形容詞',
  prenominal: '連體詞',
  adverb: '副詞',
};

/** 結尾是「い」但是な形容詞的字（きれいな、嫌いな、幸いな） */
const NA_ENDING_IN_I = new Set(['きれい', '綺麗', '嫌い', '大嫌い', '負けず嫌い', '幸い']);
/** 只能放在名詞前面的字（大きな箱，不能說「大きだ」） */
const PRENOMINAL = new Set(['大きな', '小さな', '決まりきった']);
/** 用「〜と」「〜とした」的字（漠然とした不安） */
const TARU = new Set(['漠然', '歴然', '平然']);

export function wordClass(word: Pick<VocabWord, 'word' | 'pos'>): WordClass {
  if (word.pos !== 'adjective') return word.pos;
  if (PRENOMINAL.has(word.word)) return 'prenominal';
  if (TARU.has(word.word)) return 'taru-adjective';
  if (word.word.endsWith('い') && !NA_ENDING_IN_I.has(word.word)) return 'i-adjective';
  return 'na-adjective';
}

export const wordClassLabel = (word: Pick<VocabWord, 'word' | 'pos'>) =>
  WORD_CLASS_LABELS[wordClass(word)];

/** 單字列表的詞性篩選：大類（名詞、形容詞…）或形容詞的細類 */
export type PosFilter = 'all' | VocabWord['pos'] | 'i-adjective' | 'na-adjective';

export const POS_FILTER_LABELS: Record<PosFilter, string> = {
  all: '全部詞性',
  ...PART_OF_SPEECH_LABELS,
  adjective: '形容詞（全部）',
  'i-adjective': 'い形容詞',
  'na-adjective': 'な形容詞',
};

export function matchesPosFilter(word: Pick<VocabWord, 'word' | 'pos'>, filter: PosFilter) {
  if (filter === 'all') return true;
  if (filter === 'i-adjective' || filter === 'na-adjective') return wordClass(word) === filter;
  return word.pos === filter;
}
