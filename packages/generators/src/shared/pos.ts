// Shared pieces for position and direction: coordinates, shapes on grids and the transformations
// that move them (translations, reflections, rotations and enlargements).
import type { RichInput } from "@mathsplanner/archetypes";
import type { Rng } from "@mathsplanner/core";
import type { CartesianPolygon, CartesianSpec, Coord } from "@mathsplanner/diagrams";

/** (3, -2) as LaTeX. */
export const coord = ([x, y]: Coord) => `(${x}, ${y})`;
export const same = (a: Coord, b: Coord) => a[0] === b[0] && a[1] === b[1];
export const sameShape = (a: Coord[], b: Coord[]) =>
  a.length === b.length && a.every((p, i) => same(p, b[i] as Coord));

export const translate = (s: Coord[], dx: number, dy: number): Coord[] =>
  s.map(([x, y]) => [x + dx, y + dy]);
/** Reflect in the vertical line x = m. */
export const reflectX = (s: Coord[], m: number): Coord[] => s.map(([x, y]) => [2 * m - x, y]);
/** Reflect in the horizontal line y = m. */
export const reflectY = (s: Coord[], m: number): Coord[] => s.map(([x, y]) => [x, 2 * m - y]);
/** Rotate about (cx, cy) by quarter turns clockwise (1, 2 or 3). */
export function rotate(s: Coord[], quarters: number, [cx, cy]: Coord = [0, 0]): Coord[] {
  return s.map(([x, y]) => {
    let [u, v] = [x - cx, y - cy];
    for (let i = 0; i < ((quarters % 4) + 4) % 4; i++) [u, v] = [v, -u];
    return [cx + u, cy + v];
  });
}
export const enlarge = (s: Coord[], k: number, [cx, cy]: Coord): Coord[] =>
  s.map(([x, y]) => [cx + k * (x - cx), cy + k * (y - cy)]);

/** Words for a translation: "3 squares right and 2 squares down". */
export function moveWords(dx: number, dy: number): string {
  const part = (n: number, pos: string, neg: string) =>
    n === 0 ? "" : `${Math.abs(n)} square${Math.abs(n) === 1 ? "" : "s"} ${n > 0 ? pos : neg}`;
  return [part(dx, "right", "left"), part(dy, "up", "down")].filter(Boolean).join(" and ");
}

/** Small shapes with whole-number vertices, drawn from their bottom-left corner. */
export const SHAPES: Coord[][] = [
  [
    [0, 0],
    [2, 0],
    [0, 3],
  ],
  [
    [0, 0],
    [3, 0],
    [3, 1],
    [1, 1],
    [1, 2],
    [0, 2],
  ],
  [
    [0, 0],
    [2, 0],
    [3, 2],
    [0, 2],
  ],
  [
    [0, 0],
    [3, 0],
    [1, 2],
  ],
];

/** A random shape placed with its bottom-left corner at (x, y). */
export function placeShape(rng: Rng, x: number, y: number): Coord[] {
  return translate(rng.pick(SHAPES), x, y);
}

export const inRange = (s: Coord[], lo: number, hi: number) =>
  s.every(([x, y]) => x >= lo && x <= hi && y >= lo && y <= hi);

/**
 * A grid from lo to hi on both axes with shapes (optionally labelled), points and dashed mirror
 * lines. First-quadrant grids have lo = 0.
 */
export function shapesGrid(
  lo: number,
  hi: number,
  shapes: { vertices: Coord[]; label?: string; shaded?: boolean; dashed?: boolean }[],
  description: string,
  extra: Partial<CartesianSpec> = {},
): CartesianSpec {
  const polygons: CartesianPolygon[] = shapes.map((s) => ({
    vertices: s.vertices,
    ...(s.label ? { label: s.label } : {}),
    ...(s.shaded === false ? {} : { shaded: true }),
    ...(s.dashed ? { dashed: true } : {}),
  }));
  return {
    type: "cartesian",
    x: { min: lo, max: hi, step: 1 },
    y: { min: lo, max: hi, step: 1 },
    grid: true,
    polygons,
    description,
    ...extra,
  };
}

/** A filter for choice distractors: drops any equal to the right answer or to an earlier one. */
export const distinctFrom =
  (right: RichInput) =>
  <D extends { content: RichInput }>(d: D, i: number, all: D[]): boolean => {
    const key = JSON.stringify(d.content);
    return (
      key !== JSON.stringify(right) && all.findIndex((e) => JSON.stringify(e.content) === key) === i
    );
  };
