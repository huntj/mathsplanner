// Shape helpers shared by the shape-property generators.
import {
  pointAt,
  regularPolygon,
  shape,
  type Coord,
  type GeometrySpec,
  type ShapeKind,
} from "@mathsplanner/diagrams";

export const TRIANGLES: ShapeKind[] = ["equilateral", "isosceles", "scalene", "right-angled"];
export const QUADRILATERALS: ShapeKind[] = [
  "square",
  "rectangle",
  "rhombus",
  "parallelogram",
  "trapezium",
  "kite",
];

/** Display names as a teacher would say them. */
export const SHAPE_NAME: Record<ShapeKind, string> = {
  square: "square",
  rectangle: "rectangle",
  rhombus: "rhombus",
  parallelogram: "parallelogram",
  trapezium: "trapezium",
  kite: "kite",
  equilateral: "equilateral triangle",
  isosceles: "isosceles triangle",
  scalene: "scalene triangle",
  "right-angled": "right-angled triangle",
};

export const capital = (s: string) => `${s[0]?.toUpperCase() ?? ""}${s.slice(1)}`;

/** Lines of symmetry of each shape as drawn by `shape()`. */
export const SYMMETRY_LINES: Partial<Record<ShapeKind, number>> = {
  square: 4,
  rectangle: 2,
  rhombus: 2,
  parallelogram: 0,
  kite: 1,
  equilateral: 3,
  isosceles: 1,
  scalene: 0,
};

/** Parallelogram ABCD with angle a at A, marked with parallel arrows. */
export function parallelogram(a: number, extra: Partial<GeometrySpec> = {}): GeometrySpec {
  const A: Coord = [0, 0];
  const B: Coord = [4, 0];
  const D = pointAt(A, a, 2.6);
  const C: Coord = [B[0] + D[0], B[1] + D[1]];
  return {
    type: "geometry",
    points: { A, B, C, D },
    polygons: [{ vertices: ["A", "B", "C", "D"] }],
    segments: [
      { from: "A", to: "B", arrows: 1 },
      { from: "D", to: "C", arrows: 1 },
      { from: "A", to: "D", arrows: 2 },
      { from: "B", to: "C", arrows: 2 },
    ],
    ...extra,
  };
}

/**
 * Kite ABCD standing on A, with angle `bottom` at A and `top` at C; the equal angles are at B and
 * D. AB = AD and CB = CD.
 */
export function kite(bottom: number, top: number, extra: Partial<GeometrySpec> = {}): GeometrySpec {
  const rad = (d: number) => (d * Math.PI) / 180;
  const A: Coord = [0, 0];
  const B = pointAt(A, 90 - bottom / 2, 2.4);
  const D = pointAt(A, 90 + bottom / 2, 2.4);
  const s2 = B[0] / Math.sin(rad(top / 2));
  const C: Coord = [0, Math.round((B[1] + s2 * Math.cos(rad(top / 2))) * 1e9) / 1e9];
  return {
    type: "geometry",
    points: { A, B, C, D },
    polygons: [{ vertices: ["A", "B", "C", "D"] }],
    segments: [
      { from: "A", to: "B", ticks: 1 },
      { from: "A", to: "D", ticks: 1 },
      { from: "B", to: "C", ticks: 2 },
      { from: "D", to: "C", ticks: 2 },
    ],
    ...extra,
  };
}

/** A hexagon with six equal sides but unequal angles (alternating 100° and 140°). */
export function equalSidedHexagon(marks = true): GeometrySpec {
  const names = ["A", "B", "C", "D", "E", "F"];
  const points: Record<string, Coord> = {};
  let p: Coord = [0, 0];
  let heading = 0;
  names.forEach((name, i) => {
    points[name] = p;
    p = pointAt(p, heading, 2);
    heading += i % 2 === 0 ? 80 : 40;
  });
  return {
    type: "geometry",
    points,
    polygons: [{ vertices: names }],
    ...(marks
      ? { segments: names.map((n, i) => ({ from: n, to: names[(i + 1) % 6] ?? "A", ticks: 1 })) }
      : {}),
  };
}

/** A regular polygon with every side marked equal. */
export function regularMarked(sides: number): GeometrySpec {
  const spec = regularPolygon(sides, 2);
  const names = spec.polygons?.[0]?.vertices ?? [];
  return {
    ...spec,
    segments: names.map((n, i) => ({ from: n, to: names[(i + 1) % names.length] ?? "", ticks: 1 })),
  };
}

export { shape };
