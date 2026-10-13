/** AI 日文老師可以選的本地模型（WebLLM 內建清單裡的 Gemma 日文版與 Qwen3.5） */
export type TeacherModelKey = 'japanese' | 'quality' | 'best';

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
  japanese: {
    label: '日文專家',
    f16: 'gemma-2-2b-jpn-it-q4f16_1-MLC',
    f32: 'gemma-2-2b-jpn-it-q4f32_1-MLC',
    download: '約 1.4 GB',
    memoryMB: 1895,
    note: 'Google Gemma 日文版，日文例句最自然；中文說明比較簡單。三個裡面最省記憶體',
  },
  quality: {
    label: '高品質',
    f16: 'Qwen3.5-2B-q4f16_1-MLC',
    f32: 'Qwen3.5-2B-q4f32_1-MLC',
    download: '約 1.2 GB',
    memoryMB: 2245,
    note: 'Qwen3.5 新一代，中文解說清楚；建議記憶體 8GB 以上的手機',
  },
  best: {
    label: '最佳',
    f16: 'Qwen3.5-4B-q4f16_1-MLC',
    f32: 'Qwen3.5-4B-q4f32_1-MLC',
    download: '約 2.5 GB',
    memoryMB: 3868,
    note: 'Qwen3.5 最大的版本，回答最好；適合平板、電腦或 12GB 記憶體的手機，iPhone 很可能跑不動',
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
