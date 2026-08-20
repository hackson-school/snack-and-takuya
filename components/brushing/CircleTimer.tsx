'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

interface CircleTimerProps {
  durationSec?: number;
  onComplete: () => void;
}

export function CircleTimer({ durationSec = 60, onComplete }: CircleTimerProps) {
  const [remaining, setRemaining] = useState(durationSec);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isActive && remaining > 0) {
      timer = setInterval(() => {
        setRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isActive && remaining === 0) {
      setIsActive(false);
      setIsCompleted(true);
      onComplete();
    }
    return () => clearInterval(timer);
  }, [isActive, remaining, onComplete]);

  const toggleStart = () => {
    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setRemaining(durationSec);
    setIsCompleted(false);
  };

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = remaining / durationSec;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className="space-y-4 text-center select-none flex flex-col items-center">
      {/* 円形プログレスタイマー */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* 背景円 */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-zinc-800"
            strokeWidth="10"
            fill="transparent"
          />
          {/* プログレス円 */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-emerald-400 transition-all duration-1000 ease-linear"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* 中央表示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Sparkles className="w-5 h-5 text-emerald-400 mb-0.5" />
          <span className="text-3xl font-extrabold text-white font-game">
            {remaining}
          </span>
          <span className="text-[10px] text-zinc-400 font-game">SECONDS</span>
        </div>
      </div>

      {/* ガイドテキスト */}
      <div className="bg-zinc-950 p-2.5 rounded border border-emerald-500/40 w-full text-center">
        <p className="text-xs text-zinc-200 font-bold">
          🦷 歯の隅々までしっかりブラッシング！
        </p>
        <p className="text-[10px] text-emerald-400 mt-0.5 font-game">
          達成で虫歯リスク -70 PTS
        </p>
      </div>

      {/* 操作ボタン */}
      {!isCompleted ? (
        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            onClick={toggleStart}
            className={`py-3 flex items-center justify-center gap-2 font-extrabold rounded border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer font-game text-xs transition-transform active:scale-95 ${isActive
                ? 'bg-orange-500 hover:bg-orange-400 text-white'
                : 'bg-emerald-400 hover:bg-emerald-300 text-black'
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
                <span>磨き始める</span>
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
      ) : (
        <div className="p-3 bg-emerald-950 border-2 border-emerald-400 rounded flex items-center justify-center gap-2 text-emerald-300 font-game text-xs animate-pop w-full">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>歯磨き完了！お口スッキリ！</span>
        </div>
      )}
    </div>
  );
}
