import type { WordRelation } from '../types';

/** N4 單字的同義詞、反義詞（由 scripts/build-word-relations.js 產生，不要手動修改） */
export const N4_RELATED: Record<string, WordRelation[]> = {
  'n4-002': [
    { kind: 'synonym', id: 'n4-314', word: '用意', reading: 'ようい', meaning: '預備、準備好' },
  ],
  'n4-005': [{ kind: 'antonym', id: 'n3-396', word: '配る', reading: 'くばる', meaning: '分發' }],
  'n4-006': [{ kind: 'synonym', id: 'n3-722', word: '決定', reading: 'けってい', meaning: '決定' }],
  'n4-007': [
    { kind: 'antonym', id: 'n4-040', word: '複雑', reading: 'ふくざつ', meaning: '複雜' },
    { kind: 'synonym', id: 'n4-407', word: '易しい', reading: 'やさしい', meaning: '容易的' },
    { kind: 'synonym', id: 'n2-450', word: '容易', reading: 'ようい', meaning: '容易' },
  ],
  'n4-009': [{ kind: 'synonym', id: 'n3-498', word: '不安', reading: 'ふあん', meaning: '不安' }],
  'n4-012': [
    { kind: 'synonym', id: 'n4-1337', word: '風景', reading: 'ふうけい', meaning: '風景、景致' },
  ],
  'n4-014': [{ kind: 'synonym', id: 'n4-201', word: '故障', reading: 'こしょう', meaning: '故障' }],
  'n4-015': [
    { kind: 'antonym', id: 'n4-037', word: '厳しい', reading: 'きびしい', meaning: '嚴格的' },
  ],
  'n4-020': [
    { kind: 'synonym', id: 'n4-858', word: 'ルール', reading: 'ルール', meaning: '規則（比賽等）' },
  ],
  'n4-023': [{ kind: 'synonym', id: 'n3-022', word: '調査', reading: 'ちょうさ', meaning: '調查' }],
  'n4-025': [{ kind: 'synonym', id: 'n3-023', word: '発見', reading: 'はっけん', meaning: '發現' }],
  'n4-026': [{ kind: 'synonym', id: 'n2-291', word: '比較', reading: 'ひかく', meaning: '比較' }],
  'n4-027': [{ kind: 'synonym', id: 'n2-190', word: '継続', reading: 'けいぞく', meaning: '繼續' }],
  'n4-036': [{ kind: 'synonym', id: 'n3-029', word: '危険', reading: 'きけん', meaning: '危險' }],
  'n4-037': [
    { kind: 'antonym', id: 'n4-015', word: '優しい', reading: 'やさしい', meaning: '溫柔的' },
  ],
  'n4-040': [
    { kind: 'antonym', id: 'n4-007', word: '簡単', reading: 'かんたん', meaning: '簡單' },
    { kind: 'antonym', id: 'n3-136', word: '単純', reading: 'たんじゅん', meaning: '單純' },
  ],
  'n4-041': [
    { kind: 'antonym', id: 'n3-1513', word: '乱暴', reading: 'らんぼう', meaning: '粗暴' },
  ],
  'n4-042': [{ kind: 'antonym', id: 'n3-029', word: '危険', reading: 'きけん', meaning: '危險' }],
  'n4-043': [{ kind: 'antonym', id: 'n3-282', word: '成功', reading: 'せいこう', meaning: '成功' }],
  'n4-050': [
    {
      kind: 'synonym',
      id: 'n4-1314',
      word: 'スケジュール',
      reading: 'スケジュール',
      meaning: '行程、時間表',
    },
  ],
  'n4-056': [{ kind: 'synonym', id: 'n2-244', word: '選択', reading: 'せんたく', meaning: '選擇' }],
  'n4-059': [
    { kind: 'synonym', id: 'n4-1215', word: 'びっくり', reading: 'びっくり', meaning: '嚇一跳' },
  ],
  'n4-061': [{ kind: 'antonym', id: 'n4-062', word: '負ける', reading: 'まける', meaning: '輸' }],
  'n4-062': [{ kind: 'antonym', id: 'n4-061', word: '勝つ', reading: 'かつ', meaning: '贏' }],
  'n4-063': [{ kind: 'antonym', id: 'n4-383', word: '拾う', reading: 'ひろう', meaning: '撿' }],
  'n4-067': [{ kind: 'antonym', id: 'n4-068', word: '深い', reading: 'ふかい', meaning: '深的' }],
  'n4-068': [{ kind: 'antonym', id: 'n4-067', word: '浅い', reading: 'あさい', meaning: '淺的' }],
  'n4-069': [
    { kind: 'antonym', id: 'n3-473', word: '硬い', reading: 'かたい', meaning: '堅硬的' },
    { kind: 'antonym', id: 'n4-070', word: '固い', reading: 'かたい', meaning: '硬的' },
  ],
  'n4-070': [
    { kind: 'antonym', id: 'n4-069', word: '柔らかい', reading: 'やわらかい', meaning: '柔軟的' },
  ],
  'n4-075': [
    { kind: 'synonym', id: 'n5-144', word: 'きれい', reading: 'きれい', meaning: '漂亮、乾淨' },
  ],
  'n4-077': [
    { kind: 'synonym', id: 'n4-415', word: '大事', reading: 'だいじ', meaning: '要緊' },
    { kind: 'synonym', id: 'n3-485', word: '重要', reading: 'じゅうよう', meaning: '重要' },
  ],
  'n4-078': [
    { kind: 'antonym', id: 'n3-1545', word: '不要', reading: 'ふよう', meaning: '不需要' },
  ],
  'n4-083': [{ kind: 'synonym', id: 'n4-086', word: '必ず', reading: 'かならず', meaning: '必定' }],
  'n4-086': [{ kind: 'synonym', id: 'n4-083', word: 'きっと', reading: 'きっと', meaning: '一定' }],
  'n4-094': [
    { kind: 'synonym', id: 'n3-067', word: '明らか', reading: 'あきらか', meaning: '明顯' },
  ],
  'n4-096': [{ kind: 'synonym', id: 'n4-444', word: '突然', reading: 'とつぜん', meaning: '忽然' }],
  'n4-107': [
    { kind: 'synonym', id: 'n4-1324', word: 'プラン', reading: 'プラン', meaning: '計畫、方案' },
  ],
  'n4-114': [
    { kind: 'synonym', id: 'n2-752', word: '給与', reading: 'きゅうよ', meaning: '薪資' },
    { kind: 'synonym', id: 'n2-753', word: '賃金', reading: 'ちんぎん', meaning: '工資' },
  ],
  'n4-122': [
    { kind: 'antonym', id: 'n3-378', word: '受け取る', reading: 'うけとる', meaning: '收到' },
  ],
  'n4-123': [{ kind: 'antonym', id: 'n5-400', word: '引く', reading: 'ひく', meaning: '拉、抽' }],
  'n4-124': [
    { kind: 'synonym', id: 'n4-125', word: '考える', reading: 'かんがえる', meaning: '思考' },
  ],
  'n4-125': [
    { kind: 'synonym', id: 'n4-124', word: '思う', reading: 'おもう', meaning: '想、認為' },
  ],
  'n4-127': [{ kind: 'synonym', id: 'n2-155', word: '依頼', reading: 'いらい', meaning: '委託' }],
  'n4-129': [{ kind: 'antonym', id: 'n4-130', word: '泣く', reading: 'なく', meaning: '哭' }],
  'n4-130': [{ kind: 'antonym', id: 'n4-129', word: '笑う', reading: 'わらう', meaning: '笑' }],
  'n4-137': [
    { kind: 'antonym', id: 'n5-144', word: 'きれい', reading: 'きれい', meaning: '漂亮、乾淨' },
  ],
  'n4-138': [{ kind: 'antonym', id: 'n5-423', word: '熱い', reading: 'あつい', meaning: '燙的' }],
  'n4-139': [
    { kind: 'antonym', id: 'n4-140', word: '涼しい', reading: 'すずしい', meaning: '涼爽的' },
  ],
  'n4-140': [
    { kind: 'antonym', id: 'n4-139', word: '暖かい', reading: 'あたたかい', meaning: '溫暖的' },
  ],
  'n4-142': [
    { kind: 'synonym', id: 'n5-858', word: '素敵', reading: 'すてき', meaning: '很棒、漂亮迷人' },
  ],
  'n4-144': [{ kind: 'antonym', id: 'n5-079', word: '便利', reading: 'べんり', meaning: '方便' }],
  'n4-148': [{ kind: 'synonym', id: 'n5-083', word: 'とても', reading: 'とても', meaning: '非常' }],
  'n4-150': [{ kind: 'synonym', id: 'n1-432', word: '仮に', reading: 'かりに', meaning: '假如' }],
  'n4-195': [
    { kind: 'antonym', id: 'n4-196', word: '先輩', reading: 'せんぱい', meaning: '學長姐、前輩' },
  ],
  'n4-196': [
    { kind: 'antonym', id: 'n4-195', word: '後輩', reading: 'こうはい', meaning: '學弟妹、後輩' },
  ],
  'n4-201': [
    { kind: 'synonym', id: 'n4-014', word: '壊れる', reading: 'こわれる', meaning: '壞掉' },
  ],
  'n4-213': [
    { kind: 'synonym', id: 'n3-269', word: '商品', reading: 'しょうひん', meaning: '商品' },
  ],
  'n4-223': [{ kind: 'synonym', id: 'n3-347', word: '未来', reading: 'みらい', meaning: '未來' }],
  'n4-226': [{ kind: 'antonym', id: 'n4-227', word: '男性', reading: 'だんせい', meaning: '男性' }],
  'n4-227': [{ kind: 'antonym', id: 'n4-226', word: '女性', reading: 'じょせい', meaning: '女性' }],
  'n4-235': [{ kind: 'antonym', id: 'n2-227', word: '消費', reading: 'しょうひ', meaning: '消費' }],
  'n4-241': [{ kind: 'antonym', id: 'n3-336', word: '平和', reading: 'へいわ', meaning: '和平' }],
  'n4-243': [{ kind: 'antonym', id: 'n4-244', word: '祖母', reading: 'そぼ', meaning: '祖母' }],
  'n4-244': [{ kind: 'antonym', id: 'n4-243', word: '祖父', reading: 'そふ', meaning: '祖父' }],
  'n4-245': [
    { kind: 'antonym', id: 'n4-246', word: '入院', reading: 'にゅういん', meaning: '住院' },
  ],
  'n4-246': [{ kind: 'antonym', id: 'n4-245', word: '退院', reading: 'たいいん', meaning: '出院' }],
  'n4-252': [{ kind: 'antonym', id: 'n4-253', word: '冷房', reading: 'れいぼう', meaning: '冷氣' }],
  'n4-253': [{ kind: 'antonym', id: 'n4-252', word: '暖房', reading: 'だんぼう', meaning: '暖氣' }],
  'n4-260': [{ kind: 'antonym', id: 'n4-261', word: '夫', reading: 'おっと', meaning: '丈夫' }],
  'n4-261': [{ kind: 'antonym', id: 'n4-260', word: '妻', reading: 'つま', meaning: '妻子' }],
  'n4-304': [{ kind: 'antonym', id: 'n4-305', word: '娘', reading: 'むすめ', meaning: '女兒' }],
  'n4-305': [{ kind: 'antonym', id: 'n4-304', word: '息子', reading: 'むすこ', meaning: '兒子' }],
  'n4-310': [{ kind: 'antonym', id: 'n4-311', word: '輸入', reading: 'ゆにゅう', meaning: '進口' }],
  'n4-311': [{ kind: 'antonym', id: 'n4-310', word: '輸出', reading: 'ゆしゅつ', meaning: '出口' }],
  'n4-314': [{ kind: 'synonym', id: 'n4-002', word: '準備', reading: 'じゅんび', meaning: '準備' }],
  'n4-322': [{ kind: 'antonym', id: 'n4-342', word: '下がる', reading: 'さがる', meaning: '下降' }],
  'n4-329': [{ kind: 'synonym', id: 'n3-337', word: '変化', reading: 'へんか', meaning: '變化' }],
  'n4-334': [{ kind: 'antonym', id: 'n4-375', word: '濡れる', reading: 'ぬれる', meaning: '淋濕' }],
  'n4-342': [
    { kind: 'antonym', id: 'n4-322', word: '上がる', reading: 'あがる', meaning: '上升、上去' },
  ],
  'n4-343': [
    { kind: 'antonym', id: 'n4-974', word: '上げる', reading: 'あげる', meaning: '舉起、提高' },
  ],
  'n4-347': [{ kind: 'antonym', id: 'n4-389', word: '褒める', reading: 'ほめる', meaning: '稱讚' }],
  'n4-354': [{ kind: 'antonym', id: 'n5-400', word: '引く', reading: 'ひく', meaning: '拉、抽' }],
  'n4-364': [
    { kind: 'synonym', id: 'n3-421', word: '助ける', reading: 'たすける', meaning: '幫助、救' },
  ],
  'n4-368': [{ kind: 'synonym', id: 'n3-996', word: '修理', reading: 'しゅうり', meaning: '修理' }],
  'n4-375': [{ kind: 'antonym', id: 'n4-334', word: '乾く', reading: 'かわく', meaning: '乾' }],
  'n4-379': [
    { kind: 'antonym', id: 'n5-730', word: '終える', reading: 'おえる', meaning: '結束、做完' },
  ],
  'n4-383': [{ kind: 'antonym', id: 'n4-063', word: '捨てる', reading: 'すてる', meaning: '丟棄' }],
  'n4-384': [
    { kind: 'antonym', id: 'n4-385', word: '減る', reading: 'へる', meaning: '減少' },
    { kind: 'synonym', id: 'n4-1078', word: '増加', reading: 'ぞうか', meaning: '增加（數量上）' },
  ],
  'n4-385': [
    { kind: 'antonym', id: 'n4-384', word: '増える', reading: 'ふえる', meaning: '增加' },
    {
      kind: 'synonym',
      id: 'n4-1079',
      word: '減少',
      reading: 'げんしょう',
      meaning: '減少（數量上）',
    },
  ],
  'n4-386': [{ kind: 'antonym', id: 'n4-387', word: '痩せる', reading: 'やせる', meaning: '變瘦' }],
  'n4-387': [{ kind: 'antonym', id: 'n4-386', word: '太る', reading: 'ふとる', meaning: '變胖' }],
  'n4-389': [{ kind: 'antonym', id: 'n4-347', word: '叱る', reading: 'しかる', meaning: '斥責' }],
  'n4-407': [
    { kind: 'antonym', id: 'n5-076', word: '難しい', reading: 'むずかしい', meaning: '難的' },
    { kind: 'synonym', id: 'n4-007', word: '簡単', reading: 'かんたん', meaning: '簡單' },
  ],
  'n4-409': [
    { kind: 'antonym', id: 'n3-1590', word: '不真面目', reading: 'ふまじめ', meaning: '不認真' },
  ],
  'n4-415': [
    { kind: 'synonym', id: 'n4-077', word: '大切', reading: 'たいせつ', meaning: '重要、珍惜' },
  ],
  'n4-418': [{ kind: 'antonym', id: 'n4-419', word: '得意', reading: 'とくい', meaning: '擅長' }],
  'n4-419': [
    { kind: 'antonym', id: 'n4-418', word: '苦手', reading: 'にがて', meaning: '不擅長、怕' },
  ],
  'n4-422': [
    { kind: 'antonym', id: 'n3-078', word: '薄い', reading: 'うすい', meaning: '薄的、淡的' },
  ],
  'n4-444': [
    { kind: 'synonym', id: 'n4-096', word: '急に', reading: 'きゅうに', meaning: '突然' },
    {
      kind: 'synonym',
      id: 'n3-087',
      word: 'いきなり',
      reading: 'いきなり',
      meaning: '冷不防、突然',
    },
  ],
  'n4-448': [
    { kind: 'antonym', id: 'n4-449', word: '入学', reading: 'にゅうがく', meaning: '入學' },
  ],
  'n4-449': [
    { kind: 'antonym', id: 'n4-448', word: '卒業', reading: 'そつぎょう', meaning: '畢業' },
  ],
  'n4-450': [{ kind: 'antonym', id: 'n3-536', word: '離婚', reading: 'りこん', meaning: '離婚' }],
  'n4-544': [{ kind: 'synonym', id: 'n5-335', word: '試験', reading: 'しけん', meaning: '考試' }],
  'n4-563': [{ kind: 'antonym', id: 'n2-191', word: '欠席', reading: 'けっせき', meaning: '缺席' }],
  'n4-580': [{ kind: 'antonym', id: 'n3-330', word: '部下', reading: 'ぶか', meaning: '部下' }],
  'n4-604': [
    { kind: 'antonym', id: 'n4-605', word: '退職', reading: 'たいしょく', meaning: '退休、離職' },
  ],
  'n4-605': [
    {
      kind: 'antonym',
      id: 'n4-604',
      word: '就職',
      reading: 'しゅうしょく',
      meaning: '就業、找到工作',
    },
  ],
  'n4-634': [{ kind: 'antonym', id: 'n4-635', word: '始発', reading: 'しはつ', meaning: '首班車' }],
  'n4-635': [
    { kind: 'antonym', id: 'n4-634', word: '終電', reading: 'しゅうでん', meaning: '末班電車' },
  ],
  'n4-645': [{ kind: 'antonym', id: 'n4-646', word: '往復', reading: 'おうふく', meaning: '來回' }],
  'n4-646': [{ kind: 'antonym', id: 'n4-645', word: '片道', reading: 'かたみち', meaning: '單程' }],
  'n4-666': [{ kind: 'synonym', id: 'n5-344', word: '旅行', reading: 'りょこう', meaning: '旅行' }],
  'n4-676': [
    { kind: 'antonym', id: 'n3-311', word: '到着', reading: 'とうちゃく', meaning: '到達' },
  ],
  'n4-678': [
    { kind: 'antonym', id: 'n4-679', word: '海外', reading: 'かいがい', meaning: '海外、國外' },
  ],
  'n4-679': [{ kind: 'antonym', id: 'n4-678', word: '国内', reading: 'こくない', meaning: '國內' }],
  'n4-689': [{ kind: 'synonym', id: 'n3-183', word: '価格', reading: 'かかく', meaning: '價格' }],
  'n4-767': [{ kind: 'antonym', id: 'n4-768', word: '田舎', reading: 'いなか', meaning: '鄉下' }],
  'n4-768': [
    { kind: 'antonym', id: 'n4-767', word: '都会', reading: 'とかい', meaning: '都市、大都會' },
  ],
  'n4-858': [{ kind: 'synonym', id: 'n4-020', word: '規則', reading: 'きそく', meaning: '規則' }],
  'n4-920': [{ kind: 'antonym', id: 'n3-454', word: '冷やす', reading: 'ひやす', meaning: '冰鎮' }],
  'n4-974': [{ kind: 'antonym', id: 'n4-343', word: '下げる', reading: 'さげる', meaning: '降低' }],
  'n4-976': [
    { kind: 'antonym', id: 'n3-1207', word: '点く', reading: 'つく', meaning: '（燈）亮、點著' },
    { kind: 'antonym', id: 'n3-374', word: '現れる', reading: 'あらわれる', meaning: '出現' },
  ],
  'n4-980': [
    { kind: 'antonym', id: 'n3-459', word: '減らす', reading: 'へらす', meaning: '減少（他）' },
  ],
  'n4-1078': [
    {
      kind: 'antonym',
      id: 'n4-1079',
      word: '減少',
      reading: 'げんしょう',
      meaning: '減少（數量上）',
    },
    { kind: 'synonym', id: 'n4-384', word: '増える', reading: 'ふえる', meaning: '增加' },
  ],
  'n4-1079': [
    { kind: 'antonym', id: 'n4-1078', word: '増加', reading: 'ぞうか', meaning: '增加（數量上）' },
    { kind: 'synonym', id: 'n4-385', word: '減る', reading: 'へる', meaning: '減少' },
  ],
  'n4-1081': [
    { kind: 'antonym', id: 'n3-1978', word: '向上', reading: 'こうじょう', meaning: '提升、進步' },
  ],
  'n4-1156': [
    { kind: 'antonym', id: 'n4-1157', word: '最低', reading: 'さいてい', meaning: '最差、最低' },
  ],
  'n4-1157': [
    { kind: 'antonym', id: 'n4-1156', word: '最高', reading: 'さいこう', meaning: '最棒、最高' },
  ],
  'n4-1186': [
    { kind: 'antonym', id: 'n5-436', word: '親切', reading: 'しんせつ', meaning: '親切' },
  ],
  'n4-1215': [
    { kind: 'synonym', id: 'n4-059', word: '驚く', reading: 'おどろく', meaning: '吃驚' },
  ],
  'n4-1269': [{ kind: 'synonym', id: 'n5-146', word: '一番', reading: 'いちばん', meaning: '最' }],
  'n4-1314': [{ kind: 'synonym', id: 'n4-050', word: '予定', reading: 'よてい', meaning: '預定' }],
  'n4-1315': [
    {
      kind: 'antonym',
      id: 'n4-1330',
      word: 'ゴール',
      reading: 'ゴール',
      meaning: '終點；目標；射門得分',
    },
  ],
  'n4-1317': [{ kind: 'synonym', id: 'n3-291', word: '速度', reading: 'そくど', meaning: '速度' }],
  'n4-1320': [{ kind: 'synonym', id: 'n3-101', word: '機会', reading: 'きかい', meaning: '機會' }],
  'n4-1324': [
    { kind: 'synonym', id: 'n4-107', word: '計画', reading: 'けいかく', meaning: '計畫' },
  ],
  'n4-1330': [
    {
      kind: 'antonym',
      id: 'n4-1315',
      word: 'スタート',
      reading: 'スタート',
      meaning: '開始、起跑',
    },
  ],
  'n4-1337': [{ kind: 'synonym', id: 'n4-012', word: '景色', reading: 'けしき', meaning: '景色' }],
  'n4-1344': [
    { kind: 'antonym', id: 'n3-356', word: '有料', reading: 'ゆうりょう', meaning: '收費' },
  ],
  'n4-1345': [
    { kind: 'antonym', id: 'n3-292', word: '損', reading: 'そん', meaning: '損失、吃虧' },
  ],
  'n4-1451': [
    { kind: 'antonym', id: 'n3-224', word: '現実', reading: 'げんじつ', meaning: '現實' },
  ],
};
