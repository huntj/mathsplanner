// Shapes for lesson pictures.
import type { Point } from "./types.ts";

/** The corners of a regular polygon with n sides, radius r, the first corner at `start` degrees. */
export function regular(n: number, r = 3, start = 90): Point[] {
  return Array.from({ length: n }, (_, i) => {
    const a = ((start + (360 * i) / n) * Math.PI) / 180;
    const round = (v: number) => Math.round(v * 1000) / 1000;
    return { x: round(r * Math.cos(a)), y: round(r * Math.sin(a)) };
  });
}

/** A line through the middle (0, 0) at `deg` degrees, reaching `len` each way: a mirror line. */
export function through(deg: number, len: number): [Point, Point] {
  const a = (deg * Math.PI) / 180;
  const round = (v: number) => Math.round(v * 1000) / 1000;
  const x = round(len * Math.cos(a));
  const y = round(len * Math.sin(a));
  return [
    { x: -x, y: -y },
    { x, y },
  ];
}
