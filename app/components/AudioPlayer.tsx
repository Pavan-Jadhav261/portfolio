'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  shouldPlay: boolean;
}

const AUDIO_SRC = encodeURI('/French montana unforgettable-instrumental - (320 Kbps).mp3');

export default function AudioPlayer({ shouldPlay }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth volume fade-in utility
  const fadeInVolume = (audio: HTMLAudioElement, targetVolume = 0.45, durationMs = 2800) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }
    audio.volume = 0;
    const steps = 30;
    const stepInterval = durationMs / steps;
    const volumeIncrement = targetVolume / steps;
    let step = 0;

    fadeIntervalRef.current = setInterval(() => {
      step++;
      if (step >= steps) {
        audio.volume = targetVolume;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      } else {
        audio.volume = Math.min(targetVolume, step * volumeIncrement);
      }
    }, stepInterval);
  };

  // Initialize audio and preload
  useEffect(() => {
    const audio = new Audio();
    audio.src = AUDIO_SRC;
    audio.loop = true;
    audio.preload = 'auto';

    audioRef.current = audio;

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Trigger playback as soon as shouldPlay becomes true (landing page appears)
  useEffect(() => {
    if (!shouldPlay || !audioRef.current) return;

    const audio = audioRef.current;

    const playWithFade = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          fadeInVolume(audio, 0.45, 3000);
        })
        .catch((err) => {
          // Autoplay blocked by browser policy without prior interaction:
          // Listen for the very first interaction (click, touch, key) to unlock & start
          const unlock = () => {
            audio.play()
              .then(() => {
                setIsPlaying(true);
                fadeInVolume(audio, 0.45, 2500);
              })
              .catch(() => {});
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
          };
          window.addEventListener('pointerdown', unlock, { once: true });
          window.addEventListener('keydown', unlock, { once: true });
          window.addEventListener('touchstart', unlock, { once: true });
        });
    };

    playWithFade();
  }, [shouldPlay]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          if (audio.volume < 0.2) {
            fadeInVolume(audio, 0.45, 1200);
          }
        })
        .catch(() => {});
    }
  };

  return (
    <button
      onClick={togglePlayback}
      type="button"
      title={isPlaying ? "Mute soundtrack" : "Play soundtrack"}
      className="group relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-white/15 bg-black/50 hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.5)] cursor-pointer select-none"
    >
      {/* Equalizer soundwave bars */}
      <div className="flex items-center gap-[2.5px] h-3.5 w-3.5 justify-center">
        <span
          className={`w-[2px] bg-[#ff2a5f] rounded-full transition-all duration-200 ${
            isPlaying ? 'h-3 animate-pulse' : 'h-1 opacity-50'
          }`}
          style={isPlaying ? { animationDuration: '0.6s' } : undefined}
        />
        <span
          className={`w-[2px] bg-[#ff2a5f] rounded-full transition-all duration-200 ${
            isPlaying ? 'h-3.5 animate-pulse' : 'h-1.5 opacity-50'
          }`}
          style={isPlaying ? { animationDuration: '0.9s', animationDelay: '0.15s' } : undefined}
        />
        <span
          className={`w-[2px] bg-[#ff2a5f] rounded-full transition-all duration-200 ${
            isPlaying ? 'h-2 animate-pulse' : 'h-1 opacity-50'
          }`}
          style={isPlaying ? { animationDuration: '0.75s', animationDelay: '0.3s' } : undefined}
        />
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider">
        <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors hidden min-[440px]:inline">
          SOUND
        </span>
        <span className={`font-bold transition-colors ${isPlaying ? 'text-[#ff2a5f]' : 'text-zinc-500'}`}>
          {isPlaying ? 'ON' : 'OFF'}
        </span>
      </div>
    </button>
  );
}
