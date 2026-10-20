// Helpers shared by the diagram types.
import { add, rotate, scale, unit } from "../geom.ts";
import type { Point } from "../svg.ts";
import { layoutLabel, latexToPlain, type TextBox } from "../text.ts";
import { LABEL_SIZE } from "../scene.ts";

export const label = (latex: string): TextBox => layoutLabel(latex, LABEL_SIZE);
export const plain = (latex: string): string => latexToPlain(latex);

/** How far a box's edge reaches from its centre in direction u (unit vector). */
export function reach(text: TextBox, u: Point): number {
  return (Math.abs(u[0]) * text.width) / 2 + (Math.abs(u[1]) * text.height) / 2;
}

/** Candidate centres around `at`, starting in direction `u` (px frame) and fanning out. */
export function aroundPoint(at: Point, u: Point, text: TextBox, gap: number): Point[] {
  const dir = unit(u[0] === 0 && u[1] === 0 ? [1, -1] : u);
  const out: Point[] = [];
  for (const extra of [0, 6]) {
    for (const a of [0, 45, -45, 90, -90, 135, -135, 180]) {
      const d = rotate(dir, (a * Math.PI) / 180);
      out.push(add(at, scale(d, gap + extra + reach(text, d))));
    }
  }
  return out;
}

/** Formats a number for a tick label: integers as they are, decimals without float noise. */
export function numberLabel(v: number): string {
  const rounded = Number(v.toPrecision(10));
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

/** A number for descriptions, with a real minus sign. */
export function numberPlain(v: number): string {
  return numberLabel(v).replace("-", "−");
}

/** "A, B and C" */
export function listJoin(items: readonly string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** An arrowhead at `tip` pointing in direction `u` (px frame). */
export function arrowhead(tip: Point, u: Point, size = 8): [Point, Point, Point] {
  const back = scale(unit(u), -size);
  return [add(tip, rotate(back, 0.45)), tip, add(tip, rotate(back, -0.45))];
}
