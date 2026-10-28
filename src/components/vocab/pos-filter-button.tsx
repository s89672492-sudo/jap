import { useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { PART_OF_SPEECH_LABELS, type PartOfSpeech } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';

export type PosFilter = 'all' | PartOfSpeech;

const OPTIONS: { value: PosFilter; label: string }[] = [
  { value: 'all', label: '全部詞性' },
  ...(Object.keys(PART_OF_SPEECH_LABELS) as PartOfSpeech[]).map((pos) => ({
    value: pos,
    label: PART_OF_SPEECH_LABELS[pos],
  })),
];

export const posFilterLabel = (value: PosFilter) =>
  value === 'all' ? '全部詞性' : PART_OF_SPEECH_LABELS[value];

type PosFilterButtonProps = {
  value: PosFilter;
  onChange: (value: PosFilter) => void;
  /** 每個詞性有幾個單字（選單上顯示） */
  counts?: Partial<Record<PosFilter, number>>;
};

/**
 * 搜尋框旁的「篩選」按鈕：點了從下方出現詞性選單（名詞、動詞…）。
 * 有篩選時按鈕變成實心並顯示目前的詞性。
 */
export function PosFilterButton({ value, onChange, counts }: PosFilterButtonProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const active = value !== 'all';

  const pick = (next: PosFilter) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`詞性篩選，目前是${posFilterLabel(value)}`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.button,
          active
            ? { backgroundColor: theme.primary, borderColor: theme.primary }
            : { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          pressed && styles.pressed,
        ]}>
        <ThemedText
          type="smallBold"
          numberOfLines={1}
          style={{ color: active ? theme.onPrimary : theme.text }}>
          {active ? `${PART_OF_SPEECH_LABELS[value]} ▾` : '篩選 ▾'}
        </ThemedText>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          accessibilityLabel="關閉篩選選單"
          style={styles.backdrop}
          onPress={() => setOpen(false)}>
          {/* 點選單本身不要關掉 */}
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
                paddingBottom: insets.bottom + Spacing.three,
              },
            ]}
            onPress={() => {}}>
            <ThemedText type="smallBold" style={styles.heading}>
              依詞性篩選單字
            </ThemedText>
            {OPTIONS.map((option) => {
              const selected = option.value === value;
              const count = counts?.[option.value];
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  aria-checked={selected}
                  onPress={() => pick(option.value)}
                  style={({ pressed }) => [
                    styles.row,
                    {
                      borderColor: selected ? theme.primary : theme.border,
                      backgroundColor: selected ? theme.backgroundSelected : theme.background,
                    },
                    pressed && styles.pressed,
                  ]}>
                  <ThemedText style={styles.label}>{option.label}</ThemedText>
                  {count !== undefined && (
                    <ThemedText type="small" themeColor="textSecondary">
                      {count} 個
                    </ThemedText>
                  )}
                  {selected && (
                    <ThemedText type="smallBold" style={{ color: theme.primary }}>
                      ✓
                    </ThemedText>
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    width: '100%',
    maxWidth: MaxContentWidth,
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  heading: {
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderRadius: Spacing.three,
  },
  label: {
    flex: 1,
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.7,
  },
});
