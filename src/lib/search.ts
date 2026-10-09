import { GRAMMAR_BY_LEVEL, type GrammarPoint } from '@/data/grammar';
import { JLPT_LEVELS, VOCAB_BY_LEVEL, type VocabWord } from '@/data/vocab';

/** 全部等級的單字和文法（由 N5 到 N1） */
export const ALL_WORDS: VocabWord[] = JLPT_LEVELS.flatMap((level) => VOCAB_BY_LEVEL[level]);
export const ALL_GRAMMAR: GrammarPoint[] = JLPT_LEVELS.flatMap((level) => GRAMMAR_BY_LEVEL[level]);

export const WORD_BY_ID = new Map(ALL_WORDS.map((word) => [word.id, word]));
export const GRAMMAR_BY_ID = new Map(ALL_GRAMMAR.map((point) => [point.id, point]));

/** 統一大小寫、片假名轉平假名、去掉「〜」，讓「タベル」也能找到「たべる」 */
export function normalize(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[〜～~]/g, '')
    .replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

/** 越像越前面：完全相同 → 開頭相同 → 包含 */
function score(fields: string[], query: string): number {
  let best = 0;
  for (const field of fields) {
    const value = normalize(field);
    if (value === query) return 3;
    if (value.startsWith(query)) best = Math.max(best, 2);
    else if (value.includes(query)) best = Math.max(best, 1);
  }
  return best;
}

function rank<T>(items: T[], query: string, fields: (item: T) => string[]): T[] {
  const q = normalize(query);
  if (!q) return [];
  return items
    .map((item, order) => ({ item, order, score: score(fields(item), q) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((entry) => entry.item);
}

/** 用日文、假名或中文找單字（全部等級） */
export function searchWords(query: string): VocabWord[] {
  return rank(ALL_WORDS, query, (word) => [word.word, word.reading, word.meaning]);
}

/** 用句型、中文意思或例句找文法（全部等級） */
export function searchGrammar(query: string): GrammarPoint[] {
  return rank(ALL_GRAMMAR, query, (point) => [point.pattern, point.meaning, point.example.ja]);
}
