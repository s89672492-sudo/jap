import type { ExamQuestion } from './types';

export const N3_EXAM: ExamQuestion[] = [
  {
    id: 'n3-exam-01',
    type: 'kanji-reading',
    sentence: '［現場］には 証拠が 残って いた。',
    options: ['げんば', 'げんじょう', 'けんば', 'げんぱ'],
    explanation: '「現場」讀作「げんば」。',
  },
  {
    id: 'n3-exam-02',
    type: 'kanji-reading',
    sentence: '刑事は 必死に 犯人を［追った］。',
    options: ['おった', 'まった', 'すくった', 'かった'],
    explanation: '「追う」讀作「おう」，た形是「おった」。',
  },
  {
    id: 'n3-exam-03',
    type: 'kanji-reading',
    sentence: '彼の［正直］な 答えに 驚いた。',
    options: ['しょうじき', 'せいじき', 'しょうちょく', 'せいちょく'],
    explanation: '「正直」讀作「しょうじき」，意思是誠實。',
  },
  {
    id: 'n3-exam-04',
    type: 'kanji-reading',
    sentence: '警察は 事件の［原因］を 調べて いる。',
    options: ['げんいん', 'げいいん', 'げんにん', 'がんいん'],
    explanation: '「原因」讀作「げんいん」。',
  },
  {
    id: 'n3-exam-05',
    type: 'context',
    sentence: '彼の 話には おかしな 点が あり、どうも（　）。',
    options: ['あやしい', 'やさしい', 'くわしい', 'するどい'],
    explanation: '說法有奇怪的地方，所以「可疑」：あやしい。',
  },
  {
    id: 'n3-exam-06',
    type: 'context',
    sentence: 'ドアの かぎが 開いて いる ことに、だれも（　）なかった。',
    options: ['気づか', '信じ', '守ら', '認め'],
    explanation: '「〜ことに気づく」是「察覺到〜」。',
  },
  {
    id: 'n3-exam-07',
    type: 'context',
    sentence: '問い詰められて、男は 自分が やったと（　）。',
    options: ['認めた', '守った', '失った', '盗んだ'],
    explanation: '被追問之後「承認」是自己做的：認めた。',
  },
  {
    id: 'n3-exam-08',
    type: 'grammar',
    sentence: '証拠が ない（　）、彼を 犯人だと 決める ことは できない。',
    options: ['以上', 'うちに', 'ところ', 'ばかりに'],
    explanation: '「〜以上」表示「既然〜，就〜」。',
  },
  {
    id: 'n3-exam-09',
    type: 'grammar',
    sentence: '警察が 来た（　）、犯人は 窓から 逃げた。',
    options: ['とたんに', 'ばかりに', 'くせに', 'ために'],
    explanation: '「た形＋とたんに」表示「一〜就馬上〜」。',
  },
  {
    id: 'n3-exam-10',
    type: 'grammar',
    sentence: 'この なぞは 子ども（　）解ける ほど 簡単だ。',
    options: ['でも', 'しか', 'だけ', 'こそ'],
    explanation: '「〜でも」表示「連〜都」。',
  },
];
