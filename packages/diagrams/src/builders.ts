// Builders turn the numbers a generator knows (angles, sides) into to-scale specs, so
// generators never compute coordinates by hand.
import type { Coord, GeoAngle, GeometrySpec, Label } from "./spec.ts";

const rad = (deg: number) => (deg * Math.PI) / 180;
const round = (v: number) => Math.round(v * 1e9) / 1e9;

/** The point `length` from `origin` in direction `degrees` (anticlockwise from east). */
export function pointAt(origin: Coord, degrees: number, length: number): Coord {
  return [
    round(origin[0] + length * Math.cos(rad(degrees))),
    round(origin[1] + length * Math.sin(rad(degrees))),
  ];
}

export interface AngleSpec {
  /** Size in degrees. */
  value: number;
  /** Defaults to the size, e.g. 52°. Use a letter for an unknown. */
  label?: Label;
}

const POINT_NAMES = "ABCDEFGHIJKLMNPQRSTUVWXYZ";

function fan(angles: AngleSpec[], start: number, closeTo?: string): GeometrySpec {
  const points: Record<string, Coord> = { O: [0, 0] };
  const names: string[] = [];
  let heading = start;
  const rayNames: string[] = [];
  const first = POINT_NAMES[0] ?? "A";
  points[first] = pointAt([0, 0], heading, 1);
  rayNames.push(first);
  angles.forEach((_, i) => {
    heading += angles[i]?.value ?? 0;
    const name = i === angles.length - 1 && closeTo ? closeTo : (POINT_NAMES[i + 1] ?? `P${i + 1}`);
    if (!(closeTo && name === closeTo && points[name])) points[name] = pointAt([0, 0], heading, 1);
    rayNames.push(name);
  });
  names.push(...new Set(rayNames));
  const geoAngles: GeoAngle[] = angles.map((a, i) => ({
    vertex: "O",
    from: rayNames[i] ?? "",
    to: rayNames[i + 1] ?? "",
    value: a.value,
    ...(a.label === undefined ? {} : { label: a.label }),
    ...(a.value === 90 && a.label === undefined ? { right: true } : {}),
  }));
  return {
    type: "geometry",
    points,
    segments: names.map((n) => ({ from: "O", to: n })),
    angles: geoAngles,
  };
}

/** Angles on a straight line: the angles must add up to 180°. */
export function anglesOnLine(angles: AngleSpec[]): GeometrySpec {
  const total = angles.reduce((sum, a) => sum + a.value, 0);
  if (Math.abs(total - 180) > 1e-9)
    throw new RangeError(`angles on a line add up to ${total}°, not 180°`);
  const spec = fan(angles, 0);
  const last = Object.keys(spec.points).at(-1) ?? "";
  // Replace the two outer rays with one straight line through O.
  return {
    ...spec,
    segments: [
      { from: "A", to: last, extend: false },
      ...(spec.segments ?? []).filter((s) => s.to !== "A" && s.to !== last),
    ],
  };
}

/** Angles at a point: the angles must add up to 360°. */
export function anglesAtPoint(angles: AngleSpec[], start = 20): GeometrySpec {
  const total = angles.reduce((sum, a) => sum + a.value, 0);
  if (Math.abs(total - 360) > 1e-9)
    throw new RangeError(`angles at a point add up to ${total}°, not 360°`);
  return fan(angles, start, "A");
}

/** A regular polygon with vertices A, B, C… on a circle of the given radius. */
export function regularPolygon(sides: number, radius = 1, start = -90 - 180 / sides): GeometrySpec {
  const points: Record<string, Coord> = {};
  const vertices: string[] = [];
  for (let i = 0; i < sides; i++) {
    const name = POINT_NAMES[i] ?? `P${i}`;
    points[name] = pointAt([0, 0], start + (360 * i) / sides, radius);
    vertices.push(name);
  }
  return { type: "geometry", points, polygons: [{ vertices }] };
}

/**
 * Triangle ABC from two angles and the side between them (ASA): A at the origin, B along the
 * x-axis, C above. Angles in degrees.
 */
export function triangleASA(
  angleA: number,
  ab: number,
  angleB: number,
): Record<"A" | "B" | "C", Coord> {
  const angleC = 180 - angleA - angleB;
  if (!(angleC > 0))
    throw new RangeError(`angles ${angleA}° and ${angleB}° do not leave room for a triangle`);
  const ac = (ab * Math.sin(rad(angleB))) / Math.sin(rad(angleC));
  return { A: [0, 0], B: [ab, 0], C: pointAt([0, 0], angleA, ac) };
}

/** Triangle ABC from three sides (SSS), A at the origin and B along the x-axis. */
export function triangleSSS(ab: number, bc: number, ca: number): Record<"A" | "B" | "C", Coord> {
  if (!(ab + bc > ca && bc + ca > ab && ca + ab > bc)) {
    throw new RangeError(`sides ${ab}, ${bc}, ${ca} break the triangle inequality`);
  }
  const x = (ab * ab + ca * ca - bc * bc) / (2 * ab);
  return { A: [0, 0], B: [ab, 0], C: [round(x), round(Math.sqrt(ca * ca - x * x))] };
}
