import { BLUEPRINTS, type BlueprintItem, type BlueprintSitting } from '@/data/exam/blueprints';
import {
  EXAM_BY_LEVEL,
  TYPE_DEFAULTS,
  getAuthoredQuestion,
  normalizeQuestion,
  type ExamDifficulty,
  type ExamQuestion,
  type ExamQuestionType,
  type ExamSubcategory,
} from '@/data/exam';
import { EXAM_PAPERS, type ExamPaperDef } from '@/data/exam/papers';
import type { JlptLevel } from '@/data/vocab';
import { createRng, seededShuffle, type Rng } from '@/lib/exam-seed';
import {
  generatedCandidateIds,
  getGeneratedQuestion,
  isGeneratedId,
  parseGeneratedId,
  type GeneratedType,
} from '@/lib/generated-exam';
import type { ExamRoundQuestion } from '@/lib/quiz';

/**
 * 考卷引擎：依等級藍圖（data/exam/blueprints.ts）組卷。
 * - 固定考卷：模擬考第 1〜5 回，題目和選項順序每次都一樣（data/exam/papers）
 * - 隨機考卷：用種子決定選題和選項順序，優先出錯題和沒考過的題，控制題型和難度比例，
 *   同一篇文章（題組）只出一次
 * 題庫不夠的大問就少出幾題，不會為了湊數產生題目。
 */

/** 隨機考卷的 paperId */
export const RANDOM_PAPER_ID = 'random';
/** 隨機組卷規則的版本：規則改變時加一，紀錄裡可以分辨用哪一版規則組的 */
export const RANDOM_PAPER_VERSION = 2;

/** 一節考試（考生一次坐下來作答、一起計時的範圍） */
export type Sitting = {
  label: string;
  types: ExamQuestionType[];
  /** 正式考試這一節的時間（分鐘） */
  officialMinutes: number;
};

export type MockSitting = Sitting & {
  questions: ExamRoundQuestion[];
  /** 依題數換算的作答時間（秒），練習模式用 */
  seconds: number;
};

export type PickHistory = {
  /** 答錯、還沒複習掉的題目 id（錯題本） */
  mistakes: ReadonlySet<string>;
  /** 模擬考考過的題目 id */
  seen: ReadonlySet<string>;
};

export const EMPTY_HISTORY: PickHistory = { mistakes: new Set(), seen: new Set() };

/** 用題目 id 找回題目：自編的題目或自動出的題目 */
export function findExamQuestion(level: JlptLevel, id: string): ExamQuestion | null {
  if (isGeneratedId(id)) {
    const generated = getGeneratedQuestion(id);
    // 自動出的題目：標上分類和來源（題目由 App 的單字、文法例句產生）
    return generated
      ? normalizeQuestion(parseGeneratedId(id)?.level ?? level, {
          ...generated,
          source: generated.source ?? '偵探日語自動出題（由 App 的單字、文法例句產生）',
        })
      : null;
  }
  return getAuthoredQuestion(id) ?? null;
}

/** 讀解每題（含讀文章）給的秒數；等級越高文章越長 */
const READING_SECONDS: Record<JlptLevel, number> = { N5: 120, N4: 150, N3: 180, N2: 210, N1: 240 };

/** 練習模式的時間：語彙 45 秒、文法 60 秒、句子重組 90 秒、文章文法 90 秒、讀解 2〜4 分鐘、聽解 90 秒 */
function secondsFor(type: ExamQuestionType, level: JlptLevel): number {
  switch (type) {
    case 'grammar':
      return 60;
    case 'sentence-order':
    case 'text-grammar':
    case 'listening':
      return 90;
    case 'reading':
      return READING_SECONDS[level];
    default:
      return 45;
  }
}

function toSitting(
  level: JlptLevel,
  sitting: BlueprintSitting,
  questions: ExamRoundQuestion[],
): MockSitting {
  const seconds = questions.reduce((sum, q) => sum + secondsFor(q.question.type, level), 0);
  return {
    label: sitting.label,
    types: [...new Set(sitting.items.map((i) => i.type))],
    officialMinutes: sitting.minutes,
    questions,
    // 以整分鐘計時，比較像正式考試
    seconds: Math.max(60, Math.ceil(seconds / 60) * 60),
  };
}

const withOptions = (question: ExamQuestion, rng: Rng): ExamRoundQuestion => ({
  question,
  options: seededShuffle(question.options, rng),
  answer: question.options[0],
});

