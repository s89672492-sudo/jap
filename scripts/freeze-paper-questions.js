/**
 * 把自動出題的題目「固定」成一般題目，給固定考卷使用：
 *   node scripts/freeze-paper-questions.js <等級> <回數>   例如 n5 2
 * 自動出的題目內容跟著單字資料變，固定考卷要每次一樣，所以把挑中的題目內容整個寫進
 * src/data/exam/frozen/<等級>.ts（新的 id：n5-p2-kr-01…），之後單字資料怎麼改都不影響這一回。
 * 已經有的題目不會被改掉；同一回再執行一次會略過。
 */
const fs = require('fs');
const path = require('path');
const { loadModule } = require('./lib/ts-loader');

globalThis.__DEV__ = false;

const [lv, number] = process.argv.slice(2);
if (!/^n[1-5]$/.test(lv ?? '') || !/^\d+$/.test(number ?? '')) {
  console.error('用法：node scripts/freeze-paper-questions.js n5 2');
  process.exit(1);
}
const LEVEL = lv.toUpperCase();
const FILE = path.join(__dirname, '..', 'src/data/exam/frozen', `${lv}.ts`);

/** 每一回要固定幾題（照藍圖） */
const PLAN = {
  N5: { 'kanji-reading': 7, orthography: 5, context: 6, grammar: 9 },
  N4: { 'kanji-reading': 7, orthography: 5, context: 8, grammar: 13 },
  N3: { 'kanji-reading': 8, orthography: 6, context: 11, grammar: 13 },
  N2: { 'kanji-reading': 5, orthography: 5, context: 7, grammar: 12 },
  N1: { 'kanji-reading': 6, context: 7, grammar: 10 },
};
/**
 * 人工檢查後排除的自動出題（有兩個以上合文法的答案，不適合放進固定考卷）。
 * 例：「毎朝七時に起き（ます／ません）」兩個都對。
 */
const REJECTED = new Set([
  'gen-gr-n5-g05',
  'gen-gr-n5-g72',
  'gen-gr-n5-g25',
  'gen-gr-n5-g107',
  'gen-gr-n4-g93',
  'gen-gr-n4-g02',
  'gen-gr-n4-g11',
  'gen-gr-n5-g64',
  'gen-gr-n5-g94',
  'gen-gr-n4-g145',
  'gen-gr-n4-g75',
  // 文脈規定：其他選項放進去也說得通（第 3～5 回檢查時排除）
  'gen-cx-n5-036', // （新しい／軽い／青い）くつ
  'gen-cx-n5-305', // （昼ご飯／お姉さん）は弁当です
  'gen-cx-n5-641', // 駅は（どっち／あれ／そちら）ですか
  'gen-cx-n5-854', // とても（男らしい／格好悪い）人
  'gen-cx-n5-271', // （傘／箸）を持っていきましょう
  'gen-cx-n5-318', // （塩／上）を取ってください
  'gen-cx-n5-022', // わたしの（家／店）は駅から近い
  'gen-cx-n5-844', // パンの（香ばしい／気持ち悪い）におい
  'gen-cx-n5-663', // では、（いただきます／すみません／ありがとう）
  'gen-cx-n5-106', // （妹／二人）は小学生です
  'gen-cx-n5-457', // この傘は（誰／病院）のですか
  'gen-cx-n4-675', // 週末は（温泉／見学／森）に行きたい
  'gen-cx-n4-1126', // 公園で（落ち合う／見せ合う）ことにした
  'gen-cx-n4-847', // 寝る前に（推理小説／作り方）を読む
  'gen-cx-n4-679', // 初めて（海外／市役所）へ行きます
  'gen-cx-n4-1425', // 夜中に激しい（雷雨／地震）があった
  'gen-cx-n5-691', // （空腹／小学生）のときは何でもおいしい
  'gen-cx-n5-697', // 母に（プレゼント／テーブル／テレビゲーム）をあげました
  'gen-cx-n5-328', // 毎日、（日本語／動物）を勉強しています
  'gen-cx-n4-505', // 祖母が編んだ（セーター／スカート）は暖かい
  'gen-cx-n3-954', // 優秀な（技術者／少年）
  'gen-cx-n3-601', // （お互い／持ち主）の意見
  'gen-cx-n3-167', // その選手は今年（引退／参加）した
  'gen-cx-n3-2416', // （軍事／続編）に関する情報は公開されない
  'gen-cx-n3-033', // その夜の（記憶／順番）がはっきりしない
  'gen-cx-n2-1622', // （壮大／広大／巨大）な景色
  'gen-cx-n3-756', // この（　）の歌が好きだ。
  'gen-cx-n3-811', // （　）について話し合った。
  'gen-cx-n3-2246', // 彼は大学を出てからずっと（　）だ。
  'gen-cx-n3-1915', // 芸術は新しい価値の（　）だ。
  'gen-cx-n3-2031', // 新しい（　）が記者会見を開いた。
  'gen-cx-n3-1774', // 子どもの頃、偉人の（　）をよく読んだ。
  'gen-cx-n3-736', // 駅の周りは（　）施設が多い。
  'gen-cx-n3-2414', // 彼の父は（　）で、世界中に住んだ。
  'gen-cx-n3-2424', // （　）の車が大きな音で走っていた。
  'gen-cx-n2-1948', // 彼は（　）で今の会社に入った。
  'gen-or-n3-1410', // ［おもいのほか］：「想いのほか」也有人這樣寫
  'gen-gr-n2-g90', // 最後まで聞く（ものだ／ところだ），已修正文法資料，但固定考卷不用
]);
const SHORT = { 'kanji-reading': 'kr', orthography: 'or', context: 'cx', grammar: 'gf' };

