// Trigonometry helpers for A level: exact values as LaTeX, radians as multiples of π, and solutions
// of sin x = c, cos x = c and tan x = c in a range of degrees.

export type TrigFn = "sin" | "cos" | "tan";

/** Exact values at 30°, 45° and 60° as LaTeX, with their decimal sizes for checking. */
export const EXACT: Record<TrigFn, Record<30 | 45 | 60, [string, number]>> = {
  sin: {
    30: ["\\frac{1}{2}", 0.5],
    45: ["\\frac{\\sqrt{2}}{2}", Math.SQRT1_2],
    60: ["\\frac{\\sqrt{3}}{2}", Math.sqrt(3) / 2],
  },
  cos: {
    30: ["\\frac{\\sqrt{3}}{2}", Math.sqrt(3) / 2],
    45: ["\\frac{\\sqrt{2}}{2}", Math.SQRT1_2],
    60: ["\\frac{1}{2}", 0.5],
  },
  tan: {
    30: ["\\frac{\\sqrt{3}}{3}", Math.sqrt(3) / 3],
    45: ["1", 1],
    60: ["\\sqrt{3}", Math.sqrt(3)],
  },
};

export const rad = (d: number) => (d * Math.PI) / 180;
export const deg = (r: number) => (r * 180) / Math.PI;
export const r1 = (x: number) => Math.round(x * 10) / 10;

/** An angle in degrees as a multiple of π in LaTeX, e.g. 135 → \frac{3\pi}{4}. */
export function piLatex(degrees: number): string {
  const g = (a: number, b: number): number => (b === 0 ? Math.abs(a) : g(b, a % b));
  const k = g(degrees, 180);
  const [n, d] = [degrees / k, 180 / k];
  const top = n === 1 ? "\\pi" : n === -1 ? "-\\pi" : `${n}\\pi`;
  return d === 1 ? top : `\\frac{${top}}{${d}}`;
}

/**
 * Solutions in degrees of f(x) = value for lo ≤ x ≤ hi, from the principal value p
 * (sin and tan: p in [−90, 90]; cos: p in [0, 180]).
 */
export function solutions(fn: TrigFn, p: number, lo = 0, hi = 360): number[] {
  const base = fn === "sin" ? [p, 180 - p] : fn === "cos" ? [p, -p] : [p];
  const period = fn === "tan" ? 180 : 360;
  const out = new Set<number>();
  for (const b of base) {
    for (let k = -4; k <= 4; k++) {
      const x = Math.round((b + k * period) * 1e6) / 1e6;
      if (x >= lo - 1e-9 && x <= hi + 1e-9) out.add(x);
    }
  }
  return [...out].sort((a, b) => a - b);
}
