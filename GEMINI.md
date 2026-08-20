# SNACK HERO — Gemini 実装指示書 (GEMINI.md)

> このファイルを読んだ後、追加で SPECIFICATIONS.md / DESIGN.md も参照すること。

---

## ⚠️ 開発ワークフロールール（最重要・必ず守ること）

### ルール1: 変更時の影響報告（必須）

コードを変更・追加・削除した後は、**必ず以下の形式で報告**すること：

```
【変更報告】
✅ 追加した機能:
  - XXX 機能を新規実装
  - YYY コンポーネントを追加

🗑️ 削除・変更した機能:
  - ZZZ の動作を〇〇から△△に変更
  - （なければ「なし」と明記）

⚠️ 影響を受ける可能性がある箇所:
  - AAA コンポーネントが ZZZ を参照しているため確認が必要
```

### ルール2: 既存機能の動作確認（必須）

変更後は **以下のチェックリストを全件確認**し、結果を報告すること：

```
【動作確認チェックリスト】
- [ ] npm run dev でエラーなく起動するか
- [ ] TypeScript エラーが 0 件か（型エラーがないか）
- [ ] メイン画面が正常に表示されるか
- [ ] カロリー・虫歯リスクゲージが更新されるか
- [ ] タクヤの立ち絵が状態に応じて切り替わるか
- [ ] スキャン（プリセット）→「食べさせる」の流れが動くか
- [ ] カットイン演出が発火するか
- [ ] 運動カウンター / タイマーが動くか
- [ ] 歯磨き60秒タイマーが動くか
- [ ] localStorage に保存され、リロード後も状態が維持されるか
```

動作確認できない項目がある場合は **「未確認」と明記**し、理由を添えること。
問題が見つかった場合は修正してから報告すること。

### ルール3: 禁止事項

- **仕様書に記載された機能を勝手に削除・省略しない**
- **「一旦省略」「後で実装」は禁止** — すべて完全実装する
- **変更の影響を黙って放置しない** — 必ず確認・報告する

---

## 0. まず最初にやること（セットアップ手順）

このディレクトリにはまだ Next.js プロジェクトが存在しない。以下の順番で実装すること。

```bash
# 1. 必要パッケージをインストール
npm init -y
npm install next@15 react@19 react-dom@19 typescript @types/node @types/react @types/react-dom
npm install tailwindcss@3 postcss autoprefixer
npm install @google/generative-ai
npx tailwindcss init -p

# 2. .env.local を作成（gitignore済み）
# GEMINI_API_KEY=your_key_here
```

以下の設定ファイルを作成すること：

