// Circle helpers shared by the circle generators. The geometry spec has circles but no arcs, so
// sectors and segments are drawn as shaded polygons whose vertices are sampled along the arc.
import { pointAt, type Coord, type GeometrySpec } from "@mathsplanner/diagrams";

export const RADIUS = 2.5;

const round = ([x, y]: Coord): Coord => [Math.round(x * 1e9) / 1e9, Math.round(y * 1e9) / 1e9];

/** The point on the circle (centre O at the origin) at this bearing from the x-axis, anticlockwise. */
export const onCircle = (degrees: number, r = RADIUS): Coord => round(pointAt([0, 0], degrees, r));

/** A circle with centre O marked by a dot, plus any extra points and marks. */
export function circle(extra: Partial<GeometrySpec> = {}, r = RADIUS): GeometrySpec {
  return {
    type: "geometry",
    ...extra,
    points: { O: [0, 0], ...(extra.points ?? {}) },
    circles: [{ centre: "O", radius: r }, ...(extra.circles ?? [])],
    dots: ["O", ...(extra.dots ?? [])],
  };
}

/** Named points sampled along the arc from `from`° to `to`° (anticlockwise), ends included. */
export function arc(prefix: string, from: number, to: number, r = RADIUS): Record<string, Coord> {
  const steps = Math.max(4, Math.ceil((to - from) / 6));
  const out: Record<string, Coord> = {};
  for (let i = 0; i <= steps; i++)
    out[`${prefix}${i}`] = onCircle(from + ((to - from) * i) / steps, r);
  return out;
}

/** A shaded sector (with O) or segment (closed by a chord) between `from`° and `to`°. */
export function region(kind: "sector" | "segment", from: number, to: number): GeometrySpec {
  const points = arc("K", from, to);
  const names = Object.keys(points);
  return circle({
    points,
    polygons: [{ vertices: kind === "sector" ? ["O", ...names] : names, shaded: true }],
    description: `A circle with centre O and a shaded ${kind}.`,
  });
}
