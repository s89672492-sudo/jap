export type Kana = {
  hiragana: string;
  katakana: string;
  romaji: string;
};

/** 一行五格，null 代表該位置沒有假名（例如 や行的 yi、ye） */
export type KanaRow = {
  /** 行名，例如「あ行」 */
  label: string;
  cells: (Kana | null)[];
};

export type KanaSection = {
  id: 'seion' | 'dakuon';
  title: string;
  rows: KanaRow[];
};

function k(hiragana: string, katakana: string, romaji: string): Kana {
  return { hiragana, katakana, romaji };
}

/** 清音（基本 46 音） */
const seion: KanaRow[] = [
  { label: 'あ', cells: [k('あ', 'ア', 'a'), k('い', 'イ', 'i'), k('う', 'ウ', 'u'), k('え', 'エ', 'e'), k('お', 'オ', 'o')] },
  { label: 'か', cells: [k('か', 'カ', 'ka'), k('き', 'キ', 'ki'), k('く', 'ク', 'ku'), k('け', 'ケ', 'ke'), k('こ', 'コ', 'ko')] },
  { label: 'さ', cells: [k('さ', 'サ', 'sa'), k('し', 'シ', 'shi'), k('す', 'ス', 'su'), k('せ', 'セ', 'se'), k('そ', 'ソ', 'so')] },
  { label: 'た', cells: [k('た', 'タ', 'ta'), k('ち', 'チ', 'chi'), k('つ', 'ツ', 'tsu'), k('て', 'テ', 'te'), k('と', 'ト', 'to')] },
  { label: 'な', cells: [k('な', 'ナ', 'na'), k('に', 'ニ', 'ni'), k('ぬ', 'ヌ', 'nu'), k('ね', 'ネ', 'ne'), k('の', 'ノ', 'no')] },
  { label: 'は', cells: [k('は', 'ハ', 'ha'), k('ひ', 'ヒ', 'hi'), k('ふ', 'フ', 'fu'), k('へ', 'ヘ', 'he'), k('ほ', 'ホ', 'ho')] },
  { label: 'ま', cells: [k('ま', 'マ', 'ma'), k('み', 'ミ', 'mi'), k('む', 'ム', 'mu'), k('め', 'メ', 'me'), k('も', 'モ', 'mo')] },
  { label: 'や', cells: [k('や', 'ヤ', 'ya'), null, k('ゆ', 'ユ', 'yu'), null, k('よ', 'ヨ', 'yo')] },
  { label: 'ら', cells: [k('ら', 'ラ', 'ra'), k('り', 'リ', 'ri'), k('る', 'ル', 'ru'), k('れ', 'レ', 're'), k('ろ', 'ロ', 'ro')] },
  { label: 'わ', cells: [k('わ', 'ワ', 'wa'), null, null, null, k('を', 'ヲ', 'wo')] },
  { label: 'ん', cells: [k('ん', 'ン', 'n'), null, null, null, null] },
];

/** 濁音・半濁音 */
const dakuon: KanaRow[] = [
  { label: 'が', cells: [k('が', 'ガ', 'ga'), k('ぎ', 'ギ', 'gi'), k('ぐ', 'グ', 'gu'), k('げ', 'ゲ', 'ge'), k('ご', 'ゴ', 'go')] },
  { label: 'ざ', cells: [k('ざ', 'ザ', 'za'), k('じ', 'ジ', 'ji'), k('ず', 'ズ', 'zu'), k('ぜ', 'ゼ', 'ze'), k('ぞ', 'ゾ', 'zo')] },
  { label: 'だ', cells: [k('だ', 'ダ', 'da'), k('ぢ', 'ヂ', 'ji'), k('づ', 'ヅ', 'zu'), k('で', 'デ', 'de'), k('ど', 'ド', 'do')] },
  { label: 'ば', cells: [k('ば', 'バ', 'ba'), k('び', 'ビ', 'bi'), k('ぶ', 'ブ', 'bu'), k('べ', 'ベ', 'be'), k('ぼ', 'ボ', 'bo')] },
  { label: 'ぱ', cells: [k('ぱ', 'パ', 'pa'), k('ぴ', 'ピ', 'pi'), k('ぷ', 'プ', 'pu'), k('ぺ', 'ペ', 'pe'), k('ぽ', 'ポ', 'po')] },
];

export const KANA_SECTIONS: KanaSection[] = [
  { id: 'seion', title: '清音', rows: seion },
  { id: 'dakuon', title: '濁音・半濁音', rows: dakuon },
];

export type KanaScript = 'hiragana' | 'katakana';
