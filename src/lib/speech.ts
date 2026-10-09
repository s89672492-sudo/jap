import * as Speech from 'expo-speech';

import { getSettings, SPEECH_RATES } from '@/stores/settings-store';

/** 用手機內建的日文語音唸出文字；連續點擊時先停掉上一個，避免聲音疊在一起 */
export async function speakJapanese(text: string) {
  await Speech.stop();
  Speech.speak(text, {
    language: 'ja-JP',
    rate: SPEECH_RATES[getSettings().speechSpeed],
  });
}
