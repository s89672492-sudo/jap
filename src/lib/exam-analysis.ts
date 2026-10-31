import {
  EXAM_SUBCATEGORY_LABELS,
  TYPE_DEFAULTS,
  getAuthoredQuestion,
  type ExamSubcategory,
} from '@/data/exam';
import type { JlptLevel } from '@/data/vocab';
import { parseGeneratedId } from '@/lib/generated-exam';
import type { MockExamRecord } from '@/stores/mock-exam-store';

/**
 * 模擬考成績分析：和上次比較、歷次趨勢、各題型的弱點。
 * 分數是用答對比例換算的推估分數（不是 JLPT 正式的等化分數），畫面上要一直標明。
 * 只用紀錄裡存的資料計算，不需要重新產生題目（舊紀錄沒有快照的題目用 id 判斷題型）。
 */

export type ItemResult = {
  subcategory: ExamSubcategory;
  correct: boolean;
  answered: boolean;
  ms: number;
};

/** 題目屬於哪個大問：有快照用快照，沒有就用 id 推定 */
function subcategoryOf(record: MockExamRecord, id: string): ExamSubcategory | null {
  const snap = record.snapshot?.find((item) => item.question.id === id)?.question;
  if (snap?.subcategory) return snap.subcategory;
  if (snap) return TYPE_DEFAULTS[snap.type].subcategory;
  const authored = getAuthoredQuestion(id);
  if (authored?.subcategory) return authored.subcategory;
  const generated = parseGeneratedId(id);
  if (generated) return TYPE_DEFAULTS[generated.type].subcategory;
  return null;
}

/** 正確答案：第 2 版紀錄有存；舊紀錄用快照或自編題目找（自動出的舊題目無法判斷就略過） */
function answerOf(record: MockExamRecord, id: string, stored?: string): string | null {
  if (stored !== undefined) return stored;
  const snap = record.snapshot?.find((item) => item.question.id === id);
  if (snap) return snap.answer;
  return getAuthoredQuestion(id)?.options[0] ?? null;
}

/** 一次考試每一題的結果（無法判斷的題目略過） */
export function itemResults(record: MockExamRecord): ItemResult[] {
  const results: ItemResult[] = [];
  for (const item of record.items ?? []) {
    const subcategory = subcategoryOf(record, item.id);
    const answer = answerOf(record, item.id, item.answer);
    if (!subcategory || answer === null) continue;
    results.push({
      subcategory,
      correct: item.mine === answer,
      answered: item.mine !== null,
      ms: item.ms ?? 0,
    });
  }
  return results;
}

export type TypeStat = {
  subcategory: ExamSubcategory;
  label: string;
  correct: number;
  total: number;
  rate: number;
};

/** 各大問的答對率（依出現順序） */
export function typeStats(results: ItemResult[]): TypeStat[] {
  const map = new Map<ExamSubcategory, { correct: number; total: number }>();
  for (const r of results) {
    const entry = map.get(r.subcategory) ?? { correct: 0, total: 0 };
    entry.total++;
    if (r.correct) entry.correct++;
    map.set(r.subcategory, entry);
  }
  return [...map.entries()].map(([subcategory, { correct, total }]) => ({
    subcategory,
    label: EXAM_SUBCATEGORY_LABELS[subcategory],
    correct,
    total,
    rate: total === 0 ? 0 : correct / total,
  }));
}

/** 判斷弱點至少要有幾題（題數太少不準） */
export const MIN_ITEMS_FOR_WEAKNESS = 4;

/**
 * 最弱的幾個大問：合併最近幾次考試，題數夠的大問裡答對率最低的。
 * 答對率八成以上的不算弱點。
 */
export function weakestTypes(records: MockExamRecord[], count = 3, recent = 5): TypeStat[] {
  const results = records.slice(0, recent).flatMap(itemResults);
  return typeStats(results)
    .filter((s) => s.total >= MIN_ITEMS_FOR_WEAKNESS && s.rate < 0.8)
    .sort((a, b) => a.rate - b.rate || b.total - a.total)
    .slice(0, count);
}

export type Comparison = {
  totalDiff: number;
  sections: { label: string; diff: number }[];
};

/** 和前一次比較（records 最新的在前面；沒有前一次回傳 null） */
export function compareWithPrevious(
  record: MockExamRecord,
  records: MockExamRecord[],
): Comparison | null {
  const index = records.findIndex((r) => r.date === record.date);
  // 剛考完時紀錄可能還沒寫進列表：那就和列表裡最新的一次比
  const previous = index >= 0 ? records[index + 1] : records.find((r) => r.date !== record.date);
  if (!previous) return null;
  return {
    totalDiff: record.total - previous.total,
    sections: record.sections.map((s) => ({
      label: s.label,
      diff: s.score - (previous.sections.find((p) => p.label === s.label)?.score ?? s.score),
    })),
  };
}

