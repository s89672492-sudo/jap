/** AI 日文老師可以選的本地模型（WebLLM 內建清單裡的 Qwen2.5 與 Gemma 日文版，iPhone 也跑得動） */
export type TeacherModelKey = 'chinese' | 'japanese';

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
  chinese: {
    label: '中文解說',
    f16: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    f32: 'Qwen2.5-1.5B-Instruct-q4f32_1-MLC',
    download: '約 0.9 GB',
    memoryMB: 1630,
    note: 'Qwen2.5，用中文把文法講清楚；最省記憶體，iPhone 建議用這個',
  },
  japanese: {
    label: '日文專家',
    f16: 'gemma-2-2b-jpn-it-q4f16_1-MLC',
    f32: 'gemma-2-2b-jpn-it-q4f32_1-MLC',
    download: '約 1.4 GB',
    memoryMB: 1895,
    note: 'Google Gemma 日文版，日文例句最自然；中文說明比較簡單，需要的記憶體多一點',
  },
};

export const TEACHER_MODEL_KEYS = Object.keys(TEACHER_MODELS) as TeacherModelKey[];

/** 以前提供過、現在拿掉的模型；手機裡留下的檔案會自動清掉 */
export const RETIRED_MODEL_IDS = [
  'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
  'Qwen2.5-0.5B-Instruct-q4f32_1-MLC',
  'Qwen3-1.7B-q4f16_1-MLC',
  'Qwen3-1.7B-q4f32_1-MLC',
  'Qwen3-4B-q4f16_1-MLC',
  'Qwen3-4B-q4f32_1-MLC',
  'Qwen3.5-4B-q4f16_1-MLC',
  'Qwen3.5-4B-q4f32_1-MLC',
  // iPhone 16 會當機
  'Qwen3.5-2B-q4f16_1-MLC',
  'Qwen3.5-2B-q4f32_1-MLC',
];

/** 依模型 id 找回是哪一個選項 */
export function modelKeyFor(modelId: string): TeacherModelKey | null {
  return (
    TEACHER_MODEL_KEYS.find(
      (key) => TEACHER_MODELS[key].f16 === modelId || TEACHER_MODELS[key].f32 === modelId,
    ) ?? null
  );
}

/** 跑不動時建議改用的較小模型 */
export const SMALLER_MODEL: Record<TeacherModelKey, TeacherModelKey | null> = {
  japanese: 'chinese',
  chinese: null,
};

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
