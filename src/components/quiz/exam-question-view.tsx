import { StyleSheet, View } from 'react-native';

import { AnswerOption, type AnswerState } from './answer-option';
import { ExamSentence } from './exam-sentence';
import { ListeningPlayer } from './listening-player';
import { PassageCard } from './passage-card';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { EXAM_TYPE_PROMPTS } from '@/data/exam';
import { useTheme } from '@/hooks/use-theme';
import { hasSpokenOptions } from '@/lib/audio-manager';
import type { ExamRoundQuestion } from '@/lib/quiz';

type ExamQuestionViewProps = {
  item: ExamRoundQuestion;
  picked: string | null;
  getState: (option: string) => AnswerState;
  onPick: (option: string) => void;
  /** 是否顯示對錯和解說；模擬考作答中為 false，可以改答案 */
  reveal?: boolean;
  /** 聽解的播放規則（模擬考正式模式只播一次）；沒給就是練習：可以重播 */
  listening?: { allowReplay: boolean; played: boolean; onPlayed: () => void };
};

const OPTION_NUMBERS = ['１', '２', '３', '４'];

/** 聽解各大題的作答說明 */
const SUBCATEGORY_PROMPTS: Partial<Record<string, string>> = {
  task: '先聽問題，再聽對話，選出接下來要做的事或正確答案。',
  point: '先聽問題，看一下選項，再聽對話找出重點。',
  utterance: '看情境說明，聽三個說法，選出最適合的一個。',
  'quick-response': '聽一句話，再聽三個回答，選出最適合的回答。',
};

/** 一題模擬試題：（讀解的文章或聽解的播放器）、題目、四個選項，作答後顯示解說 */
export function ExamQuestionView({
  item,
  picked,
  getState,
  onPick,
  reveal = true,
  listening,
}: ExamQuestionViewProps) {
  const theme = useTheme();
  const { question, options } = item;
  // 發話表現、即時應答：選項用唸的，作答時只顯示號碼，作答後才顯示文字
  const spoken = hasSpokenOptions(item);
  const showOptionText = !spoken || (reveal && picked !== null);

  return (
    <>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {question.subcategory && SUBCATEGORY_PROMPTS[question.subcategory]
          ? SUBCATEGORY_PROMPTS[question.subcategory]
          : EXAM_TYPE_PROMPTS[question.type]}
      </ThemedText>
      {question.passage && (
        <PassageCard passage={question.passage} furigana={question.passageFurigana} />
      )}
      {(question.script || question.type === 'listening') && (
        <ListeningPlayer
          // 每一題一個播放器：換題時播放狀態重新開始
          key={question.id}
          item={item}
          showTranscript={reveal && picked !== null}
          allowReplay={listening?.allowReplay ?? true}
          played={listening?.played ?? false}
          onPlayed={listening?.onPlayed}
        />
      )}
      <ExamSentence sentence={question.sentence} furigana={question.furigana} />
      <View style={styles.options}>
        {options.map((option, i) => (
          <AnswerOption
            key={option}
            label={
              showOptionText
                ? spoken
                  ? `${OPTION_NUMBERS[i]}　${option}`
                  : option
                : OPTION_NUMBERS[i]
            }
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
              {question.type === 'listening' ? '中文翻譯' : '題目翻譯'}：{question.translation}
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
