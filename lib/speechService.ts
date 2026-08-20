let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
    }
  }
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

// カイロソフト風レトロ文字送り音「ポッ（ピコッ）」
export function playRetroTypeSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle'; // レトロで丸みのあるピコピコ音
    // 600Hz〜800Hz前後の短いビープ音
    const baseFreq = 650 + Math.random() * 80;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // ignore audio restrictions
  }
}

// レトロ・迫力効果音「ドォーン！（カットイン発火音）」
export function playCutInImpactSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // ignore
  }
}

// 高音質音声ファイル（MP3/WAV）再生
export function playVoiceOrSpeak(text: string, audioPath?: string): void {
  if (typeof window === 'undefined') return;

  // 1. まずカットイン効果音（ドォーン！）を鳴らす
  playCutInImpactSound();

  // 2. 音声ファイルが指定されていればMP3を再生
  if (audioPath) {
    const audio = new Audio(audioPath);
    audio.volume = 1.0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play failed:', err);
      });
    }
  }
}

export function stopSpeaking(): void {
  // no-op
}
