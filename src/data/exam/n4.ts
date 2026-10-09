import type { ExamQuestion } from './types';

export const N4_EXAM: ExamQuestion[] = [
  {
    id: 'n4-exam-01',
    type: 'kanji-reading',
    sentence: '会議の［準備］を して ください。',
    options: ['じゅんび', 'じゅんぴ', 'しゅんび', 'じゅうび'],
    explanation: '「準備」讀作「じゅんび」。',
  },
  {
    id: 'n4-exam-02',
    type: 'kanji-reading',
    sentence: '道が［複雑］で、まよいました。',
    options: ['ふくざつ', 'ふくさつ', 'ふくざい', 'ほくざつ'],
    explanation: '「複雑」讀作「ふくざつ」，「雑」要濁音。',
  },
  {
    id: 'n4-exam-03',
    type: 'kanji-reading',
    sentence: 'すぐに［警察］に 電話しました。',
    options: ['けいさつ', 'けんさつ', 'けいざつ', 'きょうさつ'],
    explanation: '「警察」讀作「けいさつ」。',
  },
  {
    id: 'n4-exam-04',
    type: 'kanji-reading',
    sentence: '荷物を 部屋まで［運んで］ください。',
    options: ['はこんで', 'よろこんで', 'えらんで', 'ならんで'],
    explanation: '「運ぶ」讀作「はこぶ」，て形是「はこんで」。',
  },
  {
    id: 'n4-exam-05',
    type: 'context',
    sentence: '電車が おくれて、会議に（　）。',
    options: ['まにあわなかった', 'まちがえた', 'かたづけた', 'しらべた'],
    explanation: '電車誤點，所以會議「來不及」：まにあわなかった。',
  },
  {
    id: 'n4-exam-06',
    type: 'context',
    sentence: 'かぎを なくしたので、部屋中を（　）。',
    options: ['さがしました', 'あつめました', 'くらべました', 'はこびました'],
    explanation: '鑰匙不見了，在房間裡到處「找」：さがしました。',
  },
  {
    id: 'n4-exam-07',
    type: 'context',
    sentence: '道を わたる ときは 車に（　）して ください。',
    options: ['ちゅうい', 'しっぱい', 'そうだん', 'しんぱい'],
    explanation: '「〜に注意する」是「小心〜」。',
  },
  {
    id: 'n4-exam-08',
    type: 'grammar',
    sentence: '先生に 本を 貸して（　）。',
    options: ['いただきました', 'くださいました', 'あげました', 'くれました'],
    explanation: '「（人）に〜ていただく」表示請對方為自己做某事。「くださる」要用「先生が」。',
  },
  {
    id: 'n4-exam-09',
    type: 'grammar',
    sentence: '空が 暗いですね。雨が 降り（　）です。',
    options: ['そう', 'よう', 'らしい', 'みたい'],
    explanation: '看到天色判斷「好像要下雨」，用動詞ます形＋「そうだ」。',
  },
  {
    id: 'n4-exam-10',
    type: 'grammar',
    sentence: '練習して、日本語が 話せる（　）なりました。',
    options: ['ように', 'ために', 'ことに', 'ところに'],
    explanation: '「〜ようになる」表示能力或狀態的變化。',
  },
];
