/**
 * 成績分析測試（不需要瀏覽器）：npm run test:unit
 * 檢查資料不足時不估算、和上次比較、弱點排序、舊紀錄（沒有快照、沒有存正確答案）也能分析。
 */
const { loadModule } = require('./lib/ts-loader');

globalThis.__DEV__ = false;

const results = {};
const ok = (name, value) => (results[name] = Boolean(value));

const a = loadModule('lib/exam-analysis');
const { getAuthoredQuestion } = loadModule('data/exam');

const record = (date, total, passed, items, extra = {}) => ({
  date,
  total,
  passed,
  sections: [
    { label: '言語知識・讀解', score: total - 30, max: 120 },
    { label: '聽解', score: 30, max: 60 },
  ],
  items,
  ...extra,
});

// 第 2 版紀錄：有存正確答案
const v2Items = [
  ...['n5-pp-01', 'n5-pp-02', 'n5-pp-03', 'n5-pp-04', 'n5-pp-05'].map((id, i) => ({
    id,
    mine: i < 1 ? 'right' : 'wrong',
    answer: 'right',
    ms: 30000,
  })),
  ...['n5-so-01', 'n5-so-02', 'n5-so-03', 'n5-so-04'].map((id) => ({
    id,
    mine: 'right',
    answer: 'right',
    ms: 40000,
  })),
];
const r3 = record('2026-10-03T00:00:00.000Z', 100, true, v2Items);
const r2 = record('2026-10-02T00:00:00.000Z', 85, true, v2Items);
const r1 = record('2026-10-01T00:00:00.000Z', 70, false, v2Items);

ok(
  'outlookNotEnough',
  a.passOutlook([r3, r2]).enough === false && a.passOutlook([r3, r2]).have === 2,
);
const outlook = a.passOutlook([r3, r2, r1]);
ok(
  'outlookEnough',
  outlook.enough && outlook.passed === 2 && outlook.average === 85 && outlook.trend === 30,
);

const cmp = a.compareWithPrevious(r3, [r3, r2, r1]);
ok(
  'compareTotal',
  cmp.totalDiff === 15 && cmp.sections[0].diff === 15 && cmp.sections[1].diff === 0,
);
ok('compareFirstExam', a.compareWithPrevious(r1, [r3, r2, r1]) === null);
// 剛考完、還沒寫進列表時，和列表最新的一次比
const fresh = record('2026-10-04T00:00:00.000Z', 110, true, v2Items);
ok('compareFresh', a.compareWithPrevious(fresh, [r3, r2, r1]).totalDiff === 10);

const weak = a.weakestTypes([r3, r2, r1]);
ok(
  'weakest',
  weak.length === 1 && weak[0].subcategory === 'paraphrase' && Math.abs(weak[0].rate - 0.2) < 1e-9,
);
ok('strongNotListed', !weak.some((w) => w.subcategory === 'sentence-order'));
ok(
  'fewItemsIgnored',
  a.weakestTypes([record('2026-10-05T00:00:00.000Z', 50, false, v2Items.slice(0, 2))]).length === 0,
);

// 舊紀錄：沒有存正確答案、沒有快照 → 自編題目用題庫的答案；自動出的題目略過
const answer01 = getAuthoredQuestion('n5-exam-01').options[0];
const old = record('2026-09-01T00:00:00.000Z', 60, false, [
  { id: 'n5-exam-01', mine: answer01 },
  { id: 'n5-exam-02', mine: null },
  { id: 'gen-kr-n5-001', mine: 'x' },
]);
const oldResults = a.itemResults(old);
ok(
  'oldRecord',
  oldResults.length === 2 &&
    oldResults[0].correct &&
    !oldResults[1].answered &&
    oldResults.every((r) => r.subcategory === 'kanji-reading'),
);
ok(
  'averageSeconds',
  a.averageSeconds(a.itemResults(r3)) === 34 && a.averageSeconds(oldResults) === null,
);

// 針對練習的去處
ok(
  'practiceTarget',
  a.practiceTarget('paraphrase').focus === 'paraphrase' &&
    a.practiceTarget('kanji-reading').mode === 'reading',
);

// 建議：資料不足時仍有「下一次模擬考」，弱點會對應科目
const advice = a.studyAdvice(
  'N5',
  weak,
  30,
  r3.date,
  new Date('2026-10-05T00:00:00.000Z').getTime(),
);
ok(
  'advice',
  advice.some((x) => x.label === '單字複習' && x.detail.includes('20 個')) &&
    advice.some((x) => x.label === '文字語彙') &&
    advice.some((x) => x.label === '下一次模擬考' && x.detail.includes('5 天後')),
);

for (const [name, passed] of Object.entries(results)) console.log(`${passed ? '✓' : '✗'} ${name}`);
const failed = Object.entries(results).filter(([, v]) => !v);
console.log(failed.length ? `\n失敗 ${failed.length} 項` : '\n成績分析測試通過 ✓');
process.exit(failed.length ? 1 : 0);
