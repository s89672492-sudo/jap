import type { JlptLevel } from '@/data/vocab';

import { N1_READING } from './n1';
import { N2_READING } from './n2';
import { N3_READING } from './n3';
import { N4_READING } from './n4';
import { N5_READING } from './n5';
import type { ReadingArticle } from './types';

export type { ReadingArticle } from './types';

export const READING_BY_LEVEL: Record<JlptLevel, ReadingArticle[]> = {
  N5: N5_READING,
  N4: N4_READING,
  N3: N3_READING,
  N2: N2_READING,
  N1: N1_READING,
};
