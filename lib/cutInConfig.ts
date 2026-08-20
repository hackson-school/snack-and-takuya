import { CutInConfig, CutInTrigger } from '@/types';

export const CUT_IN_CONFIGS: Record<CutInTrigger, CutInConfig> = {
  SCAN_NON_SNACK: {
    trigger: 'SCAN_NON_SNACK',
    imagePath: '/images/cho_mateyo_cutin.jpg',
    phrase: 'ちょ、待てよ！',
    audioPath: '/audio/cho_mateyo.mp3',
    durationMs: 1800,
  },
  SCAN_HEALTHY: {
    trigger: 'SCAN_HEALTHY',
    imagePath: '/images/cutin_wakattenjan.jpg',
    phrase: 'わかってんじゃん！',
    audioPath: '/audio/wakattenjyan.mp3', // 作成されたファイル名に一致
    durationMs: 1800,
  },
  SCAN_HIGH_CALORIE: {
    trigger: 'SCAN_HIGH_CALORIE',
    imagePath: '/images/cutin_majikayo.jpg',
    phrase: '本気かよ…',
    audioPath: '/audio/majikayo.mp3',
    durationMs: 1800,
  },
  SCAN_NORMAL: {
    trigger: 'SCAN_NORMAL',
    imagePath: '/images/cutin_bucchake.jpg',
    phrase: 'ぶっちゃけ…',
    audioPath: '/audio/bucchake.mp3',
    durationMs: 1800,
  },
  WORKOUT_START: {
    trigger: 'WORKOUT_START',
    imagePath: '/images/cutin_yacchae.jpg',
    phrase: 'やっちゃえ！',
    audioPath: '/audio/yacchae.mp3',
    durationMs: 1800,
  },
  MISSION_COMPLETE: {
    trigger: 'MISSION_COMPLETE',
    imagePath: '/images/cutin_warukunai.jpg',
    phrase: '…悪くない',
    audioPath: '/audio/warukunai.mp3',
    durationMs: 1800,
  },
  STATUS_FAT: {
    trigger: 'STATUS_FAT',
    imagePath: '/images/cho_mateyo_cutin.jpg',
    phrase: 'ちょ、待てよ！',
    audioPath: '/audio/cho_mateyo.mp3',
    durationMs: 1800,
  },
  STATUS_CAVITY: {
    trigger: 'STATUS_CAVITY',
    imagePath: '/images/cho_mateyo_cutin.jpg',
    phrase: 'ちょ、待てよ！',
    audioPath: '/audio/cho_mateyo.mp3',
    durationMs: 1800,
  },
};
