import { CharacterState, GameAction, GameStatus, ScanResult } from '@/types';
import { defaultStatus } from './storage';

// チョコレート判定
export function isChocolateSnack(result: ScanResult): boolean {
  if (result.isChocolate) return true;
  const name = (result.snackName || '').toLowerCase();
  return (
    name.includes('チョコ') ||
    name.includes('chocolate') ||
    name.includes('アルフォート') ||
    name.includes('カカオ') ||
    name.includes('ガトーショコラ') ||
    name.includes('ポッキー')
  );
}

export function resolveCharacterState(status: GameStatus): CharacterState {
  // ★最優先ルール: チョコを3回連続で食べると、どんな状態（虫歯やぽっちゃり）でもシャラメ・ウォンカ化！
  if (status.chocoStreak >= 3) return 'WONKA';

  // 通常の優先順位: CAVITY > FAT > MUSCLE > NORMAL
  if (status.cavityRisk >= 50) return 'CAVITY';
  if (status.calorieStock >= 500) return 'FAT';
  if (status.workoutDoneOnce && status.calorieStock < 200) return 'MUSCLE';
  return 'NORMAL';
}

export function gameReducer(state: GameStatus, action: GameAction): GameStatus {
  switch (action.type) {
    case 'EAT_SNACK': {
      const newCal = Math.min(2000, Math.max(0, state.calorieStock + action.payload.calories));
      const newCav = Math.min(100, Math.max(0, state.cavityRisk + action.payload.cavityRiskScore));
      const isChoco = isChocolateSnack(action.payload);
      const newChocoStreak = isChoco ? state.chocoStreak + 1 : 0; // チョコ以外を食べたらストリークリセット

      return {
        ...state,
        calorieStock: newCal,
        cavityRisk: newCav,
        chocoStreak: newChocoStreak,
        lastOpenedAt: new Date().toISOString(),
      };
    }
    case 'WORKOUT_DONE': {
      const newCal = Math.max(0, state.calorieStock - action.payload.calories);
      return {
        ...state,
        calorieStock: newCal,
        workoutDoneOnce: true,
        // 運動するとウォンカ化も解除に向かう
        chocoStreak: Math.max(0, state.chocoStreak - 1),
        lastOpenedAt: new Date().toISOString(),
      };
    }
    case 'BRUSHING_DONE': {
      const newCav = Math.max(0, state.cavityRisk - 30);
      return {
        ...state,
        cavityRisk: newCav,
        lastOpenedAt: new Date().toISOString(),
      };
    }
    case 'RESET': {
      return {
        ...defaultStatus,
        lastOpenedAt: new Date().toISOString(),
      };
    }
    default:
      return state;
  }
}
