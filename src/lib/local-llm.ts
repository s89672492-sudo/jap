import type { ChatMessage, LoadProgress, SupportReport } from './local-llm-models';

/**
 * 手機 App（Expo Go）版本：手機原生環境沒有 WebGPU，本地模型只能在瀏覽器執行。
 * 網頁版的實作在 local-llm.web.ts。
 */
export const LOCAL_LLM_AVAILABLE = false;

export async function checkSupport(): Promise<SupportReport> {
  return {
    ok: false,
    f16: false,
    recommended: 'japanese',
    checks: [
      {
        label: '瀏覽器',
        status: 'fail',
        detail: 'AI 老師需要用手機瀏覽器（Safari 或 Chrome）開啟網頁版。',
      },
    ],
  };
}

export async function isModelDownloaded(_modelId: string): Promise<boolean> {
  return false;
}

export async function hasModelFiles(_modelId: string): Promise<boolean> {
  return false;
}

export async function loadModel(
  _modelId: string,
  _onProgress: (progress: LoadProgress) => void,
): Promise<void> {
  throw new Error('這個環境不支援本地 AI');
}

export function takeInterruptedModel(): string | null {
  return null;
}

export function loadedModelId(): string | null {
  return null;
}

export async function* streamChat(_messages: ChatMessage[]): AsyncGenerator<string> {
  throw new Error('這個環境不支援本地 AI');
}

export async function stopGenerating(): Promise<void> {}

export async function removeRetiredModels(): Promise<void> {}

export async function deleteModel(_modelId: string): Promise<void> {}
