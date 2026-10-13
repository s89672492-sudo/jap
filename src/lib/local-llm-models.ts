/** AI 日文老師可以選的本地模型（WebLLM 內建清單裡的 Qwen 系列，中文和日文都能回答） */
export type TeacherModelKey = 'light' | 'quality' | 'best';

export type TeacherModel = {
  label: string;
  /** 支援 shader-f16 的裝置用這個（比較省記憶體） */
  f16: string;
  /** 不支援 shader-f16 的裝置改用這個 */
  f32: string;
  /** 第一次下載的大約大小 */
  download: string;
  /** 執行時大約需要的顯示記憶體（MB），來自 WebLLM 的模型設定 */
  memoryMB: number;
  note: string;
};

export const TEACHER_MODELS: Record<TeacherModelKey, TeacherModel> = {
  light: {
    label: '輕量',
    f16: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
    f32: 'Qwen2.5-0.5B-Instruct-q4f32_1-MLC',
    download: '約 0.3 GB',
    memoryMB: 945,
    note: '建議 iPhone 和一般手機使用，回答比較簡單',
  },
  quality: {
    label: '高品質',
    f16: 'Qwen3-1.7B-q4f16_1-MLC',
    f32: 'Qwen3-1.7B-q4f32_1-MLC',
    download: '約 1.0 GB',
    memoryMB: 2037,
    note: 'Qwen3，解說比較完整，建議記憶體 6GB 以上的手機',
  },
  best: {
    label: '最佳',
    f16: 'Qwen3-4B-q4f16_1-MLC',
    f32: 'Qwen3-4B-q4f32_1-MLC',
    download: '約 2.3 GB',
    memoryMB: 3432,
    note: 'Qwen3 最大的版本，回答最好；需要記憶體 8GB 以上的新手機、平板或電腦，iPhone 可能會因記憶體不足重新整理',
  },
};

export const TEACHER_MODEL_KEYS = Object.keys(TEACHER_MODELS) as TeacherModelKey[];

export function modelIdFor(key: TeacherModelKey, f16: boolean): string {
  return f16 ? TEACHER_MODELS[key].f16 : TEACHER_MODELS[key].f32;
}

export type CheckStatus = 'pass' | 'warn' | 'fail';

export type SupportCheck = {
  label: string;
  status: CheckStatus;
  detail: string;
};

export type SupportReport = {
  /** 所有必要條件都通過，可以下載模型 */
  ok: boolean;
  checks: SupportCheck[];
  /** 是否支援 shader-f16（決定用 f16 或 f32 版本的模型） */
  f16: boolean;
  /** 依裝置建議的模型 */
  recommended: TeacherModelKey;
};

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export type LoadProgress = { progress: number; text: string };
