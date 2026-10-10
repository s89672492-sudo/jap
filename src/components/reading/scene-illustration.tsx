import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

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

type Palette = { sky: string; horizon: string; ground: string; hill: string; far: string };

const PALETTES: Record<Backdrop, Palette> = {
  day: { sky: '#A9D8F5', horizon: '#E4F4FC', ground: '#9CCB7A', hill: '#86BC64', far: '#B3D99A' },
  dawn: { sky: '#F5A86B', horizon: '#FCE1A8', ground: '#C98B5B', hill: '#B9774A', far: '#E3A877' },
  night: { sky: '#16203D', horizon: '#2E3F6E', ground: '#2F3B5C', hill: '#27324F', far: '#3A4870' },
  rain: { sky: '#8796A5', horizon: '#B9C4CE', ground: '#6F8A73', hill: '#5F7A64', far: '#8597A0' },
  snow: { sky: '#C9DCEB', horizon: '#F0F6FA', ground: '#F7FAFC', hill: '#E4EDF5', far: '#C9D8E6' },
  city: { sky: '#B6DCF3', horizon: '#EAF5FB', ground: '#A3A3AB', hill: '#7F8796', far: '#AAB6C4' },
  nature: { sky: '#B0E3EC', horizon: '#E8F8F5', ground: '#8CC46B', hill: '#73B054', far: '#A8D58D' },
  indoor: { sky: '#F0DDBF', horizon: '#F8EBD5', ground: '#C08A55', hill: '#A97444', far: '#E9D3AE' },
};

type SceneIllustrationProps = {
  emojis: string[];
  backdrop?: Backdrop;
  height?: number;
  /** 這一段的主角，站在最前面 */
  who?: string | null;
  /** 主角的心情，顯示在思考泡泡裡 */
  mood?: string | null;
};

/**
 * 會動的插畫場景：天空、遠景、地面和前景裝飾都用圖形畫出來，
 * 雲會飄、雨和雪會落下、星星會閃；角色和道具輕輕上下晃動。
 * 手機開啟「減少動態效果」時，畫面保持靜止。
 */
export function SceneIllustration({
  emojis,
  backdrop,
  height = 150,
  who,
  mood,
}: SceneIllustrationProps) {
  const kind = backdrop ?? pickBackdrop(emojis);
  const colors = PALETTES[kind];
  const [main, ...rest] = emojis;
  const groundTop = height * 0.62;
  const outdoor = kind !== 'indoor';

  return (
    <View
      style={[styles.frame, { height, backgroundColor: colors.sky }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      {/* 天空靠近地平線的地方比較亮 */}
      <View style={[styles.horizon, { top: groundTop - height * 0.3, height: height * 0.3, backgroundColor: colors.horizon }]} />

      {/* 天上 */}
      {(kind === 'day' || kind === 'nature' || kind === 'city') && <Sun top={height * 0.08} />}
      {kind === 'dawn' && <Sun top={groundTop - 40} big color="#FF9446" />}
      {kind === 'night' && (
        <>
          <Moon top={height * 0.1} />
          {STARS.map(([x, y], i) => (
            <Star key={i} left={`${x}%`} top={height * y} delay={i * 260} />
          ))}
        </>
      )}
      {outdoor && kind !== 'night' && (
        <>
          <Cloud left="6%" top={height * 0.1} scale={1} distance={18} duration={7000} dark={kind === 'rain'} />
          <Cloud left="58%" top={height * 0.2} scale={0.7} distance={-14} duration={9000} dark={kind === 'rain'} />
        </>
      )}

      {/* 遠景 */}
      {kind === 'indoor' ? (
        <IndoorWall height={height} colors={colors} />
      ) : kind === 'city' ? (
        BUILDINGS.map(([x, w, h], i) => (
          <View
            key={i}
            style={[
              styles.building,
              {
                left: `${x}%`,
                width: `${w}%`,
                height: height * h,
                top: groundTop - height * h,
                backgroundColor: i % 2 ? colors.far : colors.hill,
              },
            ]}>
            {WINDOW_ROWS.slice(0, Math.floor(h * 8)).map((row) => (
              <View key={row} style={styles.windowRow}>
                <View style={styles.cityWindow} />
                <View style={styles.cityWindow} />
              </View>
            ))}
          </View>
        ))
      ) : (
        <>
          <View style={[styles.hill, { left: '-15%', top: groundTop - 46, backgroundColor: colors.far }]} />
          <View style={[styles.hill, { right: '-20%', top: groundTop - 34, backgroundColor: colors.hill }]} />
        </>
      )}

      {/* 地面和前景 */}
      <View style={[styles.ground, { top: groundTop, backgroundColor: colors.ground }]} />
      <Foreground kind={kind} groundTop={groundTop} height={height} />

      {/* 天氣 */}
      {kind === 'rain' &&
        RAIN.map(([x, delay], i) => (
          <Raindrop key={i} left={`${x}%`} height={height} delay={delay} />
        ))}
      {kind === 'snow' &&
        SNOW.map(([x, delay], i) => (
          <Snowflake key={i} left={`${x}%`} height={height} delay={delay} />
        ))}

      {/* 角色和道具站在地面上；主角在最前面，旁邊有思考泡泡 */}
      <View style={[styles.props, { top: groundTop - 64 }]}>
        {who && (
          <Bob delay={0} distance={5}>
            <View>
              <Prop emoji={who} size={50} />
              {mood && <Bubble mood={mood} />}
            </View>
          </Bob>
        )}
        {rest[0] && (
          <Bob delay={500} distance={3} style={styles.sideProp}>
            <Prop emoji={rest[0]} size={36} />
          </Bob>
        )}
        {main && (
          <Bob delay={250} distance={4}>
            <Prop emoji={main} size={who ? 52 : 60} />
          </Bob>
        )}
        {rest[1] && (
          <Bob delay={800} distance={3} style={styles.sideProp}>
            <Prop emoji={rest[1]} size={36} />
          </Bob>
        )}
      </View>
    </View>
  );
}

/** 動畫用的共用工具：在 0 和 1 之間來回（或一直往前），減少動態效果時不動 */
function useLoop(duration: number, delay = 0, reverse = true, still = 0) {
  const reduceMotion = useReducedMotion();
  const value = useSharedValue(still);
  useEffect(() => {
    if (reduceMotion) return;
    value.value = 0;
    value.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: reverse ? Easing.inOut(Easing.sin) : Easing.linear }), -1, reverse),
    );
  }, [delay, duration, reduceMotion, reverse, value]);
  return value;
}

