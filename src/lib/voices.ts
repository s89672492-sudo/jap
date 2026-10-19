import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';

/** 手機或瀏覽器裡的一個日文聲音，已依自然程度排序 */
export type JapaneseVoice = {
  id: string;
  name: string;
  /** 高品質（加強版、高級、Natural 等）聲音，聽起來比較像真人 */
  natural: boolean;
  gender: 'male' | 'female' | null;
};

/** iPhone、Mac 內建的趣味聲音（機器人、老人、氣泡聲…），不適合學發音 */
const NOVELTY = new Set(
  'albert bahh bells boing bubbles cellos eddy flo fred grandma grandpa jester junior kathy organ ralph reed rocko sandy shelley superstar trinoids whisper wobble zarvox'.split(
    ' ',
  ),
);

const MALE = ['otoya', 'hattori', 'keita', 'ichiro', 'daichi', 'naoki', 'takumi', 'kenji'];
const FEMALE = [
  'kyoko',
  'o-ren',
  'nanami',
  'ayumi',
  'haruka',
  'sayaka',
  'mizuki',
  'aoi',
  'shiori',
  'mayu',
  'nanako',
];

function genderOf(text: string): JapaneseVoice['gender'] {
  if (MALE.some((n) => text.includes(n)) || (text.includes('male') && !text.includes('female')))
    return 'male';
  if (FEMALE.some((n) => text.includes(n)) || text.includes('female')) return 'female';
  return null;
}

/** 分數越高越自然：雲端 / 神經網路聲音 > 高級 > 加強版 > Google > 一般內建 */
function scoreOf(voice: Speech.Voice, text: string): number {
  let score = 0;
  if (/natural|neural|online/.test(text)) score += 100;
  if (text.includes('premium')) score += 90;
  if (text.includes('enhanced') || voice.quality === Speech.VoiceQuality.Enhanced) score += 70;
  if (text.includes('siri')) score += 60;
  if (text.includes('google')) score += 50;
  return score;
}

function rank(voices: Speech.Voice[]): JapaneseVoice[] {
  const seen = new Set<string>();
  return voices
    .filter((v) => v.language.replace('_', '-').toLowerCase().startsWith('ja'))
    .map((voice) => {
      const text = `${voice.name} ${voice.identifier}`.toLowerCase();
      const firstWord = voice.name.toLowerCase().split(/[\s(]/)[0];
      return { voice, text, novelty: NOVELTY.has(firstWord), score: scoreOf(voice, text) };
    })
    .filter(({ voice, novelty }) => {
      if (novelty || seen.has(voice.identifier)) return false;
      seen.add(voice.identifier);
      return true;
    })
    .sort((a, b) => b.score - a.score)
    .map(({ voice, text, score }) => ({
      id: voice.identifier,
      name: voice.name,
      natural: score >= 70,
      gender: genderOf(text),
    }));
}

let cache: JapaneseVoice[] | null = null;
let pending: Promise<JapaneseVoice[]> | null = null;

/**
 * 讀取可用的日文聲音。瀏覽器剛打開時聲音清單可能還沒準備好，
 * 最多等 3 秒，拿不到就當作沒有（照舊用系統預設聲音）。
 */
export function loadJapaneseVoices(): Promise<JapaneseVoice[]> {
  if (cache) return Promise.resolve(cache);
  pending ??= Promise.race([
    Speech.getAvailableVoicesAsync(),
    new Promise<Speech.Voice[]>((resolve) => setTimeout(() => resolve([]), 3000)),
  ])
    .catch(() => [])
    .then((voices) => {
      const ranked = rank(voices);
      // 整份清單是空的就下次再試（有些瀏覽器第一次會回傳空清單）
      if (voices.length > 0) cache = ranked;
      pending = null;
      return ranked;
    });
  return pending;
}

/** 已經讀到的聲音（還沒讀到時是空的） */
export function getCachedVoices(): JapaneseVoice[] {
  return cache ?? [];
}

export function useJapaneseVoices(): { voices: JapaneseVoice[]; loaded: boolean } {
  const [voices, setVoices] = useState<JapaneseVoice[] | null>(cache);
  useEffect(() => {
    let alive = true;
    loadJapaneseVoices().then((list) => alive && setVoices(list));
    return () => {
      alive = false;
    };
  }, []);
  return { voices: voices ?? [], loaded: voices !== null };
}
