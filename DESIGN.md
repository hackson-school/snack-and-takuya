# 設計書
**プロジェクト名**: SNACK HERO
**バージョン**: 0.1
**作成日**: 2026-08-19
**対応要件定義書**: SPECIFICATIONS.md

---

## 1. システムアーキテクチャ

```
┌─────────────────────────────────────────────────┐
│                  ブラウザ（クライアント）              │
│                                                 │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   │
│  │  UI層     │   │  状態管理  │   │ ストレージ  │   │
│  │(React/   │<──│(Context/ │<──│(local    │   │
│  │ Next.js) │   │ Reducer) │   │ Storage) │   │
│  └────┬─────┘   └──────────┘   └──────────┘   │
│       │                                         │
│  ┌────▼──────────────────────────────────────┐  │
│  │           サービス層（lib/）                │  │
│  │  ┌───────────────┐  ┌─────────────────┐  │  │
│  │  │ snackService  │  │  gameEngine     │  │  │
│  │  │（AI解析呼出し）│  │（状態遷移ロジック）│  │  │
│  │  └───────┬───────┘  └─────────────────┘  │  │
│  └──────────┼──────────────────────────────┘  │
└─────────────┼───────────────────────────────────┘
              │ HTTPS
┌─────────────▼────────────────┐
│  Next.js API Route           │
│  /api/analyze                │
│  （サーバーサイドでAPIキー保護）│
└─────────────┬────────────────┘
              │
┌─────────────▼────────────────┐
│  Google Gemini API           │
│  gemini-2.0-flash            │
│  Multimodal（画像＋テキスト）  │
└──────────────────────────────┘
```

---

## 2. 技術スタック

| 区分 | 採用技術 | 用途 |
| :--- | :--- | :--- |
| **フレームワーク** | Next.js 15 (App Router) | ルーティング、APIルート |
| **言語** | TypeScript (Strict) | 型安全性の確保 |
| **スタイリング** | Tailwind CSS v3 | スタイリング |
| **アニメーション** | Framer Motion | カットイン・キャラ切替・ゲージアニメーション |
| **AI** | Google Gemini API (gemini-2.0-flash) | お菓子画像認識＋セリフ生成 |
| **音声** | Web Speech API | セリフの自動読み上げ（日本語） |
| **永続化** | localStorage | ゲームステータスのセッションをまたいだ保存 |

---

## 3. ディレクトリ構成

```
snack-and-takuya/
├── app/
│   ├── layout.tsx              # ルートレイアウト
│   ├── page.tsx                # エントリーポイント（メインホーム）
│   ├── globals.css
│   └── api/
│       └── analyze/
│           └── route.ts        # Gemini API呼び出しルート（APIキー保護）
│
├── components/
│   ├── home/
│   │   ├── CharacterSprite.tsx # キャラクター立ち絵（4態切り替え）
│   │   ├── StatusBar.tsx       # カロリー・虫歯リスクゲージ
│   │   ├── SpeechBubble.tsx    # セリフ吹き出し
│   │   └── ActionNav.tsx       # 下部ナビ
│   ├── scan/
│   │   ├── ScanModal.tsx       # スキャン画面モーダル
│   │   ├── CameraCapture.tsx   # カメラ撮影UI
│   │   ├── PresetSelector.tsx  # プリセット選択UI
│   │   ├── ScanAnimation.tsx   # スキャン中アニメーション
│   │   └── ScanResult.tsx      # 解析結果表示
│   ├── workout/
│   │   ├── WorkoutModal.tsx    # 運動ミッション画面
│   │   ├── SquatCounter.tsx    # 回数カウンターUI
│   │   └── WorkoutTimer.tsx    # タイマーUI
│   ├── brushing/
│   │   ├── BrushingModal.tsx   # 歯磨きタイマー画面
│   │   └── CircleTimer.tsx     # 円形プログレスバー
│   └── shared/
│       ├── CutInOverlay.tsx    # カットイン演出（全画面オーバーレイ）
│       └── Modal.tsx           # 汎用モーダルラッパー
│
├── lib/
│   ├── gameEngine.ts           # ゲームロジック（状態遷移・スコア計算）
│   ├── snackService.ts         # Gemini API呼び出し＆レスポンス整形
│   ├── mockData.ts             # フォールバック用モックデータ（5種以上）
│   ├── storage.ts              # localStorage読み書きユーティリティ
│   ├── cutInConfig.ts          # カットイン発動条件マッピング
│   └── speechService.ts        # Web Speech APIラッパー
│
├── types/
│   └── index.ts                # 全型定義
│
└── public/images/              # キャラクター・カットイン画像（10枚）
```

---

## 4. 型定義（types/index.ts）

```typescript
// キャラクターの状態
export type CharacterState = 'NORMAL' | 'FAT' | 'MUSCLE' | 'CAVITY';

// ゲームステータス（localStorage保存対象）
export interface GameStatus {
  calorieStock: number;      // 0〜2000
  cavityRisk: number;        // 0〜100
  workoutDoneOnce: boolean;  // MUSCLEへの遷移条件フラグ
  lastOpenedAt: string;      // ISO8601（久しぶりログイン判定用）
}

// AIスキャンのレスポンス
export interface ScanResult {
  snackName: string;
  calories: number;
  cavityRiskScore: number;
  exerciseType: 'squat' | 'walk' | 'jog';
  exerciseAmount: number;     // 回数 or 秒数
  exerciseCalories: number;
  takuyaLine: string;         // タクヤのリアクションセリフ
  isHealthy: boolean;         // ヘルシー品フラグ
  isHighCalorie: boolean;     // 高カロリー爆弾フラグ（500kcal超）
  isNonSnack: boolean;        // お菓子以外フラグ
}

// カットイン定義
export interface CutInConfig {
  id: string;
  imagePath: string;
  phrase: string;
  durationMs: number;
}
```