### package.json
```json
{
  "name": "snack-and-takuya",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.0",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### tailwind.config.ts
```ts
import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        game: ['"Press Start 2P"', 'monospace'],
      },
      keyframes: {
        'slide-in-top': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-out-top': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
        'flash': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'scan-line': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        'bar-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--bar-width)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-8px)' },
          '80%': { transform: 'translateX(8px)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'slide-in-top': 'slide-in-top 0.2s ease-out forwards',
        'slide-out-top': 'slide-out-top 0.2s ease-in forwards',
        'flash': 'flash 0.15s ease-in-out 3',
        'scan-line': 'scan-line 1.5s linear infinite',
        'bar-fill': 'bar-fill 0.6s ease-out forwards',
        'shake': 'shake 0.4s ease-in-out',
        'pop': 'pop 0.3s ease-out forwards',
        'spin-slow': 'spin-slow 3s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
```

### next.config.js
```js
/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig
```

### .gitignore（追記）
```
.env.local
.env*.local
```

---

## 1. ゲームコンセプト・UIイメージ

### 雰囲気
- **クール × バカゲー混在**: タクヤはかっこいいが、ギャグ・コメディ要素が随所に入る
- **ペット育成ゲーム感覚**: お菓子を食べさせてタクヤの状態が変わる
- **UIスタイル**: カイロソフトのゲーム風レトロHUD

### メイン画面レイアウト（厳守）
```
┌─────────────────────────────┐
│  💀 SNACK HERO    [RESET]   │  ← ダークヘッダー
├─────────────────────────────┤
│ 🔥CAL  [████████░░] 750kcal │
│ 🦷RISK [████░░░░░░]  40/100 │  ← ステータスHUD
├─────────────────────────────┤
│                             │
│     [タクヤの立ち絵画像]     │  ← object-contain で表示
│                             │
│  ╔═════════════════════╗   │
│  ║ セリフ吹き出し…     ║   │  ← セリフ吹き出し
│  ╚═════════════════════╝   │
├─────────────────────────────┤
│ ┌──────────┐ ┌──────────┐  │
│ │ 📸 SCAN  │ │ 🏃 RUN   │  │  ← ボタングリッド
│ └──────────┘ └──────────┘  │
│ ┌──────────┐ ┌──────────┐  │
│ │ 🪥 BRUSH │ │ 🔄 RESET │  │
│ └──────────┘ └──────────┘  │
└─────────────────────────────┘
```

### UIデザイン詳細
- **背景色**: `bg-gray-950` または `bg-zinc-950`（ほぼ黒）
- **テキスト**: 白系（`text-white`, `text-gray-100`）
- **ボーダー**: `border-2 border-yellow-400` でゲーム感を出す
- **ボタン**: `bg-yellow-400 text-black font-bold` の 2x2 グリッド
- **ステータスバー**: カロリーは `bg-orange-500`、虫歯リスクは `bg-red-500`
- **フォント**: Google Fonts の `Press Start 2P` をヘッダー・ボタンに使用

---

## 2. 技術スタック

| 区分 | 採用技術 |
| :--- | :--- |
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript (Strict) |
| スタイリング | Tailwind CSS v3 |
| アニメーション | Tailwind CSS + CSS `@keyframes`（Framer Motion 禁止） |
| AI | Google Gemini API (`gemini-2.0-flash`) |
| 音声 | Web Speech API（日本語読み上げ） |
| 永続化 | localStorage（キー: `snack_hero_status`） |

---

## 3. 型定義（types/index.ts）— これをそのままコピーして使う

```typescript
export type CharacterState = 'NORMAL' | 'FAT' | 'MUSCLE' | 'CAVITY';

export type CutInTrigger =
  | 'SCAN_NON_SNACK'
  | 'SCAN_HEALTHY'
  | 'SCAN_HIGH_CALORIE'
  | 'SCAN_NORMAL'
  | 'WORKOUT_START'
  | 'MISSION_COMPLETE'
  | 'STATUS_FAT'
  | 'STATUS_CAVITY';

export interface GameStatus {
  calorieStock: number;      // 0〜2000
  cavityRisk: number;        // 0〜100
  workoutDoneOnce: boolean;
  lastOpenedAt: string;      // ISO8601
}

export interface ScanResult {
  snackName: string;
  calories: number;
  cavityRiskScore: number;
  exerciseType: 'squat' | 'walk' | 'jog';
  exerciseAmount: number;     // 回数 or 秒数
  exerciseCalories: number;
  takuyaLine: string;         // 30文字以内
  isHealthy: boolean;
  isHighCalorie: boolean;
  isNonSnack: boolean;
}

export interface CutInConfig {
  trigger: CutInTrigger;
  imagePath: string;
  phrase: string;
  durationMs: number;
}

export type GameAction =
  | { type: 'EAT_SNACK'; payload: ScanResult }
  | { type: 'WORKOUT_DONE'; payload: { calories: number } }
  | { type: 'BRUSHING_DONE' }
  | { type: 'RESET' };
```

---

## 4. 状態管理設計（Context + useReducer）

`app/page.tsx` でグローバル状態を管理し、全コンポーネントに渡す。
コンポーネント間の状態共有には React Context を使用する。

### GameContext の設計

```typescript
// lib/gameContext.tsx として作成
'use client';
import { createContext, useContext, useReducer, useCallback } from 'react';
import { GameStatus, GameAction, CharacterState, CutInTrigger } from '@/types';
import { loadStatus, saveStatus } from '@/lib/storage';
import { resolveCharacterState, gameReducer } from '@/lib/gameEngine';
import { CUT_IN_CONFIGS } from '@/lib/cutInConfig';

interface GameContextValue {
  status: GameStatus;
  characterState: CharacterState;
  currentLine: string;
  dispatch: (action: GameAction) => void;
  fireCutIn: (trigger: CutInTrigger) => void;
  activeCutIn: CutInConfig | null;
}

// Context・Provider・useGame フックをここで定義・export する
```

### gameReducer（lib/gameEngine.ts に実装）

```typescript
export function gameReducer(state: GameStatus, action: GameAction): GameStatus {
  switch (action.type) {
    case 'EAT_SNACK':
      return {
        ...state,
        calorieStock: Math.min(2000, state.calorieStock + action.payload.calories),
        cavityRisk: Math.min(100, state.cavityRisk + action.payload.cavityRiskScore),
      };
    case 'WORKOUT_DONE':
      return {
        ...state,
        calorieStock: Math.max(0, state.calorieStock - action.payload.calories),
        workoutDoneOnce: true,
      };
    case 'BRUSHING_DONE':
      return { ...state, cavityRisk: Math.max(0, state.cavityRisk - 30) };
    case 'RESET':
      return { calorieStock: 0, cavityRisk: 0, workoutDoneOnce: false, lastOpenedAt: new Date().toISOString() };
    default:
      return state;
  }
}

export function resolveCharacterState(status: GameStatus): CharacterState {
  if (status.cavityRisk >= 50) return 'CAVITY';
  if (status.calorieStock >= 500) return 'FAT';
  if (status.workoutDoneOnce && status.calorieStock < 200) return 'MUSCLE';
  return 'NORMAL';
}
```

---

## 5. 各ファイルの実装指示

### lib/storage.ts
```typescript
const KEY = 'snack_hero_status';
const defaultStatus: GameStatus = {
  calorieStock: 0, cavityRisk: 0, workoutDoneOnce: false,
  lastOpenedAt: new Date().toISOString(),
};

export function loadStatus(): GameStatus {
  if (typeof window === 'undefined') return defaultStatus;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : defaultStatus;
  } catch { return defaultStatus; }
}

