'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ScanAnimationProps {
  imagePreviewUrl?: string | null;
}

export function ScanAnimation({ imagePreviewUrl }: ScanAnimationProps) {
  return (
    <div className="relative w-full aspect-[4/3] max-h-[300px] bg-zinc-950 rounded-sm border-2 border-yellow-400 overflow-hidden flex flex-col items-center justify-center p-4">
      {/* プレビュー画像があれば背景に配置 */}
      {imagePreviewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imagePreviewUrl}
          alt="Scanning target"
          className="absolute inset-0 w-full h-full object-contain opacity-50 filter blur-[0.5px]"
        />
      ) : null}

      {/* レーダースキャングリッド */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffcc22_1px,transparent_1px),linear-gradient(to_bottom,#00ffcc22_1px,transparent_1px)] bg-[size:16px_16px]" />

      {/* 走査線 */}
      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan-line" />

      {/* 中央ターゲットサークル */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="relative w-16 h-16 rounded-full border-2 border-cyan-400 border-dashed animate-spin-slow flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-yellow-400 animate-ping opacity-75" />
        </div>

        <div className="bg-black/80 px-3 py-1.5 rounded border border-cyan-400/60 flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          <span className="text-cyan-300 font-game text-xs tracking-wider animate-pulse">
            SCANNING SNACK AI...
          </span>
        </div>
      </div>
    </div>
  );
}
