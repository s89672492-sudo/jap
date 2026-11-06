export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb';

export const PART_OF_SPEECH_LABELS: Record<PartOfSpeech, string> = {
  noun: '名詞',
  verb: '動詞',
  adjective: '形容詞',
  adverb: '副詞',
};

export type VocabExample = {
  /** 日文例句 */
  ja: string;
  /** 中文翻譯 */
  zh: string;
  /** 加了假名注音的日文例句，格式見 lib/furigana.ts */
  furigana?: string;
};

/** 真題頻率：2010 年改制後 JLPT 真題的出現次數分類（N3～N1，來源見 data/vocab/frequency） */
export type ExamFrequency = 'high' | 'mid' | 'low';

/** 資料檔的格式：[頻率]，或統計來自別的等級時 [頻率, 等級] */
export type ExamFrequencyTag = [ExamFrequency] | [ExamFrequency, JlptLevel];

export const EXAM_FREQUENCY_LABELS: Record<ExamFrequency, string> = {
  high: '真題高頻',
  mid: '真題中頻',
  low: '真題低頻',
};

/** 相關單字：同義（意思相近）或反義（意思相反） */
export type WordRelation = {
  kind: 'synonym' | 'antonym';
  /** 對方的單字 id（可能是別的等級） */
  id: string;
  word: string;
  reading: string;
  meaning: string;
};

export type VocabWord = {
  /** 唯一識別碼，例如 "n5-001" */
  id: string;
  /** 單字寫法（漢字或假名） */
  word: string;
  /** 平假名讀音，也是發音時唸的文字 */
  reading: string;
  /** 中文意思 */
  meaning: string;
  /** 詞性；い形容詞和な形容詞都歸在「形容詞」（細分見 word-class.ts） */
  pos: PartOfSpeech;
  example?: VocabExample;
  /** 真題頻率（對得上 N3～N1 真題統計的單字才有） */
  freq?: ExamFrequency;
  /** 頻率統計來自別的等級時，是哪一級的真題 */
  freqLevel?: JlptLevel;
  /** 同義詞、反義詞 */
  related?: WordRelation[];
};