export function saveStatus(status: GameStatus): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(status));
}
```

### lib/speechService.ts
```typescript
export function speak(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}
```

### lib/cutInConfig.ts
```typescript
import { CutInConfig } from '@/types';

export const CUT_IN_CONFIGS: Record<string, CutInConfig> = {
  SCAN_NON_SNACK:    { trigger: 'SCAN_NON_SNACK',    imagePath: '/images/cho_mateyo_cutin.jpg',   phrase: 'ちょ、待てよ！',    durationMs: 1500 },
  SCAN_HEALTHY:      { trigger: 'SCAN_HEALTHY',      imagePath: '/images/cutin_wakattenjan.jpg', phrase: 'わかってんじゃん！', durationMs: 1500 },
  SCAN_HIGH_CALORIE: { trigger: 'SCAN_HIGH_CALORIE', imagePath: '/images/cutin_majikayo.jpg',    phrase: '本気かよ…',         durationMs: 1500 },
  SCAN_NORMAL:       { trigger: 'SCAN_NORMAL',       imagePath: '/images/cutin_bucchake.jpg',    phrase: 'ぶっちゃけ…',       durationMs: 1500 },
  WORKOUT_START:     { trigger: 'WORKOUT_START',     imagePath: '/images/cutin_yacchae.jpg',     phrase: 'やっちゃえ！',      durationMs: 1500 },
  MISSION_COMPLETE:  { trigger: 'MISSION_COMPLETE',  imagePath: '/images/cutin_warukunai.jpg',   phrase: '…悪くない',        durationMs: 1500 },
  STATUS_FAT:        { trigger: 'STATUS_FAT',        imagePath: '/images/cho_mateyo_cutin.jpg',  phrase: 'ちょ、待てよ！',    durationMs: 1500 },
  STATUS_CAVITY:     { trigger: 'STATUS_CAVITY',     imagePath: '/images/cho_mateyo_cutin.jpg',  phrase: 'ちょ、待てよ！',    durationMs: 1500 },
};
```

### lib/mockData.ts
5種以上のプリセットを用意する。画像ファイルは存在しないので imagePath は '' でよい。

```typescript
import { ScanResult } from '@/types';

