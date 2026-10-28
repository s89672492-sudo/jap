import type { ExamQuestion, ExamQuestionType } from '@/data/exam';
import type { GrammarPoint } from '@/data/grammar';
import { getAllLevels, type AllLevelData } from '@/data/level-data';
import { JLPT_LEVELS, type JlptLevel, type VocabWord } from '@/data/vocab';
import { REAL_WORDS } from '@/data/exam/real-words';
import { lookupFurigana, parseRuby, splitsRuby, type RubySegment } from '@/lib/furigana';

/**
 * 用 App 裡的單字例句和文法例句自動出模擬試題，讓每次模擬考的題目都不一樣。
 * - 漢字讀法：例句裡的單字畫底線，錯誤選項把讀音改成清濁音、長音、促音、拗音容易搞錯的樣子
 * - 表記：例句裡的單字寫成假名，錯誤選項把其中一個漢字換成同音的其他漢字
 * - 文脈語彙：例句把單字挖空，錯誤選項是同等級、同詞性的單字
 * - 文法：用校對過的文法填空題
 * 題目 id 由單字或文法 id 組成，出題用 id 當亂數種子，同一個 id 每次都出一模一樣的題目，
 * 所以錯題本、考試紀錄只要記 id 就能找回題目。
 */

/** 自動出題要用到全部等級的單字和文法；用之前畫面要先等 loadAllLevels() 完成 */
function data(): AllLevelData {
  const all = getAllLevels();
  if (!all) throw new Error('自動出題前要先載入全部等級的資料');
  return all;
}

export type GeneratedType = Extract<
  ExamQuestionType,
  'kanji-reading' | 'orthography' | 'context' | 'grammar'
>;

export const GENERATED_TYPES: GeneratedType[] = [
  'kanji-reading',
  'orthography',
  'context',
  'grammar',
];

const PREFIX: Record<GeneratedType, string> = {
  'kanji-reading': 'gen-kr-',
  orthography: 'gen-or-',
  context: 'gen-cx-',
  grammar: 'gen-gr-',
};

export function isGeneratedId(id: string): boolean {
  return id.startsWith('gen-');
}

// ── 亂數：同一個 id 永遠得到同樣的結果 ──

function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ── 文字判斷 ──

const KANJI = /[一-鿿々]/;
const isKanji = (ch: string) => KANJI.test(ch);
const isHiragana = (ch: string) => ch >= 'ぁ' && ch <= 'ゖ';
const isKatakana = (ch: string) => (ch >= 'ァ' && ch <= 'ヺ') || ch === 'ー';

function scriptOf(word: string): 'kanji' | 'katakana' | 'hiragana' {
  if ([...word].some(isKanji)) return 'kanji';
  if ([...word].every(isKatakana)) return 'katakana';
  return 'hiragana';
}

function countOf(text: string, part: string): number {
  return text.split(part).length - 1;
}

// ── 例句裡找出單字的位置，並確認注音和單字讀音一致 ──

type Located = {
  word: VocabWord;
  plain: string;
  segments: RubySegment[];
  start: number;
  end: number;
};

/** 單字在例句中只出現一次，而且位置剛好切在注音的邊界上，讀音也和單字一致 */
function locate(word: VocabWord): Located | null {
  const example = word.example;
  if (!example) return null;
  const plain = example.ja;
  if (countOf(plain, word.word) !== 1) return null;
  const start = plain.indexOf(word.word);
  const end = start + word.word.length;
  const segments = example.furigana ? parseRuby(example.furigana) : [{ text: plain }];
  if (example.furigana && splitsRuby(example.furigana, [start, end])) return null;

  let offset = 0;
  let reading = '';
  for (const segment of segments) {
    const from = offset;
    const to = offset + segment.text.length;
    offset = to;
    if (to <= start || from >= end) continue;
    if (segment.ruby) reading += segment.ruby;
    else reading += segment.text.slice(Math.max(start, from) - from, Math.min(end, to) - from);
  }
  // 例句裡的讀法和單字不同（例如一日：ついたち／いちにち）就不出讀音相關的題
  if ([...word.word].some(isKanji) && reading !== word.reading) return null;
  return { word, plain, segments, start, end };
}

