import type { MusicPlayer, SoundEffect, SoundEffectsPlayer } from './sound';

type Wave = OscillatorType;

interface Note {
  /** Frequency in Hz. */
  freq: number;
  /** Duration in seconds. */
  duration: number;
}

/** Lazily creates a single AudioContext — browsers only allow it after a user gesture. */
export class AudioContextProvider {
  private context: AudioContext | null = null;

  get(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.context) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.context = new Ctor();
    }
    if (this.context.state === 'suspended') void this.context.resume();
    return this.context;
  }
}

function playTone(
  ctx: AudioContext,
  { freq, duration }: Note,
  at: number,
  wave: Wave,
  volume: number,
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, at);
  gain.gain.setValueAtTime(volume, at);
  // Short release avoids clicks between notes.
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + duration + 0.02);
}

const EFFECTS: Record<SoundEffect, Note[]> = {
  select: [{ freq: 880, duration: 0.05 }],
  confirm: [
    { freq: 660, duration: 0.06 },
    { freq: 990, duration: 0.09 },
  ],
  coin: [
    { freq: 988, duration: 0.07 },
    { freq: 1319, duration: 0.2 },
  ],
  secret: [
    { freq: 523, duration: 0.08 },
    { freq: 659, duration: 0.08 },
    { freq: 784, duration: 0.08 },
    { freq: 1047, duration: 0.25 },
  ],
};

export class WebAudioEffectsPlayer implements SoundEffectsPlayer {
  constructor(private readonly contexts: AudioContextProvider) {}

  play(effect: SoundEffect): void {
    const ctx = this.contexts.get();
    if (!ctx) return;
    let at = ctx.currentTime;
    for (const note of EFFECTS[effect]) {
      playTone(ctx, note, at, 'square', 0.06);
      at += note.duration;
    }
  }
}

const midiToFreq = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** A minor progression: Am – F – C – G, one bar each. Root notes (MIDI). */
const PROGRESSION = [57, 53, 48, 55];
/** Arpeggio intervals over each chord (minor for Am, major otherwise). */
const ARPEGGIOS = [
  [0, 3, 7, 12, 7, 3, 0, 3],
  [0, 4, 7, 12, 7, 4, 0, 4],
  [0, 4, 7, 12, 7, 4, 0, 4],
  [0, 4, 7, 12, 7, 4, 0, 4],
];
const STEPS_PER_BAR = 8;

/**
 * Procedural chiptune: a lookahead scheduler (Web Audio "tale of two clocks")
 * that queues notes slightly ahead of time so the loop never drifts.
 */
export class ChiptuneMusicPlayer implements MusicPlayer {
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextNoteTime = 0;
  private step = 0;
  private readonly stepDuration = 60 / 132 / 2; // eighth notes at 132 BPM

  constructor(private readonly contexts: AudioContextProvider) {}

  start(): void {
    const ctx = this.contexts.get();
    if (!ctx || this.timer) return;
    this.step = 0;
    this.nextNoteTime = ctx.currentTime + 0.05;
    this.timer = setInterval(() => this.schedule(ctx), 25);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private schedule(ctx: AudioContext): void {
    while (this.nextNoteTime < ctx.currentTime + 0.12) {
      const bar = Math.floor(this.step / STEPS_PER_BAR) % PROGRESSION.length;
      const beat = this.step % STEPS_PER_BAR;
      const root = PROGRESSION[bar];
      const lead = midiToFreq(root + 12 + ARPEGGIOS[bar][beat]);
      playTone(ctx, { freq: lead, duration: this.stepDuration * 0.9 }, this.nextNoteTime, 'square', 0.025);
      if (beat % 2 === 0) {
        playTone(
          ctx,
          { freq: midiToFreq(root - 12), duration: this.stepDuration * 1.8 },
          this.nextNoteTime,
          'triangle',
          0.08,
        );
      }
      this.nextNoteTime += this.stepDuration;
      this.step += 1;
    }
  }
}
