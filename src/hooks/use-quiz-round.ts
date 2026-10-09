import { useEffect, useState } from 'react';

import type { AnswerState } from '@/components/quiz/answer-option';

/**
 * 一輪測驗的共用流程：出題 → 作答 → 下一題 → 計分。
 * build 依 deps 重新出題；題目是隨機的，所以等畫面載入後才出題，
 * 避免網頁版預先產生的 HTML 和實際畫面不一致。
 */
export function useQuizRound<Q>(
  build: () => Q[],
  getAnswer: (question: Q) => string,
  deps: readonly unknown[],
) {
  const [questions, setQuestions] = useState<Q[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  // 按「再調查一輪」時加一，觸發重新出題
  const [round, setRound] = useState(0);

  useEffect(() => {
    setQuestions(build());
    setIndex(0);
    setPicked(null);
    setScore(0);
    // build 每次 render 都是新的函式，只在 deps 或 round 改變時重新出題
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, round]);

  const ready = questions.length > 0;
  const finished = ready && index >= questions.length;
  const current: Q | undefined = questions[index];

  const pick = (option: string) => {
    if (picked !== null || current === undefined) return;
    setPicked(option);
    if (option === getAnswer(current)) setScore((s) => s + 1);
  };

  const next = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };

  const restart = () => setRound((r) => r + 1);

  const getState = (option: string): AnswerState => {
    if (picked === null || current === undefined) return 'idle';
    if (option === getAnswer(current)) return 'correct';
    if (option === picked) return 'wrong';
    return 'dimmed';
  };

  return {
    ready,
    finished,
    current,
    index,
    total: questions.length,
    picked,
    score,
    pick,
    next,
    restart,
    getState,
  };
}
