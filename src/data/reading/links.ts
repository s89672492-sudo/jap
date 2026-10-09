import type { JlptLevel } from '@/data/vocab';

export type ReadingLink = {
  name: string;
  description: string;
  url: string;
  /** 適合的等級 */
  levels: JlptLevel[];
};

/** 免費、合法的線上日文閱讀網站；在瀏覽器開啟，不把內容複製進 App */
export const READING_LINKS: ReadingLink[] = [
  {
    name: '多言語多読：免費分級讀本',
    description: '專為學習者寫的分級小故事，從最簡單的開始',
    url: 'https://tadoku.org/japanese/free-books/',
    levels: ['N5', 'N4'],
  },
  {
    name: 'NHK NEWS WEB EASY',
    description: 'NHK 用簡單日文改寫的新聞，有假名標音',
    url: 'https://www3.nhk.or.jp/news/easy/',
    levels: ['N4', 'N3'],
  },
  {
    name: 'NHK NEWS WEB',
    description: '一般的日本新聞，適合挑戰真實的報導',
    url: 'https://www3.nhk.or.jp/news/',
    levels: ['N2', 'N1'],
  },
  {
    name: '青空文庫',
    description: '著作權已過期的日本文學作品，例如江戶川亂步的偵探小說',
    url: 'https://www.aozora.gr.jp/',
    levels: ['N2', 'N1'],
  },
];
