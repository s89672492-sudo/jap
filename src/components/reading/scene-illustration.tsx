import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

/** 插圖背景：用方塊和圓形畫出來，不需要圖片檔 */
export type Backdrop = 'day' | 'dawn' | 'night' | 'rain' | 'snow' | 'city' | 'nature' | 'indoor';

const has = (emojis: string[], list: string) => emojis.some((e) => list.includes(e));

/** 依插圖裡的表情符號猜背景：有月亮就是夜晚、有雨傘就是雨天… */
export function pickBackdrop(emojis: string[]): Backdrop {
  if (has(emojis, '🌧️☔☂️⛈️🌦️💧')) return 'rain';
  if (has(emojis, '❄️⛄☃️🌨️')) return 'snow';
  if (has(emojis, '🌙🌕🌃🌌⭐✨😴🎆🌛🌜🏮')) return 'night';
  if (has(emojis, '🌇🌅🌄')) return 'dawn';
  if (has(emojis, '🏙️🏢🚃🚉🏪🏬🚲🚗🏫🏛️🚌🏦🏥🛒🛍️')) return 'city';
  if (has(emojis, '🌳🌲🌸🍁⛰️🌾🌱🌿🐦🌻🏞️🗻🍂🌷🐝🦋🌊🏔️🌤️☀️')) return 'nature';
  return 'indoor';
}

type Palette = { sky: string; ground: string; hill: string; far: string };

const PALETTES: Record<Backdrop, Palette> = {
  day: { sky: '#BFE3F7', ground: '#9CCB7A', hill: '#86BC64', far: '#B3D99A' },
  dawn: { sky: '#F9C784', ground: '#C98B5B', hill: '#B9774A', far: '#E3A877' },
  night: { sky: '#1E2A4A', ground: '#2F3B5C', hill: '#27324F', far: '#3A4870' },
  rain: { sky: '#9AA7B4', ground: '#6F8A73', hill: '#5F7A64', far: '#8597A0' },
  snow: { sky: '#DCE8F2', ground: '#F7FAFC', hill: '#EAF1F7', far: '#C9D8E6' },
  city: { sky: '#CFE6F5', ground: '#A9A9B0', hill: '#8E8E98', far: '#B9C3CF' },
  nature: { sky: '#C7EBF0', ground: '#8CC46B', hill: '#73B054', far: '#A8D58D' },
  indoor: { sky: '#F3E3C8', ground: '#C8935C', hill: '#B5824E', far: '#E9D3AE' },
};

type SceneIllustrationProps = {
  emojis: string[];
  backdrop?: Backdrop;
  height?: number;
};

/**
 * 插畫風的小場景：先畫背景（天空、山丘或街道、室內的牆和窗、雨或雪），
 * 再把表情符號當成角色和道具擺在地面上，第一個是主角放在中間最大。
 */
