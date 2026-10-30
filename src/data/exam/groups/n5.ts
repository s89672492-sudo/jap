import type { ExamGroup } from '../types';

/** N5 讀解題組：一篇文章對應多題，題目用 groupId 對到這裡（原本每題重複存一份文章） */
export const N5_EXAM_GROUPS: ExamGroup[] = [
  {
    id: 'n5-exam-g01',
    kind: 'passage',
    subcategory: 'short',
    passage:
      'わたしは まいあさ 七時に おきます。あさごはんは パンと たまごです。八時に いえを でて、でんしゃで がっこうへ いきます。がっこうは 九時から 三時までです。',
  },
  {
    id: 'n5-exam-g02',
    kind: 'passage',
    subcategory: 'short',
    passage:
      '田中さんへ\nきょうの かいぎは 四時から 五時に かわりました。ばしょは 三かいの へやです。\n山田',
  },
  {
    id: 'n5-exam-g03',
    kind: 'passage',
    subcategory: 'short',
    passage:
      'きのうは 日よう日でした。わたしは ともだちと こうえんへ いきました。こうえんで しゃしんを たくさん とりました。それから、レストランで ひるごはんを たべました。とても おいしかったです。',
  },
  {
    id: 'n5-exam-g04',
    kind: 'passage',
    subcategory: 'short',
    passage:
      'わたしの へやには つくえと いすと ベッドが あります。つくえの 上に パソコンが あります。ねこは いつも ベッドの 上で ねて います。',
  },
  {
    id: 'n5-exam-g05',
    kind: 'passage',
    subcategory: 'short',
    passage:
      'としょかんの おしらせ\n月よう日は やすみです。火よう日から 金よう日は 九時から 七時まで、土よう日と 日よう日は 九時から 五時までです。',
  },
];
