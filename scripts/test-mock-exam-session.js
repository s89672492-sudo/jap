/**
 * 模擬考進行中狀態的單元測試（不需要瀏覽器）：npm run test:unit
 * 把 src/lib/mock-exam-session.ts 用專案的 TypeScript 轉成 JavaScript 後直接測試。
 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function loadTs(file, replacements = {}) {
  let source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  for (const [from, to] of Object.entries(replacements)) source = source.replace(from, to);
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', 'require', js)(module, module.exports, require);
  return module.exports;
}

const m = loadTs('src/lib/mock-exam-session.ts', {
  "import { JLPT_LEVELS, type JlptLevel } from '@/data/vocab';":
    "const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']; type JlptLevel = string;",
});

const q = (id, type = 'context') => ({
  question: { id, type, sentence: 's', options: ['a', 'b', 'c', 'd'], explanation: 'e' },
  options: ['b', 'a', 'd', 'c'],
  answer: 'a',
});
const sittings = [
  {
    label: 'S1',
    types: ['context'],
    officialMinutes: 20,
    seconds: 600,
    questions: [q('a1'), q('a2'), q('a3')],
  },
  {
    label: 'S2',
    types: ['grammar'],
    officialMinutes: 40,
    seconds: 900,
    questions: [q('b1', 'grammar'), q('b2', 'grammar')],
  },
];
const results = {};
const T0 = 1_000_000;
let d = m.createDraft('N5', 'official', sittings, T0);
results.officialDeadline = d.deadline === T0 + 20 * 60 * 1000;
results.practiceDeadline =
  m.createDraft('N5', 'practice', sittings, T0).deadline === T0 + 600 * 1000;
d = m.answerQuestion(d, 'a1', 'a', T0 + 1000);
d = m.answerQuestion(d, 'b1', 'a', T0 + 1000); // 別節的題目不能作答
results.answerOnlyCurrentSitting = d.answers.a1 === 'a' && d.answers.b1 === undefined;
d = m.toggleMark(d, 'a2', T0 + 2000);
results.marked = d.marked.includes('a2') && m.sittingProgress(d).marked === 1;
d = m.goToQuestion(d, 2, T0 + 5000);
results.spentTracked = d.spent.a1 === 5000 && d.questionIndex === 2;
// 截止時間後不能作答
results.noAnswerAfterDeadline = m.answerQuestion(d, 'a3', 'a', d.deadline + 1) === d;
// 時間到自動交卷
const exp = m.expireIfNeeded(d, d.deadline + 10);
results.autoSubmit =
  exp.expired &&
  !exp.finished &&
  exp.draft.status === 'break' &&
  exp.draft.completed.includes(0) &&
  exp.draft.events.at(-1).kind === 'auto-submit';
// 重複交卷沒有作用
results.doubleSubmitNoop = m.submitSitting(exp.draft, d.deadline + 20, false).draft === exp.draft;
// 已交卷的節不能再作答
results.completedLocked = m.answerQuestion(exp.draft, 'a3', 'a', d.deadline + 30) === exp.draft;
// 下一節
let d2 = m.startNextSitting(exp.draft, T0 + 2_000_000);
results.nextSitting =
  d2.status === 'sitting' &&
  d2.sittingIndex === 1 &&
  d2.deadline === T0 + 2_000_000 + 40 * 60 * 1000 &&
  d2.questionIndex === 0;
// 重新整理不會多出時間：截止時間不變
const reloaded = m.parseDraft(JSON.parse(JSON.stringify(d2)));
results.parseRoundTrip = reloaded !== null && reloaded.deadline === d2.deadline;
const fin = m.submitSitting(d2, T0 + 2_000_100, false);
results.lastSittingFinishes = fin.finished && fin.draft.completed.length === 2;
// 背景、離開次數只在作答中計算
let e = m.addEvent(d2, 'background', T0 + 2_000_050);
e = m.addEvent(e, 'leave', T0 + 2_000_060);
results.leaveCount = e.leaveCount === 2 && m.addEvent(exp.draft, 'leave', 1).leaveCount === 0;
// 壞掉的存檔不會讓 App 壞掉
results.parseBad =
  m.parseDraft({ v: 1, level: 'N9' }) === null &&
  m.parseDraft(null) === null &&
  m.parseDraft({ ...d2, questionIndex: 99 }) === null;
// 事件最多 100 筆
let many = d2;
for (let i = 0; i < 150; i++) many = m.addEvent(many, 'return', i);
results.eventCap = many.events.length === 100;
for (const [name, passed] of Object.entries(results)) console.log(`${passed ? '✓' : '✗'} ${name}`);
const failed = Object.entries(results)
  .filter(([, v]) => !v)
  .map(([k]) => k);
console.log(failed.length ? `\n失敗 ${failed.length} 項` : '\n模擬考狀態測試通過 ✓');
process.exit(failed.length ? 1 : 0);
