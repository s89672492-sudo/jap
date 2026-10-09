import { createPersistedStore, usePersistedStore } from './persisted-store';

export type OverlayStrength = 'light' | 'medium' | 'strong';

export type BackgroundSettings = {
  /** 圖片的 data URI（只存在這支手機）；null 表示不用背景圖 */
  image: string | null;
  /** 圖片上方紙張色遮罩的濃度，越濃文字越清楚 */
  overlay: OverlayStrength;
};

const DEFAULT_BACKGROUND: BackgroundSettings = { image: null, overlay: 'medium' };

export const OVERLAY_OPACITY: Record<OverlayStrength, number> = {
  light: 0.55,
  medium: 0.7,
  strong: 0.85,
};

const backgroundStore = createPersistedStore<BackgroundSettings>({
  key: 'background',
  initial: DEFAULT_BACKGROUND,
  serialize: (value) => JSON.stringify(value),
  deserialize: (raw) => {
    try {
      const saved = JSON.parse(raw) as Partial<BackgroundSettings>;
      return {
        image: typeof saved.image === 'string' ? saved.image : null,
        overlay:
          saved.overlay && saved.overlay in OVERLAY_OPACITY ? saved.overlay : DEFAULT_BACKGROUND.overlay,
      };
    } catch {
      return null;
    }
  },
});

export function setBackgroundImage(image: string | null) {
  backgroundStore.update((current) => ({ ...current, image }));
}

export function setOverlayStrength(overlay: OverlayStrength) {
  backgroundStore.update((current) => ({ ...current, overlay }));
}

export function useBackground(): BackgroundSettings {
  return usePersistedStore(backgroundStore, DEFAULT_BACKGROUND);
}
