import { N2_GRAMMAR } from '../grammar/n2';
import { N2_READING } from '../reading/n2';
import { N2_EXAMPLES } from '../vocab/examples/n2';
import { N2_WORDS } from '../vocab/n2';
import { withExamples } from '../vocab/with-examples';

import type { LevelData } from '@/data/level-data';

/** N2 的單字（含例句）、文法和閱讀文章；用到 N2 時才載入（見 data/level-data.ts） */
export const LEVEL_DATA: LevelData = {
  words: withExamples(N2_WORDS, N2_EXAMPLES),
  grammar: N2_GRAMMAR,
  reading: N2_READING,
};
