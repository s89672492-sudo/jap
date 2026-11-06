/**
 * 拼寫練習測試：npm run test:unit
 * 切方塊、干擾方塊，以及「只有一種排法拼得出答案」。
 */
const { loadModule } = require('./lib/ts-loader');

globalThis.__DEV__ = false;
const results = {};
const ok = (name, value) => (results[name] = Boolean(value));

/** 用 n 個方塊（每個最多用一次）能拼出 target 的排法數 */
function arrangements(tiles, target, n) {
  let count = 0;
  const used = new Array(tiles.length).fill(false);
  const go = (pos, k, seq) => {
    if (count > 1) return;
    if (pos === target.length) {
      if (k === n) count++;
      return;
    }
    const seen = new Set();
    tiles.forEach((t, i) => {
      if (used[i] || seen.has(t) || !target.startsWith(t, pos)) return;
      seen.add(t);
      used[i] = true;
      go(pos + t.length, k + 1, seq);
      used[i] = false;
    });
  };
  go(0, 0, []);
  return count;
}

async function main() {
  await loadModule('data/level-data').loadAllLevels();
  const { getLevel } = loadModule('data/level-data');
  const sp = loadModule('lib/spelling');

  ok('split youon', JSON.stringify(sp.splitKana('きょうしつ')) === '["きょ","う","し","つ"]');
  ok('split sokuon', JSON.stringify(sp.splitKana('がっこう')) === '["が","っ","こ","う"]');
  ok(
    'split katakana',
    JSON.stringify(sp.splitKana('チョコレート')) === '["チョ","コ","レ","ー","ト"]',
  );
  ok('not spellable mixed', !sp.isSpellable('テニスコートA') && !sp.isSpellable('あ'));
  ok(
    'voicing confusable',
    sp.confusables('か').includes('が') && sp.confusables('ば').includes('ぱ'),
  );
  ok(
    'youon confusable',
    sp.confusables('きょ').includes('きゅ') && sp.confusables('きょ').includes('き'),
  );
  ok('katakana confusable', sp.confusables('シ').includes('ツ'));
  ok(
    'no lone small kana',
    !['か', 'よ', 'ゆ', 'や', 'きょ'].some((t) =>
      sp.confusables(t).some((c) => /^[ゃゅょャュョ]$/.test(c)),
    ),
  );

  let words = 0;
  let bad = [];
  let fewDistractors = 0;
  for (const level of ['N5', 'N4', 'N3', 'N2', 'N1']) {
    for (const w of getLevel(level).words) {
      if (!sp.isSpellable(w.reading)) continue;
      words++;
      for (let i = 0; i < 3; i++) {
        const q = sp.buildSpellingQuestion(w);
        const extra = q.tiles.length - q.answer.length;
        if (extra < 2) fewDistractors++;
        const answerSet = new Set(q.answer);
        const distractors = q.tiles.filter((t) => !answerSet.has(t));
        const sorted = (a) => [...a].sort().join(',');
        if (sorted(q.tiles) !== sorted([...q.answer, ...distractors])) bad.push(`${w.word} tiles`);
        if (arrangements(q.tiles, w.reading, q.answer.length) !== 1)
          bad.push(`${w.word} 不只一種排法`);
        if (q.tiles.length > 10) bad.push(`${w.word} 方塊太多`);
      }
    }
  }
  ok(`all ${words} spellable words have exactly one arrangement`, bad.length === 0);
  ok('almost all have 2+ distractors', fewDistractors < words * 0.02);
  if (bad.length) console.log(bad.slice(0, 10));
  console.log(`  可以拼寫的單字：${words} 個；干擾方塊少於 2 個：${fewDistractors} 次`);

  for (const [name, passed] of Object.entries(results))
    console.log(`${passed ? '✓' : '✗'} ${name}`);
  const failed = Object.entries(results).filter(([, v]) => !v);
  console.log(failed.length ? `\n失敗 ${failed.length} 項` : '\n拼寫練習測試通過 ✓');
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
