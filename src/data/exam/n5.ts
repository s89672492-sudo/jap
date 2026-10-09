import type { ExamQuestion } from './types';

export const N5_EXAM: ExamQuestion[] = [
  {
    id: 'n5-exam-01',
    type: 'kanji-reading',
    sentence: '［今日］は とても 暑いです。',
    options: ['きょう', 'きのう', 'あした', 'けさ'],
    explanation: '「今日」讀作「きょう」，意思是今天。',
  },
  {
    id: 'n5-exam-02',
    type: 'kanji-reading',
    sentence: '駅の 前で［友達］を 待ちます。',
    options: ['ともだち', 'ともたち', 'とおだち', 'どもだち'],
    explanation: '「友達」讀作「ともだち」，「達」在這裡要濁音化。',
  },
  {
    id: 'n5-exam-03',
    type: 'kanji-reading',
    sentence: 'この［山］は とても 高いです。',
    options: ['やま', 'かわ', 'うみ', 'そら'],
    explanation: '「山」讀作「やま」。かわ是川、うみ是海、そら是空。',
  },
  {
    id: 'n5-exam-04',
    type: 'kanji-reading',
    sentence: '毎朝 七時に［起きます］。',
    options: ['おきます', 'いきます', 'ねます', 'かきます'],
    explanation: '「起きます」讀作「おきます」，意思是起床。',
  },
  {
    id: 'n5-exam-05',
    type: 'context',
    sentence: 'のどが かわいたので、水を（　）。',
    options: ['のみました', 'たべました', 'よみました', 'ききました'],
    explanation: '口渴所以「喝」水，用「のみました」。',
  },
  {
    id: 'n5-exam-06',
    type: 'context',
    sentence: 'あしたは 雨ですから、（　）を 持って いきます。',
    options: ['かさ', 'くつ', 'めがね', 'とけい'],
    explanation: '下雨要帶「かさ（傘）」。',
  },
  {
    id: 'n5-exam-07',
    type: 'context',
    sentence: 'この りんごは 一つ 50円です。とても（　）です。',
    options: ['やすい', 'たかい', 'ふるい', 'おもい'],
    explanation: '一個 50 日圓很便宜，用「やすい」。',
  },
  {
    id: 'n5-exam-08',
    type: 'grammar',
    sentence: 'わたしは 毎日 電車（　）学校へ 行きます。',
    options: ['で', 'に', 'を', 'が'],
    explanation: '表示交通方式、手段用助詞「で」。',
  },
  {
    id: 'n5-exam-09',
    type: 'grammar',
    sentence: 'つくえの 上（　）本が あります。',
    options: ['に', 'で', 'を', 'へ'],
    explanation: '表示東西存在的場所，「〜に あります」。',
  },
  {
    id: 'n5-exam-10',
    type: 'grammar',
    sentence: 'きのうは 雨（　）。',
    options: ['でした', 'です', 'でしょう', 'じゃありません'],
    explanation: '「きのう」是過去，名詞的過去式用「でした」。',
  },
];
