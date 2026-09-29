'use client';

import React, { useEffect, useState } from 'react';
import { liquidMergeManager, LiquidMergeData } from '../lib/liquidMergeState';

export type LiquidColorTheme =
  | 'cyan'
  | 'violet'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'blue'
  | 'indigo'
  | 'teal'
  | 'ruby'
  | 'white'
  | { from: string; via: string; to: string };

const THEMES: Record<string, { from: string; via: string; to: string }> = {
  cyan: {
    from: '#00b4d8',
    via: '#0077b6',
    to: '#023e8a',
  },
  violet: {
    from: '#a855f7',
    via: '#7c3aed',
    to: '#4c1d95',
  },
  emerald: {
    from: '#10b981',
    via: '#059669',
    to: '#064e3b',
  },
  amber: {
    from: '#f59e0b',
    via: '#d97706',
    to: '#78350f',
  },
  rose: {
    from: '#f43f5e',
    via: '#be123c',
    to: '#700c25',
  },
  blue: {
    from: '#3b82f6',
    via: '#1d4ed8',
    to: '#1e3a8a',
  },
  indigo: {
    from: '#6366f1',
    via: '#4338ca',
    to: '#312e81',
  },
  teal: {
    from: '#14b8a6',
    via: '#0f766e',
    to: '#115e59',
  },
  ruby: {
    from: '#ef4444',
    via: '#b91c1c',
    to: '#7f1d1d',
  },
  white: {
    from: '#e4e4e7',
    via: '#d4d4d8',
    to: '#a1a1aa',
  },
};

interface LiquidTargetProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'color'> {
  id: string;
  color?: LiquidColorTheme;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode | ((state: { isMerged: boolean; progress: number }) => React.ReactNode);
  as?: 'button' | 'div';
  onClick?: (e: React.MouseEvent<any>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLElement>) => void;
}

export default function LiquidTarget({
  id,
  color = 'cyan',
  className = '',
  style = {},
  children,
  as: Component = 'div',
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  ...rest
}: LiquidTargetProps) {
  const [mergeData, setMergeData] = useState<LiquidMergeData>({
    targetId: null,
    progress: 0,
    entryX: 50,
    entryY: 50,
    beatEnergy: 0,
  });

  // Origin coordinates for the liquid spill wavefront and reverse draining
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const isCurrentTarget = mergeData.targetId === id;
  const progress = isCurrentTarget ? mergeData.progress : 0;
  const isMerged = isCurrentTarget && progress > 0.15;

  // Resolve active theme colors
  const activeTheme = typeof color === 'string' && THEMES[color]
    ? THEMES[color]
    : typeof color === 'object' && color !== null
    ? {
        from: color.from,
        via: color.via,
        to: color.to,
      }
    : THEMES.cyan;

  useEffect(() => {
    const unsubscribe = liquidMergeManager.subscribe((data) => {
      if (data.targetId === id) {
        setMergeData(data);
        if (typeof data.entryX === 'number' && typeof data.entryY === 'number') {
          setOrigin({ x: data.entryX, y: data.entryY });
        }
      } else if (mergeData.targetId === id) {
        setMergeData(data);
      }
    });
    return unsubscribe;
  }, [id, mergeData.targetId]);

  const updateCoords = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setOrigin({ x, y });
    liquidMergeManager.update({
      targetId: id,
      progress: 1,
      entryX: x,
      entryY: y,
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    updateCoords(e);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    updateCoords(e);
    if (onMouseMove) onMouseMove(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setOrigin({ x, y });

    if (liquidMergeManager.get().targetId === id) {
      liquidMergeManager.update({
        targetId: null,
        progress: 0,
        entryX: x,
        entryY: y,
      });
    }
    if (onMouseLeave) onMouseLeave(e);
  };

  const Tag = Component as any;

  return (
    <Tag
      data-liquid-target={id}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
        boxShadow: 'none',
        filter: 'none',
      }}
      {...rest}
    >
      {/* Pure Liquid Fill: Water spilling and spreading across the button with ZERO glow effect */}
      <div
        className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
        style={{
          background: `radial-gradient(circle at ${origin.x}% ${origin.y}%, ${activeTheme.from} 0%, ${activeTheme.via} 55%, ${activeTheme.to} 100%)`,
          clipPath: isMerged
            ? `circle(160% at ${origin.x}% ${origin.y}%)`
            : `circle(0% at ${origin.x}% ${origin.y}%)`,
          transition: isMerged
            ? 'clip-path 420ms cubic-bezier(0.2, 0.82, 0.25, 1), opacity 300ms ease-out'
            : 'clip-path 360ms cubic-bezier(0.4, 0, 0.2, 1), opacity 320ms ease-in',
          opacity: isMerged ? 1 : 0,
          boxShadow: 'none',
          filter: 'none',
        }}
        aria-hidden="true"
      />

      {/* Layered Content with rock-solid font stability */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {typeof children === 'function' ? children({ isMerged, progress }) : children}
      </div>
    </Tag>
  );
}
