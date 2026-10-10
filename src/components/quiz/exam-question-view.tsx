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
};

/** 一題模擬試題：（讀解的文章或聽解的播放器）、題目、四個選項，作答後顯示解說 */
export function ExamQuestionView({ item, picked, getState, onPick }: ExamQuestionViewProps) {
  const theme = useTheme();
  const { question, options } = item;

  return (
    <>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {EXAM_TYPE_PROMPTS[question.type]}
      </ThemedText>
      {question.passage && <PassageCard passage={question.passage} />}
      {question.script && (
        <ListeningPlayer
          questionId={question.id}
          script={question.script}
          question={question.sentence}
          showTranscript={picked !== null}
        />
      )}
      <ExamSentence sentence={question.sentence} />
      <View style={styles.options}>
        {options.map((option) => (
          <AnswerOption
            key={option}
            label={option}
            state={getState(option)}
            disabled={picked !== null}
            onPress={() => onPick(option)}
            japanese={question.type !== 'kanji-reading' && question.type !== 'orthography'}
          />
        ))}
      </View>
      {picked !== null && (
        <View
          style={[
            styles.explanation,
            { backgroundColor: theme.backgroundSelected, borderColor: theme.gold },
          ]}>
          <ThemedText type="smallBold" style={{ color: theme.gold }}>
            推理解說
          </ThemedText>
          <ThemedText type="small">{question.explanation}</ThemedText>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: Spacing.two,
  },
  explanation: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
