import type { SpriteData } from '@/components/pixel/sprites';
import { PLAYER, WORLD, isOnGround, type GameState } from './engine';

/** Palette role → CSS custom property (same roles as PixelSprite). */
const ROLE_VARS: Record<string, string> = {
  X: '--border',
  F: '--fg',
  A: '--accent',
  H: '--accent-2',
  S: '--surface',
  M: '--muted',
  G: '--gold',
  D: '--danger',
  B: '--bg-deep',
};

export interface GameSprites {
  playerFrames: readonly SpriteData[];
  bug: SpriteData;
  coin: SpriteData;
}

/** Draws a GameState onto a 2D canvas using the page's current theme colours. */
export class CanvasRenderer {
  private colors: Record<string, string> = {};

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly sprites: GameSprites,
  ) {
    this.refreshTheme();
  }

  /** Re-read CSS variables (call after a theme switch). */
  refreshTheme(): void {
    const style = getComputedStyle(document.documentElement);
    for (const [role, variable] of Object.entries(ROLE_VARS)) {
      this.colors[role] = style.getPropertyValue(variable).trim() || '#000';
    }
    this.colors.bg = style.getPropertyValue('--surface-2').trim() || '#fff';
  }

  render(state: GameState): void {
    const { ctx } = this;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = this.colors.bg;
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);

    this.drawGround(state);
    for (const coin of state.coinItems) this.drawSprite(this.sprites.coin, coin.x, coin.y, coin.width, coin.height);
    for (const bug of state.bugs) this.drawSprite(this.sprites.bug, bug.x, bug.y, bug.width, bug.height);

    const running = state.status === 'running' && isOnGround(state);
    const frame = running ? Math.floor(state.time * 8) % this.sprites.playerFrames.length : 0;
    this.drawSprite(this.sprites.playerFrames[frame], PLAYER.x - 1, state.playerY, 16, 16);
  }

  private drawGround(state: GameState): void {
    const { ctx } = this;
    ctx.fillStyle = this.colors.X;
    ctx.fillRect(0, WORLD.groundY, WORLD.width, 2);
    ctx.fillStyle = this.colors.H;
    ctx.fillRect(0, WORLD.groundY + 2, WORLD.width, WORLD.height - WORLD.groundY - 2);
    // Scrolling brick seams sell the motion.
    ctx.fillStyle = this.colors.X;
    const offset = Math.floor(state.distance) % 16;
    for (let x = -offset; x < WORLD.width; x += 16) ctx.fillRect(x, WORLD.groundY + 8, 1, 8);
  }

  /** Draws a sprite grid stretched to the given world box. */
  private drawSprite(sprite: SpriteData, x: number, y: number, width: number, height: number): void {
    const rows = sprite.length;
    const cols = sprite[0]?.length ?? 0;
    const cellW = width / cols;
    const cellH = height / rows;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const color = this.colors[sprite[row][col]];
        if (!color) continue;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(Math.round(x + col * cellW), Math.round(y + row * cellH), Math.ceil(cellW), Math.ceil(cellH));
      }
    }
  }
}
