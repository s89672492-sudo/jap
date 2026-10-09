import type { ExamQuestion } from './types';

export const N1_EXAM: ExamQuestion[] = [
  {
    id: 'n1-exam-01',
    type: 'kanji-reading',
    sentence: '彼は 証拠を［捏造］した 疑いが ある。',
    options: ['ねつぞう', 'ねつそう', 'でつぞう', 'ねんぞう'],
    explanation: '「捏造」讀作「ねつぞう」，不是「でつぞう」。',
  },
  {
    id: 'n1-exam-02',
    type: 'kanji-reading',
    sentence: '探偵は ついに 犯人の うそを［暴いた］。',
    options: ['あばいた', 'ひらいた', 'さばいた', 'はぶいた'],
    explanation: '「暴く」讀作「あばく」，意思是揭露。',
  },
  {
    id: 'n1-exam-03',
    type: 'kanji-reading',
    sentence: '長年の［冤罪］が ようやく 晴れた。',
    options: ['えんざい', 'えんさい', 'めんざい', 'おんざい'],
    explanation: '「冤罪」讀作「えんざい」。',
  },
  {
    id: 'n1-exam-04',
    type: 'kanji-reading',
    sentence: '事件の 真相に 迫る［糸口］を つかんだ。',
    options: ['いとぐち', 'いとくち', 'しこう', 'いぐち'],
    explanation: '「糸口」讀作「いとぐち」，意思是頭緒。',
  },
  {
    id: 'n1-exam-05',
    type: 'context',
    sentence: '容疑者は 取り調べで 一貫して（　）を 続けた。',
    options: ['黙秘', '隠蔽', '偽装', '示唆'],
    explanation: '在偵訊中一直不說話，是「黙秘（保持緘默）」。',
  },
  {
    id: 'n1-exam-06',
    type: 'context',
    sentence: '完璧に 見えた アリバイにも、わずかな（　）が 見え始めた。',
    options: ['綻び', '痕跡', '盲点', '執念'],
    explanation: '看似完美的不在場證明開始出現「破綻（綻び）」。',
  },
  {
    id: 'n1-exam-07',
    type: 'context',
    sentence: '犯人は 巧妙な 手口で 警察を（　）。',
    options: ['欺いた', '覆した', '遡った', '紛れた'],
    explanation: '用巧妙的手法「欺騙」警察：欺いた。',
  },
  {
    id: 'n1-exam-08',
    type: 'grammar',
    sentence: '決定的な 証拠が ない（　）、彼を 起訴する ことは できない。',
    options: ['限り', 'ものの', 'にもかかわらず', 'とあって'],
    explanation: '「〜ない限り」表示「只要不〜，就〜」。',
  },
  {
    id: 'n1-exam-09',
    type: 'grammar',
    sentence: '名探偵（　）、この 程度の トリックは すぐに 見抜く だろう。',
    options: ['ともなれば', 'ならでは', 'をもって', 'といえども'],
    explanation: '「〜ともなれば」表示「到了〜這種程度（身分），當然〜」。',
  },
  {
    id: 'n1-exam-10',
    type: 'grammar',
    sentence: '証拠を 一つ一つ 積み上げた 彼の 推理は、見事と いう（　）。',
    options: ['ほかない', 'しまつだ', 'きらいがある', 'ずくめだ'],
    explanation: '「〜というほかない」表示「只能說是〜」。',
  },
];
