import { useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChipButton } from '@/components/ui/chip-button';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { JLPT_LEVELS, type JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { setJlptLevel, useJlptLevel } from '@/stores/jlpt-level-store';

const LEVEL_NOTES: Record<JlptLevel, string> = {
  N5: '入門・基本的日常用語',
  N4: '初級・簡單的日常會話',
  N3: '中級・日常生活中的日文',
  N2: '中高級・新聞、工作上的日文',
  N1: '高級・抽象、專業的文章',
};

/**
 * 標題旁的「N2 ▾」：點了從下方出現等級選單。
 * 等級是各分頁共用的，在這裡換等級，單字、閱讀、測驗都會一起換。
 */
export function LevelPicker() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const level = useJlptLevel();
  const [open, setOpen] = useState(false);

  const pick = (next: JlptLevel) => {
    setJlptLevel(next);
    setOpen(false);
  };

  return (
    <>
      <ChipButton
        label={`${level} ▾`}
        filled
        accessibilityLabel={`切換等級，目前是 ${level}`}
        onPress={() => setOpen(true)}
      />
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          accessibilityLabel="關閉等級選單"
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
              選擇等級
            </ThemedText>
            {JLPT_LEVELS.map((option) => {
              const selected = option === level;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="radio"
                  aria-checked={selected}
                  onPress={() => pick(option)}
                  style={({ pressed }) => [
                    styles.row,
                    {
                      borderColor: selected ? theme.primary : theme.border,
                      backgroundColor: selected ? theme.backgroundSelected : theme.background,
                    },
                    pressed && styles.pressed,
                  ]}>
                  <ThemedText style={[styles.level, { color: theme.primary }]}>{option}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
                    {LEVEL_NOTES[option]}
                  </ThemedText>
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
  level: {
    fontSize: 18,
    fontWeight: 700,
    width: 36,
  },
  note: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});
