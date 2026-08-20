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

        if (char !== ' ' && char !== '　') {
          playRetroTypeSound();
        }
        index++;
      } else {
        clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, 35);
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
    <div className="w-full px-2 py-1 select-none shrink-0">
      <div
        onClick={handleReplay}
        className="relative w-full bg-zinc-900 border-3 border-yellow-400 rounded-sm p-2.5 shadow-[0_3px_8px_rgba(0,0,0,0.6)] cursor-pointer hover:border-yellow-300 transition-colors"
      >
        {/* ネームタグ */}
        <div className="absolute -top-2.5 left-2 bg-yellow-400 text-black font-extrabold text-[10px] px-1.5 py-0.5 rounded-xs border border-black font-game flex items-center gap-1">
          <span>TAKUYA</span>
        </div>

        {/* 再生アイコン */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleReplay();
          }}
          title="セリフをもう一度表示"
          className="absolute top-1.5 right-1.5 p-1 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded cursor-pointer active:scale-90 transition-transform"
        >
          <Volume2 className={`w-3.5 h-3.5 ${isTyping ? 'animate-pulse text-yellow-300' : ''}`} />
        </button>

        {/* セリフ本文 */}
        <div className="pt-1 pr-5 min-h-[32px] flex items-center">
          <p className="text-zinc-100 font-bold text-xs sm:text-sm leading-snug tracking-wide font-sans">
            「{displayedText}
            {isTyping && <span className="inline-block w-1.5 h-3.5 bg-yellow-400 ml-1 animate-pulse" />}」
          </p>
        </div>
      </div>
    </div>
  );
}
