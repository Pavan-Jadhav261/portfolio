'use client';

import React, { useEffect, useState } from 'react';
import { audioManager } from '../lib/audioManager';

interface AudioPlayerProps {
  shouldPlay?: boolean;
}

export default function AudioPlayer({ shouldPlay }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Subscribe to playback state changes
    const unsubscribe = audioManager.subscribe((playing) => {
      setIsPlaying(playing);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (shouldPlay) {
      audioManager.play().then((success) => {
        if (!success) {
          // Autoplay was blocked by browser policy without prior interaction:
          // Arm global listeners for immediate unlock on next touch/click
          audioManager.armUserGestureUnlock();
        }
      });
    }
  }, [shouldPlay]);

  const togglePlayback = () => {
    audioManager.toggle();
  };

  return (
    <button
      onClick={togglePlayback}
      type="button"
      title={isPlaying ? 'Mute soundtrack' : 'Play soundtrack'}
      aria-label={isPlaying ? 'Soundtrack is ON, click to mute' : 'Soundtrack is OFF, click to play'}
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
