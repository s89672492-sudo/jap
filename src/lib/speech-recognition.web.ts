import type { RecognitionError, RecognitionHandlers } from './speech-recognition';

export type { RecognitionError, RecognitionHandlers } from './speech-recognition';

/** 瀏覽器內建的語音辨識（Chrome、Edge、Safari 支援；TypeScript 沒有內建型別，只宣告用到的部分） */
type BrowserRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  abort: () => void;
  onresult: ((event: BrowserResultEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type BrowserResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
};

type RecognitionConstructor = new () => BrowserRecognition;

function getConstructor(): RecognitionConstructor | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function isRecognitionSupported(): boolean {
  return getConstructor() !== undefined;
}

const ERROR_CODES: Record<string, RecognitionError> = {
  'not-allowed': 'not-allowed',
  'service-not-allowed': 'not-allowed',
  'no-speech': 'no-speech',
  network: 'network',
};

/** 開始聽日文；說完會自動停止。回傳停止用的函式 */
export function startRecognition(handlers: RecognitionHandlers): () => void {
  const Ctor = getConstructor();
  if (!Ctor) {
    handlers.onError('unsupported');
    handlers.onEnd();
    return () => {};
  }

  const recognition = new Ctor();
  recognition.lang = 'ja-JP';
  recognition.interimResults = true;
  recognition.maxAlternatives = 5;
  recognition.continuous = false;

  let finished = false;
  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    if (!result) return;
    if (result.isFinal) {
      finished = true;
      const alternatives = Array.from(result, (alt) => alt.transcript).filter(Boolean);
      handlers.onResult(alternatives);
    } else {
      handlers.onPartial?.(result[0]?.transcript ?? '');
    }
  };
  recognition.onerror = (event) => {
    if (event.error === 'aborted') return;
    // 已經回報錯誤，結束時就不要再當成「沒聽到」
    finished = true;
    handlers.onError(ERROR_CODES[event.error] ?? 'other');
  };
  recognition.onend = () => {
    // 沒有得到最終結果就結束（例如太小聲），當作沒聽到
    if (!finished) handlers.onResult([]);
    handlers.onEnd();
  };

  try {
    recognition.start();
  } catch {
    handlers.onError('other');
    handlers.onEnd();
  }
  return () => recognition.abort();
}