type Span = Pick<Located, 'plain' | 'segments' | 'start' | 'end'>;

/** 把例句的 [start, end) 換成別的文字，回傳一般句子和注音句子（換掉的部分不加注音） */
function replaceSpan(located: Span, replacement: string) {
  const { plain, segments, start, end } = located;
  const sentence = plain.slice(0, start) + replacement + plain.slice(end);
  let annotated = '';
  let offset = 0;
  let inserted = false;
  for (const segment of segments) {
    const from = offset;
    const to = offset + segment.text.length;
    offset = to;
    if (to <= start || from >= end) {
      annotated += segment.ruby ? `[${segment.text}|${segment.ruby}]` : segment.text;
      continue;
    }
    // 和範圍重疊的部分（只可能是沒有注音的文字被切開，或整段落在範圍內）
    if (from < start) annotated += segment.text.slice(0, start - from);
    if (!inserted) {
      annotated += replacement.replace(/[［］]/g, '');
      inserted = true;
    }
    if (to > end) annotated += segment.text.slice(end - from);
  }
  const hasRuby = segments.some((s) => s.ruby);
  return { sentence, furigana: hasRuby ? annotated : undefined };
}

/**
 * 也算正確的其他讀法（不能拿來當錯誤選項），
 * 例如「世論」有よろん和せろん、「〜所」有じょ和しょ兩種唸法。
 */
const OTHER_READINGS: Record<string, string[]> = {
  世論: ['せろん'],
  世論調査: ['せろんちょうさ'],
  無頓着: ['むとんじゃく'],
  大分: ['だいぶん'],
  疫病: ['やくびょう'],
  憧憬: ['どうけい'],
  修業: ['しゅうぎょう'],
  分別: ['ふんべつ'],
  格好いい: ['かっこういい'],
  洗面所: ['せんめんしょ'],
  撮影所: ['さつえいしょ'],
  料金所: ['りょうきんしょ'],
  案内所: ['あんないしょ'],
  避難所: ['ひなんしょ'],
  詩歌: ['しか'],
  人徳: ['にんとく'],
};

// ── 索引：所有單字、漢字的讀音 ──

type Indexes = {
  byId: Map<string, VocabWord>;
  /** 寫法 → 所有讀音（判斷錯誤選項是不是剛好也是正確讀法） */
  readingsOf: Map<string, Set<string>>;
  /** 所有單字寫法（表記的錯誤選項不能是真的單字） */
  writings: Set<string>;
  /** 單一漢字 → 讀音 */
  kanjiReadings: Map<string, Set<string>>;
  /** 讀音 → 有這個讀音的漢字 */
  kanjiByReading: Map<string, Set<string>>;
};

let indexes: Indexes | null = null;

function addTo<K, V>(map: Map<K, Set<V>>, key: K, value: V) {
  const set = map.get(key);
  if (set) set.add(value);
  else map.set(key, new Set([value]));
}