export const MOCK_PRESETS: { label: string; emoji: string; data: ScanResult }[] = [
  {
    label: 'アルフォート',
    emoji: '🍫',
    data: {
      snackName: 'アルフォート',
      calories: 227,
      cavityRiskScore: 35,
      exerciseType: 'squat',
      exerciseAmount: 45,
      exerciseCalories: 227,
      takuyaLine: 'チョコは美味いけど、その分動けよ？',
      isHealthy: false,
      isHighCalorie: false,
      isNonSnack: false,
    },
  },
  {
    label: 'ポテチ',
    emoji: '🥔',
    data: {
      snackName: 'ポテトチップス（1袋）',
      calories: 340,
      cavityRiskScore: 15,
      exerciseType: 'jog',
      exerciseAmount: 1800,
      exerciseCalories: 340,
      takuyaLine: '油っこいのが好きなんだろ。なら走れ。',
      isHealthy: false,
      isHighCalorie: false,
      isNonSnack: false,
    },
  },
  {
    label: 'グミ',
    emoji: '🐻',
    data: {
      snackName: 'グミ（1袋）',
      calories: 180,
      cavityRiskScore: 70,
      exerciseType: 'squat',
      exerciseAmount: 30,
      exerciseCalories: 180,
      takuyaLine: 'グミは虫歯のもとだぞ。歯磨けよ。',
      isHealthy: false,
      isHighCalorie: false,
      isNonSnack: false,
    },
  },
  {
    label: '板チョコ',
    emoji: '🍫',
    data: {
      snackName: '板チョコ（1枚）',
      calories: 558,
      cavityRiskScore: 55,
      exerciseType: 'jog',
      exerciseAmount: 2700,
      exerciseCalories: 558,
      takuyaLine: '本気かよ…それ1枚全部食ったのか。',
      isHealthy: false,
      isHighCalorie: true,
      isNonSnack: false,
    },
  },
  {
    label: 'プロテインバー',
    emoji: '💪',
    data: {
      snackName: 'プロテインバー',
      calories: 190,
      cavityRiskScore: 5,
      exerciseType: 'squat',
      exerciseAmount: 20,
      exerciseCalories: 190,
      takuyaLine: 'わかってんじゃん！それが正解だろ。',
      isHealthy: true,
      isHighCalorie: false,
      isNonSnack: false,
    },
  },
  {
    label: 'キャンディ',
    emoji: '🍬',
    data: {
      snackName: 'キャンディ（5個）',
      calories: 120,
      cavityRiskScore: 80,
      exerciseType: 'walk',
      exerciseAmount: 900,
      exerciseCalories: 120,
      takuyaLine: '甘いもの好きすぎだろ…歯がやばい。',
      isHealthy: false,
      isHighCalorie: false,
      isNonSnack: false,
    },
  },
];

// ランダムにひとつ返す（カメラ解析失敗時フォールバック用）
export function getRandomMock(): ScanResult {
  return MOCK_PRESETS[Math.floor(Math.random() * MOCK_PRESETS.length)].data;
}
```

### lib/snackService.ts
```typescript
import { ScanResult } from '@/types';
import { getRandomMock } from './mockData';

export async function analyzeSnack(imageBase64: string, mimeType: string): Promise<ScanResult> {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json() as ScanResult;
  } catch {
    return getRandomMock();
  }
}

// 画像ファイルを base64 に変換するユーティリティ
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // "data:image/jpeg;base64,xxxxx" から base64 部分のみ抽出
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

---

## 6. API ルート（app/api/analyze/route.ts）

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRandomMock } from '@/lib/mockData';

