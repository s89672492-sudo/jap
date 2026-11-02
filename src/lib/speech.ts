import * as Speech from 'expo-speech';

import type { ScriptLine, ScriptSpeaker } from '@/data/exam';
import { getCachedVoices, type JapaneseVoice } from '@/lib/voices';
import { getSettings, SPEECH_RATES } from '@/stores/settings-store';

/** 找不到男女兩種聲音時，聽解對話改用不同音高區分說話者 */
const SPEAKER_PITCH: Record<ScriptSpeaker, number> = {
  narrator: 1.0,
  man: 0.8,
  woman: 1.3,
};

/** 設定裡選的聲音；選「自動」或那個聲音不在這支手機上時，用最自然的那一個 */
function mainVoice(): JapaneseVoice | undefined {
  const voices = getCachedVoices();
  const chosen = getSettings().voice;
  return voices.find((v) => v.id === chosen) ?? voices[0];
}

/** 這一句用哪個聲音、什麼音高 */
function voiceFor(speaker: ScriptSpeaker = 'narrator'): { voice?: string; pitch: number } {
  const main = mainVoice();
  if (!main) return { pitch: SPEAKER_PITCH[speaker] };
  if (speaker === 'narrator') return { voice: main.id, pitch: 1.0 };
  const wanted = speaker === 'man' ? 'male' : 'female';
  if (main.gender === wanted) return { voice: main.id, pitch: 1.0 };
  // 有另一個性別的聲音就換人說，聽起來比調音高自然
  const other = getCachedVoices().find((v) => v.gender === wanted);
  if (other && main.gender) return { voice: other.id, pitch: 1.0 };
  return { voice: main.id, pitch: SPEAKER_PITCH[speaker] };
}

function speak(text: string, speaker?: ScriptSpeaker) {
  const { voice, pitch } = voiceFor(speaker);
  Speech.speak(text, {
    language: 'ja-JP',
    voice,
    rate: SPEECH_RATES[getSettings().speechSpeed],
    pitch,
  });
}

/** 用手機內建的日文語音唸出文字；連續點擊時先停掉上一個，避免聲音疊在一起 */
export async function speakJapanese(text: string) {
  await Speech.stop();
  speak(text);
}

/**
 * 播放聽解題：旁白說明情境和問題 → 對話 → 再唸一次問題（和 JLPT 聽解的順序相同）。
 * 每一句排進語音佇列依序播放。
 */
export async function speakScript(lines: ScriptLine[], question: string) {
  await Speech.stop();
  const [intro, ...dialogue] = lines;
  speak(`${intro.text}${question}`);
  dialogue.forEach((line) => speak(line.text, line.speaker));
  speak(question);
}

/** 停止目前的語音（例如離開聽解題時） */
export function stopSpeaking() {
  Speech.stop();
}

/**
 * 唸出文字並等到唸完（自動播放用）。
 * 有些裝置不會回報唸完，所以依字數設一個最長等待時間，時間到就繼續。
 */
export function speakAndWait(text: string, language: 'ja-JP' | 'zh-TW' = 'ja-JP'): Promise<void> {
  return new Promise((resolve) => {
    const rate = SPEECH_RATES[getSettings().speechSpeed];
    const timeout = setTimeout(resolve, (1500 + text.length * 350) / rate);
    const done = () => {
      clearTimeout(timeout);
      resolve();
    };
    const voice = language === 'ja-JP' ? mainVoice()?.id : undefined;
    Speech.speak(text, { language, voice, rate, onDone: done, onStopped: done, onError: done });
  });
}

/**
 * 用說話者的聲音唸一句並等到唸完（聽解播放用）。
 * 有些裝置不會回報唸完，所以依字數設一個最長等待時間。
 */
export function speakLineAndWait(text: string, speaker: ScriptSpeaker = 'narrator'): Promise<void> {
  return new Promise((resolve) => {
    const rate = SPEECH_RATES[getSettings().speechSpeed];
    const timeout = setTimeout(resolve, (1500 + text.length * 350) / rate);
    const done = () => {
      clearTimeout(timeout);
      resolve();
    };
    const { voice, pitch } = voiceFor(speaker);
    Speech.speak(text, {
      language: 'ja-JP',
      voice,
      rate,
      pitch,
      onDone: done,
      onStopped: done,
      onError: done,
    });
  });
}
