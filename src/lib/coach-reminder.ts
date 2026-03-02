/**
 * 檢查使用者是否有 Coach 待提醒的目標（一週／三天／當日截止）
 */
export function hasCoachReminders(goals: { dueAt: Date }[]): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const g of goals) {
    const due = new Date(g.dueAt);
    due.setHours(0, 0, 0, 0);
    const daysUntil = Math.round((due.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    if (daysUntil === 0 || daysUntil === 3 || daysUntil === 7) return true;
  }
  return false;
}
