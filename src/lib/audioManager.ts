import { VibeMode } from '../types';

class AudioManager {
  private audioCtx: AudioContext | null = null;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public playClick(mode: VibeMode) {
    this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    if (mode === VibeMode.COMFORT) {
      // Soft, warm pad / distant marimba
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250 + Math.random() * 50, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
      osc.start(t);
      osc.stop(t + 1.5);
    } else if (mode === VibeMode.CHAOTIC) {
      // Tactile ASMR click/thock (like a mechanical keyboard switch)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400 + Math.random() * 100, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.05);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } else {
      // Aesthetic: Shimmering glass/bell
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 + Math.random() * 300, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      osc.start(t);
      osc.stop(t + 1.2);
    }
  }
}

export const audioManager = new AudioManager();
