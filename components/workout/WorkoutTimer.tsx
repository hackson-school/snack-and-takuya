'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Footprints, Check } from 'lucide-react';

interface WorkoutTimerProps {
  targetMinutes: number;
  exerciseType: 'walk' | 'jog';
  calories: number;
  onComplete: () => void;
}

export function WorkoutTimer({ targetMinutes, exerciseType, calories, onComplete }: WorkoutTimerProps) {
  const totalSeconds = Math.max(60, targetMinutes * 60);
  const [remaining, setRemaining] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && remaining > 0) {
      interval = setInterval(() => {
        setRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isActive && remaining === 0) {
      setIsActive(false);
      setIsCompleted(true);
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, remaining, onComplete]);

  const toggleTimer = () => {
    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setRemaining(totalSeconds);
    setIsCompleted(false);
  };

  const handleManualComplete = () => {
    setIsActive(false);
    setIsCompleted(true);
    onComplete();
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formatTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const label = exerciseType === 'walk' ? 'ウォーキング' : 'ジョギング';

  return (
    <div className="space-y-3 text-center select-none">
      <div className="bg-zinc-950 p-4 border-2 border-cyan-400 rounded-sm space-y-2">
        <div className="text-[11px] text-cyan-300 font-game flex items-center justify-center gap-1.5">
          <Footprints className="w-4 h-4" />
          <span>{label.toUpperCase()} TIMER</span>
        </div>

        {/* タイマー数字 */}
        <div className="text-4xl font-extrabold text-yellow-300 font-game tracking-widest my-1">
          {formatTime}
        </div>

        <div className="text-[10px] text-zinc-300 font-bold">
          目標時間: <span className="text-yellow-400">{targetMinutes} 分</span>（約 {calories} kcal 消費）
        </div>
      </div>

      {/* 操作ボタン */}
      {!isCompleted ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={toggleTimer}
              className={`py-3 flex items-center justify-center gap-2 font-extrabold rounded border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer font-game text-xs transition-transform active:scale-95 ${
                isActive
                  ? 'bg-orange-500 hover:bg-orange-400 text-white'
                  : 'bg-cyan-400 hover:bg-cyan-300 text-black'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>一時停止</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>タイマースタート</span>
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="py-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 font-bold rounded border border-zinc-600 cursor-pointer font-game text-xs flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>リセット</span>
            </button>
          </div>

          {/* 実際の運動後・デモ用完了ボタン */}
          <button
            onClick={handleManualComplete}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-extrabold rounded border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center justify-center gap-1.5 font-game text-xs transition-transform mt-1"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>運動完了！（カロリーを消費する）</span>
          </button>
        </div>
      ) : (
        <div className="p-4 bg-emerald-950 border-2 border-emerald-400 rounded flex items-center justify-center gap-2 text-emerald-300 font-game text-sm animate-pop">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>MISSION COMPLETE!</span>
        </div>
      )}
    </div>
  );
}