function getIndexes(): Indexes {
  if (indexes) return indexes;
  const built: Indexes = {
    byId: new Map(),
    readingsOf: new Map(),
    writings: new Set(),
    kanjiReadings: new Map(),
    kanjiByReading: new Map(),
  };
  for (const level of JLPT_LEVELS) {
    for (const word of data().byLevel[level].words) {
      built.byId.set(word.id, word);
      built.writings.add(word.word);
      addTo(built.readingsOf, word.word, word.reading);
      // 一個漢字加送假名的單字（追う／おう）也能知道漢字讀音
      const chars = [...word.word];
      if (chars.length > 1 && isKanji(chars[0]) && chars.slice(1).every(isHiragana)) {
        const okurigana = chars.slice(1).join('');
        if (word.reading.endsWith(okurigana) && word.reading.length > okurigana.length) {
          addTo(built.kanjiReadings, chars[0], word.reading.slice(0, -okurigana.length));
        }
      }
      if (chars.length === 1 && isKanji(chars[0]))
        addTo(built.kanjiReadings, chars[0], word.reading);
      if (word.example?.furigana) {
        for (const segment of parseRuby(word.example.furigana)) {
          if (segment.ruby && segment.text.length === 1 && isKanji(segment.text)) {
            addTo(built.kanjiReadings, segment.text, segment.ruby);
          }
        }
      }
    }
  }
  for (const [writing, readings] of Object.entries(OTHER_READINGS)) {
    for (const reading of readings) addTo(built.readingsOf, writing, reading);
  }
  for (const [kanji, readings] of built.kanjiReadings) {
    for (const reading of readings) addTo(built.kanjiByReading, reading, kanji);
  }
  indexes = built;
  return built;
}

// ── 漢字讀法：容易搞錯的讀音 ──

const ROWS = [
  'かきくけこ',
  'がぎぐげご',
  'さしすせそ',
  'ざじずぜぞ',
  'たちつてと',
  'だぢづでど',
  'はひふへほ',
  'ばびぶべぼ',
  'ぱぴぷぺぽ',
];
const VOICING: Record<string, string[]> = {};
for (const [a, b] of [
  [0, 1],
  [2, 3],
  [4, 5],
  [6, 7],
  [6, 8],
  [7, 8],
]) {
  for (let i = 0; i < 5; i++) {
    const x = ROWS[a][i];
    const y = ROWS[b][i];
    if ('ぢづ'.includes(x) || 'ぢづ'.includes(y)) continue;
    (VOICING[x] ??= []).push(y);
    (VOICING[y] ??= []).push(x);
  }
}
const O_ROW = 'おこごそぞとどのほぼぽもよろょ';
const U_ROW = 'うくぐすずつぬふぶぷむゆるゅ';
const E_ROW = 'えけげせぜてでねへべぺめれ';
const SMALL = 'ゃゅょ';
const SOKUON_BEFORE = 'かきくけこさしすせそたちつてとぱぴぷぺぽ';

/** 讀音改一個地方的所有變化：清濁音、長音、促音、拗音、撥音 */
function readingVariants(reading: string): string[] {
  const chars = [...reading];
  const out = new Set<string>();
  const put = (next: string[]) => out.add(next.join(''));
  chars.forEach((ch, i) => {
    const next = chars[i + 1];
    for (const v of VOICING[ch] ?? []) put([...chars.slice(0, i), v, ...chars.slice(i + 1)]);
    // 長音：こう↔こ、せい↔せ
    if (ch === 'う' && i > 0 && (O_ROW + U_ROW).includes(chars[i - 1]))
      put([...chars.slice(0, i), ...chars.slice(i + 1)]);
    if (ch === 'い' && i > 0 && E_ROW.includes(chars[i - 1]))
      put([...chars.slice(0, i), ...chars.slice(i + 1)]);
    if (O_ROW.includes(ch) && next !== 'う')
      put([...chars.slice(0, i + 1), 'う', ...chars.slice(i + 1)]);
    // 促音：がっこう↔がくこう、けっか↔けか
    if (ch === 'っ') {
      put([...chars.slice(0, i), ...chars.slice(i + 1)]);
      put([...chars.slice(0, i), 'つ', ...chars.slice(i + 1)]);
    }
    if ('くつちき'.includes(ch) && next && SOKUON_BEFORE.includes(next) && i > 0) {
      put([...chars.slice(0, i), 'っ', ...chars.slice(i + 1)]);
    }
    // 拗音：きょ↔き、しょ↔しゅ
    if (SMALL.includes(ch)) {
      put([...chars.slice(0, i), ...chars.slice(i + 1)]);
      // ゃう 這種拼法不存在，不當選項
      for (const s of SMALL) {
        if (s !== ch && !(s === 'ゃ' && next === 'う'))
          put([...chars.slice(0, i), s, ...chars.slice(i + 1)]);
      }
    }
    // 撥音：げんいん↔げいいん
    if (ch === 'ん' && i > 0) put([...chars.slice(0, i), ...chars.slice(i + 1)]);
  });
  out.delete(reading);
  return [...out].filter((v) => v.length > 0 && !v.startsWith('っ') && !v.startsWith('ん'));
}

