import { Share } from 'react-native';

/**
 * 手機 App 版：用系統的分享選單把備份內容存到「檔案」、雲端硬碟或傳給自己。
 * Expo Go 沒有內建選擇檔案的功能，還原時改用貼上備份內容。
 */
export const canPickFile = false;

export async function saveBackupFile(name: string, text: string): Promise<void> {
  await Share.share({ title: name, message: text });
}

export async function pickBackupFile(): Promise<string | null> {
  return null;
}