async function main() {
  await loadModule('data/level-data').loadAllLevels();
  await loadModule('lib/furigana').loadFurigana();
  const generated = loadModule('lib/generated-exam');
  const { createRng, seededShuffle } = loadModule('lib/exam-seed');

  const existing = fs.existsSync(FILE) ? fs.readFileSync(FILE, 'utf8') : '';
  const prefix = `${lv}-p${number}-`;
  if (existing.includes(`'${prefix}`)) {
    console.log(`${LEVEL} 第 ${number} 回的題目已經固定過了，略過。`);
    return;
  }
  // 已經固定過的原始題目不再挑（每一回用不同的題目）
  const used = new Set([...existing.matchAll(/from: '([^']+)'/g)].map((m) => m[1]));
  const rng = createRng(`${LEVEL}-paper-${number}`);
  const frozen = [];
  const paperWords = new Set();
  for (const [type, count] of Object.entries(PLAN[LEVEL])) {
    let n = 0;
    for (const id of seededShuffle(generated.generatedCandidateIds(LEVEL, type), rng)) {
      if (n >= count) break;
      if (used.has(id) || REJECTED.has(id)) continue;
      // 同一回不考同一個單字兩次（讀音題和表記題用同一個單字，一題會洩漏另一題的答案）
      const word = id.match(/-(\d+)$/)?.[1];
      if (type !== 'grammar' && word && paperWords.has(word)) continue;
      const q = generated.getGeneratedQuestion(id);
      if (!q) continue;
      n++;
      used.add(id);
      if (type !== 'grammar' && word) paperWords.add(word);
      frozen.push({ ...q, id: `${prefix}${SHORT[type]}-${String(n).padStart(2, '0')}`, from: id });
    }
    if (n < count) throw new Error(`${type} 只找到 ${n} 題`);
  }
  const body = frozen
    .map((q) => {
      const { from, ...question } = q;
      return `  {\n    ...FROZEN,\n    from: ${JSON.stringify(from).replace(/"/g, "'")},\n${Object.entries(
        question,
      )
        .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
        .join('\n')}\n  },`;
    })
    .join('\n');
  const header = `import type { ExamQuestion } from '../types';

/**
 * ${LEVEL} 固定考卷用的題目：由 App 的單字、文法例句自動出題後固定下來（scripts/freeze-paper-questions.js）。
 * 內容不再跟著單字資料變，固定考卷每次都一樣。不放進隨機組卷和題型練習（那裡已經有自動出的同一題）。
 * from 是原本自動出題的 id（記錄來源用）。
 */
const FROZEN = {
  source: '偵探日語自動出題（由 App 的單字、文法例句產生，已固定）',
  license: 'original',
  version: 1,
} as const;

export const ${LEVEL}_FROZEN: (ExamQuestion & { from: string })[] = [
`;
  const content = existing
    ? existing.replace(/\];\s*$/, `${body}\n];\n`)
    : `${header}${body}\n];\n`;
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, content);
  console.log(
    `${LEVEL} 第 ${number} 回：固定了 ${frozen.length} 題 → ${path.relative(process.cwd(), FILE)}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
