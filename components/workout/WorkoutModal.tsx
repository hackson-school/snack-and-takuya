'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/shared/Modal';
import { SquatCounter } from './SquatCounter';
import { WorkoutTimer } from './WorkoutTimer';
import { ScanResult, CutInTrigger } from '@/types';
import { Dumbbell, Footprints, Play, Flame, HeartHandshake, Shuffle } from 'lucide-react';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastScanResult: ScanResult | null;
  onCompleteWorkout: (calories: number) => void;
  onFireCutIn: (trigger: CutInTrigger, onFinish?: () => void) => void;
}

type WorkoutDifficulty = 'hard' | 'easy'; // hard: ガチ消費モード, easy: やさしさモード
type WorkoutTypeSelection = 'gym' | 'jog' | 'walk'; // gym: 筋トレ(スクワット/腕立て/腹筋)

const GYM_EXERCISES = [
  { name: 'スクワット', emoji: '🦵', unit: '回' },
  { name: '腕立て伏せ', emoji: '💪', unit: '回' },
  { name: '腹筋 (クランチ)', emoji: '🔥', unit: '回' },
];

export function WorkoutModal({
  isOpen,
  onClose,
  lastScanResult,
  onCompleteWorkout,
  onFireCutIn,
}: WorkoutModalProps) {
  const [difficulty, setDifficulty] = useState<WorkoutDifficulty>('easy');
  const [selectedType, setSelectedType] = useState<WorkoutTypeSelection>('gym');
  const [gymIndex, setGymIndex] = useState(0); // 0: スクワット, 1: 腕立て伏せ, 2: 腹筋
  const [hasStarted, setHasStarted] = useState(false);

  // モーダルを開いた時にランダムで筋トレ種目を抽選
  useEffect(() => {
    if (isOpen && !hasStarted) {
      const randomIndex = Math.floor(Math.random() * GYM_EXERCISES.length);
      setGymIndex(randomIndex);
    }
  }, [isOpen, hasStarted]);

  const currentGym = GYM_EXERCISES[gymIndex];

  const fullCalories = lastScanResult?.exerciseCalories || (lastScanResult?.calories ?? 200);

  // 【ガチ消費モード（ノーマル）】
  const hardJogMinutes = Math.max(5, Math.round(fullCalories / 8.5));
  const hardWalkMinutes = Math.max(10, Math.round(fullCalories / 4.0));
  // 腕立て・腹筋・スクワットに応じた回数
  const hardGymCount =
    currentGym.name === '腕立て伏せ'
      ? Math.max(15, Math.min(50, Math.round(fullCalories / 8)))
      : currentGym.name === '腹筋 (クランチ)'
      ? Math.max(20, Math.min(80, Math.round(fullCalories / 5)))
      : Math.max(20, Math.min(100, Math.round(fullCalories / 4)));

  // 【やさしさモード（お手軽）】
  const easyJogMinutes = 2;
  const easyWalkMinutes = 3;
  const easyGymCount =
    currentGym.name === '腕立て伏せ'
      ? 10
      : currentGym.name === '腹筋 (クランチ)'
      ? 15
      : 15;

  const activeBurnCalories = fullCalories;
  const activeGymCount = difficulty === 'hard' ? hardGymCount : easyGymCount;
  const activeMinutes =
    difficulty === 'hard'
      ? selectedType === 'walk'
        ? hardWalkMinutes
        : hardJogMinutes
      : selectedType === 'walk'
      ? easyWalkMinutes
      : easyJogMinutes;

  const handleStart = () => {
    // 運動開始カットイン: 「やっちゃえ！」
    onFireCutIn('WORKOUT_START');
    setHasStarted(true);
  };

  const handleFinish = () => {
    // 運動達成カットイン: 「…悪くない」
    onFireCutIn('MISSION_COMPLETE');
    onCompleteWorkout(activeBurnCalories);
    setTimeout(() => {
      setHasStarted(false);
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setHasStarted(false);
    onClose();
  };

  const handleShuffleGym = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGymIndex((prev) => (prev + 1) % GYM_EXERCISES.length);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="運動ミッション" headerColor="bg-cyan-400 text-black">
      <div className="space-y-3">
        {!hasStarted ? (
          <div className="space-y-3">
            {/* 難易度切り替えスイッチ */}
            <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded border-2 border-yellow-400 select-none">
              <button
                onClick={() => setDifficulty('easy')}
                className={`py-2 px-2 flex items-center justify-center gap-1.5 text-xs font-game rounded font-bold transition-all cursor-pointer ${
                  difficulty === 'easy'
                    ? 'bg-emerald-400 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>💖 やさしさモード</span>
              </button>

              <button
                onClick={() => setDifficulty('hard')}
                className={`py-2 px-2 flex items-center justify-center gap-1.5 text-xs font-game rounded font-bold transition-all cursor-pointer ${
                  difficulty === 'hard'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>🔥 ガチ消費モード</span>
              </button>
            </div>

            {/* モード説明バナー */}
            <div className="bg-zinc-900 px-3 py-1.5 rounded border border-zinc-700 text-center select-none">
              <p className="text-[11px] text-zinc-300 font-bold">
                {difficulty === 'easy'
                  ? '無理せずサクッと！一口分の軽い運動で達成OK 👍'
                  : '食べたカロリーを完全燃焼！本格トレーニング 💥'}
              </p>
            </div>

            {/* 運動メニュー選択タブ */}
            <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded border-2 border-cyan-400 select-none text-[11px] font-game">
              {/* 筋トレ（ランダム切り替え可能） */}
              <button
                onClick={() => setSelectedType('gym')}
                className={`py-2 px-1 flex flex-col items-center justify-center gap-1 rounded font-bold transition-all cursor-pointer relative ${
                  selectedType === 'gym'
                    ? 'bg-cyan-400 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span className="truncate">{currentGym.name}</span>
                <span className="text-[9px] font-sans font-bold opacity-90">{activeGymCount}回</span>
              </button>

              {/* 早歩き */}
              <button
                onClick={() => setSelectedType('walk')}
                className={`py-2 px-1 flex flex-col items-center justify-center gap-1 rounded font-bold transition-all cursor-pointer ${
                  selectedType === 'walk'
                    ? 'bg-cyan-400 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>足踏み/歩行</span>
                <span className="text-[9px] font-sans font-bold opacity-90">{difficulty === 'easy' ? easyWalkMinutes : hardWalkMinutes}分</span>
              </button>

              {/* ジョギング */}
              <button
                onClick={() => setSelectedType('jog')}
                className={`py-2 px-1 flex flex-col items-center justify-center gap-1 rounded font-bold transition-all cursor-pointer ${
                  selectedType === 'jog'
                    ? 'bg-cyan-400 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>ジョギング</span>
                <span className="text-[9px] font-sans font-bold opacity-90">{difficulty === 'easy' ? easyJogMinutes : hardJogMinutes}分</span>
              </button>
            </div>

            {/* 筋トレ種目チェンジボタン */}
            {selectedType === 'gym' && (
              <div className="flex justify-end">
                <button
                  onClick={handleShuffleGym}
                  className="flex items-center gap-1 text-[10px] text-cyan-300 hover:text-cyan-200 bg-zinc-900 px-2 py-1 rounded border border-cyan-500/40 cursor-pointer font-game active:scale-95"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>種目を変更（{currentGym.name} ➔ 次へ）</span>
                </button>
              </div>
            )}

            {/* ミッション情報カード */}
            <div className="bg-zinc-950 p-3 border-2 border-cyan-400 rounded-sm space-y-1.5 text-center">
              <div className="text-xs font-bold text-yellow-400 font-game">
                {lastScanResult ? `【${lastScanResult.snackName}】` : 'カロリー燃焼トレーニング'}
              </div>

              <div className="text-base font-extrabold text-zinc-100 font-sans">
                {selectedType === 'gym'
                  ? `${currentGym.emoji} ${currentGym.name} ${activeGymCount} 回`
                  : selectedType === 'walk'
                  ? `早歩き・その場足踏み ${difficulty === 'easy' ? easyWalkMinutes : hardWalkMinutes} 分`
                  : `ジョギング ${difficulty === 'easy' ? easyJogMinutes : hardJogMinutes} 分`}
              </div>

              <div className="text-[11px] text-zinc-400">
                達成で <span className="text-yellow-300 font-bold font-game">-{activeBurnCalories} kcal</span> を消費！
              </div>
            </div>

            {/* 開始ボタン */}
            <button
              onClick={handleStart}
              className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-black font-extrabold rounded border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center justify-center gap-2 font-game text-xs transition-transform"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>運動を開始する！</span>
            </button>
          </div>
        ) : selectedType === 'gym' ? (
          <SquatCounter
            exerciseName={currentGym.name}
            targetCount={activeGymCount}
            calories={activeBurnCalories}
            onComplete={handleFinish}
          />
        ) : (
          <WorkoutTimer
            targetMinutes={activeMinutes}
            exerciseType={selectedType}
            calories={activeBurnCalories}
            onComplete={handleFinish}
          />
        )}
      </div>
    </Modal>
  );
}
