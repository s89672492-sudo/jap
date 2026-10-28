import { N3_GRAMMAR } from '../grammar/n3';
import { N3_READING } from '../reading/n3';
import { N3_EXAMPLES } from '../vocab/examples/n3';
import { N3_WORDS } from '../vocab/n3';
import { withExamples } from '../vocab/with-examples';

import type { LevelData } from '@/data/level-data';

/** N3 的單字（含例句）、文法和閱讀文章；用到 N3 時才載入（見 data/level-data.ts） */
export const LEVEL_DATA: LevelData = {
  words: withExamples(N3_WORDS, N3_EXAMPLES),
  grammar: N3_GRAMMAR,
  reading: N3_READING,
};
