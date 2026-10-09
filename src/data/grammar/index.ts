import type { JlptLevel } from '@/data/vocab';

import { N1_GRAMMAR } from './n1';
import { N2_GRAMMAR } from './n2';
import { N3_GRAMMAR } from './n3';
import { N4_GRAMMAR } from './n4';
import { N5_GRAMMAR } from './n5';
import type { GrammarPoint } from './types';

export type { GrammarPoint } from './types';

export const GRAMMAR_BY_LEVEL: Record<JlptLevel, GrammarPoint[]> = {
  N5: N5_GRAMMAR,
  N4: N4_GRAMMAR,
  N3: N3_GRAMMAR,
  N2: N2_GRAMMAR,
  N1: N1_GRAMMAR,
};