function Bob({ children, delay, distance, style }: { children: ReactNode; delay: number; distance: number; style?: ViewStyle }) {
  const t = useLoop(1800, delay);
  const animated = useAnimatedStyle(() => ({ transform: [{ translateY: -distance * t.value }] }));
  return <Animated.View style={[style, animated]}>{children}</Animated.View>;
}

function Prop({ emoji, size }: { emoji: string; size: number }) {
  return (
    <View style={styles.prop}>
      <ThemedText style={{ fontSize: size, lineHeight: size * 1.25 }}>{emoji}</ThemedText>
      <View style={[styles.shadow, { width: size * 0.75 }]} />
    </View>
  );
}

function Bubble({ mood }: { mood: string }) {
  const t = useLoop(1400, 300);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: 1 + 0.08 * t.value }] }));
  return (
    <Animated.View style={[styles.bubble, animated]}>
      <ThemedText style={styles.bubbleEmoji}>{mood}</ThemedText>
      <View style={styles.bubbleTail} />
    </Animated.View>
  );
}

function Sun({ top, big = false, color = '#FFD45C' }: { top: number; big?: boolean; color?: string }) {
  const t = useLoop(2600);
  const size = big ? 70 : 36;
  const halo = useAnimatedStyle(() => ({ transform: [{ scale: 1 + 0.18 * t.value }], opacity: 0.35 - 0.15 * t.value }));
  const position = big ? { left: '42%' as const, top } : { right: '10%' as const, top };
  return (
    <View style={[styles.celestial, position, { width: size, height: size }]}>
      <Animated.View style={[styles.round, { width: size, height: size, backgroundColor: color }, halo, styles.halo]} />
      <View style={[styles.round, { width: size, height: size, backgroundColor: color }]} />
    </View>
  );
}

function Moon({ top }: { top: number }) {
  const t = useLoop(3200);
  const halo = useAnimatedStyle(() => ({ transform: [{ scale: 1.3 + 0.2 * t.value }], opacity: 0.18 }));
  return (
    <View style={[styles.celestial, { right: '12%', top, width: 30, height: 30 }]}>
      <Animated.View style={[styles.round, styles.halo, { width: 30, height: 30, backgroundColor: '#F4EBC3' }, halo]} />
      <View style={[styles.round, { width: 30, height: 30, backgroundColor: '#F4EBC3' }]} />
    </View>
  );
}

