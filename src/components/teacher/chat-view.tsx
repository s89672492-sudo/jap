import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ChatMessage } from '@/lib/local-llm-models';
import { cleanReply, SUGGESTED_QUESTIONS } from '@/lib/teacher-prompt';

type ChatViewProps = {
  messages: ChatMessage[];
  /** AI 正在回答 */
  busy: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  onClear: () => void;
};

/** 和 AI 老師的文字對話：訊息泡泡、建議問題、輸入框 */
export function ChatView({ messages, busy, onSend, onStop, onClear }: ChatViewProps) {
  const theme = useTheme();
  const [draft, setDraft] = useState('');
  const canSend = draft.trim().length > 0 && !busy;

  const send = () => {
    if (!canSend) return;
    onSend(draft.trim());
    setDraft('');
  };

  return (
    <View style={styles.container}>
      {messages.length === 0 ? (
        <View style={styles.suggestions}>
          <ThemedText type="small" themeColor="textSecondary">
            可以問文法、單字用法，或請老師幫你改日文。試試看：
          </ThemedText>
          {SUGGESTED_QUESTIONS.map((question) => (
            <Pressable
              key={question}
              accessibilityRole="button"
              onPress={() => onSend(question)}
              style={({ pressed }) => [
                styles.suggestion,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="small">{question}</ThemedText>
            </Pressable>
          ))}
        </View>
      ) : (
        messages.map((message, i) => {
          const mine = message.role === 'user';
          const typing = busy && i === messages.length - 1 && !mine;
          return (
            <View
              key={i}
              style={[
                styles.bubble,
                mine
                  ? [styles.mine, { backgroundColor: theme.primary }]
                  : [
                      styles.theirs,
                      { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                    ],
              ]}>
              {!mine && (
                <ThemedText type="smallBold" style={{ color: theme.accent }}>
                  🕵️ 老師
                </ThemedText>
              )}
              <ThemedText selectable style={[styles.text, mine && { color: theme.onPrimary }]}>
                {mine ? message.content : cleanReply(message.content) || (typing ? '思考中…' : '')}
                {typing && message.content ? ' ▍' : ''}
              </ThemedText>
            </View>
          );
        })
      )}

      <View
        style={[
          styles.inputRow,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="輸入問題（中文或日文）"
          placeholderTextColor={theme.textSecondary}
          accessibilityLabel="輸入問題"
          multiline
          maxLength={500}
          style={[styles.input, { color: theme.text }]}
        />
        {busy ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="停止回答"
            onPress={onStop}
            style={({ pressed }) => [
              styles.sendButton,
              { backgroundColor: theme.accent },
              pressed && styles.pressed,
            ]}>
            <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
              停止
            </ThemedText>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="送出"
            accessibilityState={{ disabled: !canSend }}
            disabled={!canSend}
            onPress={send}
            style={({ pressed }) => [
              styles.sendButton,
              { backgroundColor: theme.primary },
              !canSend && styles.disabled,
              pressed && styles.pressed,
            ]}>
            <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
              送出
            </ThemedText>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.footerNote}>
          AI 在你的裝置上執行，對話不會上傳。小型模型可能會出錯，重要內容請再查證。
        </ThemedText>
        {messages.length > 0 && !busy && (
          <Pressable
            accessibilityRole="button"
            onPress={onClear}
            style={({ pressed }) => [styles.clear, pressed && styles.pressed]}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              清除對話
            </ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  suggestions: {
    gap: Spacing.two,
  },
  suggestion: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '92%',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.half,
  },
  mine: {
    alignSelf: 'flex-end',
  },
  theirs: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 26,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 22,
    paddingLeft: Spacing.three,
    padding: Spacing.one,
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    maxHeight: 140,
    // 16px 以上，iPhone Safari 點輸入框時才不會自動放大畫面
    fontSize: 16,
    paddingVertical: Spacing.two,
  },
  sendButton: {
    minWidth: 64,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  footer: {
    gap: Spacing.one,
    alignItems: 'center',
  },
  footerNote: {
    textAlign: 'center',
  },
  clear: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
});
