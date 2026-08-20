'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { CameraCapture } from './CameraCapture';
import { PresetSelector } from './PresetSelector';
import { ScanAnimation } from './ScanAnimation';
import { ScanResult as ScanResultView } from './ScanResult';
import { ScanResult, CutInTrigger } from '@/types';
import { analyzeSnackImage, fileToBase64 } from '@/lib/snackService';
import { PresetItem } from '@/lib/mockData';
import { Camera, Upload, Bookmark } from 'lucide-react';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEat: (result: ScanResult) => void;
  onFireCutIn: (trigger: CutInTrigger, onFinish?: () => void) => void;
}

type TabMode = 'camera' | 'upload' | 'preset';

export function ScanModal({ isOpen, onClose, onEat, onFireCutIn }: ScanModalProps) {
  const [tab, setTab] = useState<TabMode>('preset');
  const [isScanning, setIsScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const resetModalState = () => {
    setIsScanning(false);
    setPreviewUrl(null);
    setScanResult(null);
  };

  const handleClose = () => {
    resetModalState();
    onClose();
  };

  const executeAnalysis = async (base64: string, mimeType: string, preview: string) => {
    setIsScanning(true);
    setPreviewUrl(preview);
    setScanResult(null);

    // AI解析呼び出し（またはフォールバック）
    const result = await analyzeSnackImage(base64, mimeType);
    setIsScanning(false);
    setScanResult(result);

    // カットイン演出トリガー判定
    triggerCutInForResult(result);
  };

  const triggerCutInForResult = (result: ScanResult) => {
    if (result.isNonSnack) {
      onFireCutIn('SCAN_NON_SNACK');
    } else if (result.isHealthy) {
      onFireCutIn('SCAN_HEALTHY');
    } else if (result.isHighCalorie) {
      onFireCutIn('SCAN_HIGH_CALORIE');
    } else {
      onFireCutIn('SCAN_NORMAL');
    }
  };

  const handleCameraCapture = (base64: string, mimeType: string, preview: string) => {
    executeAnalysis(base64, mimeType, preview);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { base64, mimeType } = await fileToBase64(file);
      const url = URL.createObjectURL(file);
      executeAnalysis(base64, mimeType, url);
    } catch (err) {
      console.error('File reading failed:', err);
    }
  };

  const handlePresetSelect = (preset: PresetItem) => {
    setIsScanning(true);
    setPreviewUrl(null);
    // スキャンのワクワク演出のために少しだけ待機
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(preset.data);
      triggerCutInForResult(preset.data);
    }, 800);
  };

  const handleEat = () => {
    if (!scanResult) return;
    onEat(scanResult);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="お菓子スキャン">
      <div className="space-y-3">
        {/* 解析結果表示 */}
        {scanResult ? (
          <ScanResultView
            result={scanResult}
            previewUrl={previewUrl}
            onEat={handleEat}
            onRetake={resetModalState}
          />
        ) : isScanning ? (
          /* スキャン中アニメーション */
          <ScanAnimation imagePreviewUrl={previewUrl} />
        ) : (
          /* タブ選択 & 各入力UI */
          <div className="space-y-3">
            {/* タブ切り替え */}
            <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded border-2 border-yellow-400 select-none">
              <button
                onClick={() => setTab('preset')}
                className={`py-1.5 px-1 flex items-center justify-center gap-1 text-[11px] font-game rounded font-bold transition-all cursor-pointer ${
                  tab === 'preset'
                    ? 'bg-yellow-400 text-black'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>プリセット</span>
              </button>

              <button
                onClick={() => setTab('camera')}
                className={`py-1.5 px-1 flex items-center justify-center gap-1 text-[11px] font-game rounded font-bold transition-all cursor-pointer ${
                  tab === 'camera'
                    ? 'bg-yellow-400 text-black'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>カメラ</span>
              </button>

              <button
                onClick={() => setTab('upload')}
                className={`py-1.5 px-1 flex items-center justify-center gap-1 text-[11px] font-game rounded font-bold transition-all cursor-pointer ${
                  tab === 'upload'
                    ? 'bg-yellow-400 text-black'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>写真選択</span>
              </button>
            </div>

            {/* タブコンテンツ */}
            {tab === 'preset' && <PresetSelector onSelect={handlePresetSelect} />}

            {tab === 'camera' && <CameraCapture onCapture={handleCameraCapture} />}

            {tab === 'upload' && (
              <div className="space-y-3 text-center py-4">
                <label
                  htmlFor="snack-file-input"
                  className="block w-full p-8 border-2 border-dashed border-yellow-400 hover:border-yellow-300 rounded bg-zinc-950/70 hover:bg-zinc-900 cursor-pointer transition-colors"
                >
                  <Upload className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <span className="text-xs font-bold font-game text-zinc-200 block">
                    写真を選択・アップロード
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    JPG / PNG / WebP に対応
                  </span>
                  <input
                    id="snack-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
