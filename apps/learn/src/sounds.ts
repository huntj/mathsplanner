// Short sounds for right and wrong answers and a finished lesson, made in the browser with the Web
// Audio API, so there are no sound files to load. They are quiet and short, play only after the
// pupil has tapped something (as browsers require), and the Sounds switch turns them off.

export type Sound = "right" | "wrong" | "done" | "out";

/** Each sound as notes: frequency in hertz, start and length in seconds. */
const NOTES: Record<Sound, { wave: OscillatorType; notes: [number, number, number][] }> = {
  right: {
    wave: "triangle",
    notes: [
      [659, 0, 0.12],
      [988, 0.09, 0.2],
    ],
  },
  wrong: { wave: "sine", notes: [[220, 0, 0.22]] },
  done: {
    wave: "triangle",
    notes: [
      [523, 0, 0.14],
      [659, 0.12, 0.14],
      [784, 0.24, 0.14],
      [1047, 0.36, 0.3],
    ],
  },
  out: {
    wave: "sine",
    notes: [
      [392, 0, 0.18],
      [294, 0.16, 0.3],
    ],
  },
};

let context: AudioContext | undefined;

export function play(sound: Sound, on: boolean): void {
  if (!on || typeof AudioContext === "undefined") return;
  try {
    context ??= new AudioContext();
    const now = context.currentTime;
    const { wave, notes } = NOTES[sound];
    for (const [frequency, start, length] of notes) {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = wave;
      osc.frequency.value = frequency;
      // A quick fade in and out, so the notes do not click.
      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(0.12, now + start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + length);
      osc.connect(gain).connect(context.destination);
      osc.start(now + start);
      osc.stop(now + start + length + 0.02);
    }
  } catch {
    // Sound is a nicety; a browser that refuses it just stays quiet.
  }
}
