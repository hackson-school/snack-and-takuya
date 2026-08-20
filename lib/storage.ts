import { GameStatus } from '@/types';

const STORAGE_KEY = 'snack_hero_status';

export const defaultStatus: GameStatus = {
  calorieStock: 0,
  cavityRisk: 0,
  workoutDoneOnce: false,
  chocoStreak: 0,
  lastOpenedAt: new Date().toISOString(),
};

export function loadStatus(): GameStatus {
  if (typeof window === 'undefined') return defaultStatus;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStatus;
    const parsed = JSON.parse(raw);
    return {
      calorieStock: typeof parsed.calorieStock === 'number' ? parsed.calorieStock : defaultStatus.calorieStock,
      cavityRisk: typeof parsed.cavityRisk === 'number' ? parsed.cavityRisk : defaultStatus.cavityRisk,
      workoutDoneOnce: Boolean(parsed.workoutDoneOnce),
      chocoStreak: typeof parsed.chocoStreak === 'number' ? parsed.chocoStreak : defaultStatus.chocoStreak,
      lastOpenedAt: typeof parsed.lastOpenedAt === 'string' ? parsed.lastOpenedAt : defaultStatus.lastOpenedAt,
    };
  } catch (err) {
    console.error('Failed to load status from localStorage:', err);
    return defaultStatus;
  }
}

export function saveStatus(status: GameStatus): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
  } catch (err) {
    console.error('Failed to save status to localStorage:', err);
  }
}
