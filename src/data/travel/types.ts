/**
 * 生活旅行用語（和 JLPT 等級無關，本 App 自行編寫）。
 * 日文用 [漢字|かな] 標注音，格式見 lib/furigana.ts。
 */

/** 情境會話：自己要說的句子 */
export type TravelPhrase = {
  id: string;
  /** 情境，例如「餐廳」 */
  scene: string;
  ja: string;
  zh: string;
  /** 使用時機或小提醒 */
  note?: string;
};

/** 日本人這樣說：店員、站內廣播常聽到的話，和可以怎麼回 */
export type TravelHeard = {
  id: string;
  scene: string;
  ja: string;
  zh: string;
  reply?: { ja: string; zh: string };
  note?: string;
};

/** 中日漢字大不同：同樣的漢字，日文意思不一樣 */
export type TravelKanji = {
  id: string;
  word: string;
  reading: string;
  /** 日文的意思 */
  meaning: string;
  /** 台灣人容易誤會成什麼 */
  misread: string;
  example: { ja: string; zh: string };
};
