/**
 * 語音辨識（手機 App 版）：Expo Go 沒有內建語音辨識，
 * 需要額外的原生模組才能做，所以這裡回報不支援，畫面會改顯示提示。
 */
export type RecognitionHandlers = {
  /** 辨識完成：候選文字（最可能的在前面） */
  onResult: (alternatives: string[]) => void;
  /** 說話途中的暫時結果 */
  onPartial?: (text: string) => void;
  onError: (code: RecognitionError) => void;
  onEnd: () => void;
};

export type RecognitionError = 'not-allowed' | 'no-speech' | 'network' | 'unsupported' | 'other';

export function isRecognitionSupported(): boolean {
  return false;
}

/** 開始聽；回傳停止用的函式 */
export function startRecognition(handlers: RecognitionHandlers): () => void {
  handlers.onError('unsupported');
  handlers.onEnd();
  return () => {};
}