const SYSTEM_PROMPT = `あなたは「タクヤ」というキャラクターです。
一人称は「俺」。熱血でぶっきらぼうだが根は優しい兄貴肌。
語尾例：「〜じゃねぇか」「〜だろ」「動けよ？」「ついてこい」

画像を分析し、必ず以下のJSON形式のみで回答してください。
余分な文字・コードブロックは一切不要です。JSONのみ返してください。

お菓子以外の場合は isNonSnack: true を返すこと。
ヘルシー品（プロテイン・キシリトール等）は isHealthy: true を返すこと。
500kcal超は isHighCalorie: true を返すこと。
takuyaLine は30文字以内で生成すること。
exerciseType は "squat" "walk" "jog" のいずれか。

{
  "snackName": "商品名",
  "calories": 数値,
  "cavityRiskScore": 0〜100の整数,
  "exerciseType": "squat",
  "exerciseAmount": 数値,
  "exerciseCalories": 数値,
  "takuyaLine": "30文字以内",
  "isHealthy": false,
  "isHighCalorie": false,
  "isNonSnack": false
}`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(getRandomMock());
  }

  try {
    const { imageBase64, mimeType } = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      { inlineData: { data: imageBase64, mimeType } },
    ]);

    const text = result.response.text().trim();
    // JSON部分だけ抽出（```json ... ``` で囲まれている場合も対応）
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON not found');
    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch {
    return NextResponse.json(getRandomMock());
  }
}
```

---

## 7. カットイン演出（components/shared/CutInOverlay.tsx）

カットインは **グローバルな状態** で管理し、`app/page.tsx` の最上位に配置する。
発火時は画面全体をジャック（z-index: 9999）し、ユーザー操作をブロックする。

```typescript
// CutInOverlay のprops
interface CutInOverlayProps {
  config: CutInConfig | null;  // null のとき非表示
  onComplete: () => void;       // アニメーション完了コールバック
}
```

**演出フロー（CSSアニメーション）**:
1. `config` が null でない → 全画面オーバーレイ表示（`fixed inset-0 z-[9999]`）
2. 黒背景フラッシュ（`animate-flash`）
3. キャラ画像が `animate-slide-in-top` でスライドイン
4. セリフが `animate-pop` で表示
5. `speak(config.phrase)` で音声読み上げ
6. 1500ms 後に `animate-slide-out-top` でスライドアウト
7. `onComplete()` コールバックを呼ぶ

---

## 8. 各コンポーネントの props 定義

### CharacterSprite.tsx
```typescript
interface CharacterSpriteProps {
  state: CharacterState;   // 'NORMAL' | 'FAT' | 'MUSCLE' | 'CAVITY'
}
// 画像マッピング:
// NORMAL  → /images/takuya_normal.jpg
// FAT     → /images/takuya_fat.jpg
// MUSCLE  → /images/takuya_muscle.jpg
// CAVITY  → /images/takuya_toothache.jpg
// 表示: <Image> コンポーネント、object-contain、高さは画面の40〜45%
```

### StatusBar.tsx
```typescript
interface StatusBarProps {
  calorieStock: number;   // 0〜2000
  cavityRisk: number;     // 0〜100
}
// カロリーバー: 幅 = (calorieStock / 2000) * 100%、色: bg-orange-500
// 虫歯リスクバー: 幅 = cavityRisk%、色: bg-red-500
// 500kcal超でカロリーバーを bg-red-600 に変更（警告色）
// アニメーション: CSS変数 --bar-width を使った animate-bar-fill
```

### SpeechBubble.tsx
```typescript
interface SpeechBubbleProps {
  line: string;
}
// ゲームっぽいセリフ枠（二重ボーダー）
// 文字送りアニメーション（typewriter effect）は任意だが実装推奨
```

### ActionNav.tsx
```typescript
interface ActionNavProps {
  onScan: () => void;
  onWorkout: () => void;
  onBrushing: () => void;
  onReset: () => void;
}
// 2x2 グリッドのボタン
// スタイル: bg-yellow-400 text-black font-bold border-2 border-black
// ホバー: bg-yellow-300、アクティブ: scale-95
```

### ScanModal.tsx
```typescript
interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEat: (result: ScanResult) => void;  // 「食べさせる」押下時
  onFireCutIn: (trigger: CutInTrigger) => void;
}
// タブ: カメラ / アップロード / プリセット
// スキャン中: ScanAnimation を表示
// 完了: ScanResult を表示
```

### WorkoutModal.tsx
```typescript
interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ScanResult | null;   // スキャン結果から運動データを受け取る
  onComplete: (calories: number) => void;
  onFireCutIn: (trigger: CutInTrigger) => void;
}
// result が null の場合はデフォルト運動（スクワット20回）を表示
// exerciseType === 'squat' → SquatCounter を表示
// exerciseType === 'walk' | 'jog' → WorkoutTimer を表示
```

### BrushingModal.tsx
```typescript
interface BrushingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onFireCutIn: (trigger: CutInTrigger) => void;
}
// 60秒円形タイマー（CircleTimer）
// カウントダウン完了で onComplete() 呼び出し
// 途中キャンセルはステータス変化なし
```

### CircleTimer.tsx
```typescript
interface CircleTimerProps {
  durationSec: number;       // 60
  onComplete: () => void;
}
// SVG の circle + stroke-dashoffset でアニメーション
// CSS アニメーションまたは useEffect + setInterval で実装
```

---

## 9. スキャン画面の実装詳細

### カメラ撮影（CameraCapture.tsx）
```typescript
// getUserMedia API を使用
// 'use client' 必須
// 撮影ボタン → canvas に描画 → toDataURL('image/jpeg') → base64 取得
// mimeType は 'image/jpeg' 固定
```

### プリセット選択（PresetSelector.tsx）
```typescript
// mockData.ts の MOCK_PRESETS をリスト表示
// 選択 → analyzeSnack ではなく直接 MOCK_PRESETS[i].data を返す
// （APIを呼ばずにモックデータを即時使用）
```

### スキャンアニメーション（ScanAnimation.tsx）
```typescript
// レーダーっぽいスキャン演出
// 縦に動く走査線: position: absolute, animate-scan-line
// 半透明の緑グリッドオーバーレイ
// 「SCANNING...」テキスト点滅
```

---

## 10. app/layout.tsx

Google Fonts の `Press Start 2P` を読み込む。

```typescript
import type { Metadata } from 'next';
import { Press_Start_2P } from 'next/font/google';
import './globals.css';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-game',
});

