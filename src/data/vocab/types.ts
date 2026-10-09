export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type VocabWord = {
  /** 唯一識別碼，例如 "n5-001" */
  id: string;
  /** 單字寫法（漢字或假名） */
  word: string;
  /** 平假名讀音，也是發音時唸的文字 */
  reading: string;
  /** 中文意思 */
  meaning: string;
};
