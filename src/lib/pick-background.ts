import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

/** 背景圖最寬存成這個像素，手機螢幕夠用，也不會把儲存空間塞滿 */
const MAX_WIDTH = 1080;

/**
 * 讓使用者從相簿選一張圖片，縮小並壓縮成 JPEG 後回傳 data URI。
 * 取消選擇時回傳 null。
 */
export async function pickBackgroundImage(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
  });
  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  const context = ImageManipulator.manipulate(asset.uri);
  if (asset.width > MAX_WIDTH) context.resize({ width: MAX_WIDTH });
  const image = await context.renderAsync();
  const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.6, base64: true });
  if (!saved.base64) return null;

  return `data:image/jpeg;base64,${saved.base64}`;
}
