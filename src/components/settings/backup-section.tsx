import { useEffect, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Spacing } from '@/constants/theme';
import { useHydrated } from '@/hooks/use-hydrated';
import { useTheme } from '@/hooks/use-theme';
import {
  createBackup,
  currentSummary,
  getLastExport,
  parseBackup,
  restoreBackup,
  summarize,
  type BackupFile,
  type BackupSummary,
} from '@/lib/backup';
import { canPickFile, pickBackupFile, saveBackupFile } from '@/lib/backup-file';

type Message = { kind: 'ok' | 'error'; text: string };

type Preview = { backup: BackupFile; incoming: BackupSummary; current: BackupSummary };

function formatDate(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** iPhone、iPad 的瀏覽器（沒有加入主畫面時），Safari 可能清掉太久沒開的網站資料 */
function isIosBrowserTab() {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') return false;
  const ios =
    /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1);
  const standalone =
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    window.matchMedia?.('(display-mode: standalone)').matches;
  return ios && !standalone;
}

/** 設定頁「學習紀錄備份」：匯出成一個檔案，或從備份檔還原（還原前先預覽、確認） */
export function BackupSection() {
  const theme = useTheme();
  const hydrated = useHydrated();
  const [lastExport, setLastExport] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  // 手機 App 沒有選檔案的功能，改成貼上備份內容
  const [pasting, setPasting] = useState(false);
  const [pasted, setPasted] = useState('');

  useEffect(() => {
    getLastExport().then(setLastExport);
  }, []);

  const exportBackup = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const { name, text } = await createBackup();
      await saveBackupFile(name, text);
      setLastExport(new Date().toISOString());
      setMessage({
        kind: 'ok',
        text: canPickFile
          ? `已下載「${name}」。請存到「檔案」或雲端硬碟，換手機或資料不見時可以還原。`
          : '已開啟分享選單。請存到「檔案」、雲端硬碟或傳給自己保存。',
      });
    } catch {
      setMessage({ kind: 'error', text: '匯出失敗，請再試一次。原本的紀錄沒有任何改變。' });
    } finally {
      setBusy(false);
    }
  };

  const check = async (text: string | null) => {
    if (text === null) return;
    const parsed = parseBackup(text);
    if (!parsed.ok) {
      setPreview(null);
      setMessage({ kind: 'error', text: parsed.message });
      return;
    }
    setMessage(null);
    setPreview({
      backup: parsed.backup,
      incoming: summarize(parsed.backup.data),
      current: await currentSummary(),
    });
  };

  const startRestore = async () => {
    setMessage(null);
    if (canPickFile) await check(await pickBackupFile());
    else setPasting(true);
  };

  const confirmRestore = async () => {
    if (!preview) return;
    setBusy(true);
    try {
      await restoreBackup(preview.backup);
      setMessage({ kind: 'ok', text: '還原完成，學習紀錄已換成備份檔的內容。' });
      setPreview(null);
      setPasting(false);
      setPasted('');
    } catch {
      setMessage({ kind: 'error', text: '還原失敗，已保留原本的紀錄，沒有任何改變。' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      {hydrated && (
        <ThemedText type="small" themeColor="textSecondary">
          {lastExport ? `上次備份：${formatDate(lastExport)}` : '還沒有備份過。'}
        </ThemedText>
      )}
      {hydrated && isIosBrowserTab() && (
        <View style={[styles.notice, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="small">
            iPhone 提醒：用 Safari
            開網站時，超過一段時間沒打開，網站資料可能被清除。建議把網站「加入主畫面」（分享按鈕 ›
            加入主畫面），並定期匯出備份。
          </ThemedText>
        </View>
      )}

      <PrimaryButton
        label={busy ? '處理中…' : '匯出備份檔'}
        onPress={busy ? () => {} : exportBackup}
      />
      {!preview && (
        <SecondaryButton label="從備份檔還原" onPress={busy ? () => {} : startRestore} />
      )}

      {pasting && !preview && (
        <View style={styles.paste}>
          <ThemedText type="small" themeColor="textSecondary">
            把之前分享出去的備份內容整段貼在下面：
          </ThemedText>
          <TextInput
            value={pasted}
            onChangeText={setPasted}
            multiline
            placeholder="貼上備份內容"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.border, backgroundColor: theme.background },
            ]}
          />
          <SecondaryButton label="檢查備份內容" onPress={() => check(pasted)} />
        </View>
      )}

      {preview && (
        <View style={[styles.preview, { borderColor: theme.accent }]}>
          <ThemedText type="smallBold">
            備份檔：{formatDate(preview.backup.exportedAt)} 匯出
          </ThemedText>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cellLabel}>
                項目
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cell}>
                備份檔
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.cell}>
                目前
              </ThemedText>
            </View>
            {preview.incoming.map((row, i) => (
              <View key={row.label} style={styles.tableRow}>
                <ThemedText type="small" style={styles.cellLabel}>
                  {row.label}
                </ThemedText>
                <ThemedText type="smallBold" style={styles.cell}>
                  {row.value}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.cell}>
                  {preview.current[i]?.value}
                </ThemedText>
              </View>
            ))}
          </View>
          <ThemedText type="small" style={{ color: theme.accent }}>
            還原會用備份檔「取代」這支手機目前的學習紀錄（不是合併），目前的紀錄會被覆蓋。不確定的話，請先按「匯出備份檔」保存目前的紀錄。
          </ThemedText>
          <PrimaryButton
            label={busy ? '還原中…' : '確定還原'}
            onPress={busy ? () => {} : confirmRestore}
          />
          <SecondaryButton label="取消" onPress={() => setPreview(null)} />
        </View>
      )}

      {message && (
        <ThemedText
          type="small"
          accessibilityLiveRegion="polite"
          style={{ color: message.kind === 'ok' ? theme.success : theme.accent }}>
          {message.kind === 'ok' ? '✓ ' : '✗ '}
          {message.text}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  notice: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
  },
  paste: {
    gap: Spacing.two,
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  preview: {
    borderWidth: 2,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  table: {
    gap: Spacing.one,
  },
  tableRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  cellLabel: {
    flex: 1.4,
  },
  cell: {
    flex: 1,
    textAlign: 'right',
  },
});
