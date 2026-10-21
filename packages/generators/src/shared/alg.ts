// Algebra helpers: polynomials and linear expressions written the way a teacher would, and simple
// graphs on a grid.
import type { CartesianSpec } from "@mathsplanner/diagrams";

/**
 * A polynomial in v from its coefficients, highest power first: poly([1, 5, 6]) is x^2 + 5x + 6.
 * Zero terms are left out, 1 and −1 coefficients are not written, and signs are joined properly.
 */
export function poly(coeffs: number[], v = "x"): string {
  const degree = coeffs.length - 1;
  const terms: string[] = [];
  coeffs.forEach((c, i) => {
    if (c === 0) return;
    const power = degree - i;
    const letter = power === 0 ? "" : power === 1 ? v : `${v}^${power}`;
    const size = Math.abs(c);
    const body = power === 0 ? String(size) : size === 1 ? letter : `${size}${letter}`;
    terms.push(terms.length === 0 ? (c < 0 ? `-${body}` : body) : `${c < 0 ? "-" : "+"} ${body}`);
  });
  return terms.length ? terms.join(" ") : "0";
}

/** "+ 3" or "- 3", for gluing a constant onto an expression. */
export const signed = (n: number) => `${n < 0 ? "-" : "+"} ${Math.abs(n)}`;

/** A bracket (x + a), written (x - a) for negative a. */
export const bracket = (a: number, v = "x") => (a === 0 ? v : `(${v} ${signed(a)})`);

/**
 * Whether the line y = mx + c keeps clear of the origin's "O" label, which sits just below and to
 * the left of the origin, and of the tick labels beside it.
 */
export function clearOfOrigin(m: number, c: number): boolean {
  const [px, py] = [-0.5, -0.5];
  return Math.abs(m * px - py + c) / Math.hypot(m, 1) > 0.9;
}

/** y = mx + c as LaTeX, e.g. y = 2x - 3. */
export const lineLatex = (m: number, c: number, v = "x") => `y = ${poly([m, c], v)}`;

/**
 * A grid from −r to r on both axes with the given lines (y in terms of x) and points. Pass a
 * description when the default one would give the answer away, e.g. by naming the line.
 */
export function grid(
  r: number,
  curves: string[],
  points: { at: [number, number]; label?: string }[] = [],
  description?: string,
): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: -r, max: r, step: r > 8 ? 2 : 1 },
    y: { min: -r, max: r, step: r > 8 ? 2 : 1 },
    grid: true,
    curves: curves.map((y) => ({ y })),
    points,
    ...(description ? { description } : {}),
  };
}

/** Wrong answers that differ from the answer and each other; unlike wrongs(), negatives are kept. */
export function signedWrongs<W extends { value: { kind: string; value?: unknown } }>(
  answer: number,
  list: W[],
): W[] {
  const seen = new Set<unknown>([answer]);
  return list.filter((w) => {
    const v = w.value.value;
    if (seen.has(v)) return false;
    seen.add(v);
    return true;
  });
}
