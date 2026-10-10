import type { ImageSourcePropType } from 'react-native';

/** 每一段的插畫：PARAGRAPH_IMAGES[文章 id][第幾段（從 0 開始）]；沒有的段落會改用會動的場景插圖 */
export const PARAGRAPH_IMAGES: Record<string, Record<number, ImageSourcePropType>> = {};
