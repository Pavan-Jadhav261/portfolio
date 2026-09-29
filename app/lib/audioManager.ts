// Central audio manager ensuring seamless audio playback across mobile (iOS Safari, Android Chrome) and PC.

const AUDIO_SRC = encodeURI('/French montana unforgettable-instrumental - (320 Kbps).mp3');

type Listener = (isPlaying: boolean) => void;

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private listeners: Set<Listener> = new Set();
  private hasUnlocked: boolean = false;
  private fadeTimer: any = null;

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