function readingDistractors(word: VocabWord, random: () => number): string[] | null {
  const { readingsOf } = getIndexes();
  const valid = readingsOf.get(word.word) ?? new Set([word.reading]);
  const first = readingVariants(word.reading).filter((v) => !valid.has(v));
  let pool = seededShuffle(first, random);
  if (pool.length < 3) {
    // 改一個地方不夠，就再改第二個地方
    const second = first
      .flatMap(readingVariants)
      .filter((v) => !valid.has(v) && !first.includes(v));
    pool = [...pool, ...seededShuffle([...new Set(second)], random)];
  }
  return pool.length >= 3 ? pool.slice(0, 3) : null;
}

// ── 表記：把一個漢字換成同音的其他漢字 ──

/** 把單字讀音拆給每個漢字，例如 証拠／しょうこ → 証:しょう、拠:こ */
function splitReading(word: string, reading: string): string[] | null {
  const { kanjiReadings } = getIndexes();
  const chars = [...word];
  const solve = (i: number, pos: number): string[] | null => {
    if (i === chars.length) return pos === reading.length ? [] : null;
    const ch = chars[i];
    if (!isKanji(ch)) {
      if (reading[pos] !== ch) return null;
      const rest = solve(i + 1, pos + 1);
      return rest && [ch, ...rest];
    }
    const candidates = new Set<string>();
    for (const r of kanjiReadings.get(ch) ?? []) {
      candidates.add(r);
      // 連濁（はな→ばな）和促音（がく→がっ）
      for (const v of VOICING[r[0]] ?? []) candidates.add(v + r.slice(1));
      if (r.length > 1 && 'くつちき'.includes(r[r.length - 1]))
        candidates.add(r.slice(0, -1) + 'っ');
    }
    for (const r of candidates) {
      if (!reading.startsWith(r, pos)) continue;
      const rest = solve(i + 1, pos + r.length);
      if (rest) return [r, ...rest];
    }
    return null;
  };
  return solve(0, 0);
}

function orthographyDistractors(word: VocabWord, random: () => number): string[] | null {
  const { kanjiByReading, writings } = getIndexes();
  const chars = [...word.word];
  const parts = splitReading(word.word, word.reading);
  if (!parts) return null;
  const candidates: string[] = [];
  chars.forEach((ch, i) => {
    if (!isKanji(ch)) return;
    // 讀音相同的漢字優先；不夠再用清濁音不同的
    const same = [...(kanjiByReading.get(parts[i]) ?? [])];
    const similar = (VOICING[parts[i][0]] ?? []).flatMap((v) => [
      ...(kanjiByReading.get(v + parts[i].slice(1)) ?? []),
    ]);
    for (const other of [...seededShuffle(same, random), ...seededShuffle(similar, random)]) {
      if (other === ch) continue;
      candidates.push([...chars.slice(0, i), other, ...chars.slice(i + 1)].join(''));
    }
  });
  // 錯誤選項不能剛好是真的單字（例如 機会／機械、川／皮，放進句子可能也說得通）
  const unique = [...new Set(candidates)].filter(
    (c) => c !== word.word && !writings.has(c) && !REAL_WORDS.has(c),
  );
  if (unique.length < 3) return null;
  // 盡量換不同位置的漢字
  const byPosition = new Map<number, string[]>();
  for (const c of unique) {
    const pos = [...c].findIndex((ch, i) => ch !== chars[i]);
    addToList(byPosition, pos, c);
  }
  const picked: string[] = [];
  const lists = seededShuffle([...byPosition.values()], random);
  while (picked.length < 3) {
    for (const list of lists) {
      const next = list.shift();
      if (next && picked.length < 3) picked.push(next);
    }
  }
  return picked;
}

