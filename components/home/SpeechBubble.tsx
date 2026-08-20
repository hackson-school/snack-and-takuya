'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { playRetroTypeSound } from '@/lib/speechService';

interface SpeechBubbleProps {
  line: string;
}

export function SpeechBubble({ line }: SpeechBubbleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<any>(null);

  const startTypewriter = (textToType: string) => {
    if (timerRef.current) clearInterval(timerRef.current);

    setDisplayedText('');
    setIsTyping(true);

    let index = 0;
    timerRef.current = setInterval(() => {
      if (index < textToType.length) {
        const char = textToType[index];
        setDisplayedText((prev) => prev + char);

        // 空白や句読点以外で「ポッ」と鳴らす
        if (char !== ' ' && char !== '　') {
          playRetroTypeSound();
        }
        index++;
      } else {
        clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, 40); // 40ms間隔（カイロソフト風の軽快なテンポ）
  };

  useEffect(() => {
    if (line) {
      startTypewriter(line);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [line]);

  const handleReplay = () => {
    if (line) {
      startTypewriter(line);
    }
  };

  return (
    <div className="w-full px-2 py-1.5 select-none">
      <div
        onClick={handleReplay}
        className="relative w-full bg-zinc-900 border-4 border-yellow-400 rounded-sm p-3 shadow-[0_4px_10px_rgba(0,0,0,0.6)] cursor-pointer hover:border-yellow-300 transition-colors"
      >
        {/* ネームタグ */}
        <div className="absolute -top-3 left-3 bg-yellow-400 text-black font-extrabold text-xs px-2 py-0.5 rounded-xs border-2 border-black font-game flex items-center gap-1">
          <span>TAKUYA</span>
        </div>

        {/* 再生アイコン */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleReplay();
          }}
          title="セリフをもう一度表示"
          className="absolute top-2 right-2 p-1 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded cursor-pointer active:scale-90 transition-transform"
        >
          <Volume2 className={`w-4 h-4 ${isTyping ? 'animate-pulse text-yellow-300' : ''}`} />
        </button>

        {/* セリフ本文（1文字ずつポポポポ表示） */}
        <div className="pt-1.5 pr-6 min-h-[38px] flex items-center">
          <p className="text-zinc-100 font-bold text-sm leading-relaxed tracking-wide font-sans">
            「{displayedText}
            {isTyping && <span className="inline-block w-2 h-4 bg-yellow-400 ml-1 animate-pulse" />}」
          </p>
        </div>
      </div>
    </div>
  );
}
