/** 網頁版：備份檔直接下載；還原時選擇檔案 */
export const canPickFile = true;

export async function saveBackupFile(name: string, text: string): Promise<void> {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  // 等瀏覽器開始下載（讀到檔名）後再移除、釋放
  setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(url);
  }, 10_000);
}

/** 讓使用者選一個備份檔，回傳檔案內容；取消時回傳 null */
export function pickBackupFile(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      file.text().then(resolve, () => resolve(null));
    };
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}