export const metadata: Metadata = {
  title: 'SNACK HERO',
  description: 'お菓子を食べてタクヤを育てろ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${pressStart2P.variable} bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
```

---

## 11. app/page.tsx の構造

```typescript
'use client';
// - useReducer で GameStatus を管理
// - useEffect で localStorage から初期ロード
// - dispatch 後に saveStatus() を呼び即時保存
// - activeCutIn state でカットイン発火を管理
// - fireCutIn(trigger) 関数でカットイン表示 → speak → 完了後に次の処理

// レイアウト:
// <div className="max-w-[430px] mx-auto min-h-screen flex flex-col bg-gray-950">
//   <Header />
//   <StatusBar />
//   <CharacterSprite />
//   <SpeechBubble />
//   <ActionNav />
//   <CutInOverlay />  ← 常に配置、activeCutIn が null なら非表示
//   <ScanModal />
//   <WorkoutModal />
//   <BrushingModal />
// </div>
```

---

## 12. 非機能要件

- **スマホ縦画面優先** (375px〜430px幅)、PC でも動作
- **スキャンから結果まで10秒以内**、待機中はアニメーション表示
- **オフライン耐性**: `GEMINI_API_KEY` 未設定・エラー時も `mockData` で全機能動作
- ユーザーデータは `localStorage` のみ（外部送信なし）

---

## 13. 実装チェックリスト（完成条件）

- [ ] `npm run dev` でエラーなく起動する
- [ ] メイン画面がカイロソフト風HUDレイアウトになっている
- [ ] カロリー・虫歯リスクゲージが常時表示されている
- [ ] タクヤの立ち絵が4状態で切り替わる
- [ ] プリセット選択からスキャン結果が表示される（APIなしで動作）
- [ ] 「食べさせる」でステータスが更新され、ゲージが変化する
- [ ] カットイン演出が全画面で発火し、音声読み上げが動作する
- [ ] スクワットカウンターが動作する
- [ ] 歯磨き60秒タイマーが動作する
- [ ] localStorage にデータが保存され、リロード後も状態が維持される
- [ ] TypeScript のエラーが0件である
