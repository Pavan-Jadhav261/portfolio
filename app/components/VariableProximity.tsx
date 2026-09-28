'use client';

import React, { forwardRef, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import './VariableProximity.css';

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId: number;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function useMousePositionRef(containerRef?: React.RefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      if (ev.touches.length > 0) {
        const touch = ev.touches[0];
        updatePosition(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

export interface VariableProximityProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label,
    fromFontVariationSettings = "'wght' 400, 'opsz' 9",
    toFontVariationSettings = "'wght' 800, 'opsz' 40",
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    onClick,
    style,
    ...restProps
  } = props;

  const letterRefs = useRef<(HTMLElement | null)[]>([]);
  const interpolatedSettingsRef = useRef<string[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map<string, number>(
        settingsStr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => {
            const parts = s.split(' ');
            const name = parts[0];
            const value = parts[1];
            return [name.replace(/['"]/g, ''), parseFloat(value)];
          })
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = (distance: number) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case 'exponential':
        return norm ** 2;
      case 'gaussian':
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case 'linear':
      default:
        return norm;
    }
  };

  useAnimationFrame(() => {
    if (!containerRef?.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const { x, y } = mousePositionRef.current;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
      return;
    }
    lastPositionRef.current = { x, y };

    const wghtItem = parsedSettings.find((p) => p.axis === 'wght');

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;

      const rect = letterRef.getBoundingClientRect();
      const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
      const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

      const distance = calculateDistance(
        mousePositionRef.current.x,
        mousePositionRef.current.y,
        letterCenterX,
        letterCenterY
      );

      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings;
        if (wghtItem) {
          letterRef.style.fontWeight = `${wghtItem.fromValue}`;
        }
        letterRef.style.transform = 'scale(1)';
        return;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(', ');

      interpolatedSettingsRef.current[index] = newSettings;
      letterRef.style.fontVariationSettings = newSettings;

      if (wghtItem) {
        const interpolatedWeight = Math.round(
          wghtItem.fromValue + (wghtItem.toValue - wghtItem.fromValue) * falloffValue
        );
        letterRef.style.fontWeight = `${interpolatedWeight}`;
      }

      const scale = 1 + 0.08 * falloffValue;
      letterRef.style.transform = `scale(${scale})`;
    });
  });

  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={`variable-proximity ${className}`.trim()}
      onClick={onClick}
      style={{ display: 'inline', ...style }}
      {...restProps}
    >
      {words.map((word, wordIndex) => {
        const isPossibility = word.toLowerCase().includes('possibility');
        return (
          <span
            key={wordIndex}
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
            className={
              isPossibility
                ? 'text-[#ff2a5f] font-extrabold drop-shadow-[0_0_30px_rgba(255,42,95,0.6)]'
                : ''
            }
          >
            {word.split('').map((letter) => {
              const currentLetterIndex = letterIndex++;
              return (
                <motion.span
                  key={currentLetterIndex}
                  ref={(el) => {
                    letterRefs.current[currentLetterIndex] = el;
                  }}
                  style={{
                    display: 'inline-block',
                    fontVariationSettings:
                      interpolatedSettingsRef.current[currentLetterIndex] || fromFontVariationSettings,
                    transformOrigin: 'center center',
                    willChange: 'transform, font-weight, font-variation-settings',
                  }}
                  aria-hidden="true"
                >
                  {letter}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
          </span>
        );
      })}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
