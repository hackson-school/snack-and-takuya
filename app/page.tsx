'use client';

import React, { useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { gameReducer, resolveCharacterState } from '@/lib/gameEngine';
import { loadStatus, saveStatus, defaultStatus } from '@/lib/storage';
import { CUT_IN_CONFIGS } from '@/lib/cutInConfig';
import { CharacterState, CutInConfig, CutInTrigger, GameStatus, ScanResult } from '@/types';

import { CharacterSprite } from '@/components/home/CharacterSprite';
import { StatusBar } from '@/components/home/StatusBar';
import { SpeechBubble } from '@/components/home/SpeechBubble';
import { ActionNav } from '@/components/home/ActionNav';

import { ScanModal } from '@/components/scan/ScanModal';
import { WorkoutModal } from '@/components/workout/WorkoutModal';
import { BrushingModal } from '@/components/brushing/BrushingModal';
import { CutInOverlay } from '@/components/shared/CutInOverlay';
import { Sparkles, Wand2 } from 'lucide-react';

export default function HomePage() {
  const [status, dispatch] = useReducer(gameReducer, defaultStatus);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLine, setCurrentLine] = useState<string>('お菓子を食べる前に、まず俺にスキャンさせろよ！');
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);

  // モーダル表示状態
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isWorkoutOpen, setIsWorkoutOpen] = useState(false);
  const [isBrushingOpen, setIsBrushingOpen] = useState(false);

  // カットイン演出状態
  const [activeCutIn, setActiveCutIn] = useState<CutInConfig | null>(null);
  const pendingCallbackRef = useRef<(() => void) | null>(null);

  // 前回の状態（FAT・CAVITY・WONKA突入検知用）
  const prevStatusRef = useRef<GameStatus>(defaultStatus);

  // 初回マウント時にlocalStorageからロード
  useEffect(() => {
    const saved = loadStatus();
    if (saved) {
      if (saved.calorieStock !== defaultStatus.calorieStock || saved.cavityRisk !== defaultStatus.cavityRisk || saved.chocoStreak > 0) {
        dispatch({ type: 'RESET' });
        if (saved.calorieStock > 0 || saved.cavityRisk > 0 || saved.workoutDoneOnce || saved.chocoStreak > 0) {
          dispatch({
            type: 'EAT_SNACK',
            payload: {
              snackName: '復元データ',
              calories: saved.calorieStock,
              cavityRiskScore: saved.cavityRisk,
              exerciseType: 'squat',
              exerciseAmount: 20,
              exerciseCalories: saved.calorieStock,
              takuyaLine: '続きからだな。今日も頼むぞ！',
              isHealthy: false,
              isHighCalorie: false,
              isNonSnack: false,
              isChocolate: saved.chocoStreak > 0,
            },
          });
        }
      }
    }
    setIsLoaded(true);
  }, []);

  // 状態が変化するたびにlocalStorageへ即時書き込み & 状態変化セリフ/カットイン判定
  useEffect(() => {
    if (!isLoaded) return;
    saveStatus(status);

    const prev = prevStatusRef.current;
    const currentState = resolveCharacterState(status);
    const prevState = resolveCharacterState(prev);

    // WONKA突入検知（チョコ3回以上連続）
    if (prevState !== 'WONKA' && currentState === 'WONKA') {
      setCurrentLine('世界一のチョコレートを作ろう！夢はここから始まるよ🎩✨🍫');
    }
    // FAT状態（calorieStock >= 500）への突入検知
    else if (prev.calorieStock < 500 && status.calorieStock >= 500) {
      fireCutIn('STATUS_FAT');
      setCurrentLine('ちょ、待てよ！食いすぎだろ…腹出てきたじゃねぇか！');
    }
    // CAVITY状態（cavityRisk >= 50）への突入検知
    else if (prev.cavityRisk < 50 && status.cavityRisk >= 50) {
      fireCutIn('STATUS_CAVITY');
      setCurrentLine('ちょ、待てよ！歯がズキズキ痛むぞ…早く歯磨けよ！');
    }

    prevStatusRef.current = status;
  }, [status, isLoaded]);

  // カットイン発火関数
  const fireCutIn = useCallback((trigger: CutInTrigger, onFinish?: () => void) => {
    const config = CUT_IN_CONFIGS[trigger];
    if (!config) return;
    if (onFinish) {
      pendingCallbackRef.current = onFinish;
    }
    setActiveCutIn(config);
  }, []);

  // カットイン演出完了時
  const handleCutInComplete = useCallback(() => {
    setActiveCutIn(null);
    if (pendingCallbackRef.current) {
      const cb = pendingCallbackRef.current;
      pendingCallbackRef.current = null;
      cb();
    }
  }, []);

  // お菓子を食べさせる処理
  const handleEatSnack = useCallback((result: ScanResult) => {
    dispatch({ type: 'EAT_SNACK', payload: result });
    setLastScanResult(result);
    if (status.chocoStreak < 2 || !result.isChocolate) {
      setCurrentLine(result.takuyaLine);
    }
  }, [status.chocoStreak]);

  // 運動完了処理
  const handleCompleteWorkout = useCallback((calories: number) => {
    dispatch({ type: 'WORKOUT_DONE', payload: { calories } });
    setCurrentLine('…悪くない。いい汗かいたじゃねぇか！');
  }, []);

  // 歯磨き完了処理
  const handleCompleteBrushing = useCallback(() => {
    dispatch({ type: 'BRUSHING_DONE' });
    setCurrentLine('…悪くない。息も歯もスッキリ爽快だ！');
  }, []);

  // リセット処理
  const handleReset = useCallback(() => {
    if (window.confirm('ゲームステータスを初期化しますか？')) {
      dispatch({ type: 'RESET' });
      setLastScanResult(null);
      setCurrentLine('よし、心機一転ゼロからやり直しだな！');
    }
  }, []);

  const characterState: CharacterState = resolveCharacterState(status);

  return (
    <main className="w-full max-w-[430px] h-dvh max-h-dvh bg-zinc-950 border-x-4 border-yellow-400 flex flex-col justify-between relative shadow-[0_0_25px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* カイロソフト風レトロヘッダー */}
      <header className="w-full bg-yellow-400 text-black px-3 py-1.5 border-b-4 border-black flex items-center justify-between select-none z-10 shadow-sm font-game shrink-0">
        <div className="flex items-center gap-1.5 font-extrabold text-xs sm:text-sm tracking-wider">
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          <span>SNACK HERO</span>
        </div>
        <div className="flex items-center gap-2 text-[9px]">
          {characterState === 'WONKA' ? (
            <span className="bg-gradient-to-r from-purple-700 to-pink-600 text-yellow-200 px-2 py-0.5 rounded font-mono font-bold animate-pulse flex items-center gap-1 border border-purple-300">
              <Wand2 className="w-3 h-3" />
              <span>WONKA FACTORY</span>
            </span>
          ) : (
            <span className="bg-black text-yellow-300 px-1.5 py-0.5 rounded font-mono">
              STAGE 1
            </span>
          )}
        </div>
      </header>

      {/* ステータスバー（常時表示HUD） */}
      <StatusBar
        calorieStock={status.calorieStock}
        cavityRisk={status.cavityRisk}
      />

      {/* メインキャラクターエリア（自動伸縮・はみ出し防止） */}
      <div className="flex-1 flex flex-col justify-between py-1 relative z-0 min-h-0 overflow-hidden">
        <CharacterSprite state={characterState} />
        <SpeechBubble line={currentLine} />
      </div>

      {/* 下部ボタングリッド */}
      <ActionNav
        onScan={() => setIsScanOpen(true)}
        onWorkout={() => setIsWorkoutOpen(true)}
        onBrushing={() => setIsBrushingOpen(true)}
        onReset={handleReset}
      />

      {/* 各モーダル */}
      <ScanModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onEat={handleEatSnack}
        onFireCutIn={fireCutIn}
      />

      <WorkoutModal
        isOpen={isWorkoutOpen}
        onClose={() => setIsWorkoutOpen(false)}
        lastScanResult={lastScanResult}
        onCompleteWorkout={handleCompleteWorkout}
        onFireCutIn={fireCutIn}
      />

      <BrushingModal
        isOpen={isBrushingOpen}
        onClose={() => setIsBrushingOpen(false)}
        onCompleteBrushing={handleCompleteBrushing}
        onFireCutIn={fireCutIn}
      />

      {/* 全画面バーン！カットイン演出オーバーレイ */}
      <CutInOverlay
        config={activeCutIn}
        onComplete={handleCutInComplete}
      />
    </main>
  );
}
