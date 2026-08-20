'use client';

import React from 'react';
import { Camera, Dumbbell, Sparkles, RotateCcw } from 'lucide-react';

interface ActionNavProps {
  onScan: () => void;
  onWorkout: () => void;
  onBrushing: () => void;
  onReset: () => void;
}

export function ActionNav({ onScan, onWorkout, onBrushing, onReset }: ActionNavProps) {
  return (
    <div className="w-full bg-zinc-900 border-4 border-yellow-400 p-2 select-none shadow-lg">
      <div className="grid grid-cols-2 gap-2">
        {/* スキャン */}
        <button
          onClick={onScan}
          className="flex items-center justify-center gap-2 py-3 px-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-extrabold rounded-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-transform font-game text-xs"
        >
          <Camera className="w-4 h-4 stroke-[3]" />
          <span>スキャン</span>
        </button>

        {/* 運動 */}
        <button
          onClick={onWorkout}
          className="flex items-center justify-center gap-2 py-3 px-2 bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-black font-extrabold rounded-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-transform font-game text-xs"
        >
          <Dumbbell className="w-4 h-4 stroke-[3]" />
          <span>運動</span>
        </button>

        {/* 歯磨き */}
        <button
          onClick={onBrushing}
          className="flex items-center justify-center gap-2 py-3 px-2 bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-black font-extrabold rounded-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-transform font-game text-xs"
        >
          <Sparkles className="w-4 h-4 stroke-[3]" />
          <span>歯磨き</span>
        </button>

        {/* リセット */}
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 py-3 px-2 bg-zinc-700 hover:bg-zinc-600 active:scale-95 text-zinc-100 font-extrabold rounded-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-transform font-game text-xs"
        >
          <RotateCcw className="w-4 h-4 stroke-[3]" />
          <span>リセット</span>
        </button>
      </div>
    </div>
  );
}
