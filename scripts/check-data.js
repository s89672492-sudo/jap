#!/usr/bin/env node
/**
 * 學習資料檢查：npm run check:data
 *
 * 檢查單字、例句、文法、模擬試題、閱讀文章、插圖和假名注音的格式與引用。
 * 有「錯誤」時結束代碼為 1（GitHub 打包也可以用來擋下壞資料）；「提醒」只列出來。
 * 資料檔是 TypeScript，但內容只是物件陣列，所以去掉型別宣告後直接執行讀取，不需要額外套件。
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
// DATA_DIR 只給檢查程式自己的測試用（拿一份故意改壞的資料確認抓得到錯）
const DATA = process.env.DATA_DIR ?? path.join(ROOT, 'src/data');
const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];

const errors = [];
const warnings = [];
const error = (where, message) => errors.push(`${where}：${message}`);
const warn = (where, message) => warnings.push(`${where}：${message}`);

/** 讀取資料檔：去掉 import 和型別，把 export const 換成 module.exports */
function load(file) {
  const source = fs
    .readFileSync(path.join(DATA, file), 'utf8')
    .replace(/^import .*$/gm, '')
    .replace(/export const \w+(:[^=]+)?=/, 'module.exports =');
  const sandbox = { module: {} };
  vm.runInNewContext(source, sandbox, { filename: file });
  return sandbox.module.exports;
}

const KANA = /^[ぁ-ゖァ-ヺー・\s]+$/;
const KANJI = /[一-鿿々〆ヶ〇]/;
const RUBY = /\[([^|\]]+)\|([^\]]+)\]/g;
const isText = (value) => typeof value === 'string' && value.trim().length > 0;

/** 檢查 [漢字|かな] 注音格式；回傳去掉注音後的句子 */
function checkRuby(where, annotated) {
  const rest = annotated.replace(RUBY, '');
  if (/[[\]|]/.test(rest)) error(where, `注音括號不成對或格式錯誤：${annotated.slice(0, 40)}`);
  for (const [, base, reading] of annotated.matchAll(RUBY)) {
    if (!KANA.test(reading)) error(where, `「${base}」的讀音不是假名：${reading}`);
    if (!KANJI.test(base)) warn(where, `注音標在沒有漢字的文字上：${base}|${reading}`);
  }
  return annotated.replace(RUBY, '$1');
}

function checkOptions(where, options, count = 4) {
  if (!Array.isArray(options) || options.length !== count) {
    error(where, `選項應該有 ${count} 個，實際 ${options?.length ?? 0} 個`);
    return;
  }
  if (options.some((o) => !isText(o))) error(where, '有空白選項');
  if (new Set(options).size !== options.length) error(where, `選項重複：${options.join(' / ')}`);
}

// ── 單字與例句 ──
const POS = new Set(['noun', 'verb', 'adjective', 'adverb']);
const wordIds = new Map();
let wordCount = 0;
/** 各等級實際的數量（和 level-counts.ts 比對） */
const counts = Object.fromEntries(LEVELS.map((lv) => [lv, { words: 0, grammar: 0, reading: 0 }]));
for (const lv of LEVELS) {
  const words = load(`vocab/${lv}.ts`);
  counts[lv].words = words.length;
  for (const w of words) {
    const where = `單字 ${w.id ?? '(沒有 id)'}`;
    wordCount++;
    if (!isText(w.id)) error(where, '缺少 id');
    else if (!w.id.startsWith(`${lv}-`)) error(where, `id 和檔案等級（${lv}）不一致`);
    if (wordIds.has(w.id)) error(where, `id 重複（也在 ${wordIds.get(w.id)}）`);
    wordIds.set(w.id, lv);
    if (!isText(w.word)) error(where, '缺少單字');
    if (!isText(w.reading)) error(where, '缺少讀音');
    else if (!KANA.test(w.reading.replace(/[A-Za-zＡ-Ｚａ-ｚ0-9]/g, ''))) {
      warn(where, `讀音含有假名以外的字：${w.reading}`);
    }
    if (!isText(w.meaning)) error(where, '缺少中文意思');
    if (!POS.has(w.pos)) error(where, `詞性不正確：${w.pos}`);
  }
  const examples = load(`vocab/examples/${lv}.ts`);
  for (const [id, ex] of Object.entries(examples)) {
    const where = `例句 ${id}`;
    if (!wordIds.has(id)) error(where, '對應的單字不存在');
    if (!isText(ex.ja)) error(where, '缺少日文例句');
    else checkRuby(where, ex.ja);
    if (!isText(ex.zh)) error(where, '缺少中文翻譯');
  }
  const missing = words.filter((w) => !examples[w.id]).length;
  if (missing > 0) warn(`單字 ${lv}`, `${missing} 個單字沒有例句`);
}

