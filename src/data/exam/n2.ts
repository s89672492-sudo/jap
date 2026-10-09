import type { ExamQuestion } from './types';

export const N2_EXAM: ExamQuestion[] = [
  {
    id: 'n2-exam-01',
    type: 'kanji-reading',
    sentence: '目撃者の［証言］が 事件解決の かぎと なった。',
    options: ['しょうげん', 'しょうごん', 'せいげん', 'しょげん'],
    explanation: '「証言」讀作「しょうげん」，意思是證詞。',
  },
  {
    id: 'n2-exam-02',
    type: 'kanji-reading',
    sentence: '彼の 説明には［矛盾］が ある。',
    options: ['むじゅん', 'むしゅん', 'もじゅん', 'ほこたて'],
    explanation: '「矛盾」讀作「むじゅん」。',
  },
  {
    id: 'n2-exam-03',
    type: 'kanji-reading',
    sentence: '警察は 容疑者を［逮捕］した。',
    options: ['たいほ', 'たいぼ', 'だいほ', 'たいふ'],
    explanation: '「逮捕」讀作「たいほ」。',
  },
  {
    id: 'n2-exam-04',
    type: 'kanji-reading',
    sentence: '犯人は 彼の 財産を［狙って］いた。',
    options: ['ねらって', 'さぐって', 'うかがって', 'うばって'],
    explanation: '「狙う」讀作「ねらう」，意思是盯上、瞄準。',
  },
  {
    id: 'n2-exam-05',
    type: 'context',
    sentence: '残された わずかな（　）から、犯人を 突き止めた。',
    options: ['手がかり', '見通し', '心当たり', '言いがかり'],
    explanation: '「手がかり」是線索。從線索查出犯人。',
  },
  {
    id: 'n2-exam-06',
    type: 'context',
    sentence: 'その 答えは（　）で、はっきりしない。',
    options: ['あいまい', '明確', '厳密', '慎重'],
    explanation: '後面說「不清楚」，所以是「曖昧（あいまい）」。',
  },
  {
    id: 'n2-exam-07',
    type: 'context',
    sentence: '彼は 長年の 友人を（　）、敵に 情報を 渡した。',
    options: ['裏切って', '見逃して', '偽って', '怠って'],
    explanation: '把情報交給敵人，是「背叛」朋友：裏切って。',
  },
  {
    id: 'n2-exam-08',
    type: 'grammar',
    sentence: '証拠が そろった（　）、犯人を 逮捕する ことは できない。',
    options: ['上でなければ', 'からには', 'ばかりか', 'あまり'],
    explanation: '「〜た上でなければ〜できない」表示「沒有先〜就不能〜」。',
  },
  {
    id: 'n2-exam-09',
    type: 'grammar',
    sentence: '彼が 犯人だ（　）、動機は 何だろうか。',
    options: ['としたら', 'にしては', 'わりに', 'どころか'],
    explanation: '「〜としたら」表示假設「如果是〜的話」。',
  },
  {
    id: 'n2-exam-10',
    type: 'grammar',
    sentence: 'あの 名探偵（　）、この なぞが 解けない はずが ない。',
    options: ['のことだから', 'にしたら', 'をめぐって', 'に際して'],
    explanation: '「〜のことだから」表示「因為是〜（依他的個性、能力）」。',
  },
];
