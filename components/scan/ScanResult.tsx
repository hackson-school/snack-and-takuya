'use client';

import React, { useState, useEffect } from 'react';
import { ScanResult as IScanResult } from '@/types';
import { Flame, ShieldAlert, Dumbbell, Utensils, RotateCcw } from 'lucide-react';
import { playRetroTypeSound } from '@/lib/speechService';

interface ScanResultProps {
  result: IScanResult;
  previewUrl?: string | null;
  onEat: () => void;
  onRetake: () => void;
}

export function ScanResult({ result, previewUrl, onEat, onRetake }: ScanResultProps) {
  const [displayedLine, setDisplayedLine] = useState('');

  // スキャン結果表示時にもポポポポ…と文字送り
  useEffect(() => {
    setDisplayedLine('');
    let index = 0;
    const text = result.takuyaLine;
    const timer = setInterval(() => {
      if (index < text.length) {
        const char = text[index];
        setDisplayedLine((prev) => prev + char);
        if (char !== ' ' && char !== '　') {
          playRetroTypeSound();
        }
        index++;
      } else {
        clearInterval(timer);
      }
    }, 35);
    return () => clearInterval(timer);
  }, [result.takuyaLine]);

  const exerciseDesc =
    result.exerciseType === 'squat'
      ? `スクワット ${result.exerciseAmount} 回`
      : result.exerciseType === 'walk'
      ? `ウォーキング ${result.exerciseAmount} 分`
      : `ジョギング ${result.exerciseAmount} 分`;

  return (
    <div className="space-y-3 text-zinc-100">
      {/* お菓子情報ヘッダーカード */}
      <div className="bg-zinc-950 border-2 border-yellow-400 p-3 rounded-sm space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-700 pb-1.5">
          <div className="text-sm font-extrabold text-yellow-400 font-game">
            {result.snackName}
          </div>
          {result.isNonSnack ? (
            <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-game">
              お菓子以外
            </span>
          ) : result.isHealthy ? (
            <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-game">
              ヘルシー品
            </span>
          ) : result.isHighCalorie ? (
            <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-game">
              高カロリー
            </span>
          ) : null}
        </div>

        {/* 数値グリッド */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-zinc-900 p-2 rounded border border-orange-500/40">
            <div className="flex items-center gap-1 text-orange-400 text-[10px] font-game">
              <Flame className="w-3.5 h-3.5" />
              <span>ESTIMATED CAL</span>
            </div>
            <div className="text-base font-extrabold text-yellow-300 mt-0.5">
              +{result.calories} <span className="text-[10px] text-zinc-400">kcal</span>
            </div>
          </div>

          <div className="bg-zinc-900 p-2 rounded border border-red-500/40">
            <div className="flex items-center gap-1 text-red-400 text-[10px] font-game">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>CAVITY RISK</span>
            </div>
            <div className="text-base font-extrabold text-red-400 mt-0.5">
              +{result.cavityRiskScore} <span className="text-[10px] text-zinc-400">pts</span>
            </div>
          </div>
        </div>

        {/* 推奨運動 */}
        <div className="bg-zinc-900 p-2 rounded border border-cyan-500/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-cyan-300 font-game text-[10px]">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>REQUIRED WORKOUT:</span>
          </div>
          <span className="font-bold text-cyan-200">{exerciseDesc}</span>
        </div>
      </div>

      {/* タクヤのリアクション */}
      <div className="bg-zinc-950 border-2 border-yellow-400 p-2.5 rounded-sm">
        <div className="text-[10px] font-game text-yellow-400 mb-1">
          ▶ TAKUYA&apos;S REACTION:
        </div>
        <p className="text-xs font-bold text-zinc-100 leading-relaxed font-sans">
          「{displayedLine}」
        </p>
      </div>

      {/* アクションボタン */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onRetake}
          className="flex items-center justify-center gap-1.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 font-bold rounded border border-zinc-600 font-game text-xs cursor-pointer transition-transform"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>撮り直す</span>
        </button>

        <button
          onClick={onEat}
          className="flex items-center justify-center gap-1.5 py-2.5 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-extrabold rounded border-2 border-black shadow-[2px_2px_0px_#000] font-game text-xs cursor-pointer transition-transform"
        >
          <Utensils className="w-4 h-4" />
          <span>食べさせる！</span>
        </button>
      </div>
    </div>
  );
}
