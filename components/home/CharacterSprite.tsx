'use client';

import React from 'react';
import Image from 'next/image';
import { CharacterState } from '@/types';
import { Sparkles, Flame, AlertTriangle, Heart, Crown } from 'lucide-react';

interface CharacterSpriteProps {
  state: CharacterState;
}

const STATE_CONFIG: Record<
  CharacterState,
  {
    label: string;
    imagePath: string;
    color: string;
    badgeBg: string;
    icon: React.ReactNode;
    desc: string;
    lightingOverlay?: string; // 状態ごとの部屋のライティング色
  }
> = {
  NORMAL: {
    label: 'NORMAL',
    imagePath: '/images/takuya_normal.jpg',
    color: 'border-yellow-400',
    badgeBg: 'bg-yellow-400 text-black',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    desc: '黒革ジャン×白T',
    lightingOverlay: 'bg-amber-500/10',
  },
  FAT: {
    label: 'FAT',
    imagePath: '/images/takuya_fat.jpg',
    color: 'border-orange-500',
    badgeBg: 'bg-orange-500 text-white',
    icon: <Heart className="w-3.5 h-3.5" />,
    desc: 'ぽっちゃりモード',
    lightingOverlay: 'bg-orange-600/20',
  },
  MUSCLE: {
    label: 'MUSCLE',
    imagePath: '/images/takuya_muscle.jpg',
    color: 'border-cyan-400',
    badgeBg: 'bg-cyan-400 text-black',
    icon: <Flame className="w-3.5 h-3.5" />,
    desc: 'バキバキ引き締め',
    lightingOverlay: 'bg-cyan-500/20',
  },
  CAVITY: {
    label: 'CAVITY',
    imagePath: '/images/takuya_toothache.jpg',
    color: 'border-red-500',
    badgeBg: 'bg-red-500 text-white',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    desc: '虫歯で悶絶中',
    lightingOverlay: 'bg-red-600/25',
  },
  WONKA: {
    label: 'WONKA 🎩✨',
    imagePath: '/images/wonka_chalamet.jpg',
    color: 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.7)]',
    badgeBg: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
    icon: <Crown className="w-3.5 h-3.5 text-yellow-300" />,
    desc: '特別モード：シャラメ・ウォンカ降臨',
  },
};

export function CharacterSprite({ state }: CharacterSpriteProps) {
  const current = STATE_CONFIG[state];

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-center p-2 min-h-[280px]">
      {/* キャラクタースプライト枠 */}
      <div
        className={`relative w-full max-w-[340px] h-[300px] sm:h-[350px] bg-zinc-950 rounded-sm border-4 ${current.color} shadow-[inset_0_0_25px_rgba(0,0,0,0.9),0_0_15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col items-center justify-center`}
      >
        {/* レトロシックなスポットライト・グリッド背景 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] bg-[size:100%_100%] opacity-70 pointer-events-none" />
        <div className={`absolute inset-0 bg-gradient-to-b ${current.lightingOverlay || 'from-amber-500/10'} pointer-events-none`} />

        {/* 状態ステータスバッジ */}
        <div
          className={`absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold font-game uppercase tracking-wider shadow border border-black/40 shadow-black/50 select-none ${current.badgeBg}`}
        >
          {current.icon}
          <span>{current.label}</span>
        </div>

        {/* 状態説明フッタータグ */}
        <div className="absolute top-2 right-2 z-10 text-[10px] text-zinc-300 bg-black/85 px-2 py-0.5 rounded border border-zinc-700 font-bold select-none">
          {current.desc}
        </div>

        {/* 立ち絵画像（黒背景と一体化） */}
        <div className="relative z-1 w-full h-full p-2 flex items-center justify-center">
          <Image
            src={current.imagePath}
            alt={current.label}
            fill
            sizes="(max-width: 430px) 100vw, 340px"
            className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] transition-all duration-300"
            priority
          />
        </div>
      </div>
    </div>
  );
}
