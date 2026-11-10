import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { TaskRow } from './task-row';

import { CaseCard } from '@/components/detective/case-card';
import { LevelPicker } from '@/components/ui/level-picker';
import { Spacing } from '@/constants/theme';
import type { JlptLevel } from '@/data/vocab';
import type { DailyArticle } from '@/hooks/use-daily-article';
import type { LearningProgress } from '@/hooks/use-learning-progress';

type TodayTasksProps = {
  level: JlptLevel;
  progress: LearningProgress;
  daily: DailyArticle | null;
  /** 打開「今日複習單字」清單 */
  onReviewWords: () => void;
};

const openQuiz = (mode: 'vocab' | 'grammar' | 'review') =>
  router.navigate({ pathname: '/quiz', params: { mode } });

/** 首頁「今日任務」：今天該複習的、今日文章、今天做了多少（連續天數等數字在上面的招牌區塊） */
export function TodayTasks({ level, progress, daily, onReviewWords }: TodayTasksProps) {
  const current = progress.levels[level];
  const todayLog = progress.log[progress.today] ?? { n: 0, c: 0, w: 0 };
  const practiced = todayLog.n > 0 || progress.readToday;

  return (
    <CaseCard label="TODAY" title="今日任務" action={<LevelPicker />}>
      <View style={styles.rows}>
        <TaskRow
          icon="due"
          title="待複習單字"
          note={current.dueWords > 0 ? '點開一個一個看，看完打勾' : '目前沒有到期的單字'}
          value={`${current.dueWords} 個`}
          done={current.dueWords === 0}
          onPress={current.dueWords > 0 ? onReviewWords : undefined}
        />
        {current.dueGrammar > 0 && (
          <TaskRow
            icon="grammar"
            title="待複習文法"
            value={`${current.dueGrammar} 個`}
            onPress={() => openQuiz('grammar')}
          />
        )}
        <TaskRow
          icon="review"
          title="待複習錯題"
          note={current.mistakes > 0 ? `錯題本共 ${current.mistakes} 題` : '錯題本是空的'}
          value={`${current.dueMistakes} 題`}
          done={current.dueMistakes === 0}
          onPress={current.mistakes > 0 ? () => openQuiz('review') : undefined}
        />
        {daily && (
          <TaskRow
            icon="article"
            title="今日閱讀"
            note={`${daily.article.title}（${daily.article.titleZh}）`}
            value="未讀"
            done={daily.doneToday}
            onPress={() => router.navigate({ pathname: '/reading', params: { open: 'daily' } })}
          />
        )}
        <TaskRow
          icon="done"
          title="今日已完成"
          note={
            practiced
              ? [
                  todayLog.n > 0 ? `答題 ${todayLog.n} 題（答對 ${todayLog.c}）` : null,
                  todayLog.w > 0 ? `新學 ${todayLog.w} 個` : null,
                  progress.readToday ? '讀完文章' : null,
                ]
                  .filter(Boolean)
                  .join('・')
              : '今天還沒開始練習，做任何一種測驗或單字卡都算'
          }
          value="還沒開始"
          done={practiced}
        />
      </View>
    </CaseCard>
  );
}

const styles = StyleSheet.create({
  rows: {
    gap: Spacing.two,
  },
});
