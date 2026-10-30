import { scoreMockExam, type MockExamResult } from '@/lib/mock-exam';
import { allQuestions, type MockExamDraft } from '@/lib/mock-exam-session';
import type { ExamRoundQuestion } from '@/lib/quiz';
import { addMistake } from '@/stores/mistakes-store';
import { saveMockExamDraft, whenMockExamDraftLoaded } from '@/stores/mock-exam-draft-store';
import {
  hasMockExamRecord,
  markMockExamSeen,
  recordMockExam,
  whenMockExamHistoryLoaded,
  type MockExamRecord,
} from '@/stores/mock-exam-store';
import { recordStudy } from '@/stores/study-store';

export type FinishedExam = {
  result: MockExamResult;
  items: ExamRoundQuestion[];
  answers: Record<string, string>;
  record: MockExamRecord;
};

/** 正在結算的考試，避免同一場被記錄兩次（按交卷和時間到同時發生） */
const finishing = new Set<string>();

/**
 * 全部考完：計分、記錄成績、把錯題加入錯題本和複習排程，最後刪除進行中的考試。
 * 同一場考試只會記錄一次（重新整理後再結算也一樣）。
 */
export async function finishMockExam(draft: MockExamDraft): Promise<FinishedExam | null> {
  if (finishing.has(draft.sessionId)) return null;
  finishing.add(draft.sessionId);
  try {
    await whenMockExamHistoryLoaded();
    const items = allQuestions(draft);
    const result = scoreMockExam(draft.level, items, draft.answers);
    const finishedAt = new Date(draft.updatedAt).toISOString();
    const record: MockExamRecord = {
      date: finishedAt,
      total: result.total,
      passed: result.passed,
      sections: result.sections.map((s) => ({
        label: s.section.label,
        score: s.score,
        max: s.section.max,
      })),
      items: items.map((item) => ({
        id: item.question.id,
        mine: draft.answers[item.question.id] ?? null,
        answer: item.answer,
        ms: Math.round(draft.spent[item.question.id] ?? 0),
      })),
      v: 2,
      sessionId: draft.sessionId,
      mode: draft.mode,
      paperId: draft.paperId,
      paperVersion: draft.paperVersion,
      ...(draft.seed ? { seed: draft.seed } : {}),
      startedAt: new Date(draft.startedAt).toISOString(),
      leaveCount: draft.leaveCount,
      events: draft.events.slice(-50),
      snapshot: items,
    };
    if (!hasMockExamRecord(draft.level, draft.sessionId)) {
      for (const item of items) {
        const correct = draft.answers[item.question.id] === item.answer;
        recordStudy(item.question.id, correct);
        if (!correct) addMistake(item.question.id);
      }
      markMockExamSeen(
        draft.level,
        items.map((item) => item.question.id),
      );
      recordMockExam(draft.level, record);
    }
    await whenMockExamDraftLoaded();
    await saveMockExamDraft(null);
    return { result, items, answers: draft.answers, record };
  } finally {
    finishing.delete(draft.sessionId);
  }
}
