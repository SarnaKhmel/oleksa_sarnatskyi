'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BUG, DEV_FRAMES, ICONS } from '@/components/pixel/sprites';
import { PixelButton } from '@/components/ui/PixelButton';
import type { UiCopy } from '@/domain/content';
import { createGame, press, score, step, WORLD, type GameState } from '@/game/engine';
import { CanvasRenderer } from '@/game/renderer';
import { useServices } from '@/providers/AppProviders';
import { useSfx, useTheme } from '@/providers/hooks';

const BEST_KEY = 'game-best';
const JUMP_KEYS = new Set([' ', 'Spacebar', 'ArrowUp', 'w', 'W']);

function readBest(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return Number(window.localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0; // Storage blocked — the best score is simply not remembered.
  }
}

export function GameCanvas({ copy }: { copy: UiCopy['game'] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(createGame());
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const visibleRef = useRef(false);
  const [view, setView] = useState({ status: 'ready' as GameState['status'], score: 0 });
  const [best, setBest] = useState(readBest);
  const services = useServices();
  const sfx = useSfx();
  const { theme } = useTheme();

  const act = useCallback(() => {
    const before = stateRef.current;
    const after = press(before);
    stateRef.current = after;
    if (after !== before) sfx(before.status === 'running' ? 'select' : 'confirm');
  }, [sfx]);

  // Game loop — runs only while the canvas is on screen.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    canvas.width = WORLD.width;
    canvas.height = WORLD.height;
    rendererRef.current = new CanvasRenderer(ctx, { playerFrames: DEV_FRAMES, bug: BUG, coin: ICONS.coin });

    let frame = 0;
    let last = performance.now();
    let coins = 0;
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (visibleRef.current) {
        const prev = stateRef.current;
        const next = step(prev, dt);
        stateRef.current = next;
        if (next.coins > coins && services?.soundEnabled.getSnapshot()) services.effects.play('coin');
        coins = next.coins;
        if (prev.status === 'running' && next.status === 'over') {
          const final = score(next);
          setBest((current) => {
            const record = Math.max(current, final);
            try {
              window.localStorage.setItem(BEST_KEY, String(record));
            } catch {
              // ignore
            }
            return record;
          });
        }
        rendererRef.current?.render(next);
        setView((current) =>
          current.status === next.status && current.score === score(next)
            ? current
            : { status: next.status, score: score(next) },
        );
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      last = performance.now();
    });
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [services]);

  // Theme switches change the palette the renderer reads.
  useEffect(() => {
    rendererRef.current?.refreshTheme();
    rendererRef.current?.render(stateRef.current);
  }, [theme]);

  // Keyboard: only captured while the game is running or focused, so Space
  // keeps scrolling the page everywhere else.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!JUMP_KEYS.has(event.key)) return;
      const focused = document.activeElement === canvasRef.current;
      if (!focused && stateRef.current.status !== 'running') return;
      if (!visibleRef.current) return;
      event.preventDefault();
      act();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [act]);

  return (
    <div className="bg-surface p-3 pixel-frame sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-pixel text-[10px] uppercase">
        <span>
          {copy.score}: <span className="tabular-nums text-accent-2 dark:text-accent">{view.score}</span>
        </span>
        <span>
          {copy.best}:{' '}
          <span className="tabular-nums text-gold" suppressHydrationWarning>
            {best}
          </span>
        </span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label={copy.controls}
          onPointerDown={(event) => {
            event.preventDefault();
            canvasRef.current?.focus({ preventScroll: true });
            act();
          }}
          className="pixelated block aspect-[320/112] w-full cursor-pointer touch-manipulation border-4 border-line"
        />
        {view.status !== 'running' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg/70 p-4 text-center">
            {view.status === 'over' && (
              <p className="font-pixel text-[10px] uppercase leading-relaxed sm:text-xs">{copy.over}</p>
            )}
            <PixelButton
              onClick={() => {
                act();
                canvasRef.current?.focus({ preventScroll: true });
              }}
              sound="confirm"
            >
              ▶ {view.status === 'over' ? copy.restart : copy.start}
            </PixelButton>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-muted">{copy.controls}</p>
    </div>
  );
}
