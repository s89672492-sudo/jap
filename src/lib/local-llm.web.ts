import type { MLCEngine } from '@mlc-ai/web-llm';

import type { ChatMessage, LoadProgress, SupportCheck, SupportReport } from './local-llm-models';

/**
 * 網頁版本地 AI：用 WebLLM 在瀏覽器裡以 WebGPU 推論，不呼叫任何雲端 AI API。
 * 模型第一次會從 Hugging Face 下載並存在瀏覽器的 Cache Storage，之後離線也能載入。
 * WebLLM 本身約 7MB，所以用 import() 等到真的需要時才載入，不影響其他頁面的開啟速度。
 */
export const LOCAL_LLM_AVAILABLE = true;

type WebLLM = typeof import('@mlc-ai/web-llm');

let libPromise: Promise<WebLLM> | null = null;
const loadLib = () => (libPromise ??= import('@mlc-ai/web-llm'));

let engine: MLCEngine | null = null;
let engineModelId: string | null = null;

/** WebGPU 型別（TypeScript 的 DOM 型別還沒有內建，只寫用得到的部分） */
type GpuAdapter = {
  features: { has: (name: string) => boolean };
  limits: { maxStorageBufferBindingSize: number; maxBufferSize: number };
};
type GpuNavigator = Navigator & {
  gpu?: { requestAdapter: (options?: object) => Promise<GpuAdapter | null> };
  deviceMemory?: number;
};

const MB = 1024 * 1024;

function isIOS() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

export async function checkSupport(): Promise<SupportReport> {
  const nav = navigator as GpuNavigator;
  const checks: SupportCheck[] = [];
  const ios = isIOS();
  let ok = true;
  let f16 = false;

  if (!window.isSecureContext) {
    ok = false;
    checks.push({ label: '安全連線', status: 'fail', detail: '需要用 https 開啟網站。' });
  }

  let adapter: GpuAdapter | null = null;
  try {
    adapter = (await nav.gpu?.requestAdapter({ powerPreference: 'high-performance' })) ?? null;
  } catch {
    adapter = null;
  }
  if (!adapter) {
    ok = false;
    checks.push({
      label: 'WebGPU',
      status: 'fail',
      detail: ios
        ? '這台 iPhone 的 Safari 沒有開啟 WebGPU。請更新到 iOS 26 以上再試。'
        : '這個瀏覽器不支援 WebGPU。請用最新版 Chrome（Android 12 以上）開啟。',
    });
  } else {
    checks.push({ label: 'WebGPU', status: 'pass', detail: '可以用手機的 GPU 執行 AI。' });
    f16 = adapter.features.has('shader-f16');
    checks.push({
      label: '半精度運算（shader-f16）',
      status: f16 ? 'pass' : 'warn',
      detail: f16
        ? '支援，會用比較省記憶體的模型版本。'
        : '不支援，會改用 f32 版本，需要較多記憶體。',
    });
    const binding = adapter.limits.maxStorageBufferBindingSize;
    if (binding < 128 * MB) {
      ok = false;
      checks.push({
        label: 'GPU 緩衝區',
        status: 'fail',
        detail: `只有 ${Math.round(binding / MB)}MB，至少需要 128MB。`,
      });
    } else {
      checks.push({
        label: 'GPU 緩衝區',
        status: 'pass',
        detail: `${Math.round(binding / MB)}MB`,
      });
    }
  }

  if (!('caches' in window)) {
    ok = false;
    checks.push({
      label: '儲存空間',
      status: 'fail',
      detail: '瀏覽器不能儲存模型（可能是無痕模式）。',
    });
  } else {
    try {
      const { quota = 0, usage = 0 } = await navigator.storage.estimate();
      const freeGB = Math.floor(((quota - usage) / 1024 / MB) * 10) / 10;
      // 日文專家約 1.4 GB、高品質約 1.2 GB、最佳約 2.5 GB
      const fits =
        freeGB >= 2.7
          ? '，任何一個模型都放得下'
          : freeGB >= 1.5
            ? '，放得下日文專家或高品質模型'
            : freeGB >= 1.3
              ? '，只放得下高品質模型'
              : '，可能不夠存放模型';
      checks.push({
        label: '儲存空間',
        status: freeGB >= 1.5 ? 'pass' : 'warn',
        detail: `瀏覽器可用約 ${freeGB.toFixed(1)} GB${fits}`,
      });
    } catch {
      checks.push({ label: '儲存空間', status: 'warn', detail: '無法確認可用空間。' });
    }
  }

  if (nav.deviceMemory !== undefined) {
    checks.push({
      label: '手機記憶體',
      status: nav.deviceMemory >= 4 ? 'pass' : 'warn',
      detail:
        nav.deviceMemory >= 8
          ? `約 ${nav.deviceMemory} GB 以上，可以試試高品質或最佳模型`
          : nav.deviceMemory >= 4
            ? `約 ${nav.deviceMemory} GB，建議使用日文專家模型`
            : `約 ${nav.deviceMemory} GB，可能跑不動；請關掉其他 App 後試試日文專家模型`,
    });
  } else if (ios) {
    checks.push({
      label: '手機記憶體',
      status: 'warn',
      detail: 'Safari 每個分頁能用的記憶體有限，建議先用日文專家模型，並關掉其他分頁。',
    });
  }

  return { ok, checks, f16, recommended: 'japanese' };
}

