import * as Speech from 'expo-speech';

import type { ScriptLine, ScriptSpeaker } from '@/data/exam';
import { getSettings, SPEECH_RATES } from '@/stores/settings-store';

/** 聽解對話用不同音高區分說話者（手機內建語音通常只有一種聲音） */
const SPEAKER_PITCH: Record<ScriptSpeaker, number> = {
  narrator: 1.0,
  man: 0.8,
  woman: 1.3,
};

function speak(text: string, pitch = 1.0) {
  Speech.speak(text, {
    language: 'ja-JP',
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
  speak(`${intro.text}${question}`, SPEAKER_PITCH.narrator);
  dialogue.forEach((line) => speak(line.text, SPEAKER_PITCH[line.speaker]));
  speak(question, SPEAKER_PITCH.narrator);
}

/** 停止目前的語音（例如離開聽解題時） */
export function stopSpeaking() {
  Speech.stop();
}