function Star({ left, top, delay }: { left: `${number}%`; top: number; delay: number }) {
  const t = useLoop(1200, delay, true, 1);
  const animated = useAnimatedStyle(() => ({ opacity: 0.3 + 0.7 * t.value }));
  return <Animated.View style={[styles.star, { left, top }, animated]} />;
}

function Cloud({
  left,
  top,
  scale,
  distance,
  duration,
  dark,
}: {
  left: `${number}%`;
  top: number;
  scale: number;
  distance: number;
  duration: number;
  dark: boolean;
}) {
  const t = useLoop(duration);
  const animated = useAnimatedStyle(() => ({ transform: [{ translateX: distance * t.value }, { scale }] }));
  const color = dark ? 'rgba(220,226,232,0.95)' : 'rgba(255,255,255,0.92)';
  return (
    <Animated.View style={[styles.cloud, { left, top }, animated]}>
      <View style={[styles.puff, { width: 30, height: 30, left: 10, top: 0, backgroundColor: color }]} />
      <View style={[styles.puff, { width: 38, height: 38, left: 28, top: -8, backgroundColor: color }]} />
      <View style={[styles.cloudBase, { backgroundColor: color }]} />
    </Animated.View>
  );
}

function Raindrop({ left, height, delay }: { left: `${number}%`; height: number; delay: number }) {
  const t = useLoop(900, delay, false, 0.5);
  const animated = useAnimatedStyle(() => ({ transform: [{ translateY: -20 + (height + 20) * t.value }, { rotate: '15deg' }] }));
  return <Animated.View style={[styles.raindrop, { left }, animated]} />;
}

function Snowflake({ left, height, delay }: { left: `${number}%`; height: number; delay: number }) {
  const t = useLoop(4200, delay, false, 0.4);
  const animated = useAnimatedStyle(() => ({
    transform: [
      { translateY: -10 + (height + 10) * t.value },
      { translateX: 6 * Math.sin(t.value * Math.PI * 4) },
    ],
  }));
  return <Animated.View style={[styles.snowflake, { left }, animated]} />;
}

function Ripple({ left, top, delay }: { left: `${number}%`; top: number; delay: number }) {
  const t = useLoop(1500, delay, false);
  const animated = useAnimatedStyle(() => ({ transform: [{ scaleX: 0.4 + 0.8 * t.value }, { scaleY: 0.4 + 0.8 * t.value }], opacity: 0.8 - 0.8 * t.value }));
  return <Animated.View style={[styles.ripple, { left, top }, animated]} />;
}

function IndoorWall({ height, colors }: { height: number; colors: Palette }) {
  return (
    <>
      {/* 窗戶和窗簾 */}
      <View style={[styles.window, { top: height * 0.1, borderColor: colors.hill }]}>
        <View style={[styles.windowPane, { borderColor: colors.hill }]} />
        <View style={[styles.windowSill, { backgroundColor: colors.hill }]} />
      </View>
      <View style={[styles.curtain, { top: height * 0.06, left: '4%' }]} />
      <View style={[styles.curtain, { top: height * 0.06, left: '27%' }]} />
      {/* 牆上的畫框 */}
      <View style={[styles.picture, { top: height * 0.14, borderColor: colors.hill }]} />
    </>
  );
}

function Foreground({ kind, groundTop, height }: { kind: Backdrop; groundTop: number; height: number }) {
  if (kind === 'indoor') {
    return (
      <>
        {[0.18, 0.5, 0.82].map((y) => (
          <View key={y} style={[styles.plank, { top: groundTop + (height - groundTop) * y }]} />
        ))}
        <View style={[styles.rug, { top: groundTop + 6 }]} />
      </>
    );
  }
  if (kind === 'city') {
    return (
      <>
        <View style={[styles.road, { top: groundTop + (height - groundTop) * 0.45 }]} />
        {[6, 30, 54, 78].map((x) => (
          <View key={x} style={[styles.laneMark, { left: `${x}%`, top: groundTop + (height - groundTop) * 0.68 }]} />
        ))}
      </>
    );
  }
  if (kind === 'snow') {
    return (
      <>
        <View style={[styles.mound, { left: '-6%', top: height - 22 }]} />
        <View style={[styles.mound, { right: '-8%', top: height - 18, width: '40%' }]} />
      </>
    );
  }
  if (kind === 'rain') {
    return (
      <>
        <View style={[styles.puddle, { left: '10%', top: height - 20 }]} />
        <View style={[styles.puddle, { left: '68%', top: height - 16, width: 50 }]} />
        <Ripple left="14%" top={height - 22} delay={0} />
        <Ripple left="71%" top={height - 18} delay={700} />
      </>
    );
  }
  // 草地上的小草和花
  return (
    <>
      {GRASS.map(([x, y], i) => (
        <View key={i} style={[styles.grass, { left: `${x}%`, top: groundTop + (height - groundTop) * y }]} />
      ))}
      {kind !== 'night' && kind !== 'dawn' && (
        <>
          <ThemedText style={[styles.flower, { left: '4%', top: height - 24 }]}>🌼</ThemedText>
          <ThemedText style={[styles.flower, { right: '5%', top: height - 22 }]}>🌷</ThemedText>
        </>
      )}
    </>
  );
}

