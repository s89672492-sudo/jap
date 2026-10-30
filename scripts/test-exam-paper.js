/**
 * 考卷引擎測試（不需要瀏覽器）：npm run test:unit
 * 檢查固定考卷每次一樣、隨機考卷依種子重現、題型比例照藍圖、題組不重複、優先出沒考過的題目。
 */
const { loadModule } = require('./lib/ts-loader');

globalThis.__DEV__ = false;

const results = {};
const ok = (name, value) => (results[name] = Boolean(value));

async function main() {
  await loadModule('data/level-data').loadAllLevels();
  await loadModule('lib/furigana').loadFurigana();
  const engine = loadModule('lib/exam-paper');
  const { BLUEPRINTS } = loadModule('data/exam/blueprints');
  const { EXAM_PAPERS } = loadModule('data/exam/papers');
  const { getAuthoredQuestion } = loadModule('data/exam');
  const seed = loadModule('lib/exam-seed');

  // 亂數種子
  const a = seed.createRng('x');
  const b = seed.createRng('x');
  ok(
    'rngRepeatable',
    [1, 2, 3, 4, 5].every(() => a() === b()),
  );
  ok('rngDiffers', seed.createRng('x')() !== seed.createRng('y')());

  const fingerprint = (sittings) =>
    JSON.stringify(sittings.map((s) => s.questions.map((q) => [q.question.id, q.options])));

  for (const level of ['N5', 'N4', 'N3', 'N2', 'N1']) {
    const blueprint = BLUEPRINTS[level];
    // 固定考卷
    for (const paper of EXAM_PAPERS[level]) {
      const first = engine.buildFixedPaper(level, paper);
      const second = engine.buildFixedPaper(level, paper);
      const ids = first.flatMap((s) => s.questions.map((q) => q.question.id));
      const expected = paper.versions.at(-1).questionIds;
      ok(`${level} ${paper.id} same every time`, fingerprint(first) === fingerprint(second));
      ok(
        `${level} ${paper.id} has all questions`,
        ids.length === expected.length && expected.every((id) => ids.includes(id)),
      );
      ok(
        `${level} ${paper.id} sittings follow blueprint`,
        first.length === blueprint.sittings.length &&
          first.every((s, i) =>
            s.questions.every((q) =>
              blueprint.sittings[i].categories.includes(q.question.category),
            ),
          ),
      );
      ok(
        `${level} ${paper.id} official minutes`,
        first.every((s, i) => s.officialMinutes === blueprint.sittings[i].minutes),
      );
    }

    // 隨機考卷
    const empty = engine.EMPTY_HISTORY;
    const p1 = engine.buildRandomPaper(level, empty, 'seed-1');
    const p2 = engine.buildRandomPaper(level, empty, 'seed-1');
    const p3 = engine.buildRandomPaper(level, empty, 'seed-2');
    ok(`${level} random same seed same paper`, fingerprint(p1) === fingerprint(p2));
    ok(`${level} random other seed differs`, fingerprint(p1) !== fingerprint(p3));
    const all = p1.flatMap((s) => s.questions);
    const ids = all.map((q) => q.question.id);
    ok(`${level} random no duplicate questions`, new Set(ids).size === ids.length);
    ok(
      `${level} random answers in options`,
      all.every((q) => q.options.includes(q.answer)),
    );
    // 題組：同一組的題目全部一起出，而且排在一起
    const groupBlocks = {};
    let previousGroup = null;
    let groupsOk = true;
    for (const q of all) {
      const g = q.question.groupId;
      if (g && g !== previousGroup) {
        if (groupBlocks[g]) groupsOk = false;
        groupBlocks[g] = true;
      }
      previousGroup = g ?? null;
    }
    for (const g of Object.keys(groupBlocks)) {
      const members = Object.values(loadModule('data/exam').EXAM_BY_LEVEL[level]).filter(
        (q) => q.groupId === g,
      );
      if (!members.every((m) => ids.includes(m.id))) groupsOk = false;
    }
    ok(`${level} random groups whole and once`, groupsOk);
    // 題型比例：每種題型不超過藍圖（題組一次出完，最多多出一組的題數）
    let ratioOk = true;
    p1.forEach((sitting, i) => {
      const bp = blueprint.sittings[i];
      for (const type of new Set(bp.items.map((it) => it.type))) {
        const quota = bp.items
          .filter((it) => it.type === type)
          .reduce((s, it) => s + it.officialCount, 0);
        const have = sitting.questions.filter((q) => q.question.type === type).length;
        if (have > quota + 3) ratioOk = false;
      }
    });
    ok(`${level} random follows blueprint quotas`, ratioOk);
    // 優先出沒考過的：把第一份全部當作考過，第二份的自動出題型幾乎都換新
    const seen = new Set(ids);
    const next = engine.buildRandomPaper(level, { mistakes: new Set(), seen }, 'seed-1');
    const generatedNext = next
      .flatMap((s) => s.questions)
      .filter((q) => q.question.id.startsWith('gen-'));
    ok(
      `${level} random prefers unseen`,
      generatedNext.length > 0 && generatedNext.every((q) => !seen.has(q.question.id)),
    );
    // 錯題：每個大問最多三分之一
    const wrong = all.filter((q) => q.question.id.startsWith('gen-')).map((q) => q.question.id);
    const withMistakes = engine.buildRandomPaper(
      level,
      { mistakes: new Set(wrong), seen: new Set() },
      'seed-9',
    );
    const mistakeCount = withMistakes
      .flatMap((s) => s.questions)
      .filter((q) => wrong.includes(q.question.id)).length;
    ok(
      `${level} random includes some mistakes`,
      mistakeCount > 0 && mistakeCount <= Math.ceil(wrong.length / 2) + 4,
    );
    if (level === 'N5' || level === 'N4') {
      console.log(
        `  ${level} 隨機考卷題數：${p1.map((s) => `${s.label} ${s.questions.length} 題`).join('、')}`,
      );
    }
  }
  ok('authored lookup', getAuthoredQuestion('n5-exam-31')?.passage?.length > 0);

  for (const [name, passed] of Object.entries(results))
    console.log(`${passed ? '✓' : '✗'} ${name}`);
  const failed = Object.entries(results).filter(([, v]) => !v);
  console.log(failed.length ? `\n失敗 ${failed.length} 項` : '\n考卷引擎測試通過 ✓');
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