/** 合格判斷至少要幾次考試 */
export const MIN_EXAMS_FOR_OUTLOOK = 3;

export type PassOutlook =
  | { enough: false; have: number }
  | { enough: true; exams: number; passed: number; average: number; trend: number };

/**
 * 合格傾向：最近幾次（最多 5 次）有幾次達到合格標準、平均推估分數、趨勢。
 * 這不是統計上的合格機率，只是整理自己的紀錄；資料不足時不估算。
 */
export function passOutlook(records: MockExamRecord[]): PassOutlook {
  const recent = records.slice(0, 5);
  if (recent.length < MIN_EXAMS_FOR_OUTLOOK) return { enough: false, have: recent.length };
  const average = Math.round(recent.reduce((sum, r) => sum + r.total, 0) / recent.length);
  // 趨勢：最近一次和最舊那次的差
  const trend = recent[0].total - recent[recent.length - 1].total;
  return {
    enough: true,
    exams: recent.length,
    passed: recent.filter((r) => r.passed).length,
    average,
    trend,
  };
}

/** 每題平均作答秒數（沒有記錄時間的舊紀錄回傳 null） */
export function averageSeconds(results: ItemResult[]): number | null {
  const timed = results.filter((r) => r.ms > 0);
  if (timed.length === 0) return null;
  return Math.round(timed.reduce((sum, r) => sum + r.ms, 0) / timed.length / 1000);
}

/** 針對練習：這個大問在哪裡練習（推理測驗的模式＋試題的題型篩選） */
export function practiceTarget(subcategory: ExamSubcategory): {
  mode: 'exam' | 'reading' | 'grammar' | 'vocab' | 'listening';
  focus?: ExamSubcategory;
} {
  switch (subcategory) {
    case 'kanji-reading':
      return { mode: 'reading' };
    case 'grammar-form':
      return { mode: 'grammar' };
    case 'context':
      return { mode: 'vocab' };
    default:
      return { mode: 'exam', focus: subcategory };
  }
}

export type StudyAdvice = { label: string; detail: string };

/** 個人學習建議：依弱點和待複習數量，建議今天的練習量（只是建議，不改變複習排程） */
export function studyAdvice(
  level: JlptLevel,
  weak: TypeStat[],
  dueWords: number,
  lastExamDate: string | null,
  now: number,
): StudyAdvice[] {
  const advice: StudyAdvice[] = [];
  if (dueWords > 0) {
    advice.push({
      label: '單字複習',
      detail: `今天到期 ${dueWords} 個，建議先複習 ${Math.min(dueWords, 20)} 個（剩下的明天還在）。`,
    });
  }
  const has = (cats: ExamSubcategory[]) => weak.some((w) => cats.includes(w.subcategory));
  if (has(['grammar-form', 'sentence-order', 'text-grammar'])) {
    advice.push({
      label: '文法',
      detail: '文法是目前的弱點：今天做 1 輪文法測驗、1 輪句子重組或文章文法。',
    });
  }
  if (has(['kanji-reading', 'orthography', 'context', 'paraphrase', 'usage', 'word-formation'])) {
    advice.push({
      label: '文字語彙',
      detail: '語彙題型偏弱：今天做 1 輪讀音或單字測驗，搭配錯題本複習。',
    });
  }
  if (has(['short', 'mid', 'long', 'integrated', 'thematic', 'info-search'])) {
    advice.push({ label: '讀解', detail: '讀解偏弱：今天讀 1 篇今日文章，再做 1 組讀解練習題。' });
  }
  if (has(['task', 'point', 'summary', 'utterance', 'quick-response', 'integrated-listening'])) {
    advice.push({ label: '聽解', detail: '聽解偏弱：今天做 1 輪聽解練習（練習模式可以重播）。' });
  }
  const days = lastExamDate
    ? Math.floor((now - new Date(lastExamDate).getTime()) / 86400000)
    : null;
  advice.push({
    label: '下一次模擬考',
    detail:
      days === null
        ? `還沒考過 ${level} 模擬考，可以先考一次了解自己的程度。`
        : days >= 7
          ? `上次模擬考是 ${days} 天前，可以再考一次看看進步多少。`
          : `上次模擬考是 ${days === 0 ? '今天' : `${days} 天前`}，建議 ${7 - days} 天後再考（先加強弱點）。`,
  });
  return advice;
}
