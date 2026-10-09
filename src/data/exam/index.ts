import type { JlptLevel } from '@/data/vocab';

import { N1_EXAM } from './n1';
import { N2_EXAM } from './n2';
import { N3_EXAM } from './n3';
import { N4_EXAM } from './n4';
import { N5_EXAM } from './n5';
import type { ExamQuestion } from './types';

export { EXAM_SECTION_TYPES, EXAM_TYPE_LABELS, EXAM_TYPE_PROMPTS } from './types';
export type {
  ExamQuestion,
  ExamQuestionType,
  ExamSection,
  ScriptLine,
  ScriptSpeaker,
} from './types';

export const EXAM_BY_LEVEL: Record<JlptLevel, ExamQuestion[]> = {
  N5: N5_EXAM,
  N4: N4_EXAM,
  N3: N3_EXAM,
  N2: N2_EXAM,
  N1: N1_EXAM,
};
