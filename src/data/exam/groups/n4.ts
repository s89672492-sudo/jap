import type { ExamGroup } from '../types';

/** N4 讀解題組：一篇文章對應多題，題目用 groupId 對到這裡（原本每題重複存一份文章） */
export const N4_EXAM_GROUPS: ExamGroup[] = [
  {
    id: 'n4-exam-g01',
    kind: 'passage',
    subcategory: 'short',
    passage:
      '山田さん\n来週の金曜日の旅行のことですが、雨が降ったら、旅行はやめて、映画を見に行きませんか。天気がよかったら、予定どおり九時に駅で会いましょう。\nリン',
  },
  {
    id: 'n4-exam-g02',
    kind: 'passage',
    subcategory: 'short',
    passage:
      'わたしは先月から料理教室に通っています。最初は簡単な料理しか作れませんでしたが、今は魚の料理も作れるようになりました。来月は友達を家に呼んで、習った料理を作ってあげるつもりです。',
  },
  {
    id: 'n4-exam-g03',
    kind: 'passage',
    subcategory: 'short',
    passage:
      'ごみの出し方\n燃えるごみは月曜日と木曜日の朝八時までに出してください。びんとかんは水曜日です。夜にごみを出さないでください。',
  },
  {
    id: 'n4-exam-g04',
    kind: 'passage',
    subcategory: 'short',
    passage:
      'きのう、駅で財布を落としてしまいました。とても困りましたが、親切な人が拾って、駅の事務所に届けてくれていました。中のお金もカードも全部ありました。名前も聞けなかったので、お礼が言えなかったのが残念です。',
  },
  {
    id: 'n4-exam-g05',
    kind: 'passage',
    subcategory: 'short',
    passage:
      'この町の図書館は、来月から日曜日も開くことになりました。今までは平日に来られない人が多かったので、市民の意見を聞いて決めたそうです。そのかわり、毎週月曜日は休みになります。',
  },
];
