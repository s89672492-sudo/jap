/**
 * 詞性細分測試（不需要瀏覽器）：npm run test:unit
 * 檢查い形容詞、な形容詞的判斷（含例外字），篩選大類時細類也算在內，其他詞性不受影響。
 */
const { loadModule } = require('./lib/ts-loader');

globalThis.__DEV__ = false;

const results = {};
const ok = (name, value) => (results[name] = Boolean(value));

const { wordClass, matchesPosFilter } = loadModule('data/vocab/word-class');
const adj = (word) => ({ word, pos: 'adjective' });

ok(
  'iAdjective',
  ['大きい', '新しい', '頭がいい', '子供っぽい'].every((w) => wordClass(adj(w)) === 'i-adjective'),
);
ok(
  'naAdjective',
  ['静か', '元気', 'ハンサム', '科学的'].every((w) => wordClass(adj(w)) === 'na-adjective'),
);
ok(
  'naEndingInI',
  ['きれい', '嫌い', '大嫌い', '幸い'].every((w) => wordClass(adj(w)) === 'na-adjective'),
);
ok(
  'prenominal',
  wordClass(adj('大きな')) === 'prenominal' && wordClass(adj('小さな')) === 'prenominal',
);
ok('taru', wordClass(adj('漠然')) === 'taru-adjective');
ok(
  'otherPos',
  wordClass({ word: '食べる', pos: 'verb' }) === 'verb' &&
    wordClass({ word: '水', pos: 'noun' }) === 'noun',
);
ok(
  'filter',
  matchesPosFilter(adj('静か'), 'adjective') &&
    matchesPosFilter(adj('静か'), 'na-adjective') &&
    !matchesPosFilter(adj('静か'), 'i-adjective') &&
    matchesPosFilter(adj('大きな'), 'adjective') &&
    !matchesPosFilter(adj('大きな'), 'na-adjective') &&
    matchesPosFilter({ word: '水', pos: 'noun' }, 'all'),
);

// 全部等級的形容詞：每個都有細類，い形容詞＋な形容詞＋例外＝形容詞總數
let total = 0;
let split = 0;
for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) {
  const list = Object.values(loadModule(`data/vocab/${lv}`)).find(Array.isArray);
  for (const word of list.filter((w) => w.pos === 'adjective')) {
    total++;
    if (wordClass(word) !== 'adjective') split++;
  }
}
ok('allAdjectivesClassified', total > 0 && split === total);

for (const [name, passed] of Object.entries(results)) console.log(`${passed ? '✓' : '✗'} ${name}`);
const failed = Object.entries(results).filter(([, v]) => !v);
console.log(failed.length ? `\n失敗 ${failed.length} 項` : '\n詞性細分測試通過 ✓');
process.exit(failed.length ? 1 : 0);