/**
 * 題目在藍圖裡屬於哪個大問（決定放在哪一節、排第幾）。
 * 藍圖沒有的題型（例如 N1 正式考試沒有「表記」，但舊題庫有）放在同一類大問的後面，不丟掉。
 */
function itemIndex(sitting: BlueprintSitting, question: ExamQuestion): number {
  const exact = sitting.items.findIndex((i) => i.subcategory === question.subcategory);
  if (exact >= 0) return exact;
  const sameType = sitting.items.findIndex((i) => i.type === question.type);
  if (sameType >= 0) return sameType;
  if (!question.category || !sitting.categories.includes(question.category)) return -1;
  const sameCategory = sitting.items.findIndex(
    (i) => TYPE_DEFAULTS[i.type].category === question.category,
  );
  return sameCategory >= 0 ? sameCategory + 0.5 : sitting.items.length;
}

// ── 固定考卷 ──

export function latestPaperVersion(def: ExamPaperDef) {
  return def.versions[def.versions.length - 1];
}

/** 這個等級的固定考卷（已經有題目的） */
export function fixedPapers(level: JlptLevel): ExamPaperDef[] {
  return EXAM_PAPERS[level];
}

export function findPaper(level: JlptLevel, paperId: string): ExamPaperDef | undefined {
  return EXAM_PAPERS[level].find((paper) => paper.id === paperId);
}

/**
 * 組固定考卷：題目照藍圖的節和大問排好，選項順序由「考卷 id＋版本」決定，每次都一樣。
 * 找不到的題目（不應該發生，資料檢查會擋）略過。
 */
export function buildFixedPaper(
  level: JlptLevel,
  def: ExamPaperDef,
  version?: number,
): MockSitting[] {
  const paperVersion = def.versions.find((v) => v.version === version) ?? latestPaperVersion(def);
  const rng = createRng(`${def.id}@v${paperVersion.version}`);
  const questions = paperVersion.questionIds
    .map((id) => findExamQuestion(level, id))
    .filter((q): q is ExamQuestion => q !== null);
  return BLUEPRINTS[level].sittings.map((sitting) => {
    const inSitting = questions
      .map((question, order) => ({ question, order, index: itemIndex(sitting, question) }))
      .filter(
        ({ question, index }) =>
          index >= 0 &&
          question.category !== undefined &&
          sitting.categories.includes(question.category),
      )
      .sort((a, b) => a.index - b.index || a.order - b.order);
    return toSitting(
      level,
      sitting,
      inSitting.map(({ question }) => withOptions(question, rng)),
    );
  });
}

// ── 隨機考卷 ──

/** 選題的單位：單獨一題，或一整個題組（同一篇文章的題目一起出） */
type Unit = { key: string; questions: ExamQuestion[]; difficulty: ExamDifficulty };

const GENERATED_FOR: Partial<Record<ExamSubcategory, GeneratedType>> = {
  'kanji-reading': 'kanji-reading',
  orthography: 'orthography',
  context: 'context',
  'grammar-form': 'grammar',
};

/** 這個大問可以出的題目 id（自編＋自動出題） */
function candidateIds(level: JlptLevel, subcategory: ExamSubcategory): string[] {
  const authored = EXAM_BY_LEVEL[level]
    .filter((q) => q.subcategory === subcategory)
    .map((q) => q.id);
  const generated = GENERATED_FOR[subcategory];
  return generated ? [...authored, ...generatedCandidateIds(level, generated)] : authored;
}

type UnitInfo = { key: string; ids: string[]; load: () => Unit | null };

/** 把題目 id 依題組合併成選題單位；題目內容（自動出題）要選到時才產生 */
function unitInfos(level: JlptLevel, ids: string[]): UnitInfo[] {
  const byKey = new Map<string, string[]>();
  for (const id of ids) {
    const key = (isGeneratedId(id) ? undefined : getAuthoredQuestion(id)?.groupId) ?? id;
    byKey.set(key, [...(byKey.get(key) ?? []), id]);
  }
  return [...byKey.entries()].map(([key, unitIds]) => ({
    key,
    ids: unitIds,
    load: () => {
      const questions = unitIds
        .map((id) => findExamQuestion(level, id))
        .filter((q): q is ExamQuestion => q !== null);
      if (questions.length === 0) return null;
      return { key, questions, difficulty: questions[0].difficulty ?? 2 };
    },
  }));
}

