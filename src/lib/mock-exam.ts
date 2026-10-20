import { EXAM_BY_LEVEL, type ExamQuestion, type ExamQuestionType } from '@/data/exam';
import type { JlptLevel } from '@/data/vocab';
import {
  GENERATED_TYPES,
  generatedCandidateIds,
  getGeneratedQuestion,
  isGeneratedId,
  parseGeneratedId,
  type GeneratedType,
} from '@/lib/generated-exam';
import { shuffle, type ExamRoundQuestion } from '@/lib/quiz';

/**
 * 完整模擬考：照 JLPT 的考科順序、計分科目、合格標準出題和評分。
 * 計分方式參考 JLPT 官方公布的標準（總分合格點＋各科基準點），
 * 但正式考試用的是等化後的尺度分數，這裡用答對比例換算，只能當作參考。
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

/** 一節考試（考生一次坐下來作答、一起計時的範圍） */
export type Sitting = {
  label: string;
  types: ExamQuestionType[];
  /** 正式考試這一節的時間（分鐘），顯示用 */
  officialMinutes: number;
};

export type MockExamConfig = {
  sittings: Sitting[];
  sections: ScoringSection[];
  /** 總分合格點（滿分 180） */
  passMark: number;
};

const VOCAB: ExamQuestionType[] = ['kanji-reading', 'orthography', 'context', 'paraphrase'];
const GRAMMAR: ExamQuestionType[] = ['grammar', 'sentence-order'];
const READING: ExamQuestionType[] = ['reading'];
const LISTENING: ExamQuestionType[] = ['listening'];

