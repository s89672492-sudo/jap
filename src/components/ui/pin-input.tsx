import { StyleSheet, TextInput } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PIN_MAX } from '@/lib/exam-pin';

type PinInputProps = {
  value: string;
  onChange: (text: string) => void;
  label: string;
  onSubmit?: () => void;
};

/** 數字密碼輸入框：只收數字、不顯示內容，高度至少 44 */
export function PinInput({ value, onChange, label, onSubmit }: PinInputProps) {
  const theme = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, PIN_MAX))}
      placeholder={label}
      placeholderTextColor={theme.textSecondary}
      accessibilityLabel={label}
      secureTextEntry
      keyboardType="number-pad"
      inputMode="numeric"
      autoComplete="off"
      autoCorrect={false}
      maxLength={PIN_MAX}
      returnKeyType="done"
      onSubmitEditing={onSubmit}
      style={[
        styles.input,
        { color: theme.text, backgroundColor: theme.background, borderColor: theme.border },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 20,
  },
});
