// Shapes for lesson pictures.
import type { DrawingPic, Point } from "./types.ts";

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

export type Corner = "up-right" | "up-left" | "down-left" | "down-right";
export interface Mark {
  on: "lower" | "upper";
  corner: Corner;
  label: string;
}

const off = (p: Point, deg: number, d: number): Point => ({
  x: p.x + d * Math.cos((deg * Math.PI) / 180),
  y: p.y + d * Math.sin((deg * Math.PI) / 180),
});

/** Two parallel lines crossed by a line at `deg`, with angles marked at the crossings. */
export function parallels(deg: number, marks: Mark[], crossing = true): DrawingPic {
  const lower = { x: 2.4, y: 0 };
  const upper = { x: 2.4 + 3 / Math.tan((deg * Math.PI) / 180), y: 3 };
  const range: Record<Corner, [number, number]> = {
    "up-right": [0, deg],
    "up-left": [deg, 180],
    "down-left": [180, 180 + deg],
    "down-right": [180 + deg, 360],
  };
  return {
    kind: "drawing",
    items: [
      {
        line: [
          { x: 0, y: 0 },
          { x: 6, y: 0 },
        ],
        ...(crossing ? { arrow: 1 } : {}),
      },
      {
        line: [
          { x: 0, y: 3 },
          { x: 6, y: 3 },
        ],
        ...(crossing ? { arrow: 1 } : {}),
      },
      { line: [off(lower, 180 + deg, 1.2), off(upper, deg, 1.2)], tone: "soft" },
      ...marks.map((m) => ({
        angle: m.on === "lower" ? lower : upper,
        from: range[m.corner][0],
        to: range[m.corner][1],
        label: m.label,
      })),
    ],
  };
}