export function SceneIllustration({ emojis, backdrop, height = 150 }: SceneIllustrationProps) {
  const kind = backdrop ?? pickBackdrop(emojis);
  const colors = PALETTES[kind];
  const [main, ...rest] = emojis;
  const left = rest[0];
  const right = rest[1];
  const groundTop = height * 0.62;

  return (
    <View
      style={[styles.frame, { height, backgroundColor: colors.sky }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      {/* 天上：太陽、月亮和星星 */}
      {(kind === 'day' || kind === 'nature' || kind === 'city') && (
        <View style={[styles.sun, { top: height * 0.1 }]} />
      )}
      {kind === 'dawn' && <View style={[styles.sunset, { top: groundTop - 34 }]} />}
      {kind === 'night' && (
        <>
          <View style={[styles.moon, { top: height * 0.1 }]} />
          {STARS.map(([x, y], i) => (
            <View key={i} style={[styles.star, { left: `${x}%`, top: height * y }]} />
          ))}
        </>
      )}
      {(kind === 'day' || kind === 'nature' || kind === 'rain') && (
        <>
          <View style={[styles.cloud, { left: '12%', top: height * 0.14 }]} />
          <View style={[styles.cloud, styles.cloudSmall, { left: '60%', top: height * 0.24 }]} />
        </>
      )}

      {/* 遠景：室內是窗戶，城市是大樓，其他是山丘 */}
      {kind === 'indoor' ? (
        <View style={[styles.window, { top: height * 0.12, borderColor: colors.hill }]}>
          <View style={[styles.windowPane, { borderColor: colors.hill }]} />
        </View>
      ) : kind === 'city' ? (
        BUILDINGS.map(([x, w, h], i) => (
          <View
            key={i}
            style={[
              styles.building,
              { left: `${x}%`, width: `${w}%`, height: height * h, top: groundTop - height * h, backgroundColor: i % 2 ? colors.far : colors.hill },
            ]}
          />
        ))
      ) : (
        <>
          <View style={[styles.hill, { left: '-15%', top: groundTop - 46, backgroundColor: colors.far }]} />
          <View style={[styles.hill, { right: '-20%', top: groundTop - 34, backgroundColor: colors.hill }]} />
        </>
      )}

      {/* 地面 */}
      <View style={[styles.ground, { top: groundTop, backgroundColor: colors.ground }]} />

      {/* 天氣 */}
      {kind === 'rain' &&
        RAIN.map(([x, y], i) => (
          <View key={i} style={[styles.raindrop, { left: `${x}%`, top: height * y }]} />
        ))}
      {kind === 'snow' &&
        SNOW.map(([x, y], i) => (
          <View key={i} style={[styles.snowflake, { left: `${x}%`, top: height * y }]} />
        ))}

      {/* 角色和道具：站在地面上，腳下有影子 */}
      <View style={[styles.props, { top: groundTop - 62 }]}>
        {left && <Prop emoji={left} size={38} offset={14} />}
        {main && <Prop emoji={main} size={60} offset={0} />}
        {right && <Prop emoji={right} size={38} offset={14} />}
      </View>
    </View>
  );
}

function Prop({ emoji, size, offset }: { emoji: string; size: number; offset: number }) {
  return (
    <View style={[styles.prop, { marginTop: offset }]}>
      <ThemedText style={{ fontSize: size, lineHeight: size * 1.25 }}>{emoji}</ThemedText>
      <View style={[styles.shadow, { width: size * 0.8 }]} />
    </View>
  );
}

/** 星星、雨滴、雪花、大樓的位置（x 用百分比，y 用高度比例） */
const STARS: [number, number][] = [
  [8, 0.12], [22, 0.3], [35, 0.08], [48, 0.22], [64, 0.1], [88, 0.28], [76, 0.4], [15, 0.45],
];
const RAIN: [number, number][] = [
  [5, 0.1], [15, 0.35], [25, 0.05], [33, 0.5], [42, 0.2], [52, 0.42], [61, 0.08], [70, 0.3],
  [79, 0.52], [88, 0.15], [95, 0.4], [10, 0.6], [57, 0.65], [84, 0.7],
];
const SNOW: [number, number][] = [
  [6, 0.15], [18, 0.4], [27, 0.1], [38, 0.3], [50, 0.08], [59, 0.45], [68, 0.2], [80, 0.35],
  [90, 0.1], [12, 0.62], [45, 0.58], [74, 0.66], [95, 0.55],
];
const BUILDINGS: [number, number, number][] = [
  [2, 14, 0.38], [17, 10, 0.5], [29, 16, 0.3], [47, 12, 0.46], [61, 15, 0.34], [78, 10, 0.52], [89, 12, 0.28],
];

const styles = StyleSheet.create({
  frame: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  sun: {
    position: 'absolute',
    right: '10%',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFD45C',
  },
  sunset: {
    position: 'absolute',
    left: '42%',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FF9F4A',
  },
  moon: {
    position: 'absolute',
    right: '12%',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F4EBC3',
  },
  star: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFF6D5',
  },
  cloud: {
    position: 'absolute',
    width: 70,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  cloudSmall: {
    width: 48,
    height: 16,
  },
  hill: {
    position: 'absolute',
    width: '75%',
    height: 160,
    borderRadius: 999,
  },
  building: {
    position: 'absolute',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  window: {
    position: 'absolute',
    left: '8%',
    width: 74,
    height: 54,
    borderWidth: 4,
    borderRadius: 4,
    backgroundColor: '#CDE8F6',
  },
  windowPane: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    borderLeftWidth: 3,
  },
  ground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  raindrop: {
    position: 'absolute',
    width: 2,
    height: 12,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    transform: [{ rotate: '15deg' }],
  },
  snowflake: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  props: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: Spacing.four,
  },
  prop: {
    alignItems: 'center',
  },
  shadow: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.18)',
    marginTop: -6,
  },
});
