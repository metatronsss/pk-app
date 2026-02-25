const AFFINITY_MIN = -100;
const AFFINITY_MAX = 100;

export function clampAffinity(n: number): number {
  return Math.max(AFFINITY_MIN, Math.min(AFFINITY_MAX, n));
}

/**
 * 根據任務處罰金額計算完成目標時增加的好感度
 * 處罰金越高，好感度增加越多（正比）
 */
export function affinityGainFromGoalCompletion(penaltyCents: number): number {
  if (penaltyCents <= 0) return 1;
  const gain = Math.max(1, Math.min(5, Math.floor(penaltyCents / 2000)));
  return gain;
}
