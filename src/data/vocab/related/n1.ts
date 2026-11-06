import type { WordRelation } from '../types';

/** N1 單字的同義詞、反義詞（由 scripts/build-word-relations.js 產生，不要手動修改） */
export const N1_RELATED: Record<string, WordRelation[]> = {
  'n1-010': [
    { kind: 'synonym', id: 'n2-071', word: '著しい', reading: 'いちじるしい', meaning: '明顯的' },
  ],
  'n1-011': [
    { kind: 'synonym', id: 'n1-140', word: '綿密', reading: 'めんみつ', meaning: '綿密' },
    { kind: 'synonym', id: 'n2-1621', word: '精密', reading: 'せいみつ', meaning: '精密' },
  ],
  'n1-015': [{ kind: 'synonym', id: 'n2-008', word: '曖昧', reading: 'あいまい', meaning: '曖昧' }],
  'n1-068': [
    {
      kind: 'synonym',
      id: 'n2-1575',
      word: '面倒臭い',
      reading: 'めんどうくさい',
      meaning: '非常麻煩、懶得做',
    },
  ],
  'n1-073': [{ kind: 'synonym', id: 'n2-140', word: '頑固', reading: 'がんこ', meaning: '頑固' }],
  'n1-075': [
    { kind: 'antonym', id: 'n2-1610', word: '厳格', reading: 'げんかく', meaning: '嚴格、嚴厲' },
  ],
  'n1-076': [
    { kind: 'synonym', id: 'n1-423', word: '速やか', reading: 'すみやか', meaning: '盡速' },
    { kind: 'synonym', id: 'n2-1567', word: '素早い', reading: 'すばやい', meaning: '迅速、敏捷' },
  ],
  'n1-079': [
    { kind: 'synonym', id: 'n2-1797', word: '粗雑', reading: 'そざつ', meaning: '粗糙草率' },
  ],
  'n1-080': [{ kind: 'synonym', id: 'n2-447', word: '明白', reading: 'めいはく', meaning: '明白' }],
  'n1-140': [{ kind: 'synonym', id: 'n1-011', word: '緻密', reading: 'ちみつ', meaning: '縝密' }],
  'n1-263': [{ kind: 'antonym', id: 'n2-322', word: '利益', reading: 'りえき', meaning: '利益' }],
  'n1-293': [{ kind: 'antonym', id: 'n2-837', word: '原告', reading: 'げんこく', meaning: '原告' }],
  'n1-407': [
    {
      kind: 'antonym',
      id: 'n2-1636',
      word: '濃厚',
      reading: 'のうこう',
      meaning: '濃厚；（可能性）很大',
    },
  ],
  'n1-420': [
    { kind: 'antonym', id: 'n2-1138', word: '急激', reading: 'きゅうげき', meaning: '急遽的' },
  ],
  'n1-423': [{ kind: 'synonym', id: 'n1-076', word: '迅速', reading: 'じんそく', meaning: '迅速' }],
  'n1-432': [{ kind: 'synonym', id: 'n4-150', word: 'もし', reading: 'もし', meaning: '如果' }],
  'n1-577': [{ kind: 'antonym', id: 'n1-578', word: '楽観', reading: 'らっかん', meaning: '樂觀' }],
  'n1-578': [{ kind: 'antonym', id: 'n1-577', word: '悲観', reading: 'ひかん', meaning: '悲觀' }],
  'n1-579': [
    { kind: 'antonym', id: 'n1-580', word: '客観', reading: 'きゃっかん', meaning: '客觀' },
  ],
  'n1-580': [{ kind: 'antonym', id: 'n1-579', word: '主観', reading: 'しゅかん', meaning: '主觀' }],
  'n1-1079': [
    { kind: 'antonym', id: 'n2-1650', word: '有益', reading: 'ゆうえき', meaning: '有益' },
  ],
  'n1-1526': [
    { kind: 'synonym', id: 'n5-087', word: '時々', reading: 'ときどき', meaning: '有時候' },
  ],
  'n1-1551': [{ kind: 'synonym', id: 'n2-418', word: '愚か', reading: 'おろか', meaning: '愚蠢' }],
  'n1-1558': [
    { kind: 'antonym', id: 'n2-432', word: '柔軟', reading: 'じゅうなん', meaning: '靈活' },
  ],
  'n1-1559': [
    { kind: 'antonym', id: 'n2-424', word: '謙虚', reading: 'けんきょ', meaning: '謙虛' },
  ],
  'n1-1566': [
    {
      kind: 'synonym',
      id: 'n2-1765',
      word: '懸命',
      reading: 'けんめい',
      meaning: '拼命、全力以赴',
    },
  ],
  'n1-1616': [
    {
      kind: 'antonym',
      id: 'n1-1617',
      word: 'メジャー',
      reading: 'メジャー',
      meaning: '主流、知名',
    },
  ],
  'n1-1617': [
    {
      kind: 'antonym',
      id: 'n1-1616',
      word: 'マイナー',
      reading: 'マイナー',
      meaning: '冷門、小眾',
    },
  ],
  'n1-1620': [
    { kind: 'antonym', id: 'n2-1902', word: 'デジタル', reading: 'デジタル', meaning: '數位' },
  ],
  'n1-1633': [
    { kind: 'synonym', id: 'n2-1599', word: '大まか', reading: 'おおまか', meaning: '大致、粗略' },
  ],
  'n1-1649': [
    { kind: 'antonym', id: 'n1-1650', word: 'ライト', reading: 'ライト', meaning: '輕量、清淡' },
  ],
  'n1-1650': [
    { kind: 'antonym', id: 'n1-1649', word: 'ヘビー', reading: 'ヘビー', meaning: '沉重、重度' },
  ],
  'n1-1729': [{ kind: 'synonym', id: 'n2-450', word: '容易', reading: 'ようい', meaning: '容易' }],
};
