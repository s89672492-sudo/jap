import type { ExamQuestion } from '@/data/exam';
import type { GrammarPoint } from '@/data/grammar';
import type { VocabWord } from '@/data/vocab';

export type QuizQuestion = {
  word: VocabWord;
  /** 四個中文選項（已打亂），其中一個是 word.meaning */
  options: string[];
};

/** 每一輪的題數 */
export const QUESTIONS_PER_ROUND = 10;

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 從同一個等級的單字出一輪題目：看日文選中文。
 * 錯誤選項取自同等級的其他單字，且不會和正確答案重複。
 */
export function buildRound(
  words: VocabWord[],
  count = QUESTIONS_PER_ROUND,
  /** 只從這些單字出題（例如錯題）；錯誤選項仍取自整個 words */
  candidates: VocabWord[] = words,
): QuizQuestion[] {
  const targets = shuffle(candidates).slice(0, Math.min(count, candidates.length));

  return targets.map((word) => {
    const distractors = shuffle(
      [...new Set(words.map((w) => w.meaning))].filter((meaning) => meaning !== word.meaning),
    ).slice(0, 3);

    return { word, options: shuffle([word.meaning, ...distractors]) };
  });
}

export type ExamRoundQuestion = {
  question: ExamQuestion;
  /** 打亂後的選項 */
  options: string[];
  answer: string;
};

/** 模擬試題：打亂題目順序和每題的選項順序 */
export function buildExamRound(
  questions: ExamQuestion[],
  count = QUESTIONS_PER_ROUND,
): ExamRoundQuestion[] {
  return shuffle(questions)
    .slice(0, Math.min(count, questions.length))
    .map((question) => ({
      question,
      options: shuffle([...question.options]),
      answer: question.options[0],
    }));
}

export type ListeningQuestion = {
  word: VocabWord;
  /** 四個日文單字寫法（已打亂），其中一個是 word.word */
  options: string[];
};

/** 聽力測驗：聽日文發音，從同等級的四個單字中選出聽到的那一個 */
export function buildListeningRound(
  words: VocabWord[],
  count = QUESTIONS_PER_ROUND,
): ListeningQuestion[] {
  const targets = shuffle(words).slice(0, Math.min(count, words.length));

  return targets.map((word) => {
    const distractors = shuffle(
      [...new Set(words.map((w) => w.word))].filter((w) => w !== word.word),
    ).slice(0, 3);

    return { word, options: shuffle([word.word, ...distractors]) };
  });
}

export type ReadingQuestion = {
  word: VocabWord;
  /** 四個假名讀音（已打亂），其中一個是 word.reading */
  options: string[];
};

/** 含漢字的單字才適合考讀音 */
const HAS_KANJI = /[一-鿿々]/;

/**
 * 漢字讀音測驗：看漢字選假名讀音。
 * 錯誤選項優先選長度相近的讀音，避免一眼就看出答案。
 */
export function buildReadingRound(
  words: VocabWord[],
  count = QUESTIONS_PER_ROUND,
): ReadingQuestion[] {
  const kanjiWords = words.filter((word) => HAS_KANJI.test(word.word));
  const readings = [...new Set(kanjiWords.map((word) => word.reading))];
  const targets = shuffle(kanjiWords).slice(0, Math.min(count, kanjiWords.length));

  return targets.map((word) => {
    const others = shuffle(readings.filter((reading) => reading !== word.reading));
    const similar = others.filter((reading) => Math.abs(reading.length - word.reading.length) <= 1);
    const distractors = [...similar, ...others.filter((r) => !similar.includes(r))].slice(0, 3);

    return { word, options: shuffle([word.reading, ...distractors]) };
  });
}

export type GrammarQuestion = {
  point: GrammarPoint;
  /** 例句中挖空的部分（正確答案） */
  answer: string;
  /** 四個選項（已打亂），其中一個是 answer */
  options: string[];
};

/**
 * 文法測驗：例句挖空，選出正確的文法部分。
 * 錯誤選項取自同等級其他文法的標示部分，優先選長度相近的。
 */
export function buildGrammarRound(
  points: GrammarPoint[],
  count = QUESTIONS_PER_ROUND,
): GrammarQuestion[] {
  const highlights = [...new Set(points.map((point) => point.example.highlight))];
  const targets = shuffle(points).slice(0, Math.min(count, points.length));

  return targets.map((point) => {
    const answer = point.example.highlight;
    // 和答案互相包含的選項會讓題目有兩個答案，排除
    const others = shuffle(
      highlights.filter((h) => h !== answer && !h.includes(answer) && !answer.includes(h)),
    );
    const similar = others.filter((h) => Math.abs(h.length - answer.length) <= 3);
    const distractors = [...similar, ...others.filter((h) => !similar.includes(h))].slice(0, 3);

    return { point, answer, options: shuffle([answer, ...distractors]) };
  });
}
