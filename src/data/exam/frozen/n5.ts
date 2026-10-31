import type { ExamQuestion } from '../types';

/**
 * N5 固定考卷用的題目：由 App 的單字、文法例句自動出題後固定下來（scripts/freeze-paper-questions.js）。
 * 內容不再跟著單字資料變，固定考卷每次都一樣。不放進隨機組卷和題型練習（那裡已經有自動出的同一題）。
 * from 是原本自動出題的 id（記錄來源用）。
 */
const FROZEN = {
  source: '偵探日語自動出題（由 App 的單字、文法例句產生，已固定）',
  license: 'original',
  version: 1,
} as const;

export const N5_FROZEN: (ExamQuestion & { from: string })[] = [
  {
    ...FROZEN,
    from: 'gen-kr-n5-577',
    id: 'n5-p2-kr-01',
    type: 'kanji-reading',
    sentence: '［六］時に起きました。',
    furigana: '六[時|じ]に[起|お]きました。',
    options: ['ろく', 'ろうく', 'ろぐ', 'ろうぐ'],
    explanation: '「六」讀作「ろく」，意思是「六、數字6」。\n例句：六點起床了。',
  },
  {
    ...FROZEN,
    from: 'gen-kr-n5-106',
    id: 'n5-p2-kr-02',
    type: 'kanji-reading',
    sentence: '［妹］は小学生です。',
    furigana: '妹は[小学生|しょうがくせい]です。',
    options: ['いもうと', 'いもと', 'いもうど', 'いもうとう'],
    explanation: '「妹」讀作「いもうと」，意思是「妹妹」。\n例句：妹妹是小學生。',
  },
  {
    ...FROZEN,
    from: 'gen-kr-n5-472',
    id: 'n5-p2-kr-03',
    type: 'kanji-reading',
    sentence: '姉の［彼氏］はとても背が高い。',
    furigana: '[姉|あね]の彼氏はとても[背|せ]が[高|たか]い。',
    options: ['かれし', 'かれじ', 'がれし', 'がれじ'],
    explanation: '「彼氏」讀作「かれし」，意思是「男朋友」。\n例句：姊姊的男朋友個子很高。',
  },
  {
    ...FROZEN,
    from: 'gen-kr-n5-905',
    id: 'n5-p2-kr-04',
    type: 'kanji-reading',
    sentence: 'あの二人はとても［仲がいい］です。',
    furigana: 'あの[二人|ふたり]はとても仲がいいです。',
    options: ['なかがいい', 'なかかいい', 'なががいい', 'ながかいい'],
    explanation:
      '「仲がいい」讀作「なかがいい」，意思是「感情好、要好」。\n例句：那兩人感情非常好。',
  },
  {
    ...FROZEN,
    from: 'gen-kr-n5-250',
    id: 'n5-p2-kr-05',
    type: 'kanji-reading',
    sentence: 'わたしの［後ろ］にだれかいます。',
    furigana: 'わたしの後ろにだれかいます。',
    options: ['うしろ', 'うじろ', 'うしろう', 'うじろう'],
    explanation: '「後ろ」讀作「うしろ」，意思是「後面」。\n例句：我後面有人。',
  },
  {
    ...FROZEN,
    from: 'gen-kr-n5-355',
    id: 'n5-p2-kr-06',
    type: 'kanji-reading',
    sentence: '今日は［風］が強いです。',
    furigana: '[今日|きょう]は風が[強|つよ]いです。',
    options: ['かぜ', 'かせ', 'がぜ', 'がせ'],
    explanation: '「風」讀作「かぜ」，意思是「風」。\n例句：今天風很強。',
  },
  {
    ...FROZEN,
    from: 'gen-kr-n5-896',
    id: 'n5-p2-kr-07',
    type: 'kanji-reading',
    sentence: '食べ過ぎて［気持ち悪い］です。',
    furigana: '[食|た]べ[過|す]ぎて気持ち悪いです。',
    options: ['きもちわるい', 'ぎもちわるい', 'きもうちわるい', 'ぎもうちわるい'],
    explanation:
      '「気持ち悪い」讀作「きもちわるい」，意思是「噁心、不舒服」。\n例句：吃太多覺得不舒服。',
  },
  {
    ...FROZEN,
    from: 'gen-or-n5-425',
    id: 'n5-p2-or-01',
    type: 'orthography',
    sentence: 'おなかが［いたい］です。',
    furigana: 'おなかがいたいです。',
    options: ['痛い', '労い', '悼い', '板い'],
    explanation:
      '「いたい」寫成「痛い」，意思是「痛的」。其他選項是把漢字換成讀音相同或相近的字，都不是正確寫法。\n例句：肚子痛。',
  },
  {
    ...FROZEN,
    from: 'gen-or-n5-325',
    id: 'n5-p2-or-02',
    type: 'orthography',
    sentence: '［ぶたにく］と野菜を炒めました。',
    furigana: 'ぶたにくと[野菜|やさい]を[炒|いた]めました。',
    options: ['豚肉', '豚憎', '蓋肉', '二肉'],
    explanation:
      '「ぶたにく」寫成「豚肉」，意思是「豬肉」。其他選項是把漢字換成讀音相同或相近的字，都不是正確寫法。\n例句：炒了豬肉和蔬菜。',
  },
  {
    ...FROZEN,
    from: 'gen-or-n5-353',
    id: 'n5-p2-or-03',
    type: 'orthography',
    sentence: '公園に大きい［き］があります。',
    furigana: '[公園|こうえん]に[大|おお]きいきがあります。',
    options: ['木', '切', '器', '消'],
    explanation:
      '「き」寫成「木」，意思是「樹」。其他選項是把漢字換成讀音相同或相近的字，都不是正確寫法。\n例句：公園裡有一棵大樹。',
  },
  {
    ...FROZEN,
    from: 'gen-or-n5-885',
    id: 'n5-p2-or-04',
    type: 'orthography',
    sentence: 'この部屋は［あつくるしい］ですね。',
    furigana: 'この[部屋|へや]はあつくるしいですね。',
    options: ['暑苦しい', '集苦しい', '暑狂しい', '厚苦しい'],
    explanation:
      '「あつくるしい」寫成「暑苦しい」，意思是「悶熱難受」。其他選項是把漢字換成讀音相同或相近的字，都不是正確寫法。\n例句：這個房間悶熱得難受呢。',
  },
  {
    ...FROZEN,
    from: 'gen-or-n5-633',
    id: 'n5-p2-or-05',
    type: 'orthography',
    sentence: 'お子さんは［なんさい］ですか。',
    furigana: 'お[子|こ]さんはなんさいですか。',
    options: ['何歳', '何際', '何最', '何再'],
    explanation:
      '「なんさい」寫成「何歳」，意思是「幾歲」。其他選項是把漢字換成讀音相同或相近的字，都不是正確寫法。\n例句：您的孩子幾歲？',
  },
  {
    ...FROZEN,
    from: 'gen-cx-n5-141',
    id: 'n5-p2-cx-01',
    type: 'context',
    sentence: 'このケーキは（　）です。',
    furigana: 'このケーキは（　）です。',
    options: ['甘い', '暗い', '小汚い', '眠たい'],
    explanation:
      '答案是「甘い」（あまい），意思是「甜的」。\n例句：這個蛋糕很甜。\n其他選項：暗い（暗的）、小汚い（有點髒、髒兮兮）、眠たい（睏、想睡（口語））。',
  },
  {
    ...FROZEN,
    from: 'gen-cx-n5-314',
    id: 'n5-p2-cx-02',
    type: 'context',
    sentence: '（　）を一杯ください。',
    furigana: '（　）を[一杯|いっぱい]ください。',
    options: ['紅茶', '周り', '中学生', '兄'],
    explanation:
      '答案是「紅茶」（こうちゃ），意思是「紅茶」。\n例句：請給我一杯紅茶。\n其他選項：周り（周圍、四周）、中学生（國中生）、兄（（我的）哥哥）。',
  },
  {
    ...FROZEN,
    from: 'gen-cx-n5-370',
    id: 'n5-p2-cx-03',
    type: 'context',
    sentence: '日曜日に（　）をします。',
    furigana: '[日曜日|にちようび]に（　）をします。',
    options: ['野球', '道', '男の子', '夜'],
    explanation:
      '答案是「野球」（やきゅう），意思是「棒球」。\n例句：星期日打棒球。\n其他選項：道（道路）、男の子（男孩）、夜（晚上）。',
  },
  {
    ...FROZEN,
    from: 'gen-cx-n5-717',
    id: 'n5-p2-cx-04',
    type: 'context',
    sentence: '封筒の（　）に住所を書きます。',
    furigana: '[封筒|ふうとう]の（　）に[住所|じゅうしょ]を[書|か]きます。',
    options: ['表', '動物', '靴', '人'],
    explanation:
      '答案是「表」（おもて），意思是「正面、表面、外面」。\n例句：在信封正面寫地址。\n其他選項：動物（動物）、靴（鞋子）、人（人）。',
  },
  {
    ...FROZEN,
    from: 'gen-cx-n5-720',
    id: 'n5-p2-cx-05',
    type: 'context',
    sentence: '箱の（　）に字が書いてあります。',
    furigana: '[箱|はこ]の（　）に[字|じ]が[書|か]いてあります。',
    options: ['外側', '新聞', '会社員', '鉛筆'],
    explanation:
      '答案是「外側」（そとがわ），意思是「外側」。\n例句：箱子外側寫著字。\n其他選項：新聞（報紙）、会社員（公司職員、上班族）、鉛筆（鉛筆）。',
  },
  {
    ...FROZEN,
    from: 'gen-cx-n5-889',
    id: 'n5-p2-cx-06',
    type: 'context',
    sentence: '（　）料理はあまり好きではありません。',
    furigana: '（　）[料理|りょうり]はあまり[好|す]きではありません。',
    options: ['油っぽい', '真新しい', '茶色い', '黒っぽい'],
    explanation:
      '答案是「油っぽい」（あぶらっぽい），意思是「油膩」。\n例句：不太喜歡油膩的料理。\n其他選項：真新しい（嶄新）、茶色い（咖啡色的、棕色的）、黒っぽい（偏黑、深色）。',
  },
  {
    ...FROZEN,
    from: 'gen-gr-n5-g17',
    id: 'n5-p2-gf-01',
    type: 'grammar',
    sentence: '音楽を聞き（　）、勉強します。',
    furigana: '[音楽|おんがく]を[聞|き]き（　）、[勉強|べんきょう]します。',
    options: ['ながら', 'たり', 'てから', 'まで'],
    explanation:
      '「〜ながら」：一邊〜一邊〜。接續：動詞ます形 ＋ ながら。\n考試重點：主要動作放在後句，「ながら」前是附帶動作；兩動作主語必須相同。\n例句：音楽を聞きながら、勉強します。（一邊聽音樂一邊讀書。）',
  },
  {
    ...FROZEN,
    from: 'gen-gr-n5-g70',
    id: 'n5-p2-gf-02',
    type: 'grammar',
    sentence: '昨日は雨（　）。',
    furigana: '[昨日|きのう]は[雨|あめ]（　）。',
    options: ['でした', 'かったです', 'ました', 'だです'],
    explanation:
      '「〜でした」：是〜（過去肯定）。接續：名詞／な形容詞 ＋ でした。\n考試重點：名詞・な形容詞過去用「でした」；い形容詞過去不可說「〜いでした」，要用「〜かったです」。\n例句：昨日は雨でした。（昨天是雨天。）',
  },
  {
    ...FROZEN,
    from: 'gen-gr-n5-g87',
    id: 'n5-p2-gf-03',
    type: 'grammar',
    sentence: '私は推理小説（　）好きです。',
    furigana: '[私|わたし]は[推理|すいり][小説|しょうせつ]（　）[好|す]きです。',
    options: ['が', 'を', 'に', 'で'],
    explanation:
      '「〜が好きです」：喜歡〜。接續：名詞 ＋ が ＋ 好きです。\n考試重點：喜好的對象用が不用を；「大好き」語氣更強。\n例句：私は推理小説が好きです。（我喜歡推理小說。）',
  },
  {
    ...FROZEN,
    from: 'gen-gr-n5-g105',
    id: 'n5-p2-gf-04',
    type: 'grammar',
    sentence: 'このかばんは（　）ですか。',
    furigana: undefined,
    options: ['いくら', 'いくつ', 'どれ', 'いつ'],
    explanation:
      '「いくら〜」：多少錢。接續：いくら ＋ ですか。\n考試重點：問價格；問數量或年齡用「いくつ」，兩者常互為干擾選項。\n例句：このかばんはいくらですか。（這個包包多少錢？）',
  },
  {
    ...FROZEN,
    from: 'gen-gr-n5-g91',
    id: 'n5-p2-gf-05',
    type: 'grammar',
    sentence: '犯人の名前（　）わかりました。',
    furigana: '[犯人|はんにん]の[名前|なまえ]（　）わかりました。',
    options: ['が', 'を', 'に', 'で'],
    explanation:
      '「〜がわかります」：懂〜；知道〜。接續：名詞 ＋ が ＋ わかります。\n考試重點：「わかる」的對象用が，不用を；表「懂、明白」，不能用「知る」替代所有用法。\n例句：犯人の名前がわかりました。（知道犯人的名字了。）',
  },
  {
    ...FROZEN,
    from: 'gen-gr-n5-g106',
    id: 'n5-p2-gf-06',
    type: 'grammar',
    sentence: '箱の中にりんごが（　）ありますか。',
    furigana: '[箱|はこ]の[中|なか]にりんごが（　）ありますか。',
    options: ['いくつ', 'いくら', 'どう', 'どの'],
    explanation:
      '「いくつ〜」：幾個；幾歲。接續：いくつ ＋ ですか／動詞。\n考試重點：問一般物品的數量或年齡（禮貌說法「おいくつ」）；有量詞時用「何＋量詞」。\n例句：箱の中にりんごがいくつありますか。（箱子裡有幾個蘋果？）',
  },
  {
    ...FROZEN,
    from: 'gen-gr-n5-g76',
    id: 'n5-p2-gf-07',
    type: 'grammar',
    sentence: 'この部屋はとても暗い（　）。',
    furigana: 'この[部屋|へや]はとても[暗|くら]い（　）。',
    options: ['です', 'ます', 'だ', 'でした'],
    explanation:
      '「〜いです」：い形容詞的禮貌肯定。接續：い形容詞 ＋ です。\n考試重點：い形容詞直接加です，不可加だ或でした（×暗いでした）。\n例句：この部屋はとても暗いです。（這個房間非常暗。）',
  },
  {
    ...FROZEN,
    from: 'gen-gr-n5-g57',
    id: 'n5-p2-gf-08',
    type: 'grammar',
    sentence: 'りんごは全部（　）五つあります。',
    furigana: 'りんごは[全部|ぜんぶ]（　）[五|いつ]つあります。',
    options: ['で', 'に', 'を', 'へ'],
    explanation:
      '「〜で（合計）」：合計、總共。接續：數量詞 ＋ で。\n考試重點：接在全部、みんな、一人等後，表示合計或範圍（全部で千円）。\n例句：りんごは全部で五つあります。（蘋果總共有五個。）',
  },
  {
    ...FROZEN,
    from: 'gen-gr-n5-g22',
    id: 'n5-p2-gf-09',
    type: 'grammar',
    sentence: 'デパートへ靴を買い（　）。',
    furigana: 'デパートへ[靴|くつ]を[買|か]い（　）。',
    options: ['に行きます', 'て行きます', 'へ行きます', 'で行きます'],
    explanation:
      '「〜に行く」：去做〜。接續：動詞ます形／名詞 ＋ に行く。\n考試重點：目的前接動詞ます形去ます（買いに）或動作性名詞（買い物に行く）；後接行く、来る、帰る。\n例句：デパートへ靴を買いに行きます。（去百貨公司買鞋子。）',
  },
];
