/**
 * 拼寫練習：只看中文意思和詞性，用假名方塊拼出讀音。
 *
 * - 讀音切成一拍一格：拗音（きょ、チョ）和前一個字黏成一格；促音っ、長音ー、撥音ん各自一格。
 * - 干擾方塊挑「容易搞混」的假名：清音和濁音、半濁音（か／が、は／ば／ぱ）、同一行（か／き）、
 *   長得像的字（ぬ／め、シ／ツ）、大小寫（つ／っ、よ／ょ）。
 * - 干擾方塊不會和答案的任何一格相同，而每個答案的切法只有一種，
 *   所以只有一種排法能拼出正確讀音。
 */
import { shuffle } from '@/lib/quiz';

const SMALL = new Set([...'ゃゅょぁぃぅぇぉゎャュョァィゥェォヮ']);

/** 把讀音切成方塊：拗音、小寫假名黏在前一個字上 */
export function splitKana(reading: string): string[] {
  const tiles: string[] = [];
  for (const char of reading) {
    if (SMALL.has(char) && tiles.length > 0) tiles[tiles.length - 1] += char;
    else tiles.push(char);
  }
  return tiles;
}

/** 只有平假名或片假名（含長音、促音）的讀音才能拼 */
export function isSpellable(reading: string): boolean {
  if (!/^[ぁ-ゖァ-ヺー]+$/.test(reading)) return false;
  const count = splitKana(reading).length;
  return count >= 2 && count <= 8;
}

const toKatakana = (s: string) =>
  s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
const toHiragana = (s: string) =>
  s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

// 五十音的行（同一行的字互相干擾）
const ROWS = [
  'あいうえお',
  'かきくけこ',
  'がぎぐげご',
  'さしすせそ',
  'ざじずぜぞ',
  'たちつてと',
  'だぢづでど',
  'なにぬねの',
  'はひふへほ',
  'ばびぶべぼ',
  'ぱぴぷぺぽ',
  'まみむめも',
  'やゆよ',
  'らりるれろ',
  'わをん',
];
// 清音 ↔ 濁音 ↔ 半濁音
const VOICING: string[][] = [
  ['か', 'が'],
  ['き', 'ぎ'],
  ['く', 'ぐ'],
  ['け', 'げ'],
  ['こ', 'ご'],
  ['さ', 'ざ'],
  ['し', 'じ'],
  ['す', 'ず'],
  ['せ', 'ぜ'],
  ['そ', 'ぞ'],
  ['た', 'だ'],
  ['ち', 'ぢ', 'じ'],
  ['つ', 'づ', 'ず'],
  ['て', 'で'],
  ['と', 'ど'],
  ['は', 'ば', 'ぱ'],
  ['ひ', 'び', 'ぴ'],
  ['ふ', 'ぶ', 'ぷ'],
  ['へ', 'べ', 'ぺ'],
  ['ほ', 'ぼ', 'ぽ'],
];
// 長得像的字（平假名）
const LOOKALIKE: string[][] = [
  ['ぬ', 'め'],
  ['ね', 'れ', 'わ'],
  ['る', 'ろ'],
  ['さ', 'ち'],
  ['は', 'ほ'],
  ['い', 'り'],
  ['あ', 'お'],
  ['き', 'さ'],
  ['こ', 'に'],
  ['う', 'つ'],
];
// 長得像的字（片假名）
const LOOKALIKE_KATAKANA: string[][] = [
  ['シ', 'ツ'],
  ['ソ', 'ン'],
  ['ク', 'ケ', 'タ'],
  ['ウ', 'ワ', 'フ'],
  ['ス', 'ヌ'],
  ['コ', 'ユ'],
  ['チ', 'テ'],
  ['ア', 'マ'],
  ['ル', 'レ'],
  ['ノ', 'メ'],
];
// 促音和つ容易拼錯（ゃゅょ不能單獨一格，拗音的大小寫由下面的「換小字、拿掉小字」處理）
const SIZE: string[][] = [['つ', 'っ']];

function groupsOf(char: string): string[][] {
  return [...ROWS.map((row) => [...row]), ...VOICING, ...LOOKALIKE, ...SIZE].filter((group) =>
    group.includes(char),
  );
}

/** 一格的「容易搞混」候選（同樣是平假名或片假名，和原本的格子長度相同） */
export function confusables(tile: string): string[] {
  const katakana = /[ァ-ヺ]/.test(tile);
  const hira = toHiragana(tile);
  const head = hira[0];
  const tail = hira.slice(1); // 拗音的小字，例如「きょ」的「ょ」
  const out = new Set<string>();
  const add = (s: string) => out.add(katakana ? toKatakana(s) : s);

  if (tile === 'ー') {
    for (const c of katakana ? ['ウ', 'イ'] : ['う', 'い']) out.add(c);
  } else {
    for (const group of groupsOf(head)) for (const c of group) if (c !== head) add(c + tail);
    // 拗音：換另一個小字（きょ → きゅ、きゃ），或拿掉小字（きょ → き）
    if (tail) {
      for (const small of ['ゃ', 'ゅ', 'ょ']) if (small !== tail) add(head + small);
      add(head);
    }
    if (katakana) {
      for (const group of LOOKALIKE_KATAKANA)
        if (group.includes(tile[0]))
          for (const c of group) if (c !== tile[0]) out.add(c + tile.slice(1));
    }
  }
  out.delete(tile);
  return [...out];
}

export type SpellingQuestion<W> = {
  word: W;
  /** 正確答案的方塊，依順序 */
  answer: string[];
  /** 打亂後的全部方塊（答案 + 干擾） */
  tiles: string[];
};

/** 一題：答案方塊加上最多 extra 個干擾方塊（干擾方塊不會和答案的任何一格相同） */
export function buildSpellingQuestion<W extends { reading: string }>(
  word: W,
  extra = 4,
): SpellingQuestion<W> {
  const answer = splitKana(word.reading);
  const answerSet = new Set(answer);
  const want = Math.max(2, Math.min(extra, 10 - answer.length));
  // 每一格輪流挑一個容易搞混的，干擾方塊才會分散在不同的字上
  const lists = shuffle([...new Set(answer)]).map((tile) =>
    shuffle(confusables(tile)).filter((c) => !answerSet.has(c)),
  );
  const distractors: string[] = [];
  for (let round = 0; distractors.length < want && lists.some((l) => l.length > round); round++) {
    for (const list of lists) {
      const c = list[round];
      if (c && !distractors.includes(c) && distractors.length < want) distractors.push(c);
    }
  }
  return { word, answer, tiles: shuffle([...answer, ...distractors]) };
}
