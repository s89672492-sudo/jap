import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SpeakButton } from '@/components/ui/speak-button';
import { Spacing } from '@/constants/theme';
import type { VocabWord } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';

type ExampleSentenceProps = {
  word: VocabWord;
};

/**
 * 在例句中找出單字出現的位置。動詞、形容詞會變化，
 * 所以去掉字尾的假名（例如「食べる」→「食べ」）再找。
 */
function splitAtWord(sentence: string, word: string): [string, string, string] | null {
  const core = word.replace(/[ぁ-ん]+$/, '') || word;
  const index = sentence.indexOf(core);
  if (index < 0) return null;
  return [sentence.slice(0, index), core, sentence.slice(index + core.length)];
}

/** 單字例句：日文（單字以強調色標出）、中文翻譯、發音按鈕 */
export function ExampleSentence({ word }: ExampleSentenceProps) {
  const theme = useTheme();
  const example = word.example;
  if (!example) return null;

  const parts = splitAtWord(example.ja, word.word);

  return (
    <View style={[styles.container, { borderTopColor: theme.border }]}>
      <View style={styles.text}>
        <ThemedText style={styles.ja}>
          {parts ? (
            <>
              {parts[0]}
              <ThemedText style={[styles.ja, styles.highlight, { color: theme.accent }]}>
                {parts[1]}
              </ThemedText>
              {parts[2]}
            </>
          ) : (
            example.ja
          )}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {example.zh}
        </ThemedText>
      </View>
      <SpeakButton text={example.ja} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two,
    alignSelf: 'stretch',
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  ja: {
    fontSize: 15,
    lineHeight: 22,
  },
  highlight: {
    fontWeight: 700,
  },
});
