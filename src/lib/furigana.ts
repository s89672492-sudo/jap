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
