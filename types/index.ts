export type CharacterState = 'NORMAL' | 'FAT' | 'MUSCLE' | 'CAVITY' | 'WONKA';

export type CutInTrigger =
  | 'SCAN_NON_SNACK'
  | 'SCAN_HEALTHY'
  | 'SCAN_HIGH_CALORIE'
  | 'SCAN_NORMAL'
  | 'WORKOUT_START'
  | 'MISSION_COMPLETE'
  | 'STATUS_FAT'
  | 'STATUS_CAVITY';

export interface GameStatus {
  calorieStock: number;      // 0〜2000
  cavityRisk: number;        // 0〜100
  workoutDoneOnce: boolean;
  chocoStreak: number;       // 連続チョコ摂取回数（2回以上でWONKA化）
  lastOpenedAt: string;      // ISO8601
}

export interface ScanResult {
  snackName: string;
  calories: number;
  cavityRiskScore: number;
  exerciseType: 'squat' | 'walk' | 'jog';
  exerciseAmount: number;     // 回数 or 秒数
  exerciseCalories: number;
  takuyaLine: string;         // 30文字以内
  isHealthy: boolean;
  isHighCalorie: boolean;
  isNonSnack: boolean;
  isChocolate?: boolean;     // チョコレート系フラグ
}

export interface CutInConfig {
  trigger: CutInTrigger;
  imagePath: string;
  phrase: string;
  audioPath?: string;
  durationMs: number;
}

export type GameAction =
  | { type: 'EAT_SNACK'; payload: ScanResult }
  | { type: 'WORKOUT_DONE'; payload: { calories: number } }
  | { type: 'BRUSHING_DONE' }
  | { type: 'RESET' };
