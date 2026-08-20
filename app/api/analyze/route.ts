import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRandomMock } from '@/lib/mockData';
import { ScanResult } from '@/types';

const SYSTEM_PROMPT = `あなたは「タクヤ」という名前のキャラクターです。
一人称は「俺」。熱血でぶっきらぼうだが根は優しいイケメン兄貴肌です。
語尾例：「〜じゃねぇか」「〜だろ」「動けよ？」「ついてこい」「ちょ、待てよ」

ユーザーが提示したお菓子の画像を分析し、栄養・カロリー情報および健康アドバイスを推定して、
必ず以下のJSON形式のみで回答してください。

【運動量の算出基準（体重約60kgの成人基準に厳密に従ってください）】
- ジョギング (jog): 1分あたり約 8.5 kcal 消費 （例: 170kcal → 20分、340kcal → 40分、510kcal → 60分）
- ウォーキング (walk): 1分あたり約 4.0 kcal 消費 （例: 100kcal → 25分、200kcal → 50分）
- スクワット (squat): 1回あたり約 0.4 kcal 消費 （例: 20kcal → 50回、40kcal → 100回）
※ お菓子のカロリーを実際に消費できる現実的かつ正確な時間（分）または回数を exerciseAmount に設定してください。

【出力JSON形式】
{
  "snackName": "商品名または一般名（例: ポテトチップス うすしお味）",
  "calories": 推定カロリー（kcal、整数）,
  "cavityRiskScore": 虫歯リスクスコア（0〜100の整数。糖分や粘着性が高いほど高い）,
  "exerciseType": "jog" または "walk" または "squat",
  "exerciseAmount": jogやwalkなら分数の数値、squatなら回数の数値,
  "exerciseCalories": この運動で消費できるカロリー（通常は摂取カロリーと同値）,
  "takuyaLine": "タクヤとしてのリアクションセリフ（30文字以内。例: 340kcalか。ジョギング40分走れよ！）",
  "isHealthy": ヘルシー品（プロテインバー等）の場合true、それ以外false,
  "isHighCalorie": 500kcal超の場合true、それ以外false,
  "isNonSnack": お菓子や食品以外の場合true、それ以外false,
  "isChocolate": チョコレート系菓子の場合true、それ以外false
}`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const body = await req.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      return NextResponse.json(getRandomMock());
    }

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Returning mock fallback.');
      return NextResponse.json(getRandomMock());
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      },
    ]);

    const responseText = result.response.text().trim();
    const parsedData = extractAndParseJSON(responseText);

    if (!parsedData) {
      throw new Error('Could not parse valid JSON from Gemini response');
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Gemini analyze API error:', error);
    return NextResponse.json(getRandomMock());
  }
}

function extractAndParseJSON(text: string): ScanResult | null {
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('Failed to parse regex-extracted JSON:', e);
      }
    }
  }
  return null;
}