function addToList<K, V>(map: Map<K, V[]>, key: K, value: V) {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

// ── 文脈語彙：同等級、同詞性的單字當錯誤選項 ──

function contextDistractors(
  located: Located,
  level: JlptLevel,
  random: () => number,
): VocabWord[] | null {
  const { word, plain } = located;
  // 副詞常常換一個也說得通（確かに難しい／実際に難しい），不出文脈題
  if (word.pos === 'adverb') return null;
  const script = scriptOf(word.word);
  const ending = word.word.slice(-1);
  const sameShape = (other: VocabWord) => {
    if (other.pos !== word.pos || other.id === word.id) return false;
    if (other.meaning === word.meaning || other.reading === word.reading) return false;
    if (plain.includes(other.word) || scriptOf(other.word) !== script) return false;
    if (Math.abs(other.word.length - word.word.length) > 1) return false;
    // 動詞、形容詞的結尾要一樣，句子才接得上
    if (word.pos === 'verb' || word.pos === 'adjective') return other.word.slice(-1) === ending;
    return true;
  };
  const pool = data().byLevel[level].words.filter(sameShape);
  if (pool.length < 3) return null;
  const picked: VocabWord[] = [];
  for (const other of seededShuffle(pool, random)) {
    if (picked.some((p) => p.meaning === other.meaning)) continue;
    picked.push(other);
    if (picked.length === 3) return picked;
  }
  return null;
}

// ── 出題 ──

function levelOfId(id: string): JlptLevel | null {
  const match = /(n[1-5])-/.exec(id);
  return match ? (match[1].toUpperCase() as JlptLevel) : null;
}

function exampleNote(word: VocabWord) {
  return word.example ? `\n例句：${word.example.zh}` : '';
}

function buildVocabQuestion(
  type: GeneratedType,
  word: VocabWord,
  level: JlptLevel,
): ExamQuestion | null {
  if (!word.example || word.word.length < 1) return null;
  const located = locate(word);
  if (!located) return null;
  const id = PREFIX[type] + word.id;
  const random = seededRandom(id);
  const hasKanji = [...word.word].some(isKanji);
  // 數字後面的量詞（五［分］、三［階］）讀音會跟著數字變，不出讀音和寫法的題
  const before = located.plain[located.start - 1] ?? '';
  if (type !== 'context' && /[0-9０-９一二三四五六七八九十百千万何]/.test(before)) return null;

  if (type === 'kanji-reading') {
    if (!hasKanji) return null;
    const distractors = readingDistractors(word, random);
    if (!distractors) return null;
    const { sentence, furigana } = replaceSpan(located, `［${word.word}］`);
    return {
      id,
      type,
      sentence,
      furigana,
      options: [word.reading, distractors[0], distractors[1], distractors[2]],
      explanation: `「${word.word}」讀作「${word.reading}」，意思是「${word.meaning}」。${exampleNote(word)}`,
    };
  }

  if (type === 'orthography') {
    if (!hasKanji) return null;
    const distractors = orthographyDistractors(word, random);
    if (!distractors) return null;
    const { sentence, furigana } = replaceSpan(located, `［${word.reading}］`);
    return {
      id,
      type,
      sentence,
      furigana,
      options: [word.word, distractors[0], distractors[1], distractors[2]],
      explanation: `「${word.reading}」寫成「${word.word}」，意思是「${word.meaning}」。其他選項是把漢字換成讀音相同或相近的字，都不是正確寫法。${exampleNote(word)}`,
    };
  }

  if (type === 'context') {
    const others = contextDistractors(located, level, random);
    if (!others) return null;
    const { sentence, furigana } = replaceSpan(located, '（　）');
    const meanings = others.map((o) => `${o.word}（${o.meaning}）`).join('、');
    return {
      id,
      type,
      sentence,
      furigana,
      options: [word.word, others[0].word, others[1].word, others[2].word],
      explanation: `答案是「${word.word}」${word.reading === word.word ? '' : `（${word.reading}）`}，意思是「${word.meaning}」。${exampleNote(word)}\n其他選項：${meanings}。`,
    };
  }
  return null;
}

function buildGrammarQuestion(point: GrammarPoint): ExamQuestion | null {
  if (!point.quiz) return null;
  const { blank, distractors } = point.quiz;
  const plain = point.example.ja;
  if (countOf(plain, blank) !== 1) return null;
  const start = plain.indexOf(blank);
  const end = start + blank.length;
  const sentence = plain.slice(0, start) + '（　）' + plain.slice(end);
  const annotated = lookupFurigana(plain);
  let furigana: string | undefined;
  if (annotated && !splitsRuby(annotated, [start, end])) {
    const segments = parseRuby(annotated);
    furigana = replaceSpan({ plain, segments, start, end }, '（　）').furigana;
  }
  const tip = point.tip ? `\n考試重點：${point.tip}` : '';
  return {
    id: PREFIX.grammar + point.id,
    type: 'grammar',
    sentence,
    furigana,
    options: [blank, distractors[0], distractors[1], distractors[2]],
    explanation: `「${point.pattern}」：${point.meaning}。接續：${point.connection}。${tip}\n例句：${point.example.ja}（${point.example.zh}）`,
  };
}

const cache = new Map<string, ExamQuestion | null>();

/** 用題目 id 找回自動出的題目（錯題本、考試紀錄用） */
export function getGeneratedQuestion(id: string): ExamQuestion | null {
  if (cache.has(id)) return cache.get(id) ?? null;
  let question: ExamQuestion | null = null;
  const parsed = parseGeneratedId(id);
  if (parsed) {
    const { type, level } = parsed;
    const sourceId = id.slice(PREFIX[type].length);
    if (type === 'grammar') {
      const point = data().byLevel[level].grammar.find((p) => p.id === sourceId);
      question = point ? buildGrammarQuestion(point) : null;
    } else {
      const word = getIndexes().byId.get(sourceId);
      question = word ? buildVocabQuestion(type, word, level) : null;
    }
  }
  cache.set(id, question);
  return question;
}

const banks = new Map<string, ExamQuestion[]>();

/** 某個等級、某種題型能自動出的所有題目 */
export function getGeneratedBank(level: JlptLevel, type: GeneratedType): ExamQuestion[] {
  const key = `${level}-${type}`;
  const saved = banks.get(key);
  if (saved) return saved;
  const bank = generatedCandidateIds(level, type)
    .map(getGeneratedQuestion)
    .filter((q): q is ExamQuestion => q !== null);
  banks.set(key, bank);
  return bank;
}

/** 某個等級、某種題型可以拿來自動出題的題目 id（還沒確認出不出得了題，出題時才知道） */
export function generatedCandidateIds(level: JlptLevel, type: GeneratedType): string[] {
  const sourceIds =
    type === 'grammar'
      ? data()
          .byLevel[level].grammar.filter((p) => p.quiz)
          .map((p) => p.id)
      : data()
          .byLevel[level].words.filter((w) => w.example)
          .map((w) => w.id);
  return sourceIds.map((sourceId) => PREFIX[type] + sourceId);
}

/** 自動出的題目 id 屬於哪個等級、哪種題型 */
export function parseGeneratedId(id: string): { level: JlptLevel; type: GeneratedType } | null {
  const type = GENERATED_TYPES.find((t) => id.startsWith(PREFIX[t]));
  const level = levelOfId(id);
  return type && level ? { level, type } : null;
}
