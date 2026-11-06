import type { WordRelation } from '../types';

/** N2 單字的同義詞、反義詞（由 scripts/build-word-relations.js 產生，不要手動修改） */
export const N2_RELATED: Record<string, WordRelation[]> = {
  'n2-008': [
    { kind: 'antonym', id: 'n2-038', word: '明確', reading: 'めいかく', meaning: '明確' },
    { kind: 'synonym', id: 'n1-015', word: '漠然', reading: 'ばくぜん', meaning: '模糊、籠統' },
  ],
  'n2-009': [
    { kind: 'antonym', id: 'n2-1740', word: '軽率', reading: 'けいそつ', meaning: '輕率、草率' },
  ],
  'n2-010': [
    {
      kind: 'antonym',
      id: 'n2-1855',
      word: '衝動的',
      reading: 'しょうどうてき',
      meaning: '衝動的',
    },
  ],
  'n2-028': [
    { kind: 'antonym', id: 'n2-848', word: '加害者', reading: 'かがいしゃ', meaning: '加害者' },
  ],
  'n2-038': [
    { kind: 'antonym', id: 'n2-008', word: '曖昧', reading: 'あいまい', meaning: '曖昧' },
    {
      kind: 'antonym',
      id: 'n2-1814',
      word: '不確か',
      reading: 'ふたしか',
      meaning: '不確定、不可靠',
    },
  ],
  'n2-071': [{ kind: 'synonym', id: 'n1-010', word: '顕著', reading: 'けんちょ', meaning: '顯著' }],
  'n2-072': [{ kind: 'synonym', id: 'n3-037', word: '怖い', reading: 'こわい', meaning: '可怕的' }],
  'n2-080': [
    { kind: 'antonym', id: 'n2-081', word: '派手', reading: 'はで', meaning: '華麗、花俏' },
  ],
  'n2-081': [{ kind: 'antonym', id: 'n2-080', word: '地味', reading: 'じみ', meaning: '樸素' }],
  'n2-094': [{ kind: 'synonym', id: 'n5-091', word: 'すぐ', reading: 'すぐ', meaning: '馬上' }],
  'n2-132': [{ kind: 'synonym', id: 'n5-014', word: '見る', reading: 'みる', meaning: '看' }],
  'n2-140': [
    { kind: 'synonym', id: 'n2-1850', word: '強情', reading: 'ごうじょう', meaning: '固執、倔強' },
    { kind: 'synonym', id: 'n1-073', word: '頑な', reading: 'かたくな', meaning: '頑固' },
  ],
  'n2-155': [{ kind: 'synonym', id: 'n4-127', word: '頼む', reading: 'たのむ', meaning: '拜託' }],
  'n2-190': [
    { kind: 'synonym', id: 'n4-027', word: '続ける', reading: 'つづける', meaning: '繼續' },
  ],
  'n2-191': [
    { kind: 'antonym', id: 'n4-563', word: '出席', reading: 'しゅっせき', meaning: '出席' },
  ],
  'n2-193': [{ kind: 'antonym', id: 'n3-363', word: '例外', reading: 'れいがい', meaning: '例外' }],
  'n2-221': [
    { kind: 'synonym', id: 'n5-730', word: '終える', reading: 'おえる', meaning: '結束、做完' },
  ],
  'n2-222': [
    { kind: 'antonym', id: 'n2-223', word: '供給', reading: 'きょうきゅう', meaning: '供給' },
  ],
  'n2-223': [{ kind: 'antonym', id: 'n2-222', word: '需要', reading: 'じゅよう', meaning: '需求' }],
  'n2-227': [{ kind: 'antonym', id: 'n4-235', word: '生産', reading: 'せいさん', meaning: '生產' }],
  'n2-244': [{ kind: 'synonym', id: 'n4-056', word: '選ぶ', reading: 'えらぶ', meaning: '選擇' }],
  'n2-260': [{ kind: 'antonym', id: 'n2-2027', word: '具体', reading: 'ぐたい', meaning: '具體' }],
  'n2-291': [
    { kind: 'synonym', id: 'n4-026', word: '比べる', reading: 'くらべる', meaning: '比較' },
  ],
  'n2-309': [{ kind: 'antonym', id: 'n3-499', word: '不満', reading: 'ふまん', meaning: '不滿' }],
  'n2-322': [{ kind: 'antonym', id: 'n1-263', word: '損失', reading: 'そんしつ', meaning: '損失' }],
  'n2-323': [
    { kind: 'synonym', id: 'n5-405', word: '分かる', reading: 'わかる', meaning: '懂、知道' },
  ],
  'n2-344': [
    { kind: 'antonym', id: 'n3-1344', word: '満ちる', reading: 'みちる', meaning: '充滿；(潮)漲' },
  ],
  'n2-347': [{ kind: 'synonym', id: 'n5-031', word: '話す', reading: 'はなす', meaning: '說話' }],
  'n2-364': [
    { kind: 'synonym', id: 'n3-421', word: '助ける', reading: 'たすける', meaning: '幫助、救' },
  ],
  'n2-367': [{ kind: 'synonym', id: 'n5-030', word: '聞く', reading: 'きく', meaning: '聽、問' }],
  'n2-415': [{ kind: 'synonym', id: 'n2-1600', word: '温和', reading: 'おんわ', meaning: '溫和' }],
  'n2-417': [
    { kind: 'antonym', id: 'n2-1624', word: '大胆', reading: 'だいたん', meaning: '大膽' },
  ],
  'n2-418': [
    { kind: 'antonym', id: 'n3-080', word: '賢い', reading: 'かしこい', meaning: '聰明的' },
    {
      kind: 'synonym',
      id: 'n1-1551',
      word: '浅はか',
      reading: 'あさはか',
      meaning: '膚淺、考慮不周',
    },
  ],
  'n2-421': [{ kind: 'antonym', id: 'n2-1614', word: '豪華', reading: 'ごうか', meaning: '豪華' }],
  'n2-424': [
    { kind: 'antonym', id: 'n1-1559', word: '傲慢', reading: 'ごうまん', meaning: '傲慢' },
  ],
  'n2-427': [
    { kind: 'antonym', id: 'n2-1112', word: '不公平', reading: 'ふこうへい', meaning: '不公平' },
  ],
  'n2-428': [
    { kind: 'antonym', id: 'n3-1587', word: '不調', reading: 'ふちょう', meaning: '狀況不佳' },
  ],
  'n2-432': [
    { kind: 'antonym', id: 'n1-1558', word: '強硬', reading: 'きょうこう', meaning: '強硬' },
  ],
  'n2-440': [{ kind: 'antonym', id: 'n2-441', word: '敏感', reading: 'びんかん', meaning: '敏感' }],
  'n2-441': [
    { kind: 'antonym', id: 'n2-440', word: '鈍感', reading: 'どんかん', meaning: '不敏感' },
  ],
  'n2-442': [
    { kind: 'synonym', id: 'n2-443', word: '膨大', reading: 'ぼうだい', meaning: '龐大' },
    { kind: 'synonym', id: 'n2-1744', word: '巨大', reading: 'きょだい', meaning: '巨大、龐大' },
  ],
  'n2-443': [{ kind: 'synonym', id: 'n2-442', word: '莫大', reading: 'ばくだい', meaning: '巨大' }],
  'n2-447': [{ kind: 'synonym', id: 'n1-080', word: '歴然', reading: 'れきぜん', meaning: '明顯' }],
  'n2-448': [{ kind: 'antonym', id: 'n3-1536', word: '無効', reading: 'むこう', meaning: '無效' }],
  'n2-449': [{ kind: 'antonym', id: 'n3-1535', word: '無能', reading: 'むのう', meaning: '無能' }],
  'n2-450': [
    { kind: 'synonym', id: 'n4-007', word: '簡単', reading: 'かんたん', meaning: '簡單' },
    {
      kind: 'synonym',
      id: 'n1-1729',
      word: 'たやすい',
      reading: 'たやすい',
      meaning: '容易、輕而易舉',
    },
  ],
  'n2-506': [
    { kind: 'antonym', id: 'n3-197', word: '感情', reading: 'かんじょう', meaning: '感情' },
  ],
  'n2-524': [{ kind: 'synonym', id: 'n5-208', word: '体', reading: 'からだ', meaning: '身體' }],
  'n2-525': [{ kind: 'antonym', id: 'n3-283', word: '精神', reading: 'せいしん', meaning: '精神' }],
  'n2-559': [
    { kind: 'antonym', id: 'n2-2106', word: '誕生', reading: 'たんじょう', meaning: '誕生、出生' },
  ],
  'n2-702': [{ kind: 'antonym', id: 'n2-703', word: '支出', reading: 'ししゅつ', meaning: '支出' }],
  'n2-703': [
    { kind: 'antonym', id: 'n2-702', word: '収入', reading: 'しゅうにゅう', meaning: '收入' },
  ],
  'n2-732': [
    { kind: 'antonym', id: 'n2-733', word: '黒字', reading: 'くろじ', meaning: '盈餘、獲利' },
  ],
  'n2-733': [
    { kind: 'antonym', id: 'n2-732', word: '赤字', reading: 'あかじ', meaning: '赤字、虧損' },
  ],
  'n2-738': [{ kind: 'synonym', id: 'n5-227', word: '会社', reading: 'かいしゃ', meaning: '公司' }],
  'n2-752': [
    { kind: 'synonym', id: 'n4-114', word: '給料', reading: 'きゅうりょう', meaning: '薪水' },
  ],
  'n2-753': [
    { kind: 'synonym', id: 'n4-114', word: '給料', reading: 'きゅうりょう', meaning: '薪水' },
  ],
  'n2-837': [{ kind: 'antonym', id: 'n1-293', word: '被告', reading: 'ひこく', meaning: '被告' }],
  'n2-848': [
    { kind: 'antonym', id: 'n2-028', word: '被害者', reading: 'ひがいしゃ', meaning: '受害者' },
  ],
  'n2-996': [{ kind: 'antonym', id: 'n2-997', word: '合法', reading: 'ごうほう', meaning: '合法' }],
  'n2-997': [{ kind: 'antonym', id: 'n2-996', word: '違法', reading: 'いほう', meaning: '違法' }],
  'n2-1011': [{ kind: 'synonym', id: 'n5-225', word: '国', reading: 'くに', meaning: '國家' }],
  'n2-1097': [
    { kind: 'antonym', id: 'n2-1098', word: '私的', reading: 'してき', meaning: '私人的' },
  ],
  'n2-1098': [
    {
      kind: 'antonym',
      id: 'n2-1097',
      word: '公的',
      reading: 'こうてき',
      meaning: '公家的、公共的',
    },
  ],
  'n2-1101': [
    {
      kind: 'antonym',
      id: 'n2-1102',
      word: '消極的',
      reading: 'しょうきょくてき',
      meaning: '消極的',
    },
  ],
  'n2-1102': [
    {
      kind: 'antonym',
      id: 'n2-1101',
      word: '積極的',
      reading: 'せっきょくてき',
      meaning: '積極的',
    },
  ],
  'n2-1103': [
    {
      kind: 'antonym',
      id: 'n2-1653',
      word: '抽象的',
      reading: 'ちゅうしょうてき',
      meaning: '抽象的',
    },
  ],
  'n2-1104': [
    { kind: 'antonym', id: 'n2-1105', word: '主観的', reading: 'しゅかんてき', meaning: '主觀的' },
  ],
  'n2-1105': [
    {
      kind: 'antonym',
      id: 'n2-1104',
      word: '客観的',
      reading: 'きゃっかんてき',
      meaning: '客觀的',
    },
  ],
  'n2-1112': [
    { kind: 'antonym', id: 'n2-427', word: '公平', reading: 'こうへい', meaning: '公平' },
  ],
  'n2-1120': [
    { kind: 'antonym', id: 'n2-1611', word: '高価', reading: 'こうか', meaning: '高價、昂貴' },
  ],
  'n2-1121': [
    { kind: 'antonym', id: 'n2-1122', word: '無力', reading: 'むりょく', meaning: '無力的' },
  ],
  'n2-1122': [
    { kind: 'antonym', id: 'n2-1121', word: '有力', reading: 'ゆうりょく', meaning: '有力的' },
  ],
  'n2-1123': [
    { kind: 'antonym', id: 'n3-135', word: '正確', reading: 'せいかく', meaning: '正確' },
  ],
  'n2-1126': [
    { kind: 'antonym', id: 'n2-1127', word: '貧乏', reading: 'びんぼう', meaning: '貧窮' },
  ],
  'n2-1127': [
    { kind: 'antonym', id: 'n2-1126', word: '裕福', reading: 'ゆうふく', meaning: '富裕' },
  ],
  'n2-1129': [
    { kind: 'antonym', id: 'n2-1130', word: '割安', reading: 'わりやす', meaning: '相對划算' },
  ],
  'n2-1130': [
    { kind: 'antonym', id: 'n2-1129', word: '割高', reading: 'わりだか', meaning: '相對較貴' },
  ],
  'n2-1136': [{ kind: 'antonym', id: 'n2-1137', word: '小幅', reading: 'こはば', meaning: '小幅' }],
  'n2-1137': [
    { kind: 'antonym', id: 'n2-1136', word: '大幅', reading: 'おおはば', meaning: '大幅' },
  ],
  'n2-1138': [
    { kind: 'antonym', id: 'n1-420', word: '緩やか', reading: 'ゆるやか', meaning: '緩和' },
  ],
  'n2-1155': [
    { kind: 'antonym', id: 'n2-1156', word: '干潮', reading: 'かんちょう', meaning: '乾潮、低潮' },
  ],
  'n2-1156': [
    { kind: 'antonym', id: 'n2-1155', word: '満潮', reading: 'まんちょう', meaning: '滿潮' },
  ],
  'n2-1469': [
    {
      kind: 'antonym',
      id: 'n5-733',
      word: '上る',
      reading: 'のぼる',
      meaning: '上去、往上爬（階梯等）',
    },
  ],
  'n2-1567': [
    { kind: 'synonym', id: 'n1-076', word: '迅速', reading: 'じんそく', meaning: '迅速' },
  ],
  'n2-1568': [
    {
      kind: 'synonym',
      id: 'n2-1577',
      word: '喧しい',
      reading: 'やかましい',
      meaning: '吵雜；嘮叨、挑剔',
    },
  ],
  'n2-1575': [
    { kind: 'synonym', id: 'n1-068', word: '煩わしい', reading: 'わずらわしい', meaning: '煩人的' },
  ],
  'n2-1577': [
    { kind: 'synonym', id: 'n2-1579', word: '煩い', reading: 'うるさい', meaning: '吵；囉嗦' },
    {
      kind: 'synonym',
      id: 'n2-1568',
      word: '騒々しい',
      reading: 'そうぞうしい',
      meaning: '吵鬧、喧嚷',
    },
  ],
  'n2-1579': [
    {
      kind: 'synonym',
      id: 'n2-1577',
      word: '喧しい',
      reading: 'やかましい',
      meaning: '吵雜；嘮叨、挑剔',
    },
  ],
  'n2-1584': [
    { kind: 'synonym', id: 'n2-1601', word: '快適', reading: 'かいてき', meaning: '舒適' },
  ],
  'n2-1594': [
    { kind: 'antonym', id: 'n2-1595', word: '陽気', reading: 'ようき', meaning: '開朗、快活' },
  ],
  'n2-1595': [
    { kind: 'antonym', id: 'n2-1594', word: '陰気', reading: 'いんき', meaning: '陰沉、憂鬱' },
    { kind: 'synonym', id: 'n2-1642', word: '朗らか', reading: 'ほがらか', meaning: '開朗、爽朗' },
  ],
  'n2-1597': [
    { kind: 'synonym', id: 'n2-1652', word: '和やか', reading: 'なごやか', meaning: '和睦、融洽' },
  ],
  'n2-1599': [
    {
      kind: 'synonym',
      id: 'n2-1741',
      word: '大ざっぱ',
      reading: 'おおざっぱ',
      meaning: '粗枝大葉、大而化之',
    },
    {
      kind: 'synonym',
      id: 'n1-1633',
      word: 'アバウト',
      reading: 'アバウト',
      meaning: '大概、馬虎',
    },
  ],
  'n2-1600': [
    { kind: 'synonym', id: 'n2-415', word: '穏やか', reading: 'おだやか', meaning: '平穩' },
  ],
  'n2-1601': [
    {
      kind: 'synonym',
      id: 'n2-1584',
      word: '心地よい',
      reading: 'ここちよい',
      meaning: '舒適、愜意',
    },
  ],
  'n2-1603': [
    {
      kind: 'synonym',
      id: 'n2-1648',
      word: '明快',
      reading: 'めいかい',
      meaning: '明快、清楚易懂',
    },
  ],
  'n2-1609': [
    { kind: 'antonym', id: 'n2-1625', word: '怠惰', reading: 'たいだ', meaning: '懶惰、怠惰' },
  ],
  'n2-1610': [
    { kind: 'antonym', id: 'n1-075', word: '寛大', reading: 'かんだい', meaning: '寬大' },
  ],
  'n2-1611': [{ kind: 'antonym', id: 'n2-1120', word: '安価', reading: 'あんか', meaning: '低廉' }],
  'n2-1614': [
    { kind: 'antonym', id: 'n2-1616', word: '質素', reading: 'しっそ', meaning: '樸素、簡樸' },
    { kind: 'antonym', id: 'n2-421', word: '簡素', reading: 'かんそ', meaning: '簡樸' },
  ],
  'n2-1616': [{ kind: 'antonym', id: 'n2-1614', word: '豪華', reading: 'ごうか', meaning: '豪華' }],
  'n2-1618': [
    { kind: 'antonym', id: 'n2-1619', word: '下品', reading: 'げひん', meaning: '粗俗、低俗' },
  ],
  'n2-1619': [
    {
      kind: 'antonym',
      id: 'n2-1618',
      word: '上品',
      reading: 'じょうひん',
      meaning: '高雅、有品味',
    },
  ],
  'n2-1621': [{ kind: 'synonym', id: 'n1-011', word: '緻密', reading: 'ちみつ', meaning: '縝密' }],
  'n2-1624': [
    { kind: 'antonym', id: 'n2-417', word: '臆病', reading: 'おくびょう', meaning: '膽小' },
  ],
  'n2-1625': [
    { kind: 'antonym', id: 'n2-1609', word: '勤勉', reading: 'きんべん', meaning: '勤勉' },
  ],
  'n2-1626': [
    { kind: 'antonym', id: 'n2-1628', word: '単調', reading: 'たんちょう', meaning: '單調' },
  ],
  'n2-1628': [
    { kind: 'antonym', id: 'n2-1626', word: '多彩', reading: 'たさい', meaning: '多彩、多樣' },
  ],
  'n2-1636': [
    { kind: 'antonym', id: 'n1-407', word: '淡泊', reading: 'たんぱく', meaning: '淡泊' },
  ],
  'n2-1642': [
    { kind: 'synonym', id: 'n2-1595', word: '陽気', reading: 'ようき', meaning: '開朗、快活' },
  ],
  'n2-1645': [
    { kind: 'synonym', id: 'n5-442', word: '立派', reading: 'りっぱ', meaning: '出色、雄偉' },
  ],
  'n2-1648': [
    { kind: 'synonym', id: 'n2-1603', word: '簡潔', reading: 'かんけつ', meaning: '簡潔' },
  ],
  'n2-1650': [
    { kind: 'antonym', id: 'n1-1079', word: '有害', reading: 'ゆうがい', meaning: '有害' },
  ],
  'n2-1652': [
    { kind: 'synonym', id: 'n2-1597', word: '円満', reading: 'えんまん', meaning: '圓滿、和睦' },
  ],
  'n2-1653': [
    { kind: 'antonym', id: 'n2-1103', word: '具体的', reading: 'ぐたいてき', meaning: '具體的' },
  ],
  'n2-1740': [
    { kind: 'antonym', id: 'n2-009', word: '慎重', reading: 'しんちょう', meaning: '慎重' },
  ],
  'n2-1741': [
    { kind: 'synonym', id: 'n2-1599', word: '大まか', reading: 'おおまか', meaning: '大致、粗略' },
  ],
  'n2-1744': [
    { kind: 'synonym', id: 'n2-442', word: '莫大', reading: 'ばくだい', meaning: '巨大' },
  ],
  'n2-1765': [
    {
      kind: 'synonym',
      id: 'n1-1566',
      word: 'ひたむき',
      reading: 'ひたむき',
      meaning: '全心全意、專注',
    },
  ],
  'n2-1797': [{ kind: 'synonym', id: 'n1-079', word: '杜撰', reading: 'ずさん', meaning: '草率' }],
  'n2-1805': [
    { kind: 'antonym', id: 'n5-902', word: '不健康', reading: 'ふけんこう', meaning: '不健康' },
  ],
  'n2-1814': [
    { kind: 'antonym', id: 'n2-038', word: '明確', reading: 'めいかく', meaning: '明確' },
  ],
  'n2-1850': [{ kind: 'synonym', id: 'n2-140', word: '頑固', reading: 'がんこ', meaning: '頑固' }],
  'n2-1855': [
    { kind: 'antonym', id: 'n2-010', word: '冷静', reading: 'れいせい', meaning: '冷靜' },
  ],
  'n2-1859': [
    {
      kind: 'antonym',
      id: 'n2-1860',
      word: '現実的',
      reading: 'げんじつてき',
      meaning: '現實的、實際的',
    },
  ],
  'n2-1860': [
    { kind: 'antonym', id: 'n2-1859', word: '理想的', reading: 'りそうてき', meaning: '理想的' },
  ],
  'n2-1868': [
    { kind: 'antonym', id: 'n2-1869', word: '閉鎖的', reading: 'へいさてき', meaning: '封閉的' },
  ],
  'n2-1869': [
    {
      kind: 'antonym',
      id: 'n2-1868',
      word: '開放的',
      reading: 'かいほうてき',
      meaning: '開放的、開朗的',
    },
  ],
  'n2-1902': [
    {
      kind: 'antonym',
      id: 'n1-1620',
      word: 'アナログ',
      reading: 'アナログ',
      meaning: '類比的、傳統非數位',
    },
  ],
  'n2-2027': [
    { kind: 'antonym', id: 'n2-260', word: '抽象', reading: 'ちゅうしょう', meaning: '抽象' },
  ],
  'n2-2049': [
    { kind: 'antonym', id: 'n3-230', word: '合格', reading: 'ごうかく', meaning: '合格、考上' },
  ],
  'n2-2056': [{ kind: 'synonym', id: 'n5-338', word: '答え', reading: 'こたえ', meaning: '答案' }],
  'n2-2074': [
    { kind: 'synonym', id: 'n5-349', word: '勉強', reading: 'べんきょう', meaning: '讀書' },
  ],
  'n2-2082': [
    { kind: 'synonym', id: 'n3-207', word: '教師', reading: 'きょうし', meaning: '教師' },
  ],
  'n2-2106': [{ kind: 'antonym', id: 'n2-559', word: '死亡', reading: 'しぼう', meaning: '死亡' }],
  'n2-2131': [
    { kind: 'antonym', id: 'n3-290', word: '全体', reading: 'ぜんたい', meaning: '全體' },
  ],
  'n2-2132': [{ kind: 'antonym', id: 'n5-359', word: '全部', reading: 'ぜんぶ', meaning: '全部' }],
  'n2-2135': [
    { kind: 'synonym', id: 'n5-882', word: '普通', reading: 'ふつう', meaning: '普通、一般' },
  ],
};
