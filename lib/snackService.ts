import { ScanResult } from '@/types';
import { getRandomMock } from './mockData';

export async function analyzeSnackImage(imageBase64: string, mimeType: string): Promise<ScanResult> {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageBase64, mimeType }),
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data = (await res.json()) as ScanResult;
    return validateScanResult(data);
  } catch (err) {
    console.warn('Analysis fallback to mock data:', err);
    return getRandomMock();
  }
}

export function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const [header, base64] = dataUrl.split(',');
      const mimeMatch = header.match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : file.type || 'image/jpeg';
      resolve({ base64, mimeType });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function validateScanResult(data: any): ScanResult {
  return {
    snackName: typeof data.snackName === 'string' ? data.snackName : 'お菓子',
    calories: typeof data.calories === 'number' ? Math.max(0, data.calories) : 250,
    cavityRiskScore: typeof data.cavityRiskScore === 'number' ? Math.min(100, Math.max(0, data.cavityRiskScore)) : 30,
    exerciseType: data.exerciseType === 'jog' || data.exerciseType === 'walk' ? data.exerciseType : 'squat',
    exerciseAmount: typeof data.exerciseAmount === 'number' ? Math.max(1, data.exerciseAmount) : 20,
    exerciseCalories: typeof data.exerciseCalories === 'number' ? data.exerciseCalories : data.calories || 250,
    takuyaLine: typeof data.takuyaLine === 'string' ? data.takuyaLine.slice(0, 50) : '食ったらその分動けよ！',
    isHealthy: Boolean(data.isHealthy),
    isHighCalorie: Boolean(data.isHighCalorie || (data.calories && data.calories >= 500)),
    isNonSnack: Boolean(data.isNonSnack),
  };
}