// ── 文法 ──
const grammarIds = new Set();
let grammarCount = 0;
for (const lv of LEVELS) {
  for (const g of load(`grammar/${lv}.ts`)) {
    const where = `文法 ${g.id ?? '(沒有 id)'}`;
    grammarCount++;
    counts[lv].grammar++;
    if (!isText(g.id) || !g.id.startsWith(`${lv}-`)) error(where, 'id 缺少或和等級不一致');
    if (grammarIds.has(g.id)) error(where, 'id 重複');
    grammarIds.add(g.id);
    for (const field of ['pattern', 'connection', 'meaning']) {
      if (!isText(g[field])) error(where, `缺少 ${field}`);
    }
    if (!isText(g.example?.ja) || !isText(g.example?.zh)) error(where, '缺少例句或翻譯');
    else if (!g.example.ja.includes(g.example.highlight)) error(where, '例句中找不到強調的部分');
    if (g.quiz) {
      if (!g.example?.ja?.includes(g.quiz.blank))
        error(where, `例句中找不到挖空的「${g.quiz.blank}」`);
      checkOptions(where, [g.quiz.blank, ...(g.quiz.distractors ?? [])]);
    }
  }
}

// ── 模擬試題 ──
const EXAM_TYPES = new Set([
  'kanji-reading',
  'orthography',
  'context',
  'paraphrase',
  'grammar',
  'sentence-order',
  'reading',
  'listening',
]);
const examIds = new Set();
let examCount = 0;
for (const lv of LEVELS) {
  for (const q of load(`exam/${lv}.ts`)) {
    const where = `試題 ${q.id ?? '(沒有 id)'}`;
    examCount++;
    if (examIds.has(q.id)) error(where, 'id 重複');
    examIds.add(q.id);
    if (!EXAM_TYPES.has(q.type)) error(where, `題型不正確：${q.type}`);
    if (!isText(q.sentence)) error(where, '缺少題目');
    if (!isText(q.explanation)) error(where, '缺少解說');
    checkOptions(where, q.options);
    if (q.type === 'reading' && !isText(q.passage)) error(where, '讀解題缺少文章');
    if (q.type === 'listening' && !(Array.isArray(q.script) && q.script.length > 1)) {
      error(where, '聽解題缺少對話');
    }
    if (
      ['kanji-reading', 'orthography', 'paraphrase'].includes(q.type) &&
      !/［.+］/.test(q.sentence)
    ) {
      error(where, '題目沒有用［］標出畫底線的字');
    }
  }
}

// ── 閱讀文章與插圖 ──
const TOPICS = new Set(['生活', '文化', '社會', '自然', '科學', '推理']);
const articleIds = new Map();
for (const lv of LEVELS) {
  for (const a of load(`reading/${lv}.ts`)) {
    const where = `文章 ${a.id ?? '(沒有 id)'}`;
    counts[lv].reading++;
    if (articleIds.has(a.id)) error(where, 'id 重複');
    articleIds.set(a.id, a);
    if (!isText(a.title) || !isText(a.titleZh)) error(where, '缺少標題');
    if (!TOPICS.has(a.topic)) error(where, `主題不正確：${a.topic}`);
    if (!Array.isArray(a.paragraphs) || a.paragraphs.length === 0) error(where, '沒有段落');
    a.paragraphs?.forEach((p, i) => {
      if (!isText(p.ja) || !isText(p.zh)) error(where, `第 ${i + 1} 段缺少日文或翻譯`);
    });
    const text = a.paragraphs?.map((p) => p.ja).join('') ?? '';
    for (const v of a.vocab ?? []) {
      if (!isText(v.word) || !isText(v.meaning) || !KANA.test(v.reading ?? '')) {
        error(where, `重點單字欄位錯誤：${JSON.stringify(v)}`);
      }
      const stem = v.word.replace(/[うくぐすつぬぶむるいだ]$/, '');
      if (!text.includes(v.word) && !text.includes(stem))
        warn(where, `重點單字「${v.word}」不在文章中`);
    }
    for (const q of a.questions ?? []) checkOptions(`${where} 問題「${q.question}」`, q.options);
  }
}

