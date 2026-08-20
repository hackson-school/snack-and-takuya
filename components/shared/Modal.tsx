'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  headerColor?: string;
}

export function Modal({ isOpen, onClose, title, children, headerColor = 'bg-yellow-400 text-black' }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-zinc-900 border-4 border-yellow-400 rounded-sm shadow-[0_0_15px_rgba(250,204,21,0.5)] overflow-hidden animate-pop">
        {/* レトロヘッダー */}
        <div className={`flex items-center justify-between px-3 py-2 ${headerColor} border-b-4 border-yellow-400 select-none`}>
          <div className="flex items-center gap-2 font-bold tracking-wider text-sm font-game">
            <span className="text-base">▶</span>
            <span>{title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/20 rounded active:scale-90 transition-transform cursor-pointer"
            aria-label="閉じる"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 text-zinc-100">
          {children}
        </div>
      </div>
    </div>
  );
}
