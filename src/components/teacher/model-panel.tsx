import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  TEACHER_MODEL_KEYS,
  TEACHER_MODELS,
  type LoadProgress,
  type TeacherModelKey,
} from '@/lib/local-llm-models';

export type ModelPhase = 'idle' | 'loading' | 'ready' | 'error';

type ModelPanelProps = {
  modelKey: TeacherModelKey;
  onChangeModel: (key: TeacherModelKey) => void;
  /** 模型是否已經存在這台裝置；null 表示還在確認 */
  downloaded: boolean | null;
  phase: ModelPhase;
  progress: LoadProgress | null;
  error: string | null;
  online: boolean;
  onStart: () => void;
  onDelete: () => void;
  /** 裝置裡有這個模型的檔案（包含下載到一半的），可以刪除 */
  canDelete: boolean;
};

const MODEL_OPTIONS = TEACHER_MODEL_KEYS.map((key) => ({
  value: key,
  label: TEACHER_MODELS[key].label,
}));

/** 選模型、下載（第一次）或載入（之後）模型，顯示進度 */
export function ModelPanel({
  modelKey,
  onChangeModel,
  downloaded,
  phase,
  progress,
  error,
  online,
  onStart,
  onDelete,
  canDelete,
}: ModelPanelProps) {
  const theme = useTheme();
  const model = TEACHER_MODELS[modelKey];
  const loading = phase === 'loading';
  const needsNetwork = downloaded === false && !online;

  const status =
    downloaded === null
      ? '確認中…'
      : downloaded
        ? '✓ 已下載到這台裝置，離線也能使用'
        : `尚未下載（${model.download}，第一次需要網路）`;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}>
      <ThemedText type="smallBold" style={{ color: theme.accent }}>
        本地模型
      </ThemedText>
      <SegmentedControl
        options={MODEL_OPTIONS}
        value={modelKey}
        onChange={(key) => !loading && onChangeModel(key)}
      />
      <ThemedText type="small" themeColor="textSecondary">
        {model.note}
      </ThemedText>
      <ThemedText
        type="smallBold"
        style={{ color: downloaded ? theme.success : theme.textSecondary }}>
        {status}
      </ThemedText>

      {loading && (
        <View style={styles.progressBox}>
          <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
            <View
              style={[
                styles.fill,
                {
                  backgroundColor: theme.accent,
                  width: `${Math.round((progress?.progress ?? 0) * 100)}%`,
                },
              ]}
            />
          </View>
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={3}>
            {progress?.text || '準備中…'}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            下載或載入時請不要關閉這個頁面。
          </ThemedText>
        </View>
      )}

      {error && (
        <ThemedText type="small" style={{ color: theme.accent }}>
          {error}
        </ThemedText>
      )}

      {needsNetwork && (
        <ThemedText type="small" style={{ color: theme.accent }}>
          目前離線。第一次下載模型需要網路，請連上 Wi-Fi 後再試。
        </ThemedText>
      )}

      {phase !== 'ready' && (
        <PrimaryButton
          label={loading ? '處理中…' : downloaded ? '啟動 AI 老師' : '下載並啟動'}
          onPress={onStart}
          disabled={loading || downloaded === null || needsNetwork}
        />
      )}

      {(downloaded || canDelete) && !loading && (
        <Pressable
          accessibilityRole="button"
          onPress={onDelete}
          style={({ pressed }) => [styles.delete, pressed && styles.pressed]}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.deleteText}>
            刪除這個模型（釋放空間）
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  progressBox: {
    gap: Spacing.one,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  delete: {
    minHeight: 44,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
  },
  deleteText: {
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.6,
  },
});
