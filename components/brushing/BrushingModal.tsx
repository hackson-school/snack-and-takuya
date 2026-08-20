'use client';

import React from 'react';
import { Modal } from '@/components/shared/Modal';
import { CircleTimer } from './CircleTimer';
import { CutInTrigger } from '@/types';

interface BrushingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteBrushing: () => void;
  onFireCutIn: (trigger: CutInTrigger, onFinish?: () => void) => void;
}

export function BrushingModal({
  isOpen,
  onClose,
  onCompleteBrushing,
  onFireCutIn,
}: BrushingModalProps) {
  const handleComplete = () => {
    // 歯磨き達成カットイン: 「…悪くない」
    onFireCutIn('MISSION_COMPLETE');
    onCompleteBrushing();
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="歯磨きミッション" headerColor="bg-emerald-400 text-black">
      <div className="space-y-3 py-1">
        <CircleTimer durationSec={60} onComplete={handleComplete} />
      </div>
    </Modal>
  );
}
