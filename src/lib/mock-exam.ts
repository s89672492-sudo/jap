import { BLUEPRINTS } from '@/data/exam/blueprints';
import type { ExamQuestionType } from '@/data/exam';
import type { JlptLevel } from '@/data/vocab';
import {
  EMPTY_HISTORY,
  buildRandomPaper,
  findExamQuestion,
  type MockSitting,
  type PickHistory,
} from '@/lib/exam-paper';
import { shuffle, type ExamRoundQuestion } from '@/lib/quiz';

export { findExamQuestion } from '@/lib/exam-paper';
export type { MockSitting, PickHistory, Sitting } from '@/lib/exam-paper';

/**
 * 完整模擬考的計分：照 JLPT 的計分科目和合格標準評分。
 * 計分方式參考 JLPT 官方公布的標準（總分合格點＋各科基準點），
 * 但正式考試用的是等化後的尺度分數，這裡用答對比例換算，只能當作參考。
 * 考試分節、時間和組卷見 data/exam/blueprints.ts、lib/exam-paper.ts。
 */

/** 計分科目 */
export type ScoringSectionId = 'knowledgeReading' | 'knowledge' | 'reading' | 'listening';

export type ScoringSection = {
  id: ScoringSectionId;
  label: string;
  types: ExamQuestionType[];
  /** 滿分 */
  max: number;
  /** 基準點：這一科低於這個分數就不合格 */
  min: number;
};

export type MockExamConfig = {
  sections: ScoringSection[];
  /** 總分合格點（滿分 180） */
  passMark: number;
};

const VOCAB: ExamQuestionType[] = [
  'kanji-reading',
  'orthography',
  'context',
  'paraphrase',
  'usage',
];
const GRAMMAR: ExamQuestionType[] = ['grammar', 'sentence-order', 'text-grammar'];
const READING: ExamQuestionType[] = ['reading'];
const LISTENING: ExamQuestionType[] = ['listening'];

/** N5、N4：言語知識和讀解合併計分（0〜120），聽解另計（0〜60） */
function basicLevel(passMark: number): MockExamConfig {
  return {
    sections: [
      {
        id: 'knowledgeReading',
        label: '言語知識・讀解',
        types: [...VOCAB, ...GRAMMAR, ...READING],
        max: 120,
        min: 38,
      },
      { id: 'listening', label: '聽解', types: LISTENING, max: 60, min: 19 },
    ],
    passMark,
  };
}

/** N3〜N1：言語知識、讀解、聽解各 0〜60 分 */
const ADVANCED_SECTIONS: ScoringSection[] = [
  {
    id: 'knowledge',
    label: '言語知識（文字・語彙・文法）',
    types: [...VOCAB, ...GRAMMAR],
    max: 60,
    min: 19,
  },
  { id: 'reading', label: '讀解', types: READING, max: 60, min: 19 },
  { id: 'listening', label: '聽解', types: LISTENING, max: 60, min: 19 },
];

export const MOCK_EXAM_CONFIG: Record<JlptLevel, MockExamConfig> = {
  N5: basicLevel(80),
  N4: basicLevel(90),
  N3: { sections: ADVANCED_SECTIONS, passMark: 95 },
  N2: { sections: ADVANCED_SECTIONS, passMark: 90 },
  N1: { sections: ADVANCED_SECTIONS, passMark: 100 },
};

/** 正式考試各節的時間（分鐘），來自藍圖 */
export function officialMinutes(level: JlptLevel): number[] {
  return BLUEPRINTS[level].sittings.map((s) => s.minutes);
}

/**
 * 出一份隨機模擬考（依藍圖組卷，見 lib/exam-paper.ts）。
 * 沒給 history 時當作全部沒考過（說明頁預覽題數和時間用）。
 */
export function buildMockExam(
  level: JlptLevel,
  history: PickHistory = EMPTY_HISTORY,
  seed = 'preview',
): MockSitting[] {
  return buildRandomPaper(level, history, seed);
}

/**
 * 從考試紀錄找回題目和自己的答案，重看題目和解說用。
 * 有考卷快照的紀錄（第 2 版）照當時的題目和選項順序還原；
 * 舊紀錄用題目 id 從目前的題庫找回（找不到的題目略過）。
 */
export function restoreMockExam(
  level: JlptLevel,
  items: { id: string; mine: string | null }[],
  snapshot?: ExamRoundQuestion[],
): { items: ExamRoundQuestion[]; answers: Record<string, string> } {
  const answers: Record<string, string> = {};
  for (const { id, mine } of items) if (mine !== null) answers[id] = mine;
  if (snapshot && snapshot.length > 0) return { items: snapshot, answers };
  const restored: ExamRoundQuestion[] = [];
  for (const { id } of items) {
    const question = findExamQuestion(level, id);
    if (!question) continue;
    restored.push({
      question,
      options: shuffle([...question.options]),
      answer: question.options[0],
    });
  }
  return { items: restored, answers };
}

export type SectionScore = {
  section: ScoringSection;
  correct: number;
  total: number;
  score: number;
  passed: boolean;
};

export type MockExamResult = {
  sections: SectionScore[];
  total: number;
  passMark: number;
  passed: boolean;
};

/** 依答對比例換算各科分數，判斷總分和各科基準點是否都通過 */
export function scoreMockExam(
  level: JlptLevel,
  items: ExamRoundQuestion[],
  answers: Record<string, string>,
): MockExamResult {
  const { sections, passMark } = MOCK_EXAM_CONFIG[level];
  const scores = sections.map((section) => {
    const inSection = items.filter((item) => section.types.includes(item.question.type));
    const correct = inSection.filter((item) => answers[item.question.id] === item.answer).length;
    const total = inSection.length;
    const score = total === 0 ? 0 : Math.round((correct / total) * section.max);
    return { section, correct, total, score, passed: score >= section.min };
  });
  const total = scores.reduce((sum, s) => sum + s.score, 0);
  return {
    sections: scores,
    total,
    passMark,
    passed: total >= passMark && scores.every((s) => s.passed),
  };
}
