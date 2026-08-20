import { ScanResult } from '@/types';

export interface PresetItem {
  id: string;
  name: string;
  category: string;
  emoji: string;
  data: ScanResult;
}

export const MOCK_PRESETS: PresetItem[] = [
  {
    id: 'alfort',
    name: 'アルフォート（1箱）',
    category: 'チョコレート菓子',
    emoji: '🍫',
    data: {
      snackName: 'アルフォートミニチョコレート',
      calories: 318,
      cavityRiskScore: 45,
      exerciseType: 'jog',
      exerciseAmount: 38,
      exerciseCalories: 318,
      takuyaLine: '318kcalか…ジョギング38分、走ってこいよ！',
      isHealthy: false,
      isHighCalorie: false,
      isNonSnack: false,
      isChocolate: true,
    },
  },
  {
    id: 'chocolate_bar',
    name: '板チョコ（ミルク）',
    category: 'チョコレート',
    emoji: '🍫',
    data: {
      snackName: 'ミルクチョコレート（1枚）',
      calories: 558,
      cavityRiskScore: 60,
      exerciseType: 'jog',
      exerciseAmount: 65,
      exerciseCalories: 558,
      takuyaLine: '本気かよ…558kcalを消費するにはジョギング65分だぞ！',
      isHealthy: false,
      isHighCalorie: true,
      isNonSnack: false,
      isChocolate: true,
    },
  },
  {
    id: 'potato_chips',
    name: 'ポテトチップス（うすしお）',
    category: 'スナック菓子',
    emoji: '🥔',
    data: {
      snackName: 'ポテトチップス うすしお味（60g）',
      calories: 336,
      cavityRiskScore: 20,
      exerciseType: 'jog',
      exerciseAmount: 40,
      exerciseCalories: 336,
      takuyaLine: '油っこいポテチ1袋…ジョギング40分だな！',
      isHealthy: false,
      isHighCalorie: false,
      isNonSnack: false,
      isChocolate: false,
    },
  },
  {
    id: 'gummy',
    name: '果汁グミ（ぶどう）',
    category: 'キャンディ・グミ',
    emoji: '🍇',
    data: {
      snackName: '果汁グミ ぶどう（51g）',
      calories: 167,
      cavityRiskScore: 75,
      exerciseType: 'jog',
      exerciseAmount: 20,
      exerciseCalories: 167,
      takuyaLine: 'グミ167kcal！ジョギング20分走ればチャラだ！',
      isHealthy: false,
      isHighCalorie: false,
      isNonSnack: false,
      isChocolate: false,
    },
  },
  {
    id: 'protein_bar',
    name: 'プロテインバー（チョコ）',
    category: 'フィットネス食品',
    emoji: '💪',
    data: {
      snackName: '高タンパクプロテインバー',
      calories: 185,
      cavityRiskScore: 10,
      exerciseType: 'squat',
      exerciseAmount: 60,
      exerciseCalories: 185,
      takuyaLine: 'タンパク質補給だな！スクワット60回いっとくか！',
      isHealthy: true,
      isHighCalorie: false,
      isNonSnack: false,
      isChocolate: false, // プロテインバーはヘルシー枠
    },
  },
  {
    id: 'candy',
    name: 'キャンディ・飴玉（5個）',
    category: 'キャンディ',
    emoji: '🍬',
    data: {
      snackName: 'フルーツアソートキャンディ（5粒）',
      calories: 110,
      cavityRiskScore: 85,
      exerciseType: 'walk',
      exerciseAmount: 28,
      exerciseCalories: 110,
      takuyaLine: '110kcal消費ならウォーキング28分だ。動けよ？',
      isHealthy: false,
      isHighCalorie: false,
      isNonSnack: false,
      isChocolate: false,
    },
  },
  {
    id: 'non_snack_stapler',
    name: 'ホッチキス（お菓子以外）',
    category: '文具・デモ用',
    emoji: '📎',
    data: {
      snackName: '事務用ホッチキス',
      calories: 0,
      cavityRiskScore: 0,
      exerciseType: 'squat',
      exerciseAmount: 10,
      exerciseCalories: 0,
      takuyaLine: 'ちょ、待てよ！これお菓子じゃねぇだろ！',
      isHealthy: false,
      isHighCalorie: false,
      isNonSnack: true,
      isChocolate: false,
    },
  },
];

export function getRandomMock(): ScanResult {
  const index = Math.floor(Math.random() * (MOCK_PRESETS.length - 1));
  return MOCK_PRESETS[index].data;
}
