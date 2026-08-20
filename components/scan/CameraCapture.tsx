'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, SwitchCamera, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64: string, mimeType: string, previewUrl: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    setCameraError(null);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('カメラの起動に失敗しました。権限を許可するか、アップロードまたはプリセットをご利用ください。');
    }
  }, [stream]);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const base64 = dataUrl.split(',')[1];
    onCapture(base64, 'image/jpeg', dataUrl);
  };

  if (cameraError) {
    return (
      <div className="p-4 bg-zinc-950 border-2 border-red-500 rounded text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <p className="text-xs text-red-300">{cameraError}</p>
        <button
          onClick={() => startCamera(facingMode)}
          className="px-3 py-1.5 bg-yellow-400 text-black font-bold text-xs rounded border border-black font-game"
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* ビデオプレビュー */}
      <div className="relative w-full aspect-4/3 max-h-[260px] bg-black rounded-sm border-2 border-yellow-400 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* 枠線ターゲット */}
        <div className="absolute inset-4 border border-yellow-400/50 border-dashed pointer-events-none flex items-center justify-center">
          <span className="text-[10px] text-yellow-300 font-game bg-black/60 px-2 py-0.5 rounded">
            ここに お菓子を あわせろ
          </span>
        </div>

        {/* カメラ切り替えボタン */}
        <button
          onClick={toggleFacingMode}
          className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black text-white rounded-full border border-yellow-400 active:scale-90 transition-transform cursor-pointer"
          title="カメラ切り替え"
        >
          <SwitchCamera className="w-4 h-4" />
        </button>
      </div>

      {/* 撮影シャッターボタン */}
      <button
        onClick={handleCapture}
        className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-extrabold rounded border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center justify-center gap-2 font-game text-xs"
      >
        <Camera className="w-5 h-5" />
        <span>📸 撮影して解析する</span>
      </button>
    </div>
  );
}
