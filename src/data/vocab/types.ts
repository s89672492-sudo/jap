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
  /** 詞性；い形容詞和な形容詞都歸在「形容詞」 */
  pos: PartOfSpeech;
  example?: VocabExample;
};