/** 星星、雨滴、雪花、大樓、草的位置（x 用百分比） */
const STARS: [number, number][] = [
  [8, 0.12], [22, 0.3], [35, 0.08], [48, 0.22], [64, 0.1], [88, 0.28], [76, 0.4], [15, 0.45],
];
const RAIN: [number, number][] = [
  [4, 0], [12, 300], [20, 600], [28, 150], [36, 450], [44, 750], [52, 100], [60, 400],
  [68, 700], [76, 250], [84, 550], [92, 850],
];
const SNOW: [number, number][] = [
  [5, 0], [15, 1400], [25, 700], [35, 2100], [45, 300], [55, 1700], [65, 1000], [75, 2600],
  [85, 500], [95, 1900],
];
const BUILDINGS: [number, number, number][] = [
  [2, 14, 0.38], [17, 10, 0.5], [29, 16, 0.3], [47, 12, 0.46], [61, 15, 0.34], [78, 10, 0.52], [89, 12, 0.28],
];
const WINDOW_ROWS = [0, 1, 2, 3, 4];
const GRASS: [number, number][] = [
  [12, 0.25], [26, 0.6], [40, 0.3], [57, 0.7], [72, 0.35], [86, 0.62], [33, 0.85], [64, 0.15],
];

const styles = StyleSheet.create({
  frame: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  horizon: {
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 0.55,
  },
  celestial: {
    position: 'absolute',
  },
  round: {
    borderRadius: 999,
  },
  halo: {
    position: 'absolute',
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
    width: 80,
    height: 34,
  },
  puff: {
    position: 'absolute',
    borderRadius: 999,
  },
  cloudBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 18,
    borderRadius: 9,
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
    paddingTop: 6,
    gap: 6,
    alignItems: 'center',
  },
  windowRow: {
    flexDirection: 'row',
    gap: 4,
  },
  cityWindow: {
    width: 5,
    height: 6,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 244, 196, 0.85)',
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
  windowSill: {
    position: 'absolute',
    left: -8,
    right: -8,
    bottom: -8,
    height: 5,
    borderRadius: 2,
  },
  curtain: {
    position: 'absolute',
    width: 14,
    height: 66,
    borderRadius: 6,
    backgroundColor: 'rgba(214, 40, 57, 0.55)',
  },
  picture: {
    position: 'absolute',
    right: '12%',
    width: 40,
    height: 30,
    borderWidth: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(106, 168, 79, 0.45)',
  },
  ground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  plank: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  rug: {
    position: 'absolute',
    left: '22%',
    right: '22%',
    height: 26,
    borderRadius: 999,
    backgroundColor: 'rgba(214, 40, 57, 0.35)',
  },
  road: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#6E6E78',
  },
  laneMark: {
    position: 'absolute',
    width: '10%',
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#F2F2F2',
  },
  mound: {
    position: 'absolute',
    width: '45%',
    height: 40,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  puddle: {
    position: 'absolute',
    width: 64,
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(160, 190, 210, 0.7)',
  },
  ripple: {
    position: 'absolute',
    width: 40,
    height: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  grass: {
    position: 'absolute',
    width: 4,
    height: 9,
    borderRadius: 2,
    backgroundColor: 'rgba(40, 100, 30, 0.45)',
    transform: [{ rotate: '-12deg' }],
  },
  flower: {
    position: 'absolute',
    fontSize: 16,
    lineHeight: 20,
  },
  raindrop: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 13,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  snowflake: {
    position: 'absolute',
    top: 0,
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
    alignItems: 'flex-end',
    gap: Spacing.three,
  },
  sideProp: {
    marginBottom: 2,
  },
  prop: {
    alignItems: 'center',
  },
  shadow: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: -6,
  },
  bubble: {
    position: 'absolute',
    top: -22,
    right: -22,
    minWidth: 34,
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  bubbleEmoji: {
    fontSize: 18,
    lineHeight: 24,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -4,
    left: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});
