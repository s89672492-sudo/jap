import { N5_GRAMMAR } from '../grammar/n5';
import { N5_READING } from '../reading/n5';
import { N5_EXAMPLES } from '../vocab/examples/n5';
import { N5_WORDS } from '../vocab/n5';
import { withExamples } from '../vocab/with-examples';

import type { LevelData } from '@/data/level-data';

/** N5 的單字（含例句）、文法和閱讀文章；用到 N5 時才載入（見 data/level-data.ts） */
export const LEVEL_DATA: LevelData = {
  words: withExamples(N5_WORDS, N5_EXAMPLES),
  grammar: N5_GRAMMAR,
  reading: N5_READING,
};
