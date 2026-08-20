'use client';

import React from 'react';
import { Flame, ShieldAlert } from 'lucide-react';

interface StatusBarProps {
  calorieStock: number; // 0〜2000
  cavityRisk: number;   // 0〜100
}

export function StatusBar({ calorieStock, cavityRisk }: StatusBarProps) {
  // カロリー割合 (0〜2000)
  const calPercent = Math.min(100, Math.max(0, (calorieStock / 2000) * 100));
  // 虫歯リスク割合 (0〜100)
  const cavPercent = Math.min(100, Math.max(0, cavityRisk));

  const isCalorieWarning = calorieStock >= 500;
  const isCavityWarning = cavityRisk >= 50;

  return (
    <div className="w-full bg-zinc-900 border-x-4 border-b-4 border-yellow-400 p-2.5 space-y-2 select-none shadow-md">
      {/* カロリーバー */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-bold font-game">
          <div className="flex items-center gap-1.5 text-orange-400">
            <Flame className="w-3.5 h-3.5" />
            <span>CALORIE STOCK</span>
          </div>
          <div className="text-zinc-200">
            <span className={`text-sm ${isCalorieWarning ? 'text-red-400 font-extrabold animate-pulse-fast' : 'text-yellow-300'}`}>
              {calorieStock}
            </span>
            <span className="text-zinc-400 text-[10px]"> / 2000 kcal</span>
          </div>
        </div>

        {/* ゲージ外枠 */}
        <div className="relative h-4 w-full bg-zinc-950 rounded-xs border-2 border-zinc-700 p-0.5 overflow-hidden">
          <div
            className={`h-full rounded-2xs transition-all duration-500 ${
              calorieStock >= 1000
                ? 'bg-gradient-to-r from-orange-500 to-red-600'
                : calorieStock >= 500
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-emerald-500 to-yellow-500'
            }`}
            style={{ width: `${calPercent}%` }}
          />
          {/* ドット装飾 */}
          <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px] opacity-30 pointer-events-none" />
        </div>
      </div>

      {/* 虫歯リスクバー */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-bold font-game">
          <div className="flex items-center gap-1.5 text-red-400">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>CAVITY RISK</span>
          </div>
          <div className="text-zinc-200">
            <span className={`text-sm ${isCavityWarning ? 'text-red-400 font-extrabold animate-pulse-fast' : 'text-emerald-400'}`}>
              {cavityRisk}
            </span>
            <span className="text-zinc-400 text-[10px]"> / 100 PTS</span>
          </div>
        </div>

        {/* ゲージ外枠 */}
        <div className="relative h-4 w-full bg-zinc-950 rounded-xs border-2 border-zinc-700 p-0.5 overflow-hidden">
          <div
            className={`h-full rounded-2xs transition-all duration-500 ${
              cavityRisk >= 50
                ? 'bg-gradient-to-r from-orange-500 to-red-600 animate-pulse-fast'
                : cavityRisk >= 25
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-blue-500 to-emerald-500'
            }`}
            style={{ width: `${cavPercent}%` }}
          />
          {/* ドット装飾 */}
          <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px] opacity-30 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
