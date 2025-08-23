export interface ScheduleItem {
  id: string;
  title: string;
  date: string; // ISO 8601形式 (YYYY-MM-DD) で保存
  time?: string; // HH:mm形式で保存 (例: "20:00") または「未定」
  category: string; // 例: "配信", "イベント", "コラボ"
  platform: string; // 例: "YouTube", "Twitch", "X (Twitter)" // 追加
  notes?: string;
  isCompleted: boolean; // 完了済みかどうか
}
