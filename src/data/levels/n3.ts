import { N3_GRAMMAR } from '../grammar/n3';
import { N3_GRAMMAR_NOTES } from '../grammar/notes/n3';
import { withNotes } from '../grammar/types';
import { N3_READING } from '../reading/n3';
import { N3_EXAMPLES } from '../vocab/examples/n3';
import { N3_FREQUENCY } from '../vocab/frequency/n3';
import { N3_WORDS } from '../vocab/n3';
import { withExamples } from '../vocab/with-examples';

import type { LevelData } from '@/data/level-data';

/** N3 的單字（含例句）、文法和閱讀文章；用到 N3 時才載入（見 data/level-data.ts） */
export const LEVEL_DATA: LevelData = {
  words: withExamples(N3_WORDS, N3_EXAMPLES, { frequency: N3_FREQUENCY }),
  grammar: withNotes(N3_GRAMMAR, N3_GRAMMAR_NOTES),
  reading: N3_READING,
};