/** N5、N4：言語知識和讀解合併計分（0〜120），聽解另計（0〜60） */
function basicLevel(passMark: number, minutes: [number, number, number]): MockExamConfig {
  return {
    sittings: [
      { label: '言語知識（文字・語彙）', types: VOCAB, officialMinutes: minutes[0] },
      {
        label: '言語知識（文法）・讀解',
        types: [...GRAMMAR, ...READING],
        officialMinutes: minutes[1],
      },
      { label: '聽解', types: LISTENING, officialMinutes: minutes[2] },
    ],
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
  N5: basicLevel(80, [20, 40, 30]),
  N4: basicLevel(90, [25, 55, 35]),
  N3: {
    sittings: [
      { label: '言語知識（文字・語彙）', types: VOCAB, officialMinutes: 30 },
      { label: '言語知識（文法）・讀解', types: [...GRAMMAR, ...READING], officialMinutes: 70 },
      { label: '聽解', types: LISTENING, officialMinutes: 40 },
    ],
    sections: ADVANCED_SECTIONS,
    passMark: 95,
  },
  N2: {
    sittings: [
      {
        label: '言語知識（文字・語彙・文法）・讀解',
        types: [...VOCAB, ...GRAMMAR, ...READING],
        officialMinutes: 105,
      },
      { label: '聽解', types: LISTENING, officialMinutes: 50 },
    ],
    sections: ADVANCED_SECTIONS,
    passMark: 90,
  },
  N1: {
    sittings: [
      {
        label: '言語知識（文字・語彙・文法）・讀解',
        types: [...VOCAB, ...GRAMMAR, ...READING],
        officialMinutes: 110,
      },
      { label: '聽解', types: LISTENING, officialMinutes: 55 },
    ],
    sections: ADVANCED_SECTIONS,
    passMark: 100,
  },
};

/** JLPT 試題本裡的題型順序 */
const TYPE_ORDER: ExamQuestionType[] = [...VOCAB, ...GRAMMAR, ...READING, ...LISTENING];

/** 讀解每題（含讀文章）給的秒數；等級越高文章越長 */
const READING_SECONDS: Record<JlptLevel, number> = { N5: 120, N4: 150, N3: 180, N2: 210, N1: 240 };

/**
 * 這份模擬考的題數比正式考試少，所以時間依題數換算：
 * 語彙 45 秒、文法 60 秒、句子重組 90 秒、讀解 2〜4 分鐘、聽解 90 秒（含播放）。
 */
function secondsFor(type: ExamQuestionType, level: JlptLevel): number {
  if (VOCAB.includes(type)) return 45;
  if (type === 'grammar') return 60;
  if (type === 'sentence-order') return 90;
  if (type === 'reading') return READING_SECONDS[level];
  return 90;
}

export type MockSitting = Sitting & {
  questions: ExamRoundQuestion[];
  /** 這份模擬考的作答時間（秒） */
  seconds: number;
};

/** 用題目 id 找回題目：自編的題目或自動出的題目 */
export function findExamQuestion(level: JlptLevel, id: string): ExamQuestion | null {
  if (isGeneratedId(id)) return getGeneratedQuestion(id);
  return EXAM_BY_LEVEL[level].find((q) => q.id === id) ?? null;
}

export type PickHistory = {
  /** 答錯、還沒複習掉的題目 id（錯題本） */
  mistakes: ReadonlySet<string>;
  /** 模擬考考過的題目 id */
  seen: ReadonlySet<string>;
};

/**
 * 挑一種題型的題目：題數和自編題目一樣，題目從「自編＋自動出題」的題庫裡挑。
 * 順序：錯題本裡的題目（最多三分之一）→ 沒考過的 → 都考過了才出考過的。
 */
function pickQuestions(
  level: JlptLevel,
  type: GeneratedType,
  count: number,
  { mistakes, seen }: PickHistory,
): ExamQuestion[] {
  const authored = EXAM_BY_LEVEL[level].filter((q) => q.type === type);
  const ids = [...authored.map((q) => q.id), ...generatedCandidateIds(level, type)];
  const isThisType = (id: string) =>
    isGeneratedId(id) ? parseGeneratedId(id)?.type === type : authored.some((q) => q.id === id);
  const missed = shuffle([...mistakes].filter((id) => isThisType(id) && ids.includes(id)));
  const others = shuffle(ids.filter((id) => !missed.includes(id)));
  const order = [
    ...missed.slice(0, Math.ceil(count / 3)),
    ...others.filter((id) => !seen.has(id)),
    ...others.filter((id) => seen.has(id)),
  ];
  const picked: ExamQuestion[] = [];
  for (const id of order) {
    const question = findExamQuestion(level, id);
    if (question) picked.push(question);
    if (picked.length === count) break;
  }
  return picked;
}

/**
 * 出一份模擬考：每節依題型順序排列，選項打亂。
 * 沒給 history 時只用自編題目（說明頁預覽題數和時間用）。
 */
export function buildMockExam(level: JlptLevel, history?: PickHistory): MockSitting[] {
  const authored = EXAM_BY_LEVEL[level];
  return MOCK_EXAM_CONFIG[level].sittings.map((sitting) => {
    const types = [...sitting.types].sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b));
    const picked = types
      .flatMap((type) => {
        const own = authored.filter((q) => q.type === type);
        const generated = GENERATED_TYPES.find((t) => t === type);
        return history && generated ? pickQuestions(level, generated, own.length, history) : own;
      })
      .map((question) => ({
        question,
        options: shuffle([...question.options]),
        answer: question.options[0],
      }));
    const seconds = picked.reduce((sum, q) => sum + secondsFor(q.question.type, level), 0);
    // 以整分鐘計時，比較像正式考試
    return { ...sitting, questions: picked, seconds: Math.ceil(seconds / 60) * 60 };
  });
}

/** 從考試紀錄找回題目和自己的答案，重看題目和解說用（找不到的題目略過） */
export function restoreMockExam(
  level: JlptLevel,
  items: { id: string; mine: string | null }[],
): { items: ExamRoundQuestion[]; answers: Record<string, string> } {
  const restored: ExamRoundQuestion[] = [];
  const answers: Record<string, string> = {};
  for (const { id, mine } of items) {
    const question = findExamQuestion(level, id);
    if (!question) continue;
    restored.push({
      question,
      options: shuffle([...question.options]),
      answer: question.options[0],
    });
    if (mine !== null) answers[id] = mine;
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
