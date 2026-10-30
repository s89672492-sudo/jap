import type { ExamQuestion, ExamQuestionType } from '@/data/exam';
import { JLPT_LEVELS, type JlptLevel } from '@/data/vocab';
import type { MockSitting } from '@/lib/mock-exam';
import type { ExamRoundQuestion } from '@/lib/quiz';

/**
 * 進行中的模擬考（一場考試從開始到交卷的完整狀態）。
 * 每次作答、改答案、跳題、標記都存到手機，重新整理或關掉 App 後可以接著考。
 * 題目連同選項順序一起存成快照，之後題庫更新也能還原成當時的考卷。
 * 時間用「截止時間」記錄，重新整理不會多出時間。
 */

/** 正式時間：照 JLPT 官方各節時間；練習：依這份考卷的題數換算（題數比正式考試少） */
export type MockExamMode = 'official' | 'practice';

export const MOCK_EXAM_MODE_LABELS: Record<MockExamMode, string> = {
  official: '正式時間',
  practice: '練習',
};

/** 考試中發生的事，成績單和紀錄裡會顯示 */
export type ExamEventKind =
  | 'start'
  | 'resume'
  | 'background'
  | 'foreground'
  | 'leave'
  | 'return'
  | 'submit'
  | 'auto-submit';

export type ExamEvent = { at: number; kind: ExamEventKind; sitting: number };

export type DraftSitting = {
  label: string;
  types: ExamQuestionType[];
  officialMinutes: number;
  /** 這一節的作答時間（秒） */
  seconds: number;
  questions: ExamRoundQuestion[];
};

export type MockExamDraft = {
  /** 存檔格式版本 */
  v: 1;
  sessionId: string;
  level: JlptLevel;
  mode: MockExamMode;
  /** 考卷：目前都是每次重新組的「random」，固定考卷之後加入 */
  paperId: string;
  paperVersion: number;
  /** sitting：正在作答；break：這一節已交卷，等開始下一節 */
  status: 'sitting' | 'break';
  sittings: DraftSitting[];
  sittingIndex: number;
  questionIndex: number;
  /** 題目 id → 選的選項文字 */
  answers: Record<string, string>;
  /** 標記稍後檢查的題目 id */
  marked: string[];
  /** 每題停留的時間（毫秒） */
  spent: Record<string, number>;
  /** 已交卷的節（不能再作答） */
  completed: number[];
  startedAt: number;
  /** 目前這一題開始顯示的時間（算停留時間用） */
  shownAt: number;
  /** 這一節的截止時間 */
  deadline: number;
  events: ExamEvent[];
  /** 考試中離開考試畫面（切到背景、其他分頁）的次數 */
  leaveCount: number;
  updatedAt: number;
};

/** 事件最多記幾筆 */
const MAX_EVENTS = 100;

