/**
 * 口說比對：把語音辨識的結果和目標日文比較，算出相似度並標出唸錯（漏掉）的字。
 * 辨識結果有時是漢字、有時是假名，所以單字會同時和寫法、讀音比對，取最好的。
 */

/** 去掉空白和標點、片假名轉平假名、全形英數轉半形，方便比較 */
export function normalizeJapanese(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s、。，．,.！!？?「」『』（）()・…〜～ー\-:：;；"'“”]/g, '')
    .replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

function levenshtein(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = temp;
    }
  }
  return prev[b.length];
}

/** 0～1，1 表示完全一樣 */
export function similarity(a: string, b: string): number {
  if (!a && !b) return 1;
  return 1 - levenshtein(a, b) / Math.max(a.length, b.length);
}

/** 目標的每個字有沒有被唸到（用最長共同子序列對齊） */
function matchedFlags(target: string, heard: string): boolean[] {
  const dp = Array.from({ length: target.length + 1 }, () => new Array<number>(heard.length + 1).fill(0));
  for (let i = target.length - 1; i >= 0; i--) {
    for (let j = heard.length - 1; j >= 0; j--) {
      dp[i][j] =
        target[i] === heard[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const flags = new Array<boolean>(target.length).fill(false);
  let i = 0;
  let j = 0;
  while (i < target.length && j < heard.length) {
    if (target[i] === heard[j]) {
      flags[i] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return flags;
}

export type PronunciationResult = {
  /** 辨識到的文字（原樣） */
  heard: string;
  /** 0～1 */
  score: number;
  /** 拿來比對的目標（已正規化），和每個字有沒有唸到 */
  target: string;
  matched: boolean[];
};

/**
 * 從辨識的幾個候選結果和幾種目標寫法中，找出最接近的一組。
 * targets 例如 ['食べる', 'たべる']；alternatives 是辨識器給的候選文字。
 */
export function checkPronunciation(targets: string[], alternatives: string[]): PronunciationResult {
  let best: PronunciationResult = { heard: alternatives[0] ?? '', score: 0, target: normalizeJapanese(targets[0] ?? ''), matched: [] };
  for (const alt of alternatives) {
    const heard = normalizeJapanese(alt);
    for (const raw of targets) {
      const target = normalizeJapanese(raw);
      const score = similarity(target, heard);
      if (score > best.score || best.matched.length === 0) {
        best = { heard: alt, score, target, matched: matchedFlags(target, heard) };
      }
    }
  }
  return best;
}

/** 分數的評語 */
export function verdict(score: number): { mark: string; label: string; level: 'good' | 'close' | 'retry' } {
  if (score >= 0.85) return { mark: '○', label: '說得很好！', level: 'good' };
  if (score >= 0.6) return { mark: '△', label: '很接近了，再試一次', level: 'close' };
  return { mark: '×', label: '和目標差比較多，先聽一次再說', level: 'retry' };
}