---

## 5. ゲームロジック設計（lib/gameEngine.ts）

### 5.1 キャラクター状態の決定ロジック

```typescript
// 優先順位: CAVITY > FAT > MUSCLE > NORMAL
function resolveCharacterState(status: GameStatus): CharacterState {
  if (status.cavityRisk >= 50) return 'CAVITY';
  if (status.calorieStock >= 500) return 'FAT';
  if (status.workoutDoneOnce && status.calorieStock < 200) return 'MUSCLE';
  return 'NORMAL';
}
```

### 5.2 各イベントのステータス更新

| イベント | calorieStock | cavityRisk | workoutDoneOnce |
| :--- | :--- | :--- | :--- |
| `EAT_SNACK(result)` | `+ result.calories`（上限2000） | `+ result.cavityRiskScore`（上限100） | 変化なし |
| `WORKOUT_DONE(calories)` | `- calories`（下限0） | 変化なし | `true` にセット |
| `BRUSHING_DONE` | 変化なし | `- 30`（下限0） | 変化なし |
| `RESET` | `0` | `0` | `false` |

---

## 6. カットイン演出設計（lib/cutInConfig.ts）

### 6.1 発動条件マッピング

| トリガー | 条件 | カットイン | 画像ファイル |
| :--- | :--- | :--- | :--- |
| `CHO_MATEYO_BUTTON` | 常設ボタン押下 | ちょ、待てよ！ | cho_mateyo_cutin.jpg |
| `SCAN_NON_SNACK` | isNonSnack === true | ちょ、待てよ！ | cho_mateyo_cutin.jpg |
| `SCAN_HEALTHY` | isHealthy === true | わかってんじゃん！ | cutin_wakattenjan.jpg |
| `SCAN_HIGH_CALORIE` | isHighCalorie === true | 本気かよ… | cutin_majikayo.jpg |
| `SCAN_NORMAL` | 上記以外 | ぶっちゃけ… | cutin_bucchake.jpg |
| `WORKOUT_START` | 運動開始ボタン押下 | やっちゃえ！ | cutin_yacchae.jpg |
| `MISSION_COMPLETE` | 運動 or 歯磨き達成 | …悪くない | cutin_warukunai.jpg |

### 6.2 カットイン動作フロー

```
トリガー発火
  └► CutInOverlay 全画面表示（z-index: 9999）
      └► Framer Motion スライドイン（200ms）
          └► speechService.speak(phrase) 音声読み上げ開始
              └► 1500ms 表示
                  └► スライドアウト（200ms）
                      └► 後続処理（ステータス更新等）続行
```

---

## 7. Gemini API設計（app/api/analyze/route.ts）

### 7.1 リクエスト形式（POST /api/analyze）

```typescript
{
  imageBase64: string;   // base64エンコード済み画像
  mimeType: string;      // 'image/jpeg' | 'image/png' | 'image/webp'
}
```

### 7.2 Geminiへ送るシステムプロンプト（抜粋）

```
あなたは「タクヤ」という名前の、熱血でぶっきらぼうだが根は優しい
イケメンキャラクターです。一人称は「俺」。
語尾：「〜じゃねぇか」「〜だろ」「動けよ？」

画像を分析し、必ず以下のJSON形式で回答してください。
お菓子以外の場合は isNonSnack: true を返すこと。
ヘルシー品（プロテイン・キシリトール等）は isHealthy: true を返すこと。
500kcal超は isHighCalorie: true を返すこと。
takuyaLine は30文字以内で生成すること。
```

### 7.3 フォールバック処理

```
GEMINI_API_KEY 未設定 or API エラー
  └► mockData.ts から対応データを即時返却
      └► 全機能が正常動作（デモ100%保証）
```

---

## 8. 画面遷移設計

```
[メインホーム画面]
    ├── [📸 スキャン] ──► [スキャンモーダル]
    │                        ├── カメラ撮影
    │                        ├── 写真アップロード
    │                        └── プリセット選択
    │                              └► [スキャンアニメーション]
    │                                    └► [カットイン発火]
    │                                          └► [解析結果表示]
    │                                                └► [食べさせる] → ステータス更新
    │
    ├── [🏃 運動] ──────► [運動モーダル]
    │                        └► [カットイン: やっちゃえ！]
    │                              └► [カウンター or タイマー]
    │                                    └► 達成 → [カットイン: …悪くない] → ステータス更新
    │
    ├── [🪥 歯磨き] ────► [歯磨きモーダル]
    │                        └► [60秒円形タイマー]
    │                              └► 達成 → [カットイン: …悪くない] → ステータス更新
    │
    └── [🚨 ちょ待てよ！] ─► [カットイン: ちょ、待てよ！]（3秒クールダウン）
```

---

## 9. localStorage設計

```typescript
// ストレージキー: 'snack_hero_status'
// 保存タイミング: イベント発生ごとに即時書き込み
// 読み込みタイミング: アプリ初回マウント時

const defaultStatus: GameStatus = {
  calorieStock: 0,
  cavityRisk: 0,
  workoutDoneOnce: false,
  lastOpenedAt: new Date().toISOString(),
};
```