/**
 * 選出一個大問的題目：
 * 錯題本裡的題目（最多三分之一）→ 沒考過的 → 都考過了才出考過的；
 * 同一層裡依難度比例挑，挑不滿再不管難度補上。
 */
function pickUnits(
  infos: UnitInfo[],
  quota: number,
  history: PickHistory,
  mix: Record<ExamDifficulty, number>,
  used: Set<string>,
  rng: Rng,
): ExamQuestion[] {
  const available = infos.filter((u) => !used.has(u.key));
  const shuffled = seededShuffle(available, rng);
  const isMistake = (u: UnitInfo) => u.ids.some((id) => history.mistakes.has(id));
  const isSeen = (u: UnitInfo) => u.ids.every((id) => history.seen.has(id));
  const mistakes = shuffled.filter(isMistake).slice(0, Math.ceil(quota / 3));
  const ordered = [
    ...mistakes,
    ...shuffled.filter((u) => !mistakes.includes(u) && !isSeen(u)),
    ...shuffled.filter((u) => !mistakes.includes(u) && isSeen(u)),
  ];

  const target: Record<ExamDifficulty, number> = {
    1: Math.round(quota * mix[1]),
    2: Math.round(quota * mix[2]),
    3: Math.round(quota * mix[3]),
  };
  const count: Record<ExamDifficulty, number> = { 1: 0, 2: 0, 3: 0 };
  const picked: ExamQuestion[] = [];
  const skipped: Unit[] = [];
  // 第一輪：依難度比例；沒標難度的題目算「標準」
  for (const info of ordered) {
    if (picked.length >= quota) break;
    const unit = info.load();
    if (!unit) continue;
    if (count[unit.difficulty] >= Math.max(1, target[unit.difficulty])) {
      skipped.push(unit);
      continue;
    }
    count[unit.difficulty] += unit.questions.length;
    picked.push(...unit.questions);
    used.add(unit.key);
  }
  // 第二輪：題目不夠時不管難度補滿
  for (const unit of skipped) {
    if (picked.length >= quota) break;
    picked.push(...unit.questions);
    used.add(unit.key);
  }
  return picked;
}

/**
 * 組一份隨機考卷。同一個種子、同樣的作答紀錄會得到同一份考卷；
 * 考卷內容另外存成快照，所以之後一定能還原。
 */
export function buildRandomPaper(
  level: JlptLevel,
  history: PickHistory,
  seed: string,
): MockSitting[] {
  const blueprint = BLUEPRINTS[level];
  const rng = createRng(`${level}:${seed}`);
  const used = new Set<string>();
  return blueprint.sittings.map((sitting) => {
    const groups: { item: BlueprintItem; questions: ExamQuestion[] }[] = [];
    const infosFor = (subcategory: ExamSubcategory) =>
      unitInfos(level, candidateIds(level, subcategory));
    for (const item of sitting.items) {
      const questions = pickUnits(
        infosFor(item.subcategory),
        item.officialCount,
        history,
        blueprint.difficultyMix,
        used,
        rng,
      );
      groups.push({ item, questions });
    }
    // 同一種題型（例如讀解的短篇、中篇）題庫不夠時，用同題型其他大問的題目補到正式題數
    for (const type of new Set(sitting.items.map((i) => i.type))) {
      const items = groups.filter((g) => g.item.type === type);
      const quota = items.reduce((sum, g) => sum + g.item.officialCount, 0);
      const have = items.reduce((sum, g) => sum + g.questions.length, 0);
      if (have >= quota || items.length < 2) continue;
      for (const g of items) {
        const extra = pickUnits(
          infosFor(g.item.subcategory),
          quota - items.reduce((sum, x) => sum + x.questions.length, 0),
          history,
          blueprint.difficultyMix,
          used,
          rng,
        );
        g.questions.push(...extra);
      }
    }
    const questions = groups.flatMap((g) => g.questions).map((q) => withOptions(q, rng));
    return toSitting(level, sitting, questions);
  });
}

/** 紀錄或考試畫面上顯示的考卷名稱 */
export function paperLabel(level: JlptLevel, paperId?: string, version?: number): string {
  if (!paperId || paperId === RANDOM_PAPER_ID) return '隨機組卷';
  const paper = findPaper(level, paperId);
  if (!paper) return paperId;
  return version ? `${paper.title}（第 ${version} 版）` : paper.title;
}
