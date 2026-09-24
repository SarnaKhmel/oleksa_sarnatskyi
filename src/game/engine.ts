/**
 * A tiny side-scroller: the developer runs, jumps over bugs and collects coins.
 * Pure game logic — no DOM, no canvas, no timers — so it is fully unit-testable.
 * All units are "world pixels" of a fixed low-resolution screen.
 */

export const WORLD = { width: 320, height: 112, groundY: 96 } as const;

export const PLAYER = { x: 32, width: 14, height: 16 } as const;

const GRAVITY = 1100;
const JUMP_VELOCITY = -380;
const START_SPEED = 120;
const MAX_SPEED = 280;
const ACCELERATION = 5;

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Entity extends Box {
  id: number;
}

export type GameStatus = 'ready' | 'running' | 'over';

export interface GameState {
  status: GameStatus;
  playerY: number;
  velocityY: number;
  speed: number;
  distance: number;
  coins: number;
  bugs: Entity[];
  coinItems: Entity[];
  /** Seconds until the next bug / coin spawns. */
  nextBug: number;
  nextCoin: number;
  nextId: number;
  /** Seconds the run has lasted — drives the walk animation. */
  time: number;
}

/** Injected randomness keeps the engine deterministic in tests. */
export type Random = () => number;

export function createGame(): GameState {
  return {
    status: 'ready',
    playerY: WORLD.groundY - PLAYER.height,
    velocityY: 0,
    speed: START_SPEED,
    distance: 0,
    coins: 0,
    bugs: [],
    coinItems: [],
    nextBug: 1.2,
    nextCoin: 0.8,
    nextId: 1,
    time: 0,
  };
}

export function score(state: GameState): number {
  return Math.floor(state.distance / 10) + state.coins * 25;
}

export function isOnGround(state: GameState): boolean {
  return state.playerY >= WORLD.groundY - PLAYER.height;
}

/** Start / jump / restart — the only input the game needs. */
export function press(state: GameState): GameState {
  if (state.status === 'over') return { ...createGame(), status: 'running' };
  if (state.status === 'ready') return { ...state, status: 'running', velocityY: JUMP_VELOCITY };
  if (!isOnGround(state)) return state;
  return { ...state, velocityY: JUMP_VELOCITY };
}

export function intersects(a: Box, b: Box, inset = 2): boolean {
  return (
    a.x + inset < b.x + b.width - inset &&
    a.x + a.width - inset > b.x + inset &&
    a.y + inset < b.y + b.height - inset &&
    a.y + a.height - inset > b.y + inset
  );
}

export function playerBox(state: GameState): Box {
  return { x: PLAYER.x, y: state.playerY, width: PLAYER.width, height: PLAYER.height };
}

/** Advances the world by `dt` seconds. Returns a new state (immutable updates). */
export function step(state: GameState, dt: number, random: Random = Math.random): GameState {
  if (state.status !== 'running') return state;
  const delta = Math.min(dt, 0.05); // avoid tunnelling after a background tab

  const speed = Math.min(MAX_SPEED, state.speed + ACCELERATION * delta);
  const move = speed * delta;

  // Vertical physics
  let velocityY = state.velocityY + GRAVITY * delta;
  let playerY = state.playerY + velocityY * delta;
  const floor = WORLD.groundY - PLAYER.height;
  if (playerY >= floor) {
    playerY = floor;
    velocityY = 0;
  }

  let { nextId } = state;

  // Bugs
  let nextBug = state.nextBug - delta;
  let bugs = state.bugs.map((bug) => ({ ...bug, x: bug.x - move })).filter((bug) => bug.x + bug.width > 0);
  if (nextBug <= 0) {
    const tall = random() < 0.3;
    bugs = [
      ...bugs,
      {
        id: nextId++,
        x: WORLD.width,
        y: WORLD.groundY - (tall ? 18 : 12),
        width: 16,
        height: tall ? 18 : 12,
      },
    ];
    // Gaps shrink as the game speeds up, but always leave room to land.
    nextBug = 0.9 + random() * 1.1 - (speed - START_SPEED) / 600;
  }

  // Coins
  let nextCoin = state.nextCoin - delta;
  let coinItems = state.coinItems
    .map((coin) => ({ ...coin, x: coin.x - move }))
    .filter((coin) => coin.x + coin.width > 0);
  if (nextCoin <= 0) {
    coinItems = [
      ...coinItems,
      { id: nextId++, x: WORLD.width, y: WORLD.groundY - 44 - Math.floor(random() * 16), width: 10, height: 10 },
    ];
    nextCoin = 0.7 + random() * 1.3;
  }

  const next: GameState = {
    ...state,
    speed,
    playerY,
    velocityY,
    bugs,
    nextBug,
    nextCoin,
    nextId,
    distance: state.distance + move,
    time: state.time + delta,
    coinItems,
  };

  const player = playerBox(next);
  const collected = coinItems.filter((coin) => intersects(player, coin, 0));
  if (collected.length > 0) {
    next.coins += collected.length;
    next.coinItems = coinItems.filter((coin) => !collected.includes(coin));
  }
  if (bugs.some((bug) => intersects(player, bug))) next.status = 'over';

  return next;
}
