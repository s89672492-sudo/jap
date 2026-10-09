export type GrammarPoint = {
  id: string;
  /** 句型，例如「〜たことがある」 */
  pattern: string;
  /** 接續方式 */
  connection: string;
  /** 中文意思 */
  meaning: string;
  example: {
    ja: string;
    zh: string;
    /** 例句中要用強調色標出的部分 */
    highlight: string;
  };
};
