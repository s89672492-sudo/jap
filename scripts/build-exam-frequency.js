/**
 * 產生「真題頻率」標籤：src/data/vocab/frequency/n5.ts～n1.ts
 *
 * 來源：egg rolls《JLPT 10k》Anki 牌組（https://github.com/5mdld/anki-jlpt-decks，CC BY-NC 4.0）。
 * 牌組依 2010～2025 年 JLPT 真題出現次數，把 N3～N1 單字分成高頻、中頻、低頻。
 * 這裡只取用「頻率分類」，依寫法和讀音對應到本 App 的單字（修改：只保留對得上的單字，
 * 不使用牌組的解釋、例句、音檔和音調）。對不上的單字不加標籤。
 *
 * 用法：node scripts/build-exam-frequency.js <牌組的 deck-source/notes.csv>
 */
const fs = require('fs');
const path = require('path');
const { loadModule } = require('./lib/ts-loader');

globalThis.__DEV__ = false;

const toHiragana = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

async function main() {
  const csv = process.argv[2];
  if (!csv) throw new Error('請給牌組的 notes.csv 路徑');
  await loadModule('data/level-data').loadAllLevels();
  const { getLevel } = loadModule('data/level-data');

  // 牌組：寫法+讀音 → [{ 等級, 頻率 }]
  const deck = new Map();
  for (const line of fs.readFileSync(csv, 'utf8').split('\n')) {
    if (!line || line.startsWith('#')) continue;
    const cols = line.split('\t');
    const tag = cols[1].match(/(N[1-3]).*?(高|中|低)频/);
    if (!tag) continue;
    const freq = { 高: 'high', 中: 'mid', 低: 'low' }[tag[2]];
    const key = `${cols[3]}|${toHiragana(cols[6])}`;
    // 同一個詞可能出現在兩個等級：都留著，對應時優先用和本 App 相同等級的那一筆
    deck.set(key, [...(deck.get(key) ?? []), { level: tag[1], freq }]);
  }

  const out = path.join(__dirname, '..', 'src', 'data', 'vocab', 'frequency');
  fs.mkdirSync(out, { recursive: true });
  for (const level of ['N5', 'N4', 'N3', 'N2', 'N1']) {
    const tags = {};
    for (const word of getLevel(level).words) {
      const hits = deck.get(`${word.word}|${toHiragana(word.reading)}`);
      if (!hits) continue;
      const hit = hits.find((h) => h.level === level) ?? hits[0];
      // 統計的等級和本 App 不同時一起記下來，畫面上顯示「N2 真題高頻」
      tags[word.id] = hit.level === level ? [hit.freq] : [hit.freq, hit.level];
    }
    const counts = Object.values(tags).reduce((c, [f]) => ((c[f] = (c[f] ?? 0) + 1), c), {});
    const lv = level.toLowerCase();
    const body = Object.entries(tags)
      .map(([id, t]) => `  '${id}': [${t.map((x) => `'${x}'`).join(', ')}],`)
      .join('\n');
    fs.writeFileSync(
      path.join(out, `${lv}.ts`),
      `import type { ExamFrequencyTag } from '../types';

/**
 * ${level} 單字的真題頻率：[頻率] 或 [頻率, 統計的等級]（由 scripts/build-exam-frequency.js 產生，不要手動修改）。
 * 頻率分類取自 egg rolls《JLPT 10k》Anki 牌組（CC BY-NC 4.0，
 * https://github.com/5mdld/anki-jlpt-decks），只保留和本 App 單字對得上的部分。
 */
export const ${level}_FREQUENCY: Record<string, ExamFrequencyTag> = {
${body}
};
`,
    );
    console.log(
      level,
      Object.keys(tags).length,
      'tagged',
      counts,
      'of',
      getLevel(level).words.length,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
