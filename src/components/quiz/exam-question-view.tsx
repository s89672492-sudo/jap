import { StyleSheet, View } from 'react-native';

import { AnswerOption, type AnswerState } from './answer-option';
import { ExamSentence } from './exam-sentence';
import { ListeningPlayer } from './listening-player';
import { PassageCard } from './passage-card';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { EXAM_TYPE_PROMPTS } from '@/data/exam';
import { useTheme } from '@/hooks/use-theme';
import type { ExamRoundQuestion } from '@/lib/quiz';

type ExamQuestionViewProps = {
  item: ExamRoundQuestion;
  picked: string | null;
  getState: (option: string) => AnswerState;
  onPick: (option: string) => void;
  /** 是否顯示對錯和解說；模擬考作答中為 false，可以改答案 */
  reveal?: boolean;
};

/** 一題模擬試題：（讀解的文章或聽解的播放器）、題目、四個選項，作答後顯示解說 */
export function ExamQuestionView({
  item,
  picked,
  getState,
  onPick,
  reveal = true,
}: ExamQuestionViewProps) {
  const theme = useTheme();
  const { question, options } = item;

  return (
    <>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {EXAM_TYPE_PROMPTS[question.type]}
      </ThemedText>
      {question.passage && (
        <PassageCard passage={question.passage} furigana={question.passageFurigana} />
      )}
      {question.script && (
        <ListeningPlayer
          questionId={question.id}
          script={question.script}
          question={question.sentence}
          showTranscript={reveal && picked !== null}
        />
      )}
      <ExamSentence sentence={question.sentence} furigana={question.furigana} />
      <View style={styles.options}>
        {options.map((option) => (
          <AnswerOption
            key={option}
            label={option}
            state={getState(option)}
            disabled={reveal && picked !== null}
            onPress={() => onPick(option)}
            japanese={question.type !== 'kanji-reading' && question.type !== 'orthography'}
          />
        ))}
      </View>
      {reveal && picked !== null && (
        <View
          style={[
            styles.explanation,
            { backgroundColor: theme.backgroundSelected, borderColor: theme.gold },
          ]}>
          <ThemedText type="smallBold" style={{ color: theme.gold }}>
            推理解說
          </ThemedText>
          <ThemedText type="small">{question.explanation}</ThemedText>
          {question.translation && (
            <ThemedText type="small" themeColor="textSecondary">
              題目翻譯：{question.translation}
            </ThemedText>
          )}
          {question.optionNotes && (
            <View style={styles.notes}>
              {question.options.map((option, i) => (
                <ThemedText key={option} type="small">
                  <ThemedText
                    type="smallBold"
                    style={{ color: i === 0 ? theme.success : theme.textSecondary }}>
                    {i === 0 ? '✓ ' : '✗ '}
                    {option}：
                  </ThemedText>
                  {question.optionNotes?.[i]}
                </ThemedText>
              ))}
            </View>
          )}
          {question.passageTranslation && (
            <View style={[styles.translation, { borderTopColor: theme.border }]}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                文章翻譯
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {question.passageTranslation}
              </ThemedText>
            </View>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: Spacing.two,
  },
  notes: {
    gap: Spacing.one,
  },
  translation: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two,
    gap: Spacing.half,
  },
  explanation: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
