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

/** 讀取含有型別宣告的 TypeScript 檔（用專案的 TypeScript 轉換），回傳所有 export */
function loadTs(file) {
  const ts = require('typescript');
  const source = fs.readFileSync(path.join(DATA, file), 'utf8').replace(/^import .*$/gm, '');
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const sandbox = { module: { exports: {} }, exports: {} };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(js, sandbox, { filename: file });
  return sandbox.module.exports;
}

/** 文字的檢查碼（FNV-1a），用來發現固定考卷的題目內容有沒有改變 */
function hashText(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
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

// 相似文法、常見錯誤（notes/）：id 要對得上，內容不能空，錯的和對的不能一樣
let noteCount = 0;
for (const lv of LEVELS) {
  const file = `grammar/notes/${lv}.ts`;
  if (!fs.existsSync(path.join(DATA, file))) continue;
  const notes = loadTs(file)[`${lv.toUpperCase()}_GRAMMAR_NOTES`];
  for (const [id, note] of Object.entries(notes)) {
    const where = `文法說明 ${id}`;
    noteCount++;
    if (!grammarIds.has(id) || !id.startsWith(`${lv}-`)) error(where, '找不到這個文法或等級不一致');
    for (const s of note.similar ?? []) {
      if (!isText(s.pattern) || !isText(s.diff)) error(where, '相似文法缺少句型或差別');
      if (s.id !== undefined && !grammarIds.has(s.id)) error(where, `相似文法的 id ${s.id} 不存在`);
      if (s.id === id) error(where, '相似文法不能指向自己');
    }
    for (const m of note.mistakes ?? []) {
      if (!isText(m.wrong) || !isText(m.right) || !isText(m.why)) error(where, '常見錯誤缺少內容');
      else if (m.wrong === m.right) error(where, '錯誤和正確的說法一樣');
    }
  }
}

// ── 模擬試題、題組、固定考卷 ──
const EXAM_TYPES = new Set([
  'kanji-reading',
  'orthography',
  'context',
  'paraphrase',
  'usage',
  'grammar',
  'sentence-order',
  'text-grammar',
  'reading',
  'listening',
]);
const SUBCATEGORIES = new Set([
  'kanji-reading',
  'orthography',
  'word-formation',
  'context',
  'paraphrase',
  'usage',
  'grammar-form',
  'sentence-order',
  'text-grammar',
  'short',
  'mid',
  'long',
  'integrated',
  'thematic',
  'info-search',
  'task',
  'point',
  'summary',
  'utterance',
  'quick-response',
  'integrated-listening',
]);
/** 允許的授權：本專案自編，或明確可以使用的開放授權 */
const LICENSES = new Set(['original', 'CC0-1.0', 'CC-BY-4.0', 'CC-BY-SA-4.0', 'MIT']);
const JAPANESE = /[ぁ-ゖァ-ヺ一-鿿々]/;
const examIds = new Set();
const examById = new Map();
const groupById = new Map();
const usedGroups = new Set();
let examCount = 0;
let groupCount = 0;
let noDifficulty = 0;
let noTranslation = 0;

/** 選填的分類欄位：有寫就要正確 */
function checkMeta(where, item) {
  if (item.subcategory !== undefined && !SUBCATEGORIES.has(item.subcategory)) {
    error(where, `細分題型不正確：${item.subcategory}`);
  }
  if (item.difficulty !== undefined && ![1, 2, 3].includes(item.difficulty)) {
    error(where, `難度要是 1、2、3：${item.difficulty}`);
  }
  if (item.license !== undefined && !LICENSES.has(item.license)) {
    error(where, `授權不在允許清單：${item.license}`);
  }
  if (item.license !== undefined && item.license !== 'original' && !isText(item.source)) {
    error(where, '非自編的內容要寫來源（source）');
  }
  if (item.version !== undefined && !(Number.isInteger(item.version) && item.version >= 1)) {
    error(where, `版本要是正整數：${item.version}`);
  }
  if (item.audio !== undefined && !fs.existsSync(path.join(ROOT, item.audio))) {
    error(where, `找不到音檔：${item.audio}`);
  }
}

for (const lv of LEVELS) {
  for (const g of loadTs(`exam/groups/${lv}.ts`)[`${lv.toUpperCase()}_EXAM_GROUPS`]) {
    const where = `題組 ${g.id ?? '(沒有 id)'}`;
    groupCount++;
    if (!isText(g.id) || !g.id.startsWith(`${lv}-`)) error(where, 'id 缺少或和等級不一致');
    if (groupById.has(g.id)) error(where, 'id 重複');
    groupById.set(g.id, g);
    if (g.kind === 'passage' && !isText(g.passage)) error(where, '讀解題組缺少文章');
    if (g.kind === 'audio' && !(Array.isArray(g.script) && g.script.length > 1)) {
      error(where, '聽力題組缺少對話');
    }
    if (!['passage', 'audio'].includes(g.kind)) error(where, `題組種類不正確：${g.kind}`);
    if (!SUBCATEGORIES.has(g.subcategory)) error(where, `細分題型不正確：${g.subcategory}`);
    if (g.passage) {
      const plain = RUBY.test(g.passage) ? checkRuby(where, g.passage) : g.passage;
      RUBY.lastIndex = 0;
      if (!JAPANESE.test(plain)) error(where, '文章沒有日文');
      // 新格式的題組（有注音或標了難度）一定要有完整中文翻譯
      if ((g.difficulty !== undefined || plain !== g.passage) && !isText(g.translation)) {
        error(where, '新題組缺少文章的中文翻譯');
      }
    }
    checkMeta(where, g);
  }
}

const seenContent = new Map();
for (const lv of LEVELS) {
  const bankFile = `exam/bank/${lv}.ts`;
  const bank = fs.existsSync(path.join(DATA, bankFile))
    ? loadTs(bankFile)[`${lv.toUpperCase()}_EXAM_BANK`]
    : [];
  // 固定考卷用、已固定下來的自動出題
  const frozenFile = `exam/frozen/${lv}.ts`;
  if (fs.existsSync(path.join(DATA, frozenFile))) {
    bank.push(...loadTs(frozenFile)[`${lv.toUpperCase()}_FROZEN`]);
  }
  const listeningFile = `exam/bank/${lv}-listening.ts`;
  if (fs.existsSync(path.join(DATA, listeningFile))) {
    bank.push(...loadTs(listeningFile)[`${lv.toUpperCase()}_LISTENING_BANK`]);
  }
  const listeningFile2 = `exam/bank/${lv}-listening-2.ts`;
  if (fs.existsSync(path.join(DATA, listeningFile2))) {
    bank.push(...loadTs(listeningFile2)[`${lv.toUpperCase()}_LISTENING_BANK_2`]);
  }
  for (const q of [...load(`exam/${lv}.ts`), ...bank]) {
    const where = `試題 ${q.id ?? '(沒有 id)'}`;
    examCount++;
    if (examIds.has(q.id)) error(where, 'id 重複');
    examIds.add(q.id);
    examById.set(q.id, q);
    if (!isText(q.id) || !q.id.startsWith(`${lv}-`)) error(where, 'id 和檔案等級不一致');
    if (!EXAM_TYPES.has(q.type)) error(where, `題型不正確：${q.type}`);
    // 新題目可以直接寫注音 [漢字|かな]
    let sentence = q.sentence;
    if (isText(q.sentence) && /\[[^|\]]+\|/.test(q.sentence)) {
      sentence = checkRuby(where, q.sentence.replace(/[［］]/g, ''));
      sentence = q.sentence.replace(/\[([^|\]]+)\|[^\]]+\]/g, '$1');
    }
    if (!isText(q.sentence)) error(where, '缺少題目');
    else if (!JAPANESE.test(sentence)) error(where, '題目沒有日文');
    if (q.options?.some((o) => /\[[^|\]]+\|/.test(o))) error(where, '選項不能有注音標記');
    if (!isText(q.explanation)) error(where, '缺少解說（正確答案的說明）');
    // 聽解的發話表現、即時應答只有 3 個選項（和 JLPT 一樣）
    const spokenOptions = ['utterance', 'quick-response'].includes(q.subcategory);
    checkOptions(where, q.options, spokenOptions ? 3 : 4);
    if (q.options?.some((o) => !isText(o))) error(where, '有空白的選項');
    checkMeta(where, q);
    if (q.optionNotes !== undefined) {
      if (
        !Array.isArray(q.optionNotes) ||
        q.optionNotes.length !== q.options?.length ||
        !q.optionNotes.every(isText)
      ) {
        error(where, '每個選項都要有解說（數量和選項一樣）');
      }
    }
    if (q.difficulty === undefined) noDifficulty++;
    // 新格式題目（標了難度）：每個選項都要有解說，題目要有翻譯（讀解看文章翻譯）、授權
    else {
      if (!q.optionNotes) error(where, '新題目缺少每個選項的解說（optionNotes）');
      if (!q.license) error(where, '新題目缺少授權標示（license）');
      if (!['reading', 'listening'].includes(q.type) && !isText(q.translation)) {
        error(where, '新題目缺少題目的中文翻譯（translation）');
      }
    }
    if (q.translation === undefined) noTranslation++;
    const group = q.groupId ? groupById.get(q.groupId) : undefined;
    if (q.groupId) {
      if (!group) error(where, `找不到題組 ${q.groupId}`);
      else usedGroups.add(q.groupId);
      if (q.passage) error(where, '題目同時有 groupId 和 passage，文章只要放在題組裡');
    }
    const rawPassage = q.passage ?? group?.passage;
    const passage = rawPassage?.replace(/\[([^|\]]+)\|[^\]]+\]/g, '$1');
    const script = q.script ?? group?.script;
    if (q.type === 'reading' && !isText(passage)) error(where, '讀解題缺少文章（passage 或題組）');
    // 聽解：發話表現只要情境（題目句子）；即時應答至少一句話；其他要有情境說明＋對話
    const minLines = q.subcategory === 'utterance' ? 0 : q.subcategory === 'quick-response' ? 1 : 2;
    const lines = Array.isArray(script) ? script.length : 0;
    if (q.type === 'listening' && lines < minLines) error(where, '聽解題缺少對話');
    if (
      ['kanji-reading', 'orthography', 'paraphrase'].includes(q.type) &&
      !/［.+］/.test(q.sentence)
    ) {
      error(where, '題目沒有用［］標出畫底線的字');
    }
    // 重複的題目：同一篇文章、同一句題目、同一組選項
    const key = JSON.stringify([passage ?? '', sentence, [...(q.options ?? [])].sort()]);
    if (seenContent.has(key)) error(where, `和 ${seenContent.get(key)} 是重複的題目`);
    else seenContent.set(key, q.id);
  }
}
for (const id of groupById.keys()) {
  if (!usedGroups.has(id)) warn(`題組 ${id}`, '沒有題目用到這個題組');
}
if (noDifficulty > 0) warn('試題', `${noDifficulty} 題沒有標記難度（沿用預設「標準」）`);
if (noTranslation > 0) warn('試題', `${noTranslation} 題沒有題目中文翻譯（考後只顯示解說）`);

