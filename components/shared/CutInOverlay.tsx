'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CutInConfig } from '@/types';
import { playVoiceOrSpeak } from '@/lib/speechService';

interface CutInOverlayProps {
  config: CutInConfig | null;
  onComplete: () => void;
}

export function CutInOverlay({ config, onComplete }: CutInOverlayProps) {
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    if (!config) {
      setAnimatingOut(false);
      return;
    }

    // 効果音 ＋ 音声ファイル/TTS再生
    playVoiceOrSpeak(config.phrase, config.audioPath);

    // 一定時間後にスライドアウト、その後完了通知
    const outTimer = setTimeout(() => {
      setAnimatingOut(true);
    }, config.durationMs - 250);

    const finishTimer = setTimeout(() => {
      setAnimatingOut(false);
      onComplete();
    }, config.durationMs);

    return () => {
      clearTimeout(outTimer);
      clearTimeout(finishTimer);
    };
  }, [config, onComplete]);

  if (!config) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 pointer-events-auto select-none overflow-hidden animate-flash">
      {/* 背景集中線 / グリッドエフェクト */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* 帯アニメーション */}
      <div
        className={`relative w-full max-w-lg mx-auto flex flex-col items-center justify-center p-2 transition-all ${
          animatingOut ? 'animate-slide-out-top' : 'animate-slide-in-top'
        }`}
      >
        {/* レトロゴールド装飾枠 */}
        <div className="w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 p-1 rounded border-4 border-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.8)]">
          <div className="relative aspect-[4/3] w-full max-h-[50vh] bg-black overflow-hidden border-2 border-black flex items-center justify-center">
            <Image
              src={config.imagePath}
              alt={config.phrase}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* セリフバナー */}
          <div className="bg-zinc-950 px-4 py-3 border-t-4 border-yellow-400 text-center">
            <p className="text-yellow-400 font-extrabold text-2xl md:text-3xl tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)] animate-pop font-game">
              「{config.phrase}」
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
