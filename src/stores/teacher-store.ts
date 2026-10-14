import { TEACHER_MODELS, type TeacherModelKey } from '@/lib/local-llm-models';

import { createPersistedStore, usePersistedStore } from './persisted-store';

const DEFAULT_MODEL: TeacherModelKey = 'chinese';

const teacherModelStore = createPersistedStore<TeacherModelKey>({
  key: 'teacher-model',
  initial: DEFAULT_MODEL,
  serialize: (key) => key,
  deserialize: (raw) => (raw in TEACHER_MODELS ? (raw as TeacherModelKey) : null),
});

export function setTeacherModel(key: TeacherModelKey) {
  if (key !== teacherModelStore.get()) teacherModelStore.set(key);
}

/** AI 老師選用的模型（中文解說／日文專家），會記住到下次開啟 */
export function useTeacherModel(): TeacherModelKey {
  return usePersistedStore(teacherModelStore, DEFAULT_MODEL);
}
