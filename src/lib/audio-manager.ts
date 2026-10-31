import type { ScriptSpeaker } from '@/data/exam';
import type { ExamRoundQuestion } from '@/lib/quiz';
import { speakLineAndWait, stopSpeaking } from '@/lib/speech';

/**
 * 聽解播放：依 JLPT 各大題的流程，把一題要唸的內容排成一段一段依序播放。
 * 目前用手機內建的日文語音（沒有網路也能用）；題組有音檔（audio）時，之後可以在這裡改成播放音檔。
 */

export type Segment = { text: string; speaker?: ScriptSpeaker; pauseAfterMs?: number };

/** 選項用唸的大題（題目紙上沒有印選項）：發話表現、即時應答 */
export const SPOKEN_OPTION_TYPES = ['utterance', 'quick-response'] as const;

export function hasSpokenOptions(item: ExamRoundQuestion): boolean {
  return (SPOKEN_OPTION_TYPES as readonly string[]).includes(item.question.subcategory ?? '');
}

const NUMBERS = ['いち', 'に', 'さん', 'よん'];

/** 作答時間（播完後幾秒自動換下一題，正式模式用） */
export function answerSeconds(item: ExamRoundQuestion): number {
  return hasSpokenOptions(item) ? 8 : 12;
}

/** 這一題要依序唸的內容 */
export function listeningSegments(item: ExamRoundQuestion): Segment[] {
  const { question, options } = item;
  const script = question.script ?? [];
  const spokenOptions = options.map((option, i) => ({
    text: `${NUMBERS[i]}。${option}`,
    speaker: 'narrator' as const,
    pauseAfterMs: 800,
  }));
  switch (question.subcategory) {
    case 'utterance':
      // 看圖（情境）：旁白說明情境和問題，接著唸三個說法
      return [{ text: question.sentence, pauseAfterMs: 1000 }, ...spokenOptions];
    case 'quick-response':
      // 即時應答：先說一句話，接著唸三個回答
      return [
        ...script.map((line) => ({ text: line.text, speaker: line.speaker, pauseAfterMs: 600 })),
        ...spokenOptions,
      ];
    default: {
      // 課題理解、重點理解、概要理解：情境和問題 →（重點理解：先看選項的時間）→ 對話 → 再唸一次問題
      const [intro, ...dialogue] = script;
      const readTime = question.subcategory === 'point' ? 3000 : 1000;
      return [
        ...(intro ? [{ text: intro.text, speaker: intro.speaker, pauseAfterMs: 300 }] : []),
        { text: question.sentence, pauseAfterMs: readTime },
        ...dialogue.map((line) => ({ text: line.text, speaker: line.speaker, pauseAfterMs: 300 })),
        { text: question.sentence },
      ];
    }
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 依序播放；全部播完才呼叫 onDone（中途停止不算播完）。回傳停止播放的函式。
 */
export function playSegments(segments: Segment[], onDone?: () => void): () => void {
  let cancelled = false;
  (async () => {
    stopSpeaking();
    for (const segment of segments) {
      if (cancelled) return;
      await speakLineAndWait(segment.text, segment.speaker);
      if (cancelled) return;
      if (segment.pauseAfterMs) await wait(segment.pauseAfterMs);
    }
    if (!cancelled) onDone?.();
  })();
  return () => {
    cancelled = true;
    stopSpeaking();
  };
}
