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

/**
 * Other names that also correctly describe each shape as drawn (a square is also a rectangle,
 * a rhombus, a parallelogram, a kite and, by the inclusive definition, a trapezium). A
 * distractor must never be one of these, or a right answer would be marked wrong.
 */
export const GENERAL: Record<ShapeKind, ShapeKind[]> = {
  square: ["rectangle", "rhombus", "parallelogram", "kite", "trapezium"],
  rectangle: ["parallelogram", "trapezium"],
  rhombus: ["parallelogram", "kite", "trapezium"],
  parallelogram: ["trapezium"],
  trapezium: [],
  kite: [],
  equilateral: ["isosceles"],
  isosceles: [],
  // The right-angled triangle drawn by shape() has three different sides.
  "right-angled": ["scalene"],
  scalene: [],
};

/** Names from `pool` that are definitely wrong for `kind`. */
export function wrongNames(kind: ShapeKind, pool: readonly ShapeKind[]): ShapeKind[] {
  return pool.filter((k) => k !== kind && !GENERAL[kind].includes(k));
}

/** Whether no shape in the list could also be named as another in it. */
export function distinctKinds(kinds: readonly ShapeKind[]): boolean {
  return kinds.every((a) => kinds.every((b) => a === b || !GENERAL[a].includes(b)));
}

/** Whether a drawn polygon's sides are all equal and its angles are all equal. */
export function polygonFacts(spec: GeometrySpec): { sidesEqual: boolean; anglesEqual: boolean } {
  const names = spec.polygons?.[0]?.vertices ?? [];
  const pts = names.map((n): Coord => spec.points[n] ?? [0, 0]);
  const at = (i: number): Coord => pts[(i + pts.length) % pts.length] ?? [0, 0];
  const sides = pts.map((p, i) => Math.hypot(at(i + 1)[0] - p[0], at(i + 1)[1] - p[1]));
  const angles = pts.map((p, i) => {
    const a = Math.atan2(at(i - 1)[1] - p[1], at(i - 1)[0] - p[0]);
    const b = Math.atan2(at(i + 1)[1] - p[1], at(i + 1)[0] - p[0]);
    return Math.abs(((((a - b) * 180) / Math.PI + 540) % 360) - 180);
  });
  const allSame = (xs: number[]) => xs.every((x) => Math.abs(x - (xs[0] ?? 0)) < 1e-3);
  return { sidesEqual: allSame(sides), anglesEqual: allSame(angles) };
}

/** Facts about the diagonals AC and BD of a drawn quadrilateral ABCD. */
export function diagonalFacts(spec: GeometrySpec): {
  equal: boolean;
  perpendicular: boolean;
  bisected: 0 | 1 | 2;
} {
  const [A, B, C, D] = ["A", "B", "C", "D"].map((n) => spec.points[n] ?? [0, 0]) as [
    Coord,
    Coord,
    Coord,
    Coord,
  ];
  const u: Coord = [C[0] - A[0], C[1] - A[1]];
  const v: Coord = [D[0] - B[0], D[1] - B[1]];
  // Where the diagonals cross, as a fraction t along AC and s along BD.
  const cross = u[0] * v[1] - u[1] * v[0];
  const t = ((B[0] - A[0]) * v[1] - (B[1] - A[1]) * v[0]) / cross;
  const s = ((B[0] - A[0]) * u[1] - (B[1] - A[1]) * u[0]) / cross;
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-3;
  return {
    equal: near(Math.hypot(...u), Math.hypot(...v)),
    perpendicular: near(u[0] * v[0] + u[1] * v[1], 0),
    bisected: ((near(t, 0.5) ? 1 : 0) + (near(s, 0.5) ? 1 : 0)) as 0 | 1 | 2,
  };
}

/** Plain words for diagonal facts, e.g. "equal in length, cross at right angles, ...". */
export function describeDiagonals(f: ReturnType<typeof diagonalFacts>): string {
  return [
    f.equal ? "are equal in length" : "are not equal in length",
    f.perpendicular ? "cross at right angles" : "do not cross at right angles",
    [
      "neither cuts the other in half",
      "only one is cut in half by the other",
      "cut each other in half",
    ][f.bisected],
  ].join("; ");
}
