import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SearchBoxProps = {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
};

/** 搜尋框：右邊有清除按鈕，高度至少 44 */
export function SearchBox({ value, onChange, placeholder }: SearchBoxProps) {
  const theme = useTheme();

  return (
    <View
      style={[styles.box, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <ThemedText themeColor="textSecondary" style={styles.icon}>
        🔍
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        accessibilityLabel={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        style={[styles.input, { color: theme.text }]}
      />
      {value.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="清除搜尋"
          onPress={() => onChange('')}
          style={({ pressed }) => [styles.clear, pressed && styles.pressed]}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            ✕
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 22,
    paddingLeft: Spacing.three,
  },
  icon: {
    fontSize: 14,
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    fontSize: 16,
    paddingVertical: 0,
  },
  clear: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
