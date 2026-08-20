'use client';

import React, { useState } from 'react';
import { Dumbbell, CheckCircle2, Plus } from 'lucide-react';

interface SquatCounterProps {
  exerciseName?: string; // 例: 'スクワット', '腕立て伏せ', '腹筋'
  targetCount: number;
  calories: number;
  onComplete: () => void;
}

export function SquatCounter({
  exerciseName = 'スクワット',
  targetCount,
  calories,
  onComplete,
}: SquatCounterProps) {
  const [currentCount, setCurrentCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleIncrement = () => {
    if (isCompleted) return;
    const next = currentCount + 1;
    setCurrentCount(next);

    if (next >= targetCount) {
      setIsCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const progressPercent = Math.min(100, Math.round((currentCount / targetCount) * 100));

  return (
    <div className="space-y-4 text-center select-none">
      {/* カウント進捗 */}
      <div className="bg-zinc-950 p-4 border-2 border-cyan-400 rounded-sm space-y-2">
        <div className="text-[11px] text-cyan-300 font-game flex items-center justify-center gap-1.5">
          <Dumbbell className="w-4 h-4" />
          <span>{exerciseName.toUpperCase()} MISSION</span>
        </div>

        {/* カウント数字表示 */}
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl font-extrabold text-yellow-300 font-game">
            {currentCount}
          </span>
          <span className="text-sm font-bold text-zinc-400 font-game">
            / {targetCount} 回
          </span>
        </div>

        {/* プログレスバー */}
        <div className="h-3 w-full bg-zinc-900 border border-zinc-700 rounded-xs p-0.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-yellow-400 rounded-2xs transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-[10px] text-zinc-400 font-game">
          消費予定: 約 {calories} kcal
        </div>
      </div>

      {/* タップしてカウントボタン */}
      {!isCompleted ? (
        <button
          onClick={handleIncrement}
          className="w-full py-6 bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-black font-extrabold rounded border-4 border-black shadow-[4px_4px_0px_#000] cursor-pointer flex flex-col items-center justify-center gap-1 font-game text-sm transition-transform"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-6 h-6 stroke-[3]" />
            <span>{exerciseName} 1回完了！</span>
          </div>
          <span className="text-[10px] text-zinc-800">
            （タップしてカウントを加算）
          </span>
        </button>
      ) : (
        <div className="p-4 bg-emerald-950 border-2 border-emerald-400 rounded flex items-center justify-center gap-2 text-emerald-300 font-game text-sm animate-pop">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>MISSION COMPLETE!</span>
        </div>
      )}
    </div>
  );
}
