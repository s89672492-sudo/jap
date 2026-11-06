import type { WordRelation } from '../types';

/** N3 單字的同義詞、反義詞（由 scripts/build-word-relations.js 產生，不要手動修改） */
export const N3_RELATED: Record<string, WordRelation[]> = {
  'n3-018': [{ kind: 'antonym', id: 'n3-019', word: '結果', reading: 'けっか', meaning: '結果' }],
  'n3-019': [{ kind: 'antonym', id: 'n3-018', word: '原因', reading: 'げんいん', meaning: '原因' }],
  'n3-022': [
    { kind: 'synonym', id: 'n4-023', word: '調べる', reading: 'しらべる', meaning: '調查' },
  ],
  'n3-023': [
    { kind: 'synonym', id: 'n4-025', word: '見つける', reading: 'みつける', meaning: '找到' },
  ],
  'n3-029': [
    { kind: 'antonym', id: 'n4-042', word: '安全', reading: 'あんぜん', meaning: '安全' },
    { kind: 'synonym', id: 'n4-036', word: '危ない', reading: 'あぶない', meaning: '危險的' },
  ],
  'n3-036': [
    { kind: 'synonym', id: 'n3-142', word: '確実', reading: 'かくじつ', meaning: '可靠、肯定' },
  ],
  'n3-037': [
    { kind: 'synonym', id: 'n2-072', word: '恐ろしい', reading: 'おそろしい', meaning: '恐怖的' },
  ],
  'n3-038': [{ kind: 'antonym', id: 'n3-079', word: '鈍い', reading: 'にぶい', meaning: '遲鈍的' }],
  'n3-044': [
    { kind: 'synonym', id: 'n3-2221', word: '保護', reading: 'ほご', meaning: '保護、收容' },
  ],
  'n3-050': [
    { kind: 'antonym', id: 'n3-1305', word: '得る', reading: 'える', meaning: '得到、獲得' },
  ],
  'n3-052': [
    {
      kind: 'antonym',
      id: 'n3-1237',
      word: '引き出す',
      reading: 'ひきだす',
      meaning: '提領(存款)、引出',
    },
  ],
  'n3-062': [
    { kind: 'antonym', id: 'n3-1194', word: '浮く', reading: 'うく', meaning: '浮起' },
    { kind: 'antonym', id: 'n3-377', word: '浮かぶ', reading: 'うかぶ', meaning: '浮現' },
  ],
  'n3-066': [
    { kind: 'antonym', id: 'n3-374', word: '現れる', reading: 'あらわれる', meaning: '出現' },
  ],
  'n3-067': [
    { kind: 'synonym', id: 'n4-094', word: 'はっきり', reading: 'はっきり', meaning: '清楚地' },
  ],
  'n3-078': [
    { kind: 'antonym', id: 'n4-422', word: '厚い', reading: 'あつい', meaning: '厚的' },
    { kind: 'antonym', id: 'n3-493', word: '濃い', reading: 'こい', meaning: '濃的' },
  ],
  'n3-079': [
    { kind: 'antonym', id: 'n3-038', word: '鋭い', reading: 'するどい', meaning: '敏銳的' },
  ],
  'n3-080': [{ kind: 'antonym', id: 'n2-418', word: '愚か', reading: 'おろか', meaning: '愚蠢' }],
  'n3-087': [{ kind: 'synonym', id: 'n4-444', word: '突然', reading: 'とつぜん', meaning: '忽然' }],
  'n3-100': [{ kind: 'synonym', id: 'n5-093', word: 'また', reading: 'また', meaning: '又、再' }],
  'n3-101': [
    { kind: 'synonym', id: 'n4-1320', word: 'チャンス', reading: 'チャンス', meaning: '機會' },
  ],
  'n3-106': [{ kind: 'synonym', id: 'n3-264', word: '手段', reading: 'しゅだん', meaning: '手段' }],
  'n3-135': [
    { kind: 'antonym', id: 'n2-1123', word: '不正確', reading: 'ふせいかく', meaning: '不正確' },
  ],
  'n3-136': [{ kind: 'antonym', id: 'n4-040', word: '複雑', reading: 'ふくざつ', meaning: '複雜' }],
  'n3-138': [{ kind: 'antonym', id: 'n3-139', word: '太い', reading: 'ふとい', meaning: '粗的' }],
  'n3-139': [{ kind: 'antonym', id: 'n3-138', word: '細い', reading: 'ほそい', meaning: '細的' }],
  'n3-142': [{ kind: 'synonym', id: 'n3-036', word: '確か', reading: 'たしか', meaning: '確實' }],
  'n3-183': [{ kind: 'synonym', id: 'n4-689', word: '値段', reading: 'ねだん', meaning: '價錢' }],
  'n3-188': [{ kind: 'antonym', id: 'n3-347', word: '未来', reading: 'みらい', meaning: '未來' }],
  'n3-197': [{ kind: 'antonym', id: 'n2-506', word: '理性', reading: 'りせい', meaning: '理性' }],
  'n3-205': [{ kind: 'antonym', id: 'n3-227', word: '権利', reading: 'けんり', meaning: '權利' }],
  'n3-206': [
    { kind: 'synonym', id: 'n5-175', word: '休み', reading: 'やすみ', meaning: '休假、休息日' },
  ],
  'n3-207': [
    { kind: 'synonym', id: 'n5-005', word: '先生', reading: 'せんせい', meaning: '老師' },
    { kind: 'synonym', id: 'n2-2082', word: '教員', reading: 'きょういん', meaning: '教職員' },
  ],
  'n3-213': [{ kind: 'antonym', id: 'n3-788', word: '許可', reading: 'きょか', meaning: '許可' }],
  'n3-223': [{ kind: 'synonym', id: 'n5-151', word: '今', reading: 'いま', meaning: '現在' }],
  'n3-224': [{ kind: 'antonym', id: 'n4-1451', word: '理想', reading: 'りそう', meaning: '理想' }],
  'n3-227': [{ kind: 'antonym', id: 'n3-205', word: '義務', reading: 'ぎむ', meaning: '義務' }],
  'n3-230': [
    {
      kind: 'antonym',
      id: 'n2-2049',
      word: '不合格',
      reading: 'ふごうかく',
      meaning: '不及格、落榜',
    },
  ],
  'n3-239': [
    { kind: 'antonym', id: 'n3-240', word: '最後', reading: 'さいご', meaning: '最後、結尾' },
    { kind: 'synonym', id: 'n5-688', word: '初め', reading: 'はじめ', meaning: '開頭、起初' },
  ],
  'n3-240': [{ kind: 'antonym', id: 'n3-239', word: '最初', reading: 'さいしょ', meaning: '最初' }],
  'n3-248': [{ kind: 'antonym', id: 'n3-249', word: '反対', reading: 'はんたい', meaning: '反對' }],
  'n3-249': [{ kind: 'antonym', id: 'n3-248', word: '賛成', reading: 'さんせい', meaning: '贊成' }],
  'n3-264': [{ kind: 'synonym', id: 'n3-106', word: '方法', reading: 'ほうほう', meaning: '方法' }],
  'n3-269': [
    { kind: 'synonym', id: 'n4-213', word: '品物', reading: 'しなもの', meaning: '物品、商品' },
  ],
  'n3-282': [{ kind: 'antonym', id: 'n4-043', word: '失敗', reading: 'しっぱい', meaning: '失敗' }],
  'n3-283': [{ kind: 'antonym', id: 'n2-525', word: '肉体', reading: 'にくたい', meaning: '肉體' }],
  'n3-290': [{ kind: 'antonym', id: 'n2-2131', word: '部分', reading: 'ぶぶん', meaning: '部分' }],
  'n3-291': [
    { kind: 'synonym', id: 'n4-1317', word: 'スピード', reading: 'スピード', meaning: '速度' },
  ],
  'n3-292': [
    { kind: 'antonym', id: 'n4-1345', word: '得', reading: 'とく', meaning: '划算、得利' },
  ],
  'n3-311': [
    { kind: 'antonym', id: 'n4-676', word: '出発', reading: 'しゅっぱつ', meaning: '出發' },
  ],
  'n3-312': [{ kind: 'synonym', id: 'n5-050', word: '道', reading: 'みち', meaning: '道路' }],
  'n3-330': [{ kind: 'antonym', id: 'n4-580', word: '上司', reading: 'じょうし', meaning: '上司' }],
  'n3-336': [{ kind: 'antonym', id: 'n4-241', word: '戦争', reading: 'せんそう', meaning: '戰爭' }],
  'n3-337': [{ kind: 'synonym', id: 'n4-329', word: '変わる', reading: 'かわる', meaning: '變化' }],
  'n3-343': [{ kind: 'antonym', id: 'n3-344', word: '偽物', reading: 'にせもの', meaning: '假貨' }],
  'n3-344': [{ kind: 'antonym', id: 'n3-343', word: '本物', reading: 'ほんもの', meaning: '真品' }],
  'n3-347': [
    { kind: 'antonym', id: 'n3-188', word: '過去', reading: 'かこ', meaning: '過去' },
    { kind: 'synonym', id: 'n4-223', word: '将来', reading: 'しょうらい', meaning: '將來' },
  ],
  'n3-356': [
    { kind: 'antonym', id: 'n4-1344', word: '無料', reading: 'むりょう', meaning: '免費' },
  ],
  'n3-363': [{ kind: 'antonym', id: 'n2-193', word: '原則', reading: 'げんそく', meaning: '原則' }],
  'n3-369': [
    { kind: 'antonym', id: 'n3-451', word: '外れる', reading: 'はずれる', meaning: '脫落、落空' },
  ],
  'n3-374': [
    { kind: 'antonym', id: 'n3-066', word: '隠れる', reading: 'かくれる', meaning: '躲藏' },
    { kind: 'antonym', id: 'n4-976', word: '消える', reading: 'きえる', meaning: '消失、熄滅' },
  ],
  'n3-376': [{ kind: 'antonym', id: 'n5-381', word: '死ぬ', reading: 'しぬ', meaning: '死' }],
  'n3-377': [{ kind: 'antonym', id: 'n3-062', word: '沈む', reading: 'しずむ', meaning: '下沉' }],
  'n3-378': [{ kind: 'antonym', id: 'n4-122', word: '送る', reading: 'おくる', meaning: '寄送' }],
  'n3-396': [
    { kind: 'antonym', id: 'n4-005', word: '集める', reading: 'あつめる', meaning: '收集' },
  ],
  'n3-421': [
    { kind: 'synonym', id: 'n4-364', word: '手伝う', reading: 'てつだう', meaning: '幫忙' },
    { kind: 'synonym', id: 'n2-364', word: '救う', reading: 'すくう', meaning: '拯救' },
  ],
  'n3-448': [{ kind: 'synonym', id: 'n5-375', word: '言う', reading: 'いう', meaning: '說' }],
  'n3-451': [
    { kind: 'antonym', id: 'n3-369', word: '当たる', reading: 'あたる', meaning: '命中、中獎' },
  ],
  'n3-454': [
    { kind: 'antonym', id: 'n4-920', word: '温める', reading: 'あたためる', meaning: '加熱、溫熱' },
  ],
  'n3-459': [
    { kind: 'antonym', id: 'n4-980', word: '増やす', reading: 'ふやす', meaning: '增加（他）' },
  ],
  'n3-473': [
    { kind: 'antonym', id: 'n4-069', word: '柔らかい', reading: 'やわらかい', meaning: '柔軟的' },
  ],
  'n3-483': [{ kind: 'antonym', id: 'n5-221', word: '病気', reading: 'びょうき', meaning: '病' }],
  'n3-485': [
    { kind: 'synonym', id: 'n4-077', word: '大切', reading: 'たいせつ', meaning: '重要、珍惜' },
  ],
  'n3-493': [
    { kind: 'antonym', id: 'n3-078', word: '薄い', reading: 'うすい', meaning: '薄的、淡的' },
  ],
  'n3-494': [
    { kind: 'antonym', id: 'n3-495', word: 'きつい', reading: 'きつい', meaning: '緊的、辛苦的' },
  ],
  'n3-495': [{ kind: 'antonym', id: 'n3-494', word: '緩い', reading: 'ゆるい', meaning: '鬆的' }],
  'n3-498': [{ kind: 'synonym', id: 'n4-009', word: '心配', reading: 'しんぱい', meaning: '擔心' }],
  'n3-499': [{ kind: 'antonym', id: 'n2-309', word: '満足', reading: 'まんぞく', meaning: '滿足' }],
  'n3-500': [{ kind: 'antonym', id: 'n3-501', word: '不利', reading: 'ふり', meaning: '不利' }],
  'n3-501': [{ kind: 'antonym', id: 'n3-500', word: '有利', reading: 'ゆうり', meaning: '有利' }],
  'n3-518': [{ kind: 'synonym', id: 'n5-088', word: 'いつも', reading: 'いつも', meaning: '總是' }],
  'n3-536': [{ kind: 'antonym', id: 'n4-450', word: '結婚', reading: 'けっこん', meaning: '結婚' }],
  'n3-559': [
    { kind: 'synonym', id: 'n5-482', word: '老人', reading: 'ろうじん', meaning: '老人' },
    {
      kind: 'synonym',
      id: 'n5-483',
      word: 'お年寄り',
      reading: 'おとしより',
      meaning: '長者、老人家',
    },
  ],
  'n3-608': [
    { kind: 'antonym', id: 'n3-609', word: '短所', reading: 'たんしょ', meaning: '短處、缺點' },
  ],
  'n3-609': [
    { kind: 'antonym', id: 'n3-608', word: '長所', reading: 'ちょうしょ', meaning: '長處、優點' },
  ],
  'n3-640': [{ kind: 'antonym', id: 'n3-641', word: '不幸', reading: 'ふこう', meaning: '不幸' }],
  'n3-641': [
    { kind: 'antonym', id: 'n3-640', word: '幸せ', reading: 'しあわせ', meaning: '幸福、幸運' },
  ],
  'n3-722': [{ kind: 'synonym', id: 'n4-006', word: '決める', reading: 'きめる', meaning: '決定' }],
  'n3-739': [{ kind: 'synonym', id: 'n3-740', word: 'コスト', reading: 'コスト', meaning: '成本' }],
  'n3-740': [{ kind: 'synonym', id: 'n3-739', word: '費用', reading: 'ひよう', meaning: '費用' }],
  'n3-788': [{ kind: 'antonym', id: 'n3-213', word: '禁止', reading: 'きんし', meaning: '禁止' }],
  'n3-900': [{ kind: 'synonym', id: 'n5-019', word: '天気', reading: 'てんき', meaning: '天氣' }],
  'n3-960': [{ kind: 'antonym', id: 'n3-961', word: '手動', reading: 'しゅどう', meaning: '手動' }],
  'n3-961': [{ kind: 'antonym', id: 'n3-960', word: '自動', reading: 'じどう', meaning: '自動' }],
  'n3-996': [
    { kind: 'synonym', id: 'n4-368', word: '直す', reading: 'なおす', meaning: '修理、改正' },
  ],
  'n3-1079': [
    { kind: 'antonym', id: 'n3-1080', word: '着陸', reading: 'ちゃくりく', meaning: '降落' },
  ],
  'n3-1080': [{ kind: 'antonym', id: 'n3-1079', word: '離陸', reading: 'りりく', meaning: '起飛' }],
  'n3-1194': [{ kind: 'antonym', id: 'n3-062', word: '沈む', reading: 'しずむ', meaning: '下沉' }],
  'n3-1207': [
    { kind: 'antonym', id: 'n4-976', word: '消える', reading: 'きえる', meaning: '消失、熄滅' },
  ],
  'n3-1237': [
    { kind: 'antonym', id: 'n3-052', word: '預ける', reading: 'あずける', meaning: '寄放' },
  ],
  'n3-1305': [
    { kind: 'antonym', id: 'n3-050', word: '失う', reading: 'うしなう', meaning: '失去' },
  ],
  'n3-1344': [
    { kind: 'antonym', id: 'n2-344', word: '欠ける', reading: 'かける', meaning: '缺損、不足' },
  ],
  'n3-1513': [
    { kind: 'antonym', id: 'n4-041', word: '丁寧', reading: 'ていねい', meaning: '有禮貌、仔細' },
  ],
  'n3-1535': [
    { kind: 'antonym', id: 'n2-449', word: '有能', reading: 'ゆうのう', meaning: '能幹' },
  ],
  'n3-1536': [
    { kind: 'antonym', id: 'n2-448', word: '有効', reading: 'ゆうこう', meaning: '有效' },
  ],
  'n3-1538': [
    { kind: 'antonym', id: 'n5-078', word: '有名', reading: 'ゆうめい', meaning: '有名' },
  ],
  'n3-1545': [
    { kind: 'antonym', id: 'n4-078', word: '必要', reading: 'ひつよう', meaning: '必要' },
  ],
  'n3-1547': [
    { kind: 'antonym', id: 'n3-1548', word: '可能', reading: 'かのう', meaning: '可能、可行' },
  ],
  'n3-1548': [
    { kind: 'antonym', id: 'n3-1547', word: '不可能', reading: 'ふかのう', meaning: '不可能' },
  ],
  'n3-1587': [
    { kind: 'antonym', id: 'n2-428', word: '好調', reading: 'こうちょう', meaning: '順利' },
  ],
  'n3-1590': [
    { kind: 'antonym', id: 'n4-409', word: '真面目', reading: 'まじめ', meaning: '認真' },
  ],
  'n3-1613': [
    {
      kind: 'antonym',
      id: 'n3-1614',
      word: '肯定的',
      reading: 'こうていてき',
      meaning: '肯定的、正面的',
    },
  ],
  'n3-1614': [
    { kind: 'antonym', id: 'n3-1613', word: '否定的', reading: 'ひていてき', meaning: '否定的' },
  ],
  'n3-1635': [
    { kind: 'antonym', id: 'n3-1636', word: '悲観的', reading: 'ひかんてき', meaning: '悲觀的' },
  ],
  'n3-1636': [
    { kind: 'antonym', id: 'n3-1635', word: '楽観的', reading: 'らっかんてき', meaning: '樂觀的' },
  ],
  'n3-1721': [
    {
      kind: 'antonym',
      id: 'n3-1722',
      word: 'プラス',
      reading: 'プラス',
      meaning: '正、加分、有利',
    },
  ],
  'n3-1722': [
    {
      kind: 'antonym',
      id: 'n3-1721',
      word: 'マイナス',
      reading: 'マイナス',
      meaning: '負、減分、不利',
    },
  ],
  'n3-1978': [
    {
      kind: 'antonym',
      id: 'n4-1081',
      word: '低下',
      reading: 'ていか',
      meaning: '下降、降低（程度）',
    },
  ],
  'n3-1986': [
    { kind: 'antonym', id: 'n3-1988', word: '公立', reading: 'こうりつ', meaning: '公立' },
  ],
  'n3-1988': [{ kind: 'antonym', id: 'n3-1986', word: '私立', reading: 'しりつ', meaning: '私立' }],
  'n3-2221': [
    { kind: 'synonym', id: 'n3-044', word: '守る', reading: 'まもる', meaning: '保護、遵守' },
  ],
  'n3-2256': [
    {
      kind: 'antonym',
      id: 'n3-2257',
      word: '入社',
      reading: 'にゅうしゃ',
      meaning: '進入公司任職',
    },
  ],
  'n3-2257': [
    {
      kind: 'antonym',
      id: 'n3-2256',
      word: '退社',
      reading: 'たいしゃ',
      meaning: '離職、下班離開公司',
    },
  ],
};
