import { describe, expect, it } from 'vitest';
import { createGame, intersects, isOnGround, press, score, step, WORLD, PLAYER, type GameState } from '../engine';

const never = () => 0.99;

function running(overrides: Partial<GameState> = {}): GameState {
  return { ...createGame(), status: 'running', nextBug: 99, nextCoin: 99, ...overrides };
}

describe('game engine', () => {
  it('starts idle on the ground', () => {
    const game = createGame();
    expect(game.status).toBe('ready');
    expect(isOnGround(game)).toBe(true);
  });

  it('press starts the run with a jump', () => {
    const game = press(createGame());
    expect(game.status).toBe('running');
    expect(game.velocityY).toBeLessThan(0);
  });

  it('does not allow double jumps in the air', () => {
    const airborne = step(press(createGame()), 0.05, never);
    expect(isOnGround(airborne)).toBe(false);
    expect(press(airborne)).toBe(airborne);
  });

  it('lands back on the ground after a jump', () => {
    let game = press(createGame());
    for (let i = 0; i < 60; i += 1) game = step({ ...game, nextBug: 99, nextCoin: 99 }, 0.05, never);
    expect(isOnGround(game)).toBe(true);
    expect(game.velocityY).toBe(0);
  });

  it('ends the game when the player hits a bug', () => {
    const bug = { id: 1, x: PLAYER.x, y: WORLD.groundY - 12, width: 16, height: 12 };
    const game = step(running({ bugs: [bug] }), 0.01, never);
    expect(game.status).toBe('over');
  });

  it('collects coins and adds them to the score', () => {
    const player = running();
    const coin = { id: 1, x: PLAYER.x + 2, y: player.playerY + 2, width: 10, height: 10 };
    const game = step({ ...player, coinItems: [coin] }, 0.001, never);
    expect(game.coins).toBe(1);
    expect(game.coinItems).toHaveLength(0);
    expect(score(game)).toBeGreaterThanOrEqual(25);
  });

  it('spawns bugs over time and speeds up', () => {
    let game = running({ nextBug: 0.01 });
    game = step(game, 0.02, never);
    expect(game.bugs).toHaveLength(1);
    expect(game.speed).toBeGreaterThan(createGame().speed);
  });

  it('restarts after game over', () => {
    const over = { ...createGame(), status: 'over' as const, distance: 500, coins: 3 };
    const restarted = press(over);
    expect(restarted.status).toBe('running');
    expect(restarted.coins).toBe(0);
    expect(restarted.distance).toBe(0);
  });

  it('does nothing while not running', () => {
    const ready = createGame();
    expect(step(ready, 1)).toBe(ready);
  });

  it('detects box intersections with an inset', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    expect(intersects(a, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
    expect(intersects(a, { x: 9, y: 9, width: 10, height: 10 })).toBe(false);
  });
});
