'use client';

import React from 'react';
import { MOCK_PRESETS, PresetItem } from '@/lib/mockData';
import { Sparkles } from 'lucide-react';

interface PresetSelectorProps {
  onSelect: (preset: PresetItem) => void;
}

export function PresetSelector({ onSelect }: PresetSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-zinc-300 font-sans">
        デモ用・オフライン用プリセットを選択して、AI解析とリアクションを即時体験できます。
      </p>

      <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
        {MOCK_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className="flex items-center justify-between p-2.5 bg-zinc-950 hover:bg-zinc-800 border-2 border-yellow-400 rounded-sm text-left active:scale-[0.98] transition-transform cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl select-none">{preset.emoji}</span>
              <div>
                <div className="text-xs font-bold text-yellow-400 font-game">
                  {preset.name}
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                  <span>{preset.data.calories} kcal</span>
                  <span>•</span>
                  <span>リスク {preset.data.cavityRiskScore}pts</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-yellow-300 font-game bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/30">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>選択</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
