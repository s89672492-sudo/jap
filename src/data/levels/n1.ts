import { N1_GRAMMAR } from '../grammar/n1';
import { N1_READING } from '../reading/n1';
import { N1_EXAMPLES } from '../vocab/examples/n1';
import { N1_WORDS } from '../vocab/n1';
import { withExamples } from '../vocab/with-examples';

import type { LevelData } from '@/data/level-data';

/** N1 的單字（含例句）、文法和閱讀文章；用到 N1 時才載入（見 data/level-data.ts） */
export const LEVEL_DATA: LevelData = {
  words: withExamples(N1_WORDS, N1_EXAMPLES),
  grammar: N1_GRAMMAR,
  reading: N1_READING,
};