/** 固定考卷用到的題目內容（決定檢查碼） */
function paperContent(ids) {
  return ids.map((id) => {
    const q = examById.get(id);
    if (!q) return [id, null];
    const group = q.groupId ? groupById.get(q.groupId) : undefined;
    return [
      id,
      q.type,
      q.sentence,
      q.options,
      q.explanation,
      q.passage ?? group?.passage ?? null,
      q.script ?? group?.script ?? null,
      q.optionNotes ?? null,
    ];
  });
}

const { EXAM_PAPERS } = loadTs('exam/papers/index.ts');
const paperIds = new Set();
let paperCount = 0;
for (const lv of LEVELS) {
  for (const paper of EXAM_PAPERS[lv.toUpperCase()] ?? []) {
    const where = `考卷 ${paper.id}`;
    paperCount++;
    if (paperIds.has(paper.id)) error(where, 'id 重複');
    paperIds.add(paper.id);
    if (paper.level !== lv.toUpperCase()) error(where, '等級不一致');
    let previous = 0;
    for (const version of paper.versions ?? []) {
      const at = `${where} 第 ${version.version} 版`;
      if (!(version.version > previous)) error(at, '版本號要遞增');
      previous = version.version;
      const ids = version.questionIds ?? [];
      if (ids.length === 0) error(at, '沒有題目');
      if (new Set(ids).size !== ids.length) error(at, '有重複的題目');
      for (const id of ids) {
        if (!examById.has(id)) error(at, `找不到題目 ${id}（固定考卷只能用自編題目）`);
        else if (!id.startsWith(`${lv}-`)) error(at, `題目 ${id} 不是這個等級的`);
      }
      const hash = hashText(JSON.stringify(paperContent(ids)));
      if (version.contentHash !== hash) {
        error(
          at,
          `題目內容和檢查碼不一致（目前內容是 ${hash}）。修改了題目的話，請新增一個版本（版本號加一）再填入新的檢查碼，不要直接改舊版本。`,
        );
      }
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
  `單字 ${wordCount}・文法 ${grammarCount}（說明 ${noteCount}）・試題 ${examCount}・題組 ${groupCount}・固定考卷 ${paperCount}・文章 ${articleIds.size}・注音句 ${Object.keys(map).length}`,
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