export async function isModelDownloaded(modelId: string): Promise<boolean> {
  try {
    const lib = await loadLib();
    return await lib.hasModelInCache(modelId);
  } catch {
    return false;
  }
}

export async function loadModel(
  modelId: string,
  onProgress: (progress: LoadProgress) => void,
): Promise<void> {
  if (engine && engineModelId === modelId) return;
  const lib = await loadLib();
  if (engine) {
    await engine.unload();
    engine = null;
    engineModelId = null;
  }
  // 請瀏覽器不要在空間不足時自動清掉模型（不一定會同意）
  navigator.storage?.persist?.().catch(() => {});
  engine = await lib.CreateMLCEngine(modelId, {
    initProgressCallback: (report) => onProgress({ progress: report.progress, text: report.text }),
  });
  engineModelId = modelId;
}

export function loadedModelId(): string | null {
  return engineModelId;
}

function foldSystemPrompt(messages: ChatMessage[]): ChatMessage[] {
  const system = messages.filter((m) => m.role === 'system').map((m) => m.content);
  const rest = messages.filter((m) => m.role !== 'system');
  const firstUser = rest.findIndex((m) => m.role === 'user');
  if (system.length === 0 || firstUser < 0) return rest;
  return rest.map((m, i) =>
    i === firstUser ? { ...m, content: `${system.join('\n')}\n\n學生的問題：${m.content}` } : m,
  );
}

export async function* streamChat(messages: ChatMessage[]): AsyncGenerator<string> {
  if (!engine) throw new Error('模型還沒載入');
  // Gemma 不支援系統指令，把老師的規則放進第一則學生訊息裡
  if (engineModelId?.startsWith('gemma')) messages = foldSystemPrompt(messages);
  // Qwen3／Qwen3.5 預設會先「思考」很久才回答，關掉思考模式直接回答，手機上比較快
  const qwen3 = engineModelId?.startsWith('Qwen3') ?? false;
  const chunks = await engine.chat.completions.create({
    messages,
    stream: true,
    temperature: qwen3 ? 0.7 : 0.6,
    top_p: qwen3 ? 0.8 : undefined,
    max_tokens: 800,
    extra_body: qwen3 ? { enable_thinking: false } : undefined,
  });
  for await (const chunk of chunks) {
    const text = chunk.choices[0]?.delta?.content;
    if (text) yield text;
  }
}

export async function stopGenerating(): Promise<void> {
  await engine?.interruptGenerate();
}

export async function deleteModel(modelId: string): Promise<void> {
  if (engineModelId === modelId && engine) {
    await engine.unload();
    engine = null;
    engineModelId = null;
  }
  const lib = await loadLib();
  await lib.deleteModelAllInfoInCache(modelId);
}