export function newSessionId(now: number): string {
  return `${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** 這一節要給多少秒 */
export function sittingSeconds(sitting: MockSitting, mode: MockExamMode): number {
  return mode === 'official' ? sitting.officialMinutes * 60 : sitting.seconds;
}

export function createDraft(
  level: JlptLevel,
  mode: MockExamMode,
  sittings: MockSitting[],
  now: number,
): MockExamDraft {
  const draftSittings = sittings.map((s) => ({
    label: s.label,
    types: s.types,
    officialMinutes: s.officialMinutes,
    seconds: sittingSeconds(s, mode),
    questions: s.questions,
  }));
  return {
    v: 1,
    sessionId: newSessionId(now),
    level,
    mode,
    paperId: 'random',
    paperVersion: 1,
    status: 'sitting',
    sittings: draftSittings,
    sittingIndex: 0,
    questionIndex: 0,
    answers: {},
    marked: [],
    spent: {},
    completed: [],
    startedAt: now,
    shownAt: now,
    deadline: now + draftSittings[0].seconds * 1000,
    events: [{ at: now, kind: 'start', sitting: 0 }],
    leaveCount: 0,
    updatedAt: now,
  };
}

export function addEvent(draft: MockExamDraft, kind: ExamEventKind, now: number): MockExamDraft {
  const events = [...draft.events, { at: now, kind, sitting: draft.sittingIndex }].slice(
    -MAX_EVENTS,
  );
  const leaving = kind === 'background' || kind === 'leave';
  return {
    ...draft,
    events,
    leaveCount: draft.leaveCount + (leaving && draft.status === 'sitting' ? 1 : 0),
    updatedAt: now,
  };
}

export function currentQuestion(draft: MockExamDraft): ExamRoundQuestion | undefined {
  return draft.sittings[draft.sittingIndex]?.questions[draft.questionIndex];
}

/** 把目前這一題的停留時間加上去 */
function addSpent(draft: MockExamDraft, now: number): Record<string, number> {
  const item = currentQuestion(draft);
  if (!item || draft.status !== 'sitting') return draft.spent;
  const id = item.question.id;
  const elapsed = Math.max(0, Math.min(now, draft.deadline) - draft.shownAt);
  return { ...draft.spent, [id]: (draft.spent[id] ?? 0) + elapsed };
}

/** 只有正在作答、還沒到截止時間的節可以作答 */
export function canAnswer(draft: MockExamDraft, now: number): boolean {
  return (
    draft.status === 'sitting' &&
    now < draft.deadline &&
    !draft.completed.includes(draft.sittingIndex)
  );
}

export function answerQuestion(
  draft: MockExamDraft,
  id: string,
  option: string,
  now: number,
): MockExamDraft {
  if (!canAnswer(draft, now)) return draft;
  const inSitting = draft.sittings[draft.sittingIndex].questions.some((q) => q.question.id === id);
  if (!inSitting) return draft;
  return { ...draft, answers: { ...draft.answers, [id]: option }, updatedAt: now };
}

export function toggleMark(draft: MockExamDraft, id: string, now: number): MockExamDraft {
  if (!canAnswer(draft, now)) return draft;
  const marked = draft.marked.includes(id)
    ? draft.marked.filter((m) => m !== id)
    : [...draft.marked, id];
  return { ...draft, marked, updatedAt: now };
}

export function goToQuestion(draft: MockExamDraft, index: number, now: number): MockExamDraft {
  const count = draft.sittings[draft.sittingIndex].questions.length;
  const next = Math.max(0, Math.min(count - 1, index));
  if (next === draft.questionIndex) return draft;
  return {
    ...draft,
    spent: addSpent(draft, now),
    questionIndex: next,
    shownAt: now,
    updatedAt: now,
  };
}

/**
 * 交出目前這一節。最後一節交卷後回傳 finished: true（由畫面計分、記錄成績、刪除進行中的考試）。
 * 同一節重複交卷（按鈕和時間到同時發生）不會有作用。
 */
export function submitSitting(
  draft: MockExamDraft,
  now: number,
  auto: boolean,
): { draft: MockExamDraft; finished: boolean } {
  if (draft.status !== 'sitting' || draft.completed.includes(draft.sittingIndex)) {
    return { draft, finished: false };
  }
  const closed = addEvent(
    {
      ...draft,
      spent: addSpent(draft, now),
      completed: [...draft.completed, draft.sittingIndex],
    },
    auto ? 'auto-submit' : 'submit',
    now,
  );
  const finished = draft.sittingIndex + 1 >= draft.sittings.length;
  return { draft: { ...closed, status: 'break', updatedAt: now }, finished };
}

export function startNextSitting(draft: MockExamDraft, now: number): MockExamDraft {
  if (draft.status !== 'break') return draft;
  const index = draft.sittingIndex + 1;
  if (index >= draft.sittings.length) return draft;
  return {
    ...draft,
    status: 'sitting',
    sittingIndex: index,
    questionIndex: 0,
    shownAt: now,
    deadline: now + draft.sittings[index].seconds * 1000,
    updatedAt: now,
  };
}

/** 時間到了沒交卷（例如關掉 App 期間時間到了）：自動交卷 */
export function expireIfNeeded(
  draft: MockExamDraft,
  now: number,
): { draft: MockExamDraft; finished: boolean; expired: boolean } {
  if (draft.status === 'sitting' && now >= draft.deadline) {
    return { ...submitSitting(draft, now, true), expired: true };
  }
  return { draft, finished: false, expired: false };
}

export function allQuestions(draft: MockExamDraft): ExamRoundQuestion[] {
  return draft.sittings.flatMap((s) => s.questions);
}

/** 目前這一節的作答狀態 */
export function sittingProgress(draft: MockExamDraft) {
  const questions = draft.sittings[draft.sittingIndex].questions;
  const answered = questions.filter((q) => draft.answers[q.question.id] !== undefined).length;
  const marked = questions.filter((q) => draft.marked.includes(q.question.id)).length;
  return { total: questions.length, answered, unanswered: questions.length - answered, marked };
}

// ── 讀回存檔時的格式檢查 ──

const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export function isExamQuestion(value: unknown): value is ExamQuestion {
  const q = value as ExamQuestion;
  return (
    isString(q?.id) &&
    isString(q.type) &&
    isString(q.sentence) &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    q.options.every(isString) &&
    isString(q.explanation)
  );
}

export function isRoundQuestion(value: unknown): value is ExamRoundQuestion {
  const item = value as ExamRoundQuestion;
  return (
    isExamQuestion(item?.question) &&
    Array.isArray(item.options) &&
    item.options.every(isString) &&
    isString(item.answer) &&
    item.options.includes(item.answer)
  );
}

function isSitting(value: unknown): value is DraftSitting {
  const s = value as DraftSitting;
  return (
    isString(s?.label) &&
    Array.isArray(s.types) &&
    isNumber(s.officialMinutes) &&
    isNumber(s.seconds) &&
    Array.isArray(s.questions) &&
    s.questions.length > 0 &&
    s.questions.every(isRoundQuestion)
  );
}

const isStringRecord = (value: unknown): value is Record<string, string> =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.values(value).every(isString);

const isNumberRecord = (value: unknown): value is Record<string, number> =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.values(value).every(isNumber);

/** 存檔讀回來是不是一場完整的考試；格式不對回傳 null（不會讓 App 壞掉） */
export function parseDraft(value: unknown): MockExamDraft | null {
  const d = value as MockExamDraft;
  if (d?.v !== 1) return null;
  const ok =
    isString(d.sessionId) &&
    (JLPT_LEVELS as readonly string[]).includes(d.level) &&
    (d.mode === 'official' || d.mode === 'practice') &&
    isString(d.paperId) &&
    isNumber(d.paperVersion) &&
    (d.status === 'sitting' || d.status === 'break') &&
    Array.isArray(d.sittings) &&
    d.sittings.length > 0 &&
    d.sittings.every(isSitting) &&
    Number.isInteger(d.sittingIndex) &&
    d.sittingIndex >= 0 &&
    d.sittingIndex < d.sittings.length &&
    Number.isInteger(d.questionIndex) &&
    d.questionIndex >= 0 &&
    d.questionIndex < d.sittings[d.sittingIndex].questions.length &&
    isStringRecord(d.answers) &&
    Array.isArray(d.marked) &&
    d.marked.every(isString) &&
    isNumberRecord(d.spent) &&
    Array.isArray(d.completed) &&
    d.completed.every((n) => Number.isInteger(n)) &&
    isNumber(d.startedAt) &&
    isNumber(d.shownAt) &&
    isNumber(d.deadline) &&
    Array.isArray(d.events) &&
    isNumber(d.leaveCount) &&
    isNumber(d.updatedAt);
  return ok ? d : null;
}
