import { useEffect, useSyncExternalStore } from 'react';

/**
 * 例句的假名注音格式：[漢字|かんじ]，例如「[毎朝|まいあさ]、[水|みず]を飲みます。」
 * 資料裡存的是加了注音的句子，顯示和朗讀時再拆開。
 */

const RUBY = /\[([^|\]]+)\|([^\]]+)\]/g;

export type RubySegment = {
  text: string;
  /** 這段的讀音；沒有漢字的部分沒有 */
  ruby?: string;
};

/** 去掉注音，得到一般的句子 */
export function stripRuby(annotated: string): string {
  return annotated.replace(RUBY, '$1');
}

/** 拆成一段一段：有注音的漢字、沒注音的文字 */
export function parseRuby(annotated: string): RubySegment[] {
  const segments: RubySegment[] = [];
  let last = 0;
  for (const match of annotated.matchAll(RUBY)) {
    const index = match.index ?? 0;
    if (index > last) segments.push({ text: annotated.slice(last, index) });
    segments.push({ text: match[1], ruby: match[2] });
    last = index + match[0].length;
  }
  if (last < annotated.length) segments.push({ text: annotated.slice(last) });
  return segments;
}

// ── 文法例句、閱讀文章、試題的注音對照表（約 4,800 句）：用到時才在背景載入 ──

let furiganaMap: Record<string, string> | null = null;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

export function loadFurigana(): Promise<void> {
  loading ??= import('@/data/furigana-map').then((module) => {
    furiganaMap = module.FURIGANA_MAP;
    listeners.forEach((listener) => listener());
  });
  return loading;
}

/**
 * 查一句話的注音版本；沒有漢字、沒收錄的句子，或對照表還沒載入時回傳 undefined
 * （先顯示沒有注音的句子，載入後會自動補上）。用到的元件要呼叫 useFuriganaLoaded() 才會更新。
 */
export function lookupFurigana(text: string): string | undefined {
  return furiganaMap?.[text];
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** 開始載入注音對照表，載入完成時讓畫面重新整理 */
export function useFuriganaLoaded(): boolean {
  useEffect(() => {
    loadFurigana();
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => furiganaMap !== null,
    () => false,
  );
}

/** 範圍 [start, end) 的邊界是否切在一組注音的中間（例如只挖空「何時」的「何」） */
export function splitsRuby(annotated: string, [start, end]: [number, number]): boolean {
  let offset = 0;
  for (const segment of parseRuby(annotated)) {
    const from = offset;
    const to = offset + segment.text.length;
    if (segment.ruby && ((start > from && start < to) || (end > from && end < to))) return true;
    offset = to;
  }
  return false;
}
