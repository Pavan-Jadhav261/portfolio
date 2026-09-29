'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { audioManager } from '../lib/audioManager';

interface LoadingScreenProps {
  isReady: boolean;
  onFadeStart?: () => void;
  onLoaded?: () => void;
}

export default function LoadingScreen({ isReady, onFadeStart, onLoaded }: LoadingScreenProps) {
  const [progress, setProgress] = useState(12);
  const [statusText, setStatusText] = useState('Downloading assets...');
  const [shouldRender, setShouldRender] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [awaitingGesture, setAwaitingGesture] = useState(false);
  const enteredRef = useRef(false);

  // Smooth progress ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (isReady) {
          return 100;
        }
        if (prev < 45) {
          return prev + Math.floor(Math.random() * 8) + 4;
        }
        if (prev < 85) {
          return prev + Math.floor(Math.random() * 3) + 1;
        }
        if (prev < 95) {
          return prev + 1;
        }
        return prev;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isReady]);

  useEffect(() => {
    if (progress < 30) {
      setStatusText('Downloading visual assets...');
    } else if (progress < 65) {
      setStatusText('Buffering soundtrack & textures...');
    } else if (progress < 85) {
      setStatusText('Initializing WebGL shaders...');
    } else if (progress < 99) {
      setStatusText('Finalizing environment...');
    } else {
      setStatusText('Ready');
    }
  }, [progress]);

  const enterExperience = useCallback(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;

    // Immediately trigger playback in this direct user gesture (or automated)
    audioManager.play().catch(() => {
      audioManager.armUserGestureUnlock();
    });

    setIsFadingOut(true);
    onFadeStart?.();
    const unmountTimer = setTimeout(() => {
      setShouldRender(false);
      onLoaded?.();
    }, 1400);

    return () => clearTimeout(unmountTimer);
  }, [onFadeStart, onLoaded]);

  useEffect(() => {
    if (isReady) {
      setProgress(100);

      // Attempt immediate background autoplay right after loading completes
      audioManager.play().then((success) => {
        if (success) {
          // Autoplay allowed immediately (PC / permitted browser)
          const timer = setTimeout(() => {
            enterExperience();
          }, 450);
          return () => clearTimeout(timer);
        } else {
          // Autoplay blocked by mobile browser policy without prior interaction:
          // Display the stylish Enter prompt & arm tap-anywhere
          setAwaitingGesture(true);

          // Safety fallback: if user doesn't tap within 3.5s, auto-enter anyway
          const fallbackTimer = setTimeout(() => {
            enterExperience();
          }, 3500);
          return () => clearTimeout(fallbackTimer);
        }
      });
    }
  }, [isReady, enterExperience]);

  // Tapping anywhere on the loading screen pre-arms or starts audio immediately
  const handleScreenTouch = () => {
    if (isReady) {
      enterExperience();
    } else {
      audioManager.armUserGestureUnlock();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      onClick={handleScreenTouch}
      onTouchStart={handleScreenTouch}
      className={`fixed inset-0 z-[100] bg-[#050508] flex flex-col justify-between p-8 sm:p-12 select-none transition-all duration-[1400ms] ease-in-out cursor-pointer ${
        isFadingOut ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top Branding */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto pointer-events-none">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono tracking-widest uppercase font-bold text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-[#ff2a5f] shadow-[0_0_10px_#ff2a5f] animate-pulse" />
          <span>PAVAN JADHAV</span>
        </div>
        <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
          2026 / PORTFOLIO
        </span>
      </div>

      {/* Center Progress */}
      <div className="flex flex-col items-center justify-center text-center my-auto w-full max-w-md mx-auto">
        <div className="text-5xl sm:text-6xl font-black text-white font-gilroy tracking-tighter mb-5 tabular-nums">
          {progress}
          <span className="text-xl sm:text-2xl text-[#ff2a5f] font-normal ml-0.5">%</span>
        </div>

        {/* Minimalist Progress Track */}
        <div className="w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden mb-4 relative">
          <div
            className="h-full bg-gradient-to-r from-[#ff2a5f] to-[#ff5983] shadow-[0_0_12px_#ff2a5f] transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[11px] sm:text-xs font-mono tracking-[0.2em] text-zinc-400 uppercase mb-2">
          {statusText}
        </p>

        {/* Seamless Enter Button for Mobile / Restrictive Browsers */}
        {awaitingGesture && (
          <div className="mt-4 flex flex-col items-center animate-fade-in">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                enterExperience();
              }}
              className="px-6 py-2.5 rounded-full bg-[#ff2a5f] hover:bg-[#ff154f] text-white font-mono text-xs tracking-widest font-bold shadow-[0_0_24px_rgba(255,42,95,0.7)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>ENTER PORTFOLIO</span>
              <span>&rarr;</span>
            </button>
            <span className="mt-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              SOUND: ON &bull; TAP TO ENTER
            </span>
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between text-[11px] font-mono text-zinc-500 pointer-events-none">
        <span>PREPARING ENVIRONMENT</span>
        <span className="text-zinc-600">INTELLECTUAL SYSTEMS</span>
      </div>
    </div>
  );
}