/** 從 require('@/assets/...') 找出圖片路徑，確認檔案存在 */
function checkImages(file, describe) {
  const source = fs.readFileSync(path.join(DATA, file), 'utf8');
  const ids = new Map();
  let currentId = null;
  for (const line of source.split('\n')) {
    const key = line.match(/^ {2}'(n\d-r\d\d)'/);
    if (key) currentId = key[1];
    for (const [, asset] of line.matchAll(/require\('@\/assets\/([^']+)'\)/g)) {
      if (!fs.existsSync(path.join(ROOT, 'assets', asset)))
        error(file, `圖片檔不存在：assets/${asset}`);
      if (currentId) ids.set(currentId, (ids.get(currentId) ?? 0) + 1);
    }
  }
  for (const id of ids.keys()) if (!articleIds.has(id)) error(file, `引用了不存在的文章 ${id}`);
  describe(ids);
}
checkImages('reading/covers.ts', (ids) => {
  for (const id of articleIds.keys()) if (!ids.has(id)) warn(`文章 ${id}`, '沒有封面圖');
});
checkImages('reading/paragraph-images.ts', (ids) => {
  for (const [id, a] of articleIds) {
    const count = ids.get(id) ?? 0;
    if (count !== a.paragraphs.length)
      warn(`文章 ${id}`, `段落插圖 ${count} 張，段落 ${a.paragraphs.length} 段`);
  }
});
const icons = load('reading/illustrations.ts');
for (const [id, list] of Object.entries(icons)) {
  if (!articleIds.has(id)) error('reading/illustrations.ts', `引用了不存在的文章 ${id}`);
  const vocab = new Set(articleIds.get(id)?.vocab.map((v) => v.word) ?? []);
  for (const word of Object.keys(list)) {
    if (!vocab.has(word)) warn(`文章 ${id}`, `小圖示的單字「${word}」不在重點單字表`);
  }
}

// ── 假名注音對照表 ──
const map = load('furigana-map.ts');
for (const [plain, annotated] of Object.entries(map)) {
  const where = `注音表「${plain.slice(0, 20)}」`;
  const stripped = checkRuby(where, annotated);
  // 試題句子的注音版本刻意去掉了畫底線用的［］
  if (stripped !== plain.replace(/[［］]/g, '')) error(where, '去掉注音後和原句不一致');
}

// ── 各等級數量（首頁、進度總覽用） ──
const levelCounts = load('level-counts.ts');
for (const lv of LEVELS) {
  const listed = levelCounts[lv.toUpperCase()] ?? {};
  for (const kind of ['words', 'grammar', 'reading']) {
    if (listed[kind] !== counts[lv][kind]) {
      error(
        `level-counts.ts ${lv.toUpperCase()}`,
        `${kind} 寫 ${listed[kind]}，實際是 ${counts[lv][kind]}`,
      );
    }
  }
}

// ── 結果 ──
console.log(
  `單字 ${wordCount}・文法 ${grammarCount}・試題 ${examCount}・文章 ${articleIds.size}・注音句 ${Object.keys(map).length}`,
);
if (warnings.length > 0) {
  console.log(`\n提醒 ${warnings.length} 項：`);
  warnings.slice(0, 50).forEach((w) => console.log(`  - ${w}`));
  if (warnings.length > 50) console.log(`  …還有 ${warnings.length - 50} 項`);
}
if (errors.length > 0) {
  console.log(`\n錯誤 ${errors.length} 項：`);
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  process.exit(1);
}
console.log('\n資料檢查通過 ✓');
