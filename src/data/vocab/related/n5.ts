import type { WordRelation } from '../types';

/** N5 單字的同義詞、反義詞（由 scripts/build-word-relations.js 產生，不要手動修改） */
export const N5_RELATED: Record<string, WordRelation[]> = {
  'n5-005': [{ kind: 'synonym', id: 'n3-207', word: '教師', reading: 'きょうし', meaning: '教師' }],
  'n5-006': [
    { kind: 'synonym', id: 'n5-469', word: '友人', reading: 'ゆうじん', meaning: '朋友（較正式）' },
  ],
  'n5-008': [
    { kind: 'antonym', id: 'n5-009', word: '小さい', reading: 'ちいさい', meaning: '小的' },
  ],
  'n5-009': [
    { kind: 'antonym', id: 'n5-008', word: '大きい', reading: 'おおきい', meaning: '大的' },
  ],
  'n5-011': [{ kind: 'antonym', id: 'n5-152', word: '昨日', reading: 'きのう', meaning: '昨天' }],
  'n5-012': [{ kind: 'antonym', id: 'n5-013', word: '来る', reading: 'くる', meaning: '來' }],
  'n5-013': [{ kind: 'antonym', id: 'n5-012', word: '行く', reading: 'いく', meaning: '去' }],
  'n5-014': [
    { kind: 'synonym', id: 'n2-132', word: '眺める', reading: 'ながめる', meaning: '眺望' },
  ],
  'n5-019': [
    { kind: 'synonym', id: 'n3-900', word: '天候', reading: 'てんこう', meaning: '天候、氣象狀況' },
  ],
  'n5-027': [{ kind: 'antonym', id: 'n5-056', word: '売る', reading: 'うる', meaning: '賣' }],
  'n5-030': [
    { kind: 'synonym', id: 'n2-367', word: '尋ねる', reading: 'たずねる', meaning: '詢問' },
  ],
  'n5-031': [{ kind: 'synonym', id: 'n2-347', word: '語る', reading: 'かたる', meaning: '講述' }],
  'n5-034': [{ kind: 'antonym', id: 'n5-035', word: '寝る', reading: 'ねる', meaning: '睡覺' }],
  'n5-035': [{ kind: 'antonym', id: 'n5-034', word: '起きる', reading: 'おきる', meaning: '起床' }],
  'n5-036': [{ kind: 'antonym', id: 'n5-037', word: '古い', reading: 'ふるい', meaning: '舊的' }],
  'n5-037': [
    { kind: 'antonym', id: 'n5-036', word: '新しい', reading: 'あたらしい', meaning: '新的' },
  ],
  'n5-038': [
    { kind: 'antonym', id: 'n5-039', word: '安い', reading: 'やすい', meaning: '便宜的' },
    { kind: 'antonym', id: 'n5-421', word: '低い', reading: 'ひくい', meaning: '低的、矮的' },
  ],
  'n5-039': [
    { kind: 'antonym', id: 'n5-038', word: '高い', reading: 'たかい', meaning: '高的、貴的' },
  ],
  'n5-040': [
    { kind: 'antonym', id: 'n5-041', word: '寒い', reading: 'さむい', meaning: '（天氣）冷的' },
  ],
  'n5-041': [
    { kind: 'antonym', id: 'n5-040', word: '暑い', reading: 'あつい', meaning: '（天氣）熱的' },
  ],
  'n5-042': [
    { kind: 'antonym', id: 'n5-437', word: '賑やか', reading: 'にぎやか', meaning: '熱鬧' },
  ],
  'n5-044': [{ kind: 'antonym', id: 'n5-045', word: '夜', reading: 'よる', meaning: '晚上' }],
  'n5-045': [
    { kind: 'antonym', id: 'n5-169', word: '昼', reading: 'ひる', meaning: '中午' },
    { kind: 'antonym', id: 'n5-044', word: '朝', reading: 'あさ', meaning: '早上' },
  ],
  'n5-050': [{ kind: 'synonym', id: 'n3-312', word: '道路', reading: 'どうろ', meaning: '道路' }],
  'n5-056': [{ kind: 'antonym', id: 'n5-027', word: '買う', reading: 'かう', meaning: '買' }],
  'n5-057': [{ kind: 'antonym', id: 'n5-408', word: '習う', reading: 'ならう', meaning: '學習' }],
  'n5-059': [
    { kind: 'antonym', id: 'n5-127', word: '始まる', reading: 'はじまる', meaning: '開始' },
  ],
  'n5-060': [{ kind: 'antonym', id: 'n5-061', word: '貸す', reading: 'かす', meaning: '借出' }],
  'n5-061': [{ kind: 'antonym', id: 'n5-060', word: '借りる', reading: 'かりる', meaning: '借入' }],
  'n5-064': [{ kind: 'antonym', id: 'n5-380', word: '立つ', reading: 'たつ', meaning: '站' }],
  'n5-065': [
    { kind: 'antonym', id: 'n5-726', word: '入れる', reading: 'いれる', meaning: '放進、裝入' },
  ],
  'n5-067': [{ kind: 'antonym', id: 'n5-068', word: '短い', reading: 'みじかい', meaning: '短的' }],
  'n5-068': [{ kind: 'antonym', id: 'n5-067', word: '長い', reading: 'ながい', meaning: '長的' }],
  'n5-069': [{ kind: 'antonym', id: 'n5-070', word: '狭い', reading: 'せまい', meaning: '狹窄的' }],
  'n5-070': [{ kind: 'antonym', id: 'n5-069', word: '広い', reading: 'ひろい', meaning: '寬廣的' }],
  'n5-071': [{ kind: 'antonym', id: 'n5-072', word: '遠い', reading: 'とおい', meaning: '遠的' }],
  'n5-072': [{ kind: 'antonym', id: 'n5-071', word: '近い', reading: 'ちかい', meaning: '近的' }],
  'n5-073': [
    { kind: 'antonym', id: 'n5-074', word: '遅い', reading: 'おそい', meaning: '慢的、晚的' },
  ],
  'n5-074': [
    { kind: 'antonym', id: 'n5-073', word: '早い', reading: 'はやい', meaning: '早的' },
    { kind: 'antonym', id: 'n5-869', word: '速い', reading: 'はやい', meaning: '（速度）快' },
  ],
  'n5-076': [
    { kind: 'antonym', id: 'n4-407', word: '易しい', reading: 'やさしい', meaning: '容易的' },
  ],
  'n5-077': [{ kind: 'antonym', id: 'n5-433', word: '暇', reading: 'ひま', meaning: '空閒' }],
  'n5-078': [
    { kind: 'antonym', id: 'n3-1538', word: '無名', reading: 'むめい', meaning: '沒沒無聞、無名' },
  ],
  'n5-079': [{ kind: 'antonym', id: 'n4-144', word: '不便', reading: 'ふべん', meaning: '不方便' }],
  'n5-080': [{ kind: 'antonym', id: 'n5-081', word: '嫌い', reading: 'きらい', meaning: '討厭' }],
  'n5-081': [{ kind: 'antonym', id: 'n5-080', word: '好き', reading: 'すき', meaning: '喜歡' }],
  'n5-082': [
    { kind: 'antonym', id: 'n5-438', word: '下手', reading: 'へた', meaning: '不擅長' },
    {
      kind: 'synonym',
      id: 'n5-845',
      word: 'うまい',
      reading: 'うまい',
      meaning: '好吃；高明（口語）',
    },
  ],
  'n5-083': [
    { kind: 'synonym', id: 'n4-148', word: '非常に', reading: 'ひじょうに', meaning: '非常' },
  ],
  'n5-084': [
    { kind: 'antonym', id: 'n5-085', word: 'たくさん', reading: 'たくさん', meaning: '很多' },
    { kind: 'synonym', id: 'n5-095', word: 'ちょっと', reading: 'ちょっと', meaning: '稍微' },
  ],
  'n5-085': [{ kind: 'antonym', id: 'n5-084', word: '少し', reading: 'すこし', meaning: '一點點' }],
  'n5-087': [
    { kind: 'synonym', id: 'n1-1526', word: '時折', reading: 'ときおり', meaning: '偶爾、有時' },
    { kind: 'synonym', id: 'n5-909', word: 'たまに', reading: 'たまに', meaning: '偶爾' },
  ],
  'n5-088': [{ kind: 'synonym', id: 'n3-518', word: '常に', reading: 'つねに', meaning: '經常' }],
  'n5-091': [
    { kind: 'synonym', id: 'n2-094', word: '直ちに', reading: 'ただちに', meaning: '立刻' },
  ],
  'n5-093': [{ kind: 'synonym', id: 'n3-100', word: '再び', reading: 'ふたたび', meaning: '再次' }],
  'n5-095': [{ kind: 'synonym', id: 'n5-084', word: '少し', reading: 'すこし', meaning: '一點點' }],
  'n5-101': [
    { kind: 'antonym', id: 'n5-102', word: '母', reading: 'はは', meaning: '（我的）媽媽' },
  ],
  'n5-102': [
    { kind: 'antonym', id: 'n5-101', word: '父', reading: 'ちち', meaning: '（我的）爸爸' },
  ],
  'n5-103': [{ kind: 'antonym', id: 'n5-105', word: '弟', reading: 'おとうと', meaning: '弟弟' }],
  'n5-104': [{ kind: 'antonym', id: 'n5-106', word: '妹', reading: 'いもうと', meaning: '妹妹' }],
  'n5-105': [
    { kind: 'antonym', id: 'n5-103', word: '兄', reading: 'あに', meaning: '（我的）哥哥' },
  ],
  'n5-106': [
    { kind: 'antonym', id: 'n5-104', word: '姉', reading: 'あね', meaning: '（我的）姊姊' },
  ],
  'n5-107': [{ kind: 'antonym', id: 'n5-193', word: '大人', reading: 'おとな', meaning: '大人' }],
  'n5-121': [
    { kind: 'antonym', id: 'n5-122', word: '出る', reading: 'でる', meaning: '出去、離開' },
  ],
  'n5-122': [{ kind: 'antonym', id: 'n5-121', word: '入る', reading: 'はいる', meaning: '進入' }],
  'n5-123': [
    { kind: 'antonym', id: 'n5-124', word: '降りる', reading: 'おりる', meaning: '下（車）' },
  ],
  'n5-124': [{ kind: 'antonym', id: 'n5-123', word: '乗る', reading: 'のる', meaning: '搭乘' }],
  'n5-125': [{ kind: 'antonym', id: 'n5-126', word: '閉める', reading: 'しめる', meaning: '關上' }],
  'n5-126': [{ kind: 'antonym', id: 'n5-125', word: '開ける', reading: 'あける', meaning: '打開' }],
  'n5-127': [{ kind: 'antonym', id: 'n5-059', word: '終わる', reading: 'おわる', meaning: '結束' }],
  'n5-130': [
    { kind: 'antonym', id: 'n5-131', word: '忘れる', reading: 'わすれる', meaning: '忘記' },
  ],
  'n5-131': [
    { kind: 'antonym', id: 'n5-130', word: '覚える', reading: 'おぼえる', meaning: '記住' },
  ],
  'n5-135': [{ kind: 'antonym', id: 'n5-136', word: '暗い', reading: 'くらい', meaning: '暗的' }],
  'n5-136': [
    { kind: 'antonym', id: 'n5-135', word: '明るい', reading: 'あかるい', meaning: '明亮的' },
  ],
  'n5-137': [{ kind: 'antonym', id: 'n5-138', word: '軽い', reading: 'かるい', meaning: '輕的' }],
  'n5-138': [{ kind: 'antonym', id: 'n5-137', word: '重い', reading: 'おもい', meaning: '重的' }],
  'n5-139': [
    { kind: 'antonym', id: 'n5-140', word: '少ない', reading: 'すくない', meaning: '少的' },
  ],
  'n5-140': [{ kind: 'antonym', id: 'n5-139', word: '多い', reading: 'おおい', meaning: '多的' }],
  'n5-141': [{ kind: 'antonym', id: 'n5-142', word: '辛い', reading: 'からい', meaning: '辣的' }],
  'n5-142': [{ kind: 'antonym', id: 'n5-141', word: '甘い', reading: 'あまい', meaning: '甜的' }],
  'n5-143': [{ kind: 'antonym', id: 'n5-416', word: '黒い', reading: 'くろい', meaning: '黑色的' }],
  'n5-144': [
    { kind: 'antonym', id: 'n4-137', word: '汚い', reading: 'きたない', meaning: '髒的' },
    { kind: 'synonym', id: 'n4-075', word: '美しい', reading: 'うつくしい', meaning: '美麗的' },
  ],
  'n5-146': [{ kind: 'synonym', id: 'n4-1269', word: '最も', reading: 'もっとも', meaning: '最' }],
  'n5-151': [{ kind: 'synonym', id: 'n3-223', word: '現在', reading: 'げんざい', meaning: '目前' }],
  'n5-152': [{ kind: 'antonym', id: 'n5-011', word: '明日', reading: 'あした', meaning: '明天' }],
  'n5-160': [
    { kind: 'antonym', id: 'n5-162', word: '来週', reading: 'らいしゅう', meaning: '下週' },
  ],
  'n5-162': [
    { kind: 'antonym', id: 'n5-160', word: '先週', reading: 'せんしゅう', meaning: '上週' },
  ],
  'n5-163': [
    { kind: 'antonym', id: 'n5-165', word: '来月', reading: 'らいげつ', meaning: '下個月' },
  ],
  'n5-165': [
    { kind: 'antonym', id: 'n5-163', word: '先月', reading: 'せんげつ', meaning: '上個月' },
  ],
  'n5-166': [{ kind: 'antonym', id: 'n5-168', word: '来年', reading: 'らいねん', meaning: '明年' }],
  'n5-168': [{ kind: 'antonym', id: 'n5-166', word: '去年', reading: 'きょねん', meaning: '去年' }],
  'n5-169': [{ kind: 'antonym', id: 'n5-045', word: '夜', reading: 'よる', meaning: '晚上' }],
  'n5-175': [{ kind: 'synonym', id: 'n3-206', word: '休暇', reading: 'きゅうか', meaning: '休假' }],
  'n5-189': [{ kind: 'antonym', id: 'n5-190', word: '女', reading: 'おんな', meaning: '女性' }],
  'n5-190': [{ kind: 'antonym', id: 'n5-189', word: '男', reading: 'おとこ', meaning: '男性' }],
  'n5-193': [{ kind: 'antonym', id: 'n5-107', word: '子ども', reading: 'こども', meaning: '小孩' }],
  'n5-197': [
    {
      kind: 'antonym',
      id: 'n5-198',
      word: 'お母さん',
      reading: 'おかあさん',
      meaning: '（稱呼）媽媽、母親',
    },
  ],
  'n5-198': [
    {
      kind: 'antonym',
      id: 'n5-197',
      word: 'お父さん',
      reading: 'おとうさん',
      meaning: '（稱呼）爸爸、父親',
    },
  ],
  'n5-208': [
    {
      kind: 'synonym',
      id: 'n2-524',
      word: '身体',
      reading: 'しんたい',
      meaning: '身體（正式說法）',
    },
  ],
  'n5-221': [{ kind: 'antonym', id: 'n3-483', word: '健康', reading: 'けんこう', meaning: '健康' }],
  'n5-225': [{ kind: 'synonym', id: 'n2-1011', word: '国家', reading: 'こっか', meaning: '國家' }],
  'n5-227': [{ kind: 'synonym', id: 'n2-738', word: '企業', reading: 'きぎょう', meaning: '企業' }],
  'n5-247': [{ kind: 'antonym', id: 'n5-248', word: '下', reading: 'した', meaning: '下面' }],
  'n5-248': [{ kind: 'antonym', id: 'n5-247', word: '上', reading: 'うえ', meaning: '上面' }],
  'n5-249': [{ kind: 'antonym', id: 'n5-250', word: '後ろ', reading: 'うしろ', meaning: '後面' }],
  'n5-250': [{ kind: 'antonym', id: 'n5-249', word: '前', reading: 'まえ', meaning: '前面' }],
  'n5-251': [{ kind: 'antonym', id: 'n5-252', word: '左', reading: 'ひだり', meaning: '左邊' }],
  'n5-252': [{ kind: 'antonym', id: 'n5-251', word: '右', reading: 'みぎ', meaning: '右邊' }],
  'n5-255': [
    { kind: 'antonym', id: 'n5-711', word: '縦', reading: 'たて', meaning: '縱、豎、長度' },
  ],
  'n5-256': [{ kind: 'antonym', id: 'n5-257', word: '西', reading: 'にし', meaning: '西' }],
  'n5-257': [{ kind: 'antonym', id: 'n5-256', word: '東', reading: 'ひがし', meaning: '東' }],
  'n5-258': [{ kind: 'antonym', id: 'n5-259', word: '北', reading: 'きた', meaning: '北' }],
  'n5-259': [{ kind: 'antonym', id: 'n5-258', word: '南', reading: 'みなみ', meaning: '南' }],
  'n5-261': [{ kind: 'antonym', id: 'n5-262', word: '出口', reading: 'でぐち', meaning: '出口' }],
  'n5-262': [{ kind: 'antonym', id: 'n5-261', word: '入口', reading: 'いりぐち', meaning: '入口' }],
  'n5-335': [
    { kind: 'synonym', id: 'n4-544', word: 'テスト', reading: 'テスト', meaning: '測驗、小考' },
  ],
  'n5-338': [
    {
      kind: 'synonym',
      id: 'n2-2056',
      word: '回答',
      reading: 'かいとう',
      meaning: '回答（問卷、詢問）',
    },
  ],
  'n5-344': [
    { kind: 'synonym', id: 'n4-666', word: '旅', reading: 'たび', meaning: '旅程、旅行（文雅）' },
  ],
  'n5-349': [
    { kind: 'synonym', id: 'n2-2074', word: '学習', reading: 'がくしゅう', meaning: '學習' },
  ],
  'n5-359': [
    { kind: 'antonym', id: 'n2-2132', word: '一部', reading: 'いちぶ', meaning: '一部分' },
  ],
  'n5-375': [{ kind: 'synonym', id: 'n3-448', word: '述べる', reading: 'のべる', meaning: '敘述' }],
  'n5-380': [{ kind: 'antonym', id: 'n5-064', word: '座る', reading: 'すわる', meaning: '坐' }],
  'n5-381': [
    { kind: 'antonym', id: 'n5-403', word: '生まれる', reading: 'うまれる', meaning: '出生' },
    { kind: 'antonym', id: 'n3-376', word: '生きる', reading: 'いきる', meaning: '活' },
  ],
  'n5-382': [{ kind: 'antonym', id: 'n5-384', word: '脱ぐ', reading: 'ぬぐ', meaning: '脫' }],
  'n5-384': [
    { kind: 'antonym', id: 'n5-382', word: '着る', reading: 'きる', meaning: '穿（上衣）' },
  ],
  'n5-389': [
    { kind: 'antonym', id: 'n5-390', word: '付ける', reading: 'つける', meaning: '打開（電器）' },
  ],
  'n5-390': [
    { kind: 'antonym', id: 'n5-389', word: '消す', reading: 'けす', meaning: '關掉、擦掉' },
  ],
  'n5-400': [
    { kind: 'antonym', id: 'n4-123', word: '押す', reading: 'おす', meaning: '推、按' },
    { kind: 'antonym', id: 'n4-354', word: '足す', reading: 'たす', meaning: '加' },
  ],
  'n5-403': [{ kind: 'antonym', id: 'n5-381', word: '死ぬ', reading: 'しぬ', meaning: '死' }],
  'n5-405': [{ kind: 'synonym', id: 'n2-323', word: '理解', reading: 'りかい', meaning: '理解' }],
  'n5-408': [
    { kind: 'antonym', id: 'n5-057', word: '教える', reading: 'おしえる', meaning: '教、告訴' },
  ],
  'n5-413': [
    { kind: 'antonym', id: 'n5-414', word: '閉まる', reading: 'しまる', meaning: '（門等）關' },
  ],
  'n5-414': [
    { kind: 'antonym', id: 'n5-413', word: '開く', reading: 'あく', meaning: '（門等）開' },
  ],
  'n5-416': [{ kind: 'antonym', id: 'n5-143', word: '白い', reading: 'しろい', meaning: '白色的' }],
  'n5-421': [
    { kind: 'antonym', id: 'n5-038', word: '高い', reading: 'たかい', meaning: '高的、貴的' },
  ],
  'n5-423': [
    { kind: 'antonym', id: 'n4-138', word: '冷たい', reading: 'つめたい', meaning: '冰冷的' },
  ],
  'n5-426': [
    { kind: 'antonym', id: 'n5-427', word: 'まずい', reading: 'まずい', meaning: '難吃的' },
    {
      kind: 'synonym',
      id: 'n5-845',
      word: 'うまい',
      reading: 'うまい',
      meaning: '好吃；高明（口語）',
    },
  ],
  'n5-427': [
    { kind: 'antonym', id: 'n5-426', word: 'おいしい', reading: 'おいしい', meaning: '好吃的' },
  ],
  'n5-428': [
    { kind: 'antonym', id: 'n5-429', word: 'つまらない', reading: 'つまらない', meaning: '無聊的' },
  ],
  'n5-429': [
    { kind: 'antonym', id: 'n5-428', word: '面白い', reading: 'おもしろい', meaning: '有趣的' },
  ],
  'n5-430': [{ kind: 'antonym', id: 'n5-431', word: '強い', reading: 'つよい', meaning: '強的' }],
  'n5-431': [{ kind: 'antonym', id: 'n5-430', word: '弱い', reading: 'よわい', meaning: '弱的' }],
  'n5-433': [
    { kind: 'antonym', id: 'n5-077', word: '忙しい', reading: 'いそがしい', meaning: '忙碌的' },
  ],
  'n5-436': [
    {
      kind: 'antonym',
      id: 'n4-1186',
      word: '不親切',
      reading: 'ふしんせつ',
      meaning: '不親切、冷淡',
    },
  ],
  'n5-437': [{ kind: 'antonym', id: 'n5-042', word: '静か', reading: 'しずか', meaning: '安靜' }],
  'n5-438': [
    { kind: 'antonym', id: 'n5-082', word: '上手', reading: 'じょうず', meaning: '擅長、高明' },
  ],
  'n5-441': [
    { kind: 'antonym', id: 'n5-857', word: '大嫌い', reading: 'だいきらい', meaning: '最討厭' },
  ],
  'n5-442': [
    { kind: 'synonym', id: 'n2-1645', word: '見事', reading: 'みごと', meaning: '出色、精彩' },
  ],
  'n5-444': [
    { kind: 'antonym', id: 'n5-445', word: '後で', reading: 'あとで', meaning: '等一下、之後' },
  ],
  'n5-445': [{ kind: 'antonym', id: 'n5-444', word: '先に', reading: 'さきに', meaning: '先' }],
  'n5-460': [
    {
      kind: 'antonym',
      id: 'n5-461',
      word: 'おばあさん',
      reading: 'おばあさん',
      meaning: '奶奶、老奶奶',
    },
  ],
  'n5-461': [
    {
      kind: 'antonym',
      id: 'n5-460',
      word: 'おじいさん',
      reading: 'おじいさん',
      meaning: '爺爺、老爺爺',
    },
  ],
  'n5-469': [{ kind: 'synonym', id: 'n5-006', word: '友達', reading: 'ともだち', meaning: '朋友' }],
  'n5-482': [
    {
      kind: 'synonym',
      id: 'n3-559',
      word: '高齢者',
      reading: 'こうれいしゃ',
      meaning: '高齡者、年長者',
    },
  ],
  'n5-483': [
    {
      kind: 'synonym',
      id: 'n3-559',
      word: '高齢者',
      reading: 'こうれいしゃ',
      meaning: '高齡者、年長者',
    },
  ],
  'n5-688': [{ kind: 'synonym', id: 'n3-239', word: '最初', reading: 'さいしょ', meaning: '最初' }],
  'n5-690': [
    { kind: 'antonym', id: 'n5-691', word: '空腹', reading: 'くうふく', meaning: '空腹、肚子餓' },
  ],
  'n5-691': [
    { kind: 'antonym', id: 'n5-690', word: '満腹', reading: 'まんぷく', meaning: '吃飽、肚子很飽' },
  ],
  'n5-711': [{ kind: 'antonym', id: 'n5-255', word: '横', reading: 'よこ', meaning: '旁邊' }],
  'n5-717': [{ kind: 'antonym', id: 'n5-718', word: '裏', reading: 'うら', meaning: '背面、後面' }],
  'n5-718': [
    { kind: 'antonym', id: 'n5-717', word: '表', reading: 'おもて', meaning: '正面、表面、外面' },
  ],
  'n5-719': [{ kind: 'antonym', id: 'n5-720', word: '外側', reading: 'そとがわ', meaning: '外側' }],
  'n5-720': [{ kind: 'antonym', id: 'n5-719', word: '内側', reading: 'うちがわ', meaning: '內側' }],
  'n5-726': [
    { kind: 'antonym', id: 'n5-065', word: '出す', reading: 'だす', meaning: '拿出、交出' },
  ],
  'n5-730': [
    { kind: 'antonym', id: 'n4-379', word: '始める', reading: 'はじめる', meaning: '開始（他）' },
    { kind: 'synonym', id: 'n2-221', word: '終了', reading: 'しゅうりょう', meaning: '結束' },
  ],
  'n5-733': [
    { kind: 'antonym', id: 'n2-1469', word: '下る', reading: 'くだる', meaning: '下（坡）、往下' },
  ],
  'n5-840': [
    {
      kind: 'antonym',
      id: 'n5-841',
      word: '小さな',
      reading: 'ちいさな',
      meaning: '小的（只放在名詞前）',
    },
  ],
  'n5-841': [
    {
      kind: 'antonym',
      id: 'n5-840',
      word: '大きな',
      reading: 'おおきな',
      meaning: '大的（只放在名詞前）',
    },
  ],
  'n5-845': [
    { kind: 'synonym', id: 'n5-426', word: 'おいしい', reading: 'おいしい', meaning: '好吃的' },
    { kind: 'synonym', id: 'n5-082', word: '上手', reading: 'じょうず', meaning: '擅長、高明' },
  ],
  'n5-857': [
    { kind: 'antonym', id: 'n5-441', word: '大好き', reading: 'だいすき', meaning: '非常喜歡' },
  ],
  'n5-858': [
    { kind: 'synonym', id: 'n4-142', word: '素晴らしい', reading: 'すばらしい', meaning: '極好的' },
  ],
  'n5-869': [
    { kind: 'antonym', id: 'n5-074', word: '遅い', reading: 'おそい', meaning: '慢的、晚的' },
  ],
  'n5-873': [
    { kind: 'antonym', id: 'n5-874', word: '真っ黒', reading: 'まっくろ', meaning: '漆黑、烏黑' },
  ],
  'n5-874': [
    { kind: 'antonym', id: 'n5-873', word: '真っ白', reading: 'まっしろ', meaning: '雪白、純白' },
  ],
  'n5-882': [
    { kind: 'synonym', id: 'n2-2135', word: '一般', reading: 'いっぱん', meaning: '一般、普通' },
  ],
  'n5-900': [
    {
      kind: 'antonym',
      id: 'n5-901',
      word: '辛口',
      reading: 'からくち',
      meaning: '偏辣、辛辣（口味）',
    },
  ],
  'n5-901': [
    {
      kind: 'antonym',
      id: 'n5-900',
      word: '甘口',
      reading: 'あまくち',
      meaning: '偏甜、不辣（口味）',
    },
  ],
  'n5-902': [
    {
      kind: 'antonym',
      id: 'n2-1805',
      word: '健康的',
      reading: 'けんこうてき',
      meaning: '健康的、有益健康的',
    },
  ],
  'n5-909': [
    { kind: 'synonym', id: 'n5-087', word: '時々', reading: 'ときどき', meaning: '有時候' },
  ],
};
