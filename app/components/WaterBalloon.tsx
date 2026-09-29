'use client';

import React, { useEffect, useRef, useState } from 'react';
import { audioManager } from '../lib/audioManager';
import { liquidMergeManager } from '../lib/liquidMergeState';

const NUM_NODES = 16;
const BASE_RADIUS = 12.5; // ~25px base diameter - minimal, borderless, visible crimson liquid droplet
const CANVAS_SIZE = 120;
const HALF_SIZE = CANVAS_SIZE / 2;

interface Node {
  angle: number;
  r: number;
  v: number;
}

export default function WaterBalloon() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      const desktop =
        typeof window !== 'undefined' &&
        (window.innerWidth >= 768 || window.matchMedia('(hover: hover) and (pointer: fine)').matches);
      setIsDesktop(desktop);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = `${CANVAS_SIZE}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;
    ctx.scale(dpr, dpr);

    // 1. Soft-body water balloon perimeter nodes
    const nodes: Node[] = Array.from({ length: NUM_NODES }, (_, i) => ({
      angle: (i / NUM_NODES) * Math.PI * 2,
      r: BASE_RADIUS,
      v: 0
    }));

    // 2. Cursor spring-damper position tracking
    let targetX = -200;
    let targetY = -200;
    let posX = -200;
    let posY = -200;
    let velX = 0;
    let velY = 0;
    let hasMoved = false;

    // 3. Speaker impact physical forces (Vertical jump, squash & stretch, lateral wobble)
    let jump = 0;
    let jumpVel = 0;
    let squash = 0;
    let squashVel = 0;
    let wobble = 0;
    let wobbleVel = 0;
    let wobbleDir = 1;

    let bassBaseline = 0;
    let lastKickTime = 0;

    // 4. Liquid merge & absorption state
    let mergeAlpha = 0;
    let wasInside = false;
    let isCurrentlyInside = false;
    let lastMergedTargetId: string | null = null;
    let lastQueryTime = 0;
    let cachedTargets: HTMLElement[] = [];

    const onPointerMove = (e: MouseEvent | PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!hasMoved) {
        posX = targetX;
        posY = targetY;
        hasMoved = true;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });

    let rafId: number;
    let lastTime = performance.now();

    const updatePhysics = (dt: number, time: number) => {
      // ─────────────────────────────────────────────────────────────
      // INTERACTIVE TARGET PROXIMITY & MAGNETIC ATTRACTION
      // ─────────────────────────────────────────────────────────────
      if (time - lastQueryTime > 200) {
        lastQueryTime = time;
        cachedTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-liquid-target]'));
      }

      let closestTarget: HTMLElement | null = null;
      let closestId: string | null = null;
      let closestDist = Infinity;
      let closestClampX = targetX;
      let closestClampY = targetY;
      let closestRect: DOMRect | null = null;

      // 1. Instantaneous hover detection via elementFromPoint
      const hoveredEl = typeof document !== 'undefined'
        ? (document.elementFromPoint(targetX, targetY)?.closest<HTMLElement>('[data-liquid-target]') || null)
        : null;

      if (hoveredEl) {
        closestTarget = hoveredEl;
        closestId = hoveredEl.getAttribute('data-liquid-target');
        closestRect = hoveredEl.getBoundingClientRect();
        closestDist = 0;
        closestClampX = targetX;
        closestClampY = targetY;
      } else {
        for (let i = 0; i < cachedTargets.length; i++) {
          const el = cachedTargets[i];
          const rect = el.getBoundingClientRect();
          if (rect.bottom < -50 || rect.top > window.innerHeight + 50) continue;

          const clampX = Math.max(rect.left, Math.min(rect.right, targetX));
          const clampY = Math.max(rect.top, Math.min(rect.bottom, targetY));
          const dx = targetX - clampX;
          const dy = targetY - clampY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < closestDist) {
            closestDist = dist;
            closestTarget = el;
            closestId = el.getAttribute('data-liquid-target');
            closestClampX = clampX;
            closestClampY = clampY;
            closestRect = rect;
          }
        }
      }

      const isInside = hoveredEl !== null || (closestDist <= 0.5 && closestTarget !== null);
      isCurrentlyInside = isInside;

      // Magnetic Attraction & Teardrop Elongation when near (outside)
      const MERGE_ATTRACT_DIST = 85;
      let targetXAttracted = targetX;
      let targetYAttracted = targetY;

      if (!isInside && closestDist < MERGE_ATTRACT_DIST && closestTarget && closestRect) {
        const proximity = 1 - closestDist / MERGE_ATTRACT_DIST;
        const pull = Math.pow(proximity, 1.5) * 0.42;
        targetXAttracted += (closestClampX - targetX) * pull;
        targetYAttracted += (closestClampY - targetY) * pull;

        // Elongate soft-body nodes facing the element
        const angleToEl = Math.atan2(closestClampY - posY, closestClampX - posX);
        const stretchAmount = proximity * 8.5;
        for (let i = 0; i < NUM_NODES; i++) {
          const diff = Math.cos(nodes[i].angle - angleToEl);
          if (diff > 0.1) {
            nodes[i].r += diff * stretchAmount * 0.35;
          }
        }
      }

      // Exit transition: when cursor leaves element back into open canvas
      if (!isInside && wasInside) {
        // Place orb directly at cursor exit point so it emerges seamlessly
        posX = targetX;
        posY = targetY;
        velX = 0;
        velY = 0;
        // Elastic rebound "pop" as it emerges from the surface
        squashVel += 0.15;
        jumpVel -= 32;
        for (let i = 0; i < NUM_NODES; i++) {
          nodes[i].v += (Math.random() - 0.5) * 12;
        }
      }
      wasInside = isInside;

      // Keep orb coordinate in sync with cursor while inside
      if (isInside) {
        posX = targetX;
        posY = targetY;
        velX = 0;
        velY = 0;
      }

      // Merge absorption interpolation
      const targetMerge = isInside ? 1.0 : 0.0;
      const mergeSpeed = isInside ? 0.38 : 0.22;
      mergeAlpha += (targetMerge - mergeAlpha) * mergeSpeed;

      // Broadcast merge progress to target element
      const { beat, bass, treble, isPlaying } = audioManager.getBeatData();

      if (closestId && closestRect && (isInside || mergeAlpha > 0.01)) {
        const entryX = Math.max(0, Math.min(100, ((targetX - closestRect.left) / closestRect.width) * 100));
        const entryY = Math.max(0, Math.min(100, ((targetY - closestRect.top) / closestRect.height) * 100));

        liquidMergeManager.update({
          targetId: closestId,
          progress: isInside ? 1.0 : mergeAlpha,
          entryX,
          entryY,
          beatEnergy: isPlaying ? beat : 0,
        });
        lastMergedTargetId = closestId;
      } else if (lastMergedTargetId && mergeAlpha <= 0.01 && !isInside) {
        liquidMergeManager.update({
          targetId: null,
          progress: 0,
          entryX: 50,
          entryY: 50,
          beatEnergy: 0,
        });
        lastMergedTargetId = null;
      }

      // ─────────────────────────────────────────────────────────────
      // CURSOR PHYSICS: Spring-damper pull + inertia & sudden stop overshoot
      // ─────────────────────────────────────────────────────────────
      const kCursor = 135;
      const dCursor = 16.5;
      const ax = (targetXAttracted - posX) * kCursor - velX * dCursor;
      const ay = (targetYAttracted - posY) * kCursor - velY * dCursor;

      velX += ax * dt;
      velY += ay * dt;
      posX += velX * dt;
      posY += velY * dt;

      // ─────────────────────────────────────────────────────────────
      // AUDIO $\rightarrow$ VIGOROUS SPEAKER IMPACT PHYSICS
      // ─────────────────────────────────────────────────────────────

      // Sharp transient kick detection
      const bassDelta = Math.max(0, bass - bassBaseline * 1.06);
      bassBaseline += (bass - bassBaseline) * 0.12;

      const timeSinceKick = (time - lastKickTime) / 1000;
      const isKickHit = isPlaying && bassDelta > 0.032 && beat > 0.28 && timeSinceKick > 0.13;

      if (isKickHit) {
        lastKickTime = time;
        const impulse = Math.min(0.9, Math.max(0.25, bassDelta * 2.8 + beat * 0.45));

        // 1. Soft vertical upward hop
        jumpVel -= impulse * 110;

        // 2. Gentle squash against virtual speaker surface
        squashVel += impulse * 13;

        // 3. Subtle lateral liquid wobble / slosh torque
        wobbleDir = -wobbleDir;
        wobbleVel += wobbleDir * impulse * 55;

        // 4. Soft-body nodal impulses (soft elastic deformation)
        for (let i = 0; i < NUM_NODES; i++) {
          const node = nodes[i];
          const sinA = Math.sin(node.angle); // +1 bottom, -1 top
          const cosA = Math.cos(node.angle);

          if (sinA > 0.2) {
            node.v -= impulse * 45 * sinA;
          } else if (sinA < -0.2) {
            node.v += impulse * 30 * Math.abs(sinA);
          } else {
            node.v += impulse * 18 * Math.abs(cosA);
          }
        }
      }

      // ─────────────────────────────────────────────────────────────
      // CONTINUOUS HARMONIC INTEGRATION (Soft elastic liquid damping)
      // ─────────────────────────────────────────────────────────────

      // 1. Vertical Hop Spring
      const kJump = 160;
      const dJump = 13.0;
      const jumpAcc = -jump * kJump - jumpVel * dJump;
      jumpVel += jumpAcc * dt;
      jump += jumpVel * dt;

      // 2. Squash & Stretch Spring
      const kSquash = 130;
      const dSquash = 10.0;
      let squashAcc = -squash * kSquash - squashVel * dSquash;
      if (jump > 0) squashAcc += jump * 8; // gentle landing compression
      squashVel += squashAcc * dt;
      squash += squashVel * dt;

      // 3. Side-to-side liquid wobble Spring
      const kWobble = 95;
      const dWobble = 8.5;
      const wobbleAcc = -wobble * kWobble - wobbleVel * dWobble;
      wobbleVel += wobbleAcc * dt;
      wobble += wobbleVel * dt;

      // 4. Perimeter 16-Node Soft-Body Spring Mesh
      const kRadial = 140;
      const dRadial = 11.0;
      const kMembrane = 48;

      let totalDisp = 0;
      for (let i = 0; i < NUM_NODES; i++) totalDisp += nodes[i].r - BASE_RADIUS;
      const avgDisp = totalDisp / NUM_NODES;

      const continuousBass = isPlaying ? Math.pow(bass, 1.4) : 0;

      for (let i = 0; i < NUM_NODES; i++) {
        const node = nodes[i];
        const prev = nodes[(i - 1 + NUM_NODES) % NUM_NODES];
        const next = nodes[(i + 1) % NUM_NODES];

        let force = -kRadial * (node.r - BASE_RADIUS) - dRadial * node.v;
        force += kMembrane * (prev.r - node.r + (next.r - node.r));
        force -= 20 * avgDisp;

        if (continuousBass > 0.05) {
          const sinA = Math.sin(node.angle);
          if (sinA > 0.2) force -= continuousBass * 10 * sinA;
          else force += continuousBass * 5;
        }

        if (isPlaying && treble > 0.12) {
          force += Math.sin(node.angle * 3 + time * 0.02) * treble * 8;
        }

        // Cursor acceleration inertia & sudden stop overshoot
        const cosT = Math.cos(node.angle);
        const sinT = Math.sin(node.angle);
        const inertialForce = -(ax * cosT + ay * sinT) * 0.035;
        force += inertialForce;

        node.v += force * dt;
        node.r += node.v * dt;
        node.r = Math.max(BASE_RADIUS * 0.6, Math.min(BASE_RADIUS * 1.5, node.r));
      }
    };

    const render = (time: number) => {
      rafId = requestAnimationFrame(render);

      if (!hasMoved) return;

      const dt = Math.min(0.033, Math.max(0.001, (time - lastTime) / 1000));
      lastTime = time;

      updatePhysics(dt, time);

      // If cursor is hovering inside target or orb has absorbed, hide completely
      if (isCurrentlyInside || mergeAlpha >= 0.7) {
        container.style.opacity = '0';
        container.style.visibility = 'hidden';
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        return; // Orb is 100% invisible inside the button!
      }

      // Re-enable visibility when outside
      container.style.visibility = 'visible';
      container.style.opacity = '1';

      // Position the mini canvas using GPU translate3d
      container.style.transform = `translate3d(${posX - HALF_SIZE}px, ${posY - HALF_SIZE}px, 0)`;

      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Dissolve and shrink orb as it physically merges into target element
      const orbScale = Math.max(0, 1 - mergeAlpha * 1.35);
      const orbOpacity = Math.max(0, 1 - mergeAlpha * 1.3);

      if (orbScale <= 0.02 || orbOpacity <= 0.02) {
        return; // Orb completely merged and disappeared into the element!
      }

      ctx.save();
      ctx.globalAlpha = orbOpacity;

      // Softened vertical jump, wobble rotation, and squash/stretch scaled by merge factor
      const clampedJump = Math.max(-8, Math.min(4, jump));
      const clampedSquash = Math.max(-0.14, Math.min(0.18, squash));
      const scaleX = (1 + clampedSquash) * orbScale;
      const scaleY = (1 - clampedSquash * 0.75) * orbScale;
      const clampedWobble = Math.max(-7, Math.min(7, wobble));

      ctx.translate(HALF_SIZE, HALF_SIZE + clampedJump);
      ctx.rotate((clampedWobble * Math.PI) / 180);
      ctx.scale(scaleX, scaleY);

      // Convert polar soft-body perimeter nodes into 2D Cartesian points
      const points = nodes.map(n => ({
        x: n.r * Math.cos(n.angle),
        y: n.r * Math.sin(n.angle)
      }));

      // Draw infinitely smooth closed liquid curve using quadratic midpoint spline
      ctx.beginPath();
      const firstMidX = (points[NUM_NODES - 1].x + points[0].x) * 0.5;
      const firstMidY = (points[NUM_NODES - 1].y + points[0].y) * 0.5;
      ctx.moveTo(firstMidX, firstMidY);

      for (let i = 0; i < NUM_NODES; i++) {
        const next = points[(i + 1) % NUM_NODES];
        const mx = (points[i].x + next.x) * 0.5;
        const my = (points[i].y + next.y) * 0.5;
        ctx.quadraticCurveTo(points[i].x, points[i].y, mx, my);
      }
      ctx.closePath();

      // Vivid, deep red liquid fill: minimal, borderless, zero outline, zero heavy glow
      const grad = ctx.createRadialGradient(
        -BASE_RADIUS * 0.25,
        -BASE_RADIUS * 0.25,
        0,
        0,
        0,
        BASE_RADIUS * 1.5
      );
      grad.addColorStop(0, '#ff3366');   // Bright vibrant highlight
      grad.addColorStop(0.5, '#e60039');  // Saturated rich liquid red
      grad.addColorStop(0.9, '#b30024');  // Deep red
      grad.addColorStop(1, '#80001a');    // Dark rubber edge

      ctx.fillStyle = grad;
      ctx.fill();

      ctx.restore();
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousemove', onPointerMove);
      liquidMergeManager.update({ targetId: null, progress: 0 });
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 pointer-events-none z-[9990] will-change-transform"
      style={{
        width: `${CANVAS_SIZE}px`,
        height: `${CANVAS_SIZE}px`,
        transform: 'translate3d(-200px, -200px, 0)'
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
}
