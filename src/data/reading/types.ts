export type ReadingTopic = '生活' | '文化' | '社會' | '自然' | '科學' | '推理';

export type ReadingParagraph = {
  ja: string;
  zh: string;
};

export type ReadingVocab = {
  word: string;
  reading: string;
  meaning: string;
};

export type ReadingQuestion = {
  question: string;
  questionZh: string;
  /** 四個選項，第一個是正確答案（顯示時會打亂） */
  options: string[];
};

/** 一篇原創的分級閱讀文章 */
export type ReadingArticle = {
  id: string;
  title: string;
  titleZh: string;
  topic: ReadingTopic;
  paragraphs: ReadingParagraph[];
  vocab: ReadingVocab[];
  questions: ReadingQuestion[];
};
