/**
 * 產生同義詞、反義詞：讀 scripts/data/word-relations.txt（本 App 自行整理），
 * 依寫法對應到單字 id，輸出 src/data/vocab/related/n5.ts～n1.ts。
 * 兩個方向都會加（A 的反義詞有 B，B 的反義詞也有 A）。對方的寫法、讀音、意思一起存，
 * 卡片上不必載入別的等級就能顯示。
 *
 * 用法：node scripts/build-word-relations.js（產生後再用 prettier 排版 src/data/vocab/related）
 */
const fs = require('fs');
const path = require('path');
const { loadModule } = require('./lib/ts-loader');

globalThis.__DEV__ = false;

async function main() {
  await loadModule('data/level-data').loadAllLevels();
  const { getLevel } = loadModule('data/level-data');
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const bySpelling = new Map();
  for (const level of levels) for (const w of getLevel(level).words) bySpelling.set(w.word, w);

  const related = new Map();
  const missing = [];
  const seen = new Set();
  let pairs = 0;
  const lines = fs
    .readFileSync(path.join(__dirname, 'data', 'word-relations.txt'), 'utf8')
    .split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^(\S+)\s*(⇔|≒)\s*(\S+)$/);
    if (!m) throw new Error(`格式不正確：${line}`);
    const [, left, mark, right] = m;
    const a = bySpelling.get(left);
    const b = bySpelling.get(right);
    if (!a || !b) {
      missing.push(line);
      continue;
    }
    const kind = mark === '⇔' ? 'antonym' : 'synonym';
    const key = [a.id, b.id].sort().join('|') + kind;
    if (seen.has(key) || a.id === b.id) continue;
    seen.add(key);
    pairs++;
    for (const [from, to] of [
      [a, b],
      [b, a],
    ]) {
      const list = related.get(from.id) ?? [];
      list.push({ kind, id: to.id, word: to.word, reading: to.reading, meaning: to.meaning });
      related.set(from.id, list);
    }
  }

  const out = path.join(__dirname, '..', 'src', 'data', 'vocab', 'related');
  fs.mkdirSync(out, { recursive: true });
  for (const level of levels) {
    const lv = level.toLowerCase();
    const entries = getLevel(level)
      .words.filter((w) => related.has(w.id))
      .map((w) => {
        // 反義詞排前面
        const list = related
          .get(w.id)
          .sort((x, y) => (x.kind === y.kind ? 0 : x.kind === 'antonym' ? -1 : 1));
        return `  '${w.id}': ${JSON.stringify(list)},`;
      });
    fs.writeFileSync(
      path.join(out, `${lv}.ts`),
      `import type { WordRelation } from '../types';

/** ${level} 單字的同義詞、反義詞（由 scripts/build-word-relations.js 產生，不要手動修改） */
export const ${level}_RELATED: Record<string, WordRelation[]> = {
${entries.join('\n')}
};
`,
    );
    console.log(level, entries.length, 'words with relations');
  }
  console.log(`${pairs} pairs; not in word list (${missing.length}):`, missing.join('  '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
