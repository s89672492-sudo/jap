import { N4_GRAMMAR } from '../grammar/n4';
import { N4_GRAMMAR_NOTES } from '../grammar/notes/n4';
import { withNotes } from '../grammar/types';
import { N4_READING } from '../reading/n4';
import { N4_EXAMPLES } from '../vocab/examples/n4';
import { N4_FREQUENCY } from '../vocab/frequency/n4';
import { N4_RELATED } from '../vocab/related/n4';
import { N4_WORDS } from '../vocab/n4';
import { withExamples } from '../vocab/with-examples';

import type { LevelData } from '@/data/level-data';

/** N4 的單字（含例句）、文法和閱讀文章；用到 N4 時才載入（見 data/level-data.ts） */
export const LEVEL_DATA: LevelData = {
  words: withExamples(N4_WORDS, N4_EXAMPLES, { frequency: N4_FREQUENCY, related: N4_RELATED }),
  grammar: withNotes(N4_GRAMMAR, N4_GRAMMAR_NOTES),
  reading: N4_READING,
};
