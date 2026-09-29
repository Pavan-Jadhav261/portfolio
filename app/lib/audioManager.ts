// Central audio manager ensuring seamless audio playback across mobile (iOS Safari, Android Chrome) and PC.

const AUDIO_SRC = encodeURI('/French montana unforgettable-instrumental - (320 Kbps).mp3');

type Listener = (isPlaying: boolean) => void;

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private listeners: Set<Listener> = new Set();
  private hasUnlocked: boolean = false;
  private fadeTimer: any = null;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;

  public init() {
    if (typeof window === 'undefined' || this.audio) return;

    try {
      this.audio = new Audio();
      this.audio.src = AUDIO_SRC;
      this.audio.loop = true;
      this.audio.preload = 'auto';

      try {
        this.audio.volume = 0.45;
      } catch {
        // iOS Safari throws or ignores programmatic volume changes
      }

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });
    } catch (e) {
      console.warn('Audio init warning:', e);
    }
  }

  public initAnalyser() {
    if (this.analyser || !this.audio || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.5;

      this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);
      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    } catch (e) {
      // Browsers may restrict createMediaElementSource before user gesture; gracefully fallback
    }
  }

  public getAudio(): HTMLAudioElement | null {
    if (!this.audio) this.init();
    return this.audio;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isPlaying));
  }

  // Smooth volume fade-in for desktop/Android (safely guarded for iOS)
  private fadeIn(targetVolume = 0.45, durationMs = 1800) {
    if (!this.audio) return;
    if (this.fadeTimer) clearInterval(this.fadeTimer);

    try {
      this.audio.volume = 0.05;
      const steps = 20;
      const stepInterval = durationMs / steps;
      const increment = (targetVolume - 0.05) / steps;
      let currentStep = 0;

      this.fadeTimer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps || !this.audio) {
          if (this.audio) this.audio.volume = targetVolume;
          clearInterval(this.fadeTimer);
          this.fadeTimer = null;
        } else {
          this.audio.volume = Math.min(targetVolume, 0.05 + currentStep * increment);
        }
      }, stepInterval);
    } catch {
      // iOS doesn't support programmatic volume changes; ignore safely
    }
  }

  public async play(): Promise<boolean> {
    this.init();
    if (!this.audio) return false;

    try {
      this.initAnalyser();
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      await this.audio.play();
      this.isPlaying = true;
      this.hasUnlocked = true;
      this.fadeIn(0.45, 1800);
      this.notify();
      return true;
    } catch (err) {
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public getBeatData(): { beat: number; bass: number; mid: number; treble: number; isPlaying: boolean } {
    if (!this.isPlaying) {
      return { beat: 0, bass: 0, mid: 0, treble: 0, isPlaying: false };
    }

    if (!this.analyser) {
      this.initAnalyser();
    }

    if (!this.analyser || !this.dataArray) {
      const t = performance.now() * 0.007;
      const wave = Math.max(0, Math.sin(t));
      return { beat: wave * 0.4, bass: wave * 0.5, mid: wave * 0.2, treble: 0, isPlaying: true };
    }

    try {
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      this.analyser.getByteFrequencyData(this.dataArray as any);

      // 1. Deep Bass (bins 0 to 3: ~0 - 180Hz) - sub-kick & speaker impulse
      let bassSum = 0;
      const bassBins = Math.min(4, this.dataArray.length);
      for (let i = 0; i < bassBins; i++) {
        bassSum += this.dataArray[i];
      }
      const bass = bassSum / (bassBins * 255);

      // 2. Mids (bins 4 to 10: ~200 - 1500Hz)
      let midSum = 0;
      const midEnd = Math.min(11, this.dataArray.length);
      for (let i = bassBins; i < midEnd; i++) {
        midSum += this.dataArray[i];
      }
      const mid = midSum / ((midEnd - bassBins) * 255 || 1);

      // 3. Treble / Highs (bins 11 to 24: ~1.5kHz - 8kHz) - surface micro-vibrations
      let trebleSum = 0;
      const trebleEnd = Math.min(25, this.dataArray.length);
      for (let i = midEnd; i < trebleEnd; i++) {
        trebleSum += this.dataArray[i];
      }
      const treble = trebleSum / ((trebleEnd - midEnd) * 255 || 1);

      const beat = Math.min(1, Math.max(0, bass * 1.35 + mid * 0.25));

      return { beat, bass, mid, treble, isPlaying: true };
    } catch {
      return { beat: 0, bass: 0, mid: 0, treble: 0, isPlaying: this.isPlaying };
    }
  }

  public pause() {
    if (this.fadeTimer) clearInterval(this.fadeTimer);
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getPlayingState(): boolean {
    return this.isPlaying;
  }

  // Arms global listeners to unlock audio on the very first user touch/click if autoplay was blocked
  public armUserGestureUnlock() {
    if (typeof window === 'undefined' || this.hasUnlocked) return;

    const unlock = async () => {
      if (this.hasUnlocked) return;
      const success = await this.play();
      if (success) {
        this.hasUnlocked = true;
        removeListeners();
      }
    };

    const removeListeners = () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }
}

export const audioManager = new AudioManager();
